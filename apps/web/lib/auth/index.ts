import { verifyPasswordHash } from '@/lib/auth/password';
import client from '@/lib/db';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth, { AuthError } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { cache } from 'react';
import authConfig from './auth.config';
import { getDefaultUserRole } from './utils';

const {
  auth: uncachedAuth,
  handlers,
  signIn,
  signOut
} = NextAuth({
  adapter: MongoDBAdapter(client, {
    databaseName: process.env.MONGODB_DB_NAME
  }),
  session: { strategy: 'jwt' },
  ...authConfig,
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
        const { email, password } = credentials as any;

        if (!email || !password) {
          throw new AuthError('Email and password are required');
        }

        const user = await client.db(process.env.MONGODB_DB_NAME).collection('users').findOne({ email: email });

        if (!user || !user.password) {
          throw new AuthError('Please provide an email and password.');
        }

        const passwordMatch = verifyPasswordHash(user.password, password);

        if (!passwordMatch) {
          throw new AuthError('Please provide an email and password.');
        }

        if (!user.emailVerified) {
          throw new AuthError('Please verify your email address.');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user?.image || '',
          role: user?.role || ''
        };
      }
    })
  ],
  events: {
    async createUser({ user }) {
      // Create role to database.
      const role = getDefaultUserRole(user.email);

      // Update role to database.
      await client.db(process.env.MONGODB_DB_NAME).collection('users').updateOne(
        {
          email: user.email
        },
        { $set: { role } }
      );
    }
  }
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
