import { z } from "zod";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const pluginPathsRouter = createTRPCRouter({
  getPluginPaths: protectedProcedure.query(async ({ ctx }) => {
    const paths = new Map<string, string>();

    const res = await ctx.db.pluginPath.findMany();

    if (!res) {
      return paths;
    }

    for (const path of res) {
      paths.set(path.pluginId, path.path);
    }

    return paths;
  }),

  getPluginPath: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.pluginPath.findUnique({
        where: {
          pluginId: input.id,
        },
      });

      if (!res) {
        return null;
      }

      return res.path;
    }),

  setPluginPath: adminProcedure
    .input(z.object({ id: z.string(), path: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.pluginPath.upsert({
        where: {
          pluginId: input.id,
        },
        update: {
          path: input.path,
        },
        create: {
          pluginId: input.id,
          path: input.path,
        },
      });
    }),
});
