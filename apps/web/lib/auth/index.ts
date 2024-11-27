import client from '@/lib/db';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import { cache } from 'react';
import authConfig from './auth.config';

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
  ...authConfig
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
