import { genSaltSync, hashSync } from "bcrypt-ts";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { getUserByUsernameAndPassword } from "@/server/service/auth";
import { TRPCError } from "@trpc/server";

const updateSchema = z.object({
  password: z.string().min(8).max(32).optional(),
});

export const userRouter = createTRPCRouter({
  setupAdminUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if ((await ctx.db.user.count()) > 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin account already exists",
        });
      }

      const salt = genSaltSync(10);
      const hashedPassword = hashSync(input.password, salt);

      try {
        await ctx.db.user.create({
          data: {
            username: input.username,
            password: hashedPassword,
            role: "ADMIN",
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create admin account",
        });
      }
    }),

  createUser: adminProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        role: z.enum(["ADMIN", "USER"]),
        avatar: z.union([z.string(), z.null()]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const salt = genSaltSync(10);
      const hashedPassword = hashSync(input.password, salt);

      try {
        const user = await ctx.db.user.create({
          data: {
            username: input.username,
            password: hashedPassword,
            avatar: input.avatar,
            role: input.role,
          },
        });

        await ctx.db.log.create({
          data: {
            operators: {
              connect: [{ id: ctx.session.user.id!! }],
            },
            action: {
              type: "CREATE_USER",
              userId: user.id,
            },
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create account",
        });
      }
    }),

  getUserByUsernameAndPassword: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return getUserByUsernameAndPassword(
        input.username,
        input.password,
        ctx.db,
      );
    }),

  getUsersByIDs: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        return ctx.db.user.findMany({
          where: {
            id: {
              in: input.ids,
            },
          },
          select: {
            id: true,
            bio: true,
            username: true,
            role: true,
            avatar: true,
            password: false,
            UserResourceRole: true,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get users",
        });
      }
    }),

  getUserById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        return ctx.db.user.findFirst({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            bio: true,
            username: true,
            role: true,
            avatar: true,
            password: false,
            UserResourceRole: true,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get user",
        });
      }
    }),

  queryUsers: protectedProcedure
    .input(
      z.object({
        username: z.string().optional(),
        role: z.enum(["ADMIN", "USER"]).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        return ctx.db.user.findMany({
          where: {
            username: input.username ? { contains: input.username } : undefined,
            role: input.role,
          },
          select: {
            id: true,
            bio: true,
            username: true,
            role: true,
            avatar: true,
            password: false,
            UserResourceRole: true,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get users",
        });
      }
    }),

  updateUserById: adminProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          username: z.string().optional(),
          password: z.string().optional(),
          role: z.enum(["ADMIN", "USER"]).optional(),
          bio: z.string().optional(),
          avatar: z.union([z.string(), z.null()]),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        updateSchema.parse(input.data);
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }

      await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          ...input.data,
          avatar: input.data.avatar === null ? undefined : input.data.avatar,
          password: input.data.password
            ? hashSync(input.data.password, genSaltSync(10))
            : undefined,
        },
      });

      await ctx.db.log.create({
        data: {
          operators: {
            connect: [{ id: ctx.session.user.id!! }],
          },
          action: {
            type: "UPDATE_USER",
            userId: input.id,
            update: input.data,
          },
        },
      });

      return input.data.password ? { password: true } : {};
    }),

  deleteUserById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.user.delete({
        where: {
          id: input.id,
        },
      });

      await ctx.db.log.create({
        data: {
          operators: {
            connect: [{ id: ctx.session.user.id!! }],
          },
          action: {
            type: "DELETE_USER",
            userId: input.id,
          },
        },
      });
    }),
});
