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
        role: z.string(),
        resources: z.array(z.string()),
        users: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.resourceRole.create({
          data: {
            role: input.role,
            resources: input.resources,
          },
        });

        for (const userId of input.users) {
          await ctx.db.userResourceRole.create({
            data: {
              user: {
                connect: {
                  id: userId,
                },
              },
              resourceRole: {
                connect: {
                  role: input.role,
                },
              },
            },
          });
        }

        await ctx.db.log.create({
          data: {
            operators: {
              connect: [{ id: ctx.session.user.id }],
            },
            action: {
              type: "CREATE_RESOURCE_ROLE",
              role: input.role,
              resources: input.resources,
              users: input.users,
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create resource role",
        });
      }
    }),

  deleteResourceRole: adminProcedure
    .input(z.object({ role: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.resourceRole.delete({
          where: {
            role: input.role,
          },
        });

        await ctx.db.userResourceRole.deleteMany({
          where: {
            resourceRole: {
              role: input.role,
            },
          },
        });

        await ctx.db.log.create({
          data: {
            operators: {
              connect: [{ id: ctx.session.user.id }],
            },
            action: {
              type: "DELETE_RESOURCE_ROLE",
              role: input.role,
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete resource role",
        });
      }
    }),

  assignResourceRole: adminProcedure
    .input(z.object({ roleId: z.number(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existing = await ctx.db.userResourceRole.findFirst({
          where: {
            userId: input.userId,
            resourceRoleId: input.roleId,
          },
        });

        if (existing) {
          return;
        }

        await ctx.db.userResourceRole.create({
          data: {
            user: {
              connect: {
                id: input.userId,
              },
            },
            resourceRole: {
              connect: {
                id: input.roleId,
              },
            },
          },
        });

        await ctx.db.log.create({
          data: {
            operators: {
              connect: [{ id: ctx.session.user.id }],
            },
            action: {
              type: "ASSIGN_RESOURCE_ROLE",
              roleId: input.roleId,
              userId: input.userId,
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to assign resource role",
        });
      }
    }),

  unassignResourceRole: adminProcedure
    .input(z.object({ roleId: z.number(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.userResourceRole.deleteMany({
          where: {
            userId: input.userId,
            resourceRoleId: input.roleId,
          },
        });

        await ctx.db.log.create({
          data: {
            operators: {
              connect: [{ id: ctx.session.user.id }],
            },
            action: {
              type: "UNASSIGN_RESOURCE_ROLE",
              role: input.roleId,
              userId: input.userId,
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to unassign resource role",
        });
      }
    }),

  updateResourceRole: adminProcedure
    .input(
      z.object({
        roleId: z.number(),
        resources: z.array(z.string()),
        users: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.resourceRole.update({
          where: {
            id: input.roleId,
          },
          data: {
            resources: input.resources,
          },
        });

        await ctx.db.userResourceRole.deleteMany({
          where: {
            resourceRoleId: input.roleId,
            NOT: {
              userId: {
                in: input.users,
              },
            },
          },
        });

        for (const userId of input.users) {
          const existing = await ctx.db.userResourceRole.findFirst({
            where: {
              userId,
              resourceRoleId: input.roleId,
            },
          });

          if (existing) {
            continue;
          }

          await ctx.db.userResourceRole.create({
            data: {
              user: {
                connect: {
                  id: userId,
                },
              },
              resourceRole: {
                connect: {
                  id: input.roleId,
                },
              },
            },
          });
        }

        await ctx.db.log.create({
          data: {
            operators: {
              connect: [{ id: ctx.session.user.id }],
            },
            action: {
              type: "UPDATE_RESOURCE_ROLE",
              roleId: input.roleId,
              resources: input.resources,
              users: input.users,
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update resource role",
        });
      }
    }),

  getResourceRoleUsers: protectedProcedure
    .input(z.object({ role: z.string() }))
    .query(async ({ input, ctx }) => {
      const users = await ctx.db.userResourceRole.findMany({
        where: {
          resourceRole: {
            role: input.role,
          },
        },
        include: {
          user: true,
        },
      });

      return users;
    }),

  getUserResourceRoles: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const roles = await ctx.db.userResourceRole.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          resourceRole: true,
        },
      });

      return roles;
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
