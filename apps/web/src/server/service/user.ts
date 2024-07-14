"use server";

import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { auth } from "@/server/auth";

const updateSchema = z.object({
  password: z.string().min(8).max(32).optional(),
});

export async function checkRole(role: string, id: string) {
  return ((await getUserById(id))?.role ?? "USER") === role;
}

export async function isAdmin(id: string) {
  return checkRole("ADMIN", id);
}

export async function updateLastLogin(username: string) {
  return prisma.user.update({
    where: {
      username,
    },
    data: {
      lastLogin: new Date(),
    },
  });
}

export async function updateUserById(id: string, data: any) {
  const session = await auth();

  if (!session || !session.user) return null;

  const sessionId = session.user.id!!;

  if (sessionId !== id && !(await isAdmin(sessionId))) {
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

export async function setupAdminUser(username: string, password: string) {
  const session = await auth();

  if (
    (!session || !session.user || !(await isAdmin(session.user.id!!))) &&
    (await prisma.user.count()) > 0
  ) {
    return false;
  }

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

export async function createUser(
  username: string,
  password: string,
  role: "ADMIN" | "USER",
  avatar: string | ArrayBuffer | null,
) {
  const session = await auth();

  if (!session || !session.user) return false;

  const sessionId = session.user.id!!;

  if (!(await isAdmin(sessionId))) {
    return false;
  }

  const salt = genSaltSync(10);
  const hashedPassword = hashSync(password, salt);

  try {
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        avatar: avatar ? (avatar as string) : undefined,
        role,
      },
    });
    return true;
  } catch (e) {
    return false;
  }
}
