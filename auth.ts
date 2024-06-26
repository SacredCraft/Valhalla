import Credentials from "next-auth/providers/credentials";

import NextAuth from "next-auth";

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
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.username = token.username as string;
      session.user.id = token.id as string;
      return session;
    },
  },
});

declare module "next-auth" {
  interface User {
    username: string;
  }
}
