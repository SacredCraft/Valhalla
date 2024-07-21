import valhallaConfig from "@/valhalla";

import { createTRPCRouter, protectedProcedure } from "../trpc";

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
});
