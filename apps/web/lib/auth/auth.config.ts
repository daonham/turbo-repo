import client from "@/lib/db";
import { User, type NextAuthConfig } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        return {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          image: "https://example.com/avatar.png",
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      console.log({ user, account, profile });
      if (!user.email) {
        return false;
      }

      if (account?.provider === "google") {
        const db = await client.connect();

        const userExists = await db
          .db(process.env.MONGODB_DB_NAME)
          .collection("users")
          .findOne({ email: user.email });

        if (!userExists || !profile) {
          return true;
        }

        // TODO: upload avatar and more...
      }

      return true;
    },
    session: ({ session, token }) => {
      session.user = {
        // @ts-ignore
        ...(token || session).user,
      };

      return session;
    },
    jwt: async ({
      token,
      user,
      trigger,
    }: {
      token: JWT;
      user: User | AdapterUser;
      trigger?: "signIn" | "update" | "signUp";
    }) => {
      if (user) {
        token.user = user;
      }

      return token;
    },
  },
} satisfies NextAuthConfig;
