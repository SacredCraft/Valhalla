import Credentials from "next-auth/providers/credentials";

import NextAuth from "next-auth";
import { ZodError } from "zod";

import { signInSchema } from "@/lib/zod";
import { getUserByUsernameAndPassword } from "@/service/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        const { username, password } =
          await signInSchema.parseAsync(credentials);

        user = await getUserByUsernameAndPassword(username, password);

        if (!user) {
          throw new Error("User not found.");
        }

        return user;
      },
    }),
  ],
});

declare module "next-auth" {
  interface User {
    username: string | null;
  }
}
