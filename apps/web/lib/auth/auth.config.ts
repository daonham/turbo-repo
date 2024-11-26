import { type NextAuthConfig, AuthError } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

export default {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' }
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error('no-credentials');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          throw new AuthError('User not found');
        }

        const user = await response.json();

        // refactor: code
        if (user?.error) {
          if (user.error === 'invalid-credentials') {
            throw new AuthError('Please provide an email and password.');
          }

          if (user.error === 'email-not-verified') {
            throw new AuthError('Please verify your email address.');
          }

          throw new AuthError(user.error);
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user?.image || ''
        };
      }
    })
  ],
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
