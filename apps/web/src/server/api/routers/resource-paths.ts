import { z } from "zod";

import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const resourcePathsRouter = createTRPCRouter({
  getResourcePaths: protectedProcedure.query(async ({ ctx }) => {
    const paths = new Map<string, string>();

    const res = await ctx.db.resourcePath.findMany();

    if (!res) {
      return paths;
    }

    for (const path of res) {
      paths.set(path.name, path.path);
    }

    return paths;
  }),

  getResourcePath: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      return getResourcePath(input);
    }),

  setResourcePath: adminProcedure
    .input(z.object({ name: z.string(), path: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.resourcePath.upsert({
          where: {
            name: input.name,
          },
          update: {
            path: input.path,
          },
          create: {
            name: input.name,
            path: input.path,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to set resource path",
        });
      }
    }),
});

export async function getResourcePath(input: { name: string }) {
  const res = await db.resourcePath.findUnique({
    where: {
      name: input.name,
    },
  });

  if (!res) {
    return null;
  }

  return res.path;
}
