"use server";

import { auth } from "@/auth";
import { plugins } from "@/config/plugins";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/service/user";

export async function getOwnedResources() {
  const session = await auth();

  if (!session || !session.user) return [];

  const sessionId = session.user.id!!;

  if (await isAdmin(sessionId)) {
    return plugins.map((plugin) => plugin.id);
  }

  const user = await prisma.user.findFirst({
    where: {
      id: sessionId,
    },
    select: {
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
    const resources = user.UserResourceRole.flatMap(
      (userResourceRole) => userResourceRole.resourceRole.resources,
    );

    return Array.from(new Set(resources));
  }

  return [];
}
