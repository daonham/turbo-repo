import { type NextAuthConfig } from "next-auth";
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

        // TODO: check email login and return data.

        return {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          image: "https://example.com/avatar.png",
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
