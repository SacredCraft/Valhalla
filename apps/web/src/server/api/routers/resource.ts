import { z } from "zod";

import valhallaConfig from "@/valhalla";
import { db } from "@sacred-craft/valhalla-database";
import { TRPCError } from "@trpc/server";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const resourceRouter = createTRPCRouter({
  getOwnedResources: protectedProcedure.query(async ({ ctx }) => {
    const session = ctx.session;

    const sessionId = session.user.id;

    const user = await ctx.db.user.findFirst({
      where: {
        id: sessionId,
      },
      select: {
        role: true,
        UserResourceRole: {
          select: {
            resourceRole: {
              select: {
                resources: true,
              },
            },
          },
        },
      },
    });

    if (user) {
      if (user.role === "ADMIN") {
        return valhallaConfig.resources.map((resource) => resource.name);
      }
      const filteredResources = user.UserResourceRole.flatMap(
        (userResourceRole) => userResourceRole.resourceRole.resources,
      );

      return Array.from(new Set(filteredResources));
    }

    return [];
  }),

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

        await ctx.db.log.create({
          data: {
            operators: {
              connect: [{ id: ctx.session.user.id }],
            },
            action: {
              type: "SET_RESOURCE_PATH",
              name: input.name,
              path: input.path,
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to set resource path",
        });
      }
    }),

  getResourceRoles: protectedProcedure.query(async ({ ctx }) => {
    const roles = await ctx.db.resourceRole.findMany({
      include: {
        UserResourceRole: {
          select: {
            user: true,
          },
        },
      },
    });

    return roles;
  }),

  createResourceRole: adminProcedure
    .input(
      z.object({
        name: z.string(),
        resources: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {}),
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
