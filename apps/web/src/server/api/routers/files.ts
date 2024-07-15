import fs from "fs";
import path from "path";
import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getPluginPath } from "./plugin-paths";

export type FileMeta = {
  type: "file" | "dir";
  name: string;
  path: string[];
  size: number;
  createdAt: string;
  updatedAt: string;
  ext?: string;
  [key: string]: any;
};

export const PluginPathNotFound = new TRPCError({
  code: "NOT_FOUND",
  message: "Plugin path not found",
});

const bufferEncodingSchema = z.union([
  z.literal("ascii"),
  z.literal("utf8"),
  z.literal("utf-16le"),
  z.literal("ucs2"),
  z.literal("base64"),
  z.literal("base64url"),
  z.literal("latin1"),
  z.literal("binary"),
  z.literal("hex"),
]);

export const filesRouter = createTRPCRouter({
  getPluginFiles: protectedProcedure
    .input(z.object({ id: z.string(), relativePath: z.array(z.string()) }))
    .query(async ({ input }): Promise<FileMeta[] | null> => {
      const pluginPath = await getPluginPath({ id: input.id });
      const absolutePath = pluginPath
        ? [pluginPath, ...input.relativePath]
        : [];
      try {
        const mappedFiles = fs
          .readdirSync(absolutePath.map((i) => decodeURIComponent(i)).join("/"))
          .filter((file) => !file.startsWith("."))
          .map(async (file) => {
            const stats = fs.statSync(
              `${absolutePath.map((i) => decodeURIComponent(i)).join("/")}/${file}`,
            );
            return {
              type: stats.isDirectory() ? "dir" : "file",
              name: file,
              path: `${input.relativePath.length !== 0 ? `${input.relativePath.join(path.sep)}/` : ``}${file}`.split(
                path.sep,
              ),
              createdAt: stats.birthtime.toLocaleString(),
              updatedAt: stats.mtime.toLocaleString(),
              size: stats.size,
            } as FileMeta;
          });

        const files = await Promise.all(mappedFiles);

        return files.sort((a, b) => {
          if (a.type === "dir" && b.type !== "dir") {
            return -1;
          }
          if (a.type !== "dir" && b.type === "dir") {
            return 1;
          }
          return a.name.localeCompare(b.name);
        });
      } catch (error) {
        return null;
      }
    }),

  getPluginFile: protectedProcedure
    .input(z.object({ id: z.string(), relativePath: z.array(z.string()) }))
    .query(async ({ input }) => {
      const pluginPath = await getPluginPath({ id: input.id });
      if (!pluginPath) {
        return null;
      }
      const filePath = path.join(pluginPath, input.relativePath.join(path.sep));
      try {
        const stats = fs.statSync(filePath);

        return {
          type: stats.isDirectory() ? "dir" : "file",
          name: path.basename(filePath),
          path: input.relativePath,
          createdAt: stats.birthtime.toLocaleString(),
          updatedAt: stats.mtime.toLocaleString(),
          size: stats.size,
          ext: path.extname(filePath).slice(1),
        } as FileMeta;
      } catch (error) {
        return null;
      }
    }),

  readPluginFile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        relativePath: z.array(z.string()),
        options: z
          .union([
            z.object({
              encoding: bufferEncodingSchema,
              flag: z.string().optional(),
            }),
            bufferEncodingSchema,
          ])
          .optional(),
      }),
    )
    .query(async ({ input }): Promise<string | Buffer | null> => {
      const pluginPath = await getPluginPath({ id: input.id });
      if (!pluginPath) {
        return null;
      }
      return fs.readFileSync(
        path.join(pluginPath, input.relativePath.join(path.sep)),
        input.options,
      );
    }),

  deletePluginFile: protectedProcedure
    .input(z.object({ id: z.string(), relativePath: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const pluginPath = await getPluginPath({ id: input.id });
      if (!pluginPath) {
        throw PluginPathNotFound;
      }
      try {
        fs.unlinkSync(path.join(pluginPath, input.relativePath.join(path.sep)));
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete file",
        });
      }
    }),

  renamePluginFile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        oldRelativePath: z.array(z.string()),
        newRelativePath: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const pluginPath = await getPluginPath({ id: input.id });
      if (!pluginPath) {
        throw PluginPathNotFound;
      }
      try {
        fs.renameSync(
          path.join(pluginPath, input.oldRelativePath.join(path.sep)),
          path.join(pluginPath, input.newRelativePath.join(path.sep)),
        );
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to rename file",
        });
      }
    }),

  createPluginFile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        relativePath: z.array(z.string()),
        type: z.enum(["file", "dir"]),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const pluginPath = await getPluginPath({ id: input.id });
      if (!pluginPath) {
        throw PluginPathNotFound;
      }
      const filePath = path.join(pluginPath, input.relativePath.join(path.sep));
      try {
        if (input.type === "dir") {
          fs.mkdirSync(filePath);
        } else {
          fs.writeFileSync(filePath, input.content || "");
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create file",
        });
      }
    }),
});
