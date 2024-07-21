import fs from "fs";
import path from "path";
import { z } from "zod";

import valhallaConfig from "@/valhalla";
import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getResourcePath } from "./resource-paths";

export type FileMeta = {
  type: "file" | "dir";
  name: string;
  path: string[];
  size: number;
  createdAt: Date;
  updatedAt: Date;
  ext?: string;
  [key: string]: any;
};

export type Trash = {
  path: string[];
  originName: string;
  trashName: string;
  size: number;
  operator: string | User;
  timestamp: string;
};

export const resourcePathNotFound = new TRPCError({
  code: "NOT_FOUND",
  message: "Resource path not found",
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
  getResourceFiles: protectedProcedure
    .input(z.object({ name: z.string(), relativePath: z.array(z.string()) }))
    .query(async ({ input }): Promise<FileMeta[] | null> => {
      const resourcePath = await getResourcePath({ name: input.name });
      const absolutePath = resourcePath
        ? [resourcePath, ...input.relativePath]
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
              createdAt: stats.birthtime,
              updatedAt: stats.mtime,
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

  getResourceFile: protectedProcedure
    .input(z.object({ name: z.string(), relativePath: z.array(z.string()) }))
    .query(async ({ input }) => {
      const resourcePath = await getResourcePath({ name: input.name });
      if (!resourcePath) {
        return null;
      }
      const filePath = path.join(
        resourcePath,
        input.relativePath.join(path.sep),
      );
      try {
        const stats = fs.statSync(filePath);

        return {
          type: stats.isDirectory() ? "dir" : "file",
          name: path.basename(filePath),
          path: input.relativePath,
          createdAt: stats.birthtime,
          updatedAt: stats.mtime,
          size: stats.size,
          ext: path.extname(filePath).slice(1),
        } as FileMeta;
      } catch (error) {
        return null;
      }
    }),

  readResourceFile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
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
      const resourcePath = await getResourcePath({ name: input.name });
      if (!resourcePath) {
        return null;
      }
      return fs.readFileSync(
        path.join(resourcePath, input.relativePath.join(path.sep)),
        input.options,
      );
    }),

  deleteResourceFile: protectedProcedure
    .input(z.object({ name: z.string(), relativePath: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const resourcePath = await getResourcePath({ name: input.name });
      if (!resourcePath) {
        throw resourcePathNotFound;
      }
      try {
        fs.unlinkSync(
          path.join(resourcePath, input.relativePath.join(path.sep)),
        );
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete file",
        });
      }
    }),

  renameResourceFile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        oldRelativePath: z.array(z.string()),
        newRelativePath: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const resourcePath = await getResourcePath({ name: input.name });
      if (!resourcePath) {
        throw resourcePathNotFound;
      }
      try {
        fs.renameSync(
          path.join(resourcePath, input.oldRelativePath.join(path.sep)),
          path.join(resourcePath, input.newRelativePath.join(path.sep)),
        );
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to rename file",
        });
      }
    }),

  createResourceFile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        relativePath: z.array(z.string()),
        type: z.enum(["file", "dir"]),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const resourcePath = await getResourcePath({ name: input.name });
      if (!resourcePath) {
        throw resourcePathNotFound;
      }
      const filePath = path.join(
        resourcePath,
        input.relativePath.join(path.sep),
      );
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

  copyResourceFile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        source: z.array(z.string()),
        destination: z.array(z.string()),
        cut: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const resourcePath = await getResourcePath({ name: input.name });
      if (!resourcePath) {
        throw resourcePathNotFound;
      }

      const sourceFile = path.join(resourcePath, input.source.join(path.sep));
      const destinationFile = path.join(
        resourcePath,
        input.destination.join(path.sep),
        path.basename(input.source.join(path.sep)),
      );

      try {
        fs.accessSync(destinationFile, fs.constants.F_OK);
        throw new TRPCError({
          code: "CONFLICT",
          message: "Destination file already exists",
        });
      } catch (error) {
        if (error instanceof TRPCError && error.code === "CONFLICT") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Destination file already exists",
          });
        }
        try {
          fs.copyFileSync(sourceFile, destinationFile);
          if (input.cut) {
            fs.unlinkSync(sourceFile);
          }
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to copy file",
          });
        }
      }
    }),

  replaceResourceFile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        source: z.array(z.string()),
        destination: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const resourcePath = await getResourcePath({ name: input.name });
      if (!resourcePath) {
        throw resourcePathNotFound;
      }

      const sourceFile = path.join(resourcePath, input.source.join(path.sep));
      const destinationFile = path.join(
        resourcePath,
        input.destination.join(path.sep),
      );

      try {
        fs.copyFileSync(sourceFile, destinationFile);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to replace file",
        });
      }
    }),

  moveToTrash: protectedProcedure
    .input(z.object({ name: z.string(), relativePath: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      const resourcePath = await getResourcePath({ name: input.name });
      if (!resourcePath) {
        throw resourcePathNotFound;
      }

      const filePath = path.join(
        resourcePath,
        input.relativePath.join(path.sep),
      );

      const trashPath = path.join(
        resourcePath,
        valhallaConfig.folders.valhalla,
        valhallaConfig.folders.trash,
      );

      const filesPath = path.join(
        resourcePath,
        valhallaConfig.folders.valhalla,
        valhallaConfig.folders.files,
      );
      try {
        const name = crypto.randomUUID();
        fs.mkdirSync(trashPath, { recursive: true });
        fs.mkdirSync(filesPath, { recursive: true });
        fs.renameSync(filePath, `${filesPath}/${name}`);
        const size = fs.statSync(`${filesPath}/${name}`).size;

        fs.writeFileSync(
          `${trashPath}/${name}.json`,
          JSON.stringify({
            path: input.relativePath,
            originName: path.basename(filePath),
            trashName: name,
            size,
            operator: ctx.session.user.id!!,
            timestamp: new Date().toISOString(),
          } as Trash),
        );

        await ctx.db.log.create({
          data: {
            operators: {
              connect: [{ id: ctx.session.user.id!! }],
            },
            action: {
              type: "MOVE_TO_TRASH",
              resource: input.name,
              path: input.relativePath,
              originName: path.basename(filePath),
              trashName: name,
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to move file to trash",
        });
      }
    }),

  emptyTrash: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const resourcePath = await getResourcePath({ name: input.name });
      if (!resourcePath) {
        throw resourcePathNotFound;
      }

      const trashPath = path.join(
        resourcePath,
        valhallaConfig.folders.valhalla,
        valhallaConfig.folders.trash,
      );

      const filesPath = path.join(
        resourcePath,
        valhallaConfig.folders.valhalla,
        valhallaConfig.folders.files,
      );

      try {
        fs.mkdirSync(trashPath, { recursive: true });
        fs.readdirSync(trashPath).forEach((file) => {
          if (!file.endsWith(".json")) {
            return;
          }
          fs.unlinkSync(`${filesPath}/${path.basename(file, ".json")}`);
          fs.unlinkSync(`${trashPath}/${file}`);
        });

        await ctx.db.log.create({
          data: {
            operators: {
              connect: [{ id: ctx.session.user.id!! }],
            },
            action: {
              type: "EMPTY_TRASH",
              resource: input.name,
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to empty trash",
        });
      }
    }),

  getTrash: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input, ctx }) => {
      const resourcePath = await getResourcePath({ name: input.name });
      if (!resourcePath) {
        throw resourcePathNotFound;
      }

      const trashPath = path.join(
        resourcePath,
        valhallaConfig.folders.valhalla,
        valhallaConfig.folders.trash,
      );

      try {
        fs.mkdirSync(trashPath, { recursive: true });
        const trash = fs
          .readdirSync(trashPath)
          .filter((file) => file.endsWith(".json"))
          .map(async (file) => {
            const content = fs.readFileSync(`${trashPath}/${file}`, "utf-8");
            const operator = await ctx.db.user.findUnique({
              where: { id: JSON.parse(content).operator },
            });
            return {
              ...JSON.parse(content),
              operator,
            } as Trash;
          });

        return Promise.all(trash);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get trash",
        });
      }
    }),
});
