import client from "@/lib/db";
import { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { verifyPasswordHash } from "./password";

export const authConfig = {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error("no-credentials");
        }

        const user = await client
          .db(process.env.MONGODB_DB_NAME)
          .collection("users")
          .findOne({ email: email });

        if (!user || !user.password) {
          throw new Error("invalid-credentials");
        }

        const passwordMatch = verifyPasswordHash(user.password, password);

        if (!passwordMatch) {
          throw new Error("invalid-credentials");
        }

        if (!user.emailVerified) {
          throw new Error("email-not-verified");
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user?.image || "",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    session: ({ session, token }) => {
      session.user = {
        // @ts-ignore
        ...(token || session).user,
      };

      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }

      return token;
    },
  },
} satisfies NextAuthConfig;
