"use server";

import { compareSync } from "bcrypt-ts";
import { isRedirectError } from "next/dist/client/components/redirect";

import { signIn as signInAuth } from "@/server/auth";
import { PrismaClient, db } from "@sacred-craft/valhalla-database";

export const signIn = async (username: string, password: string) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  try {
    await signInAuth("credentials", formData);
  } catch (error) {
    if (!isRedirectError(error)) {
      return false;
    }
  }

  db.user.update({
    where: {
      username,
    },
    data: {
      lastLogin: new Date(),
    },
  });

  return true;
};

export const getUserByUsernameAndPassword = async (
  username: string,
  password: string,
  db: PrismaClient,
) => {
  const user = await db.user.findFirst({
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
};
