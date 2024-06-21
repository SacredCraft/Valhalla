"use server";

import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";

import prisma from "@/lib/prisma";

export async function getUserByUsernameAndPassword(
  username: string,
  password: string,
) {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!user) {
    return null;
  }

  return compareSync(password, user.password) ? user : null;
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
