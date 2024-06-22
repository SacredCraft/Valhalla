"use server";

import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { z } from "zod";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const updateSchema = z.object({
  password: z.string().min(8).max(32).optional(),
});

export async function updateUserById(id: string, data: any) {
  const session = await auth();

  if (!session || !session.user) return null;

  const sessionId = session.user.id!!;

  if (
    sessionId !== id ||
    ((await getUserById(sessionId))?.role ?? "USER") !== "ADMIN"
  ) {
    return null;
  }

  try {
    updateSchema.parse(data);
  } catch (e) {
    return null;
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: {
      ...data,
      password: data.password
        ? hashSync(data.password, genSaltSync(10))
        : undefined,
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findFirst({
    where: {
      id,
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
}

export async function getUserByUsernameAndPassword(
  username: string,
  password: string,
) {
  const user = await prisma.user.findFirst({
    where: {
      username,
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

  return compareSync(password, user.password)
    ? {
        ...user,
        password: undefined,
      }
    : null;
}

export async function createAdminUser(username: string, password: string) {
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(password, salt);

  try {
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function createUser(username: string, password: string) {
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(password, salt);

  try {
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    return true;
  } catch (e) {
    return false;
  }
}
