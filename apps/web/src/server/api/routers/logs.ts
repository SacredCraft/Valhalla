import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const logsRouter = createTRPCRouter({
  query: protectedProcedure
    .input(
      z.object({
        orderBy: z.enum(["asc", "desc"]).optional(),
        page: z.number().optional(),
        perPage: z.number().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { orderBy = "asc", page = 1, perPage = 10 } = input;
      const logs = await ctx.db.log.findMany({
        orderBy: {
          createdAt: orderBy,
        },
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          action: true,
          createdAt: true,
          operators: true,
        },
      });

      const count = await ctx.db.log.count();

      return {
        logs,
        count,
      };
    }),

  deleteByIds: protectedProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .mutation(async ({ input, ctx }) => {
      const { ids } = input;
      await ctx.db.log.deleteMany({
        where: {
          id: { in: ids },
        },
      });
    }),

  deleteByTime: protectedProcedure
    .input(z.object({ time: z.date() }))
    .mutation(async ({ input, ctx }) => {
      const { time } = input;
      await ctx.db.log.deleteMany({
        where: {
          createdAt: { lt: time },
        },
      });
    }),
});
