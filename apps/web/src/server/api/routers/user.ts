import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { isRedirectError } from "next/dist/client/components/redirect";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { signIn } from "@/server/auth";
import { TRPCError } from "@trpc/server";

const updateSchema = z.object({
  password: z.string().min(8).max(32).optional(),
});

export const userRouter = createTRPCRouter({
  signIn: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const formData = new FormData();
      formData.append("username", input.username);
      formData.append("password", input.password);

      try {
        await signIn("credentials", formData);
      } catch (error) {
        if (!isRedirectError(error)) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
          });
        }
      }

      ctx.db.user.update({
        where: {
          username: input.username,
        },
        data: {
          lastLogin: new Date(),
        },
      });
    }),

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
        await ctx.db.user.create({
          data: {
            username: input.username,
            password: hashedPassword,
            avatar: input.avatar,
            role: input.role,
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
      const user = await ctx.db.user.findFirst({
        where: {
          username: input.username,
        },
        select: {
          id: true,
          username: true,
          password: true,
        },
      });

      if (!user) {
        return null;
      }

      return compareSync(input.password, user.password)
        ? {
            ...user,
            password: undefined,
          }
        : null;
    }),

  getUserById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
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
    }),

  updateUserById: adminProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          username: z.string(),
          password: z.string().optional(),
          role: z.enum(["ADMIN", "USER"]),
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

      ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          ...input.data,
          password: input.data.password
            ? hashSync(input.data.password, genSaltSync(10))
            : undefined,
        },
      });

      return input.data.password ? { password: true } : {};
    }),
});
