import { type NextAuthConfig } from 'next-auth';

export default {
  providers: [],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    session: ({ session, token }) => {
      session.user = {
        // @ts-ignore
        ...(token || session).user
      };

      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }

      return token;
    }
  }
} satisfies NextAuthConfig;
