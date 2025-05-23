import { db } from '@/lib/db';
import { account, session, user, verification } from '@/lib/db/schema';
import { isStoraged, storage } from '@/lib/storage';
import { sendEmail } from '@repo/email';
import ResetPasswordLink from '@repo/email/templates/reset-password-link';
import VerifyEmail from '@repo/email/templates/verify-email';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      verification
    }
  }),
  trustedOrigins: ['http://localhost:3000'],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        subject: `Password reset instructions`,
        email: user.email,
        react: ResetPasswordLink({
          email: user.email,
          url: url
        })
      });
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_ID as string,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET as string
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        subject: `Verify your account`,
        email: user.email,
        react: VerifyEmail({
          email: user.email,
          url
        })
      });
    }
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google']
    }
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith('/callback/:id')) {
        const newSession = ctx.context.newSession;
        if (newSession?.user?.image && !isStoraged(newSession?.user?.image)) {
          const { url } = await storage.upload(`avatars/${newSession.user.id}`, newSession.user.image);
          await ctx.context.internalAdapter.updateUser(newSession.user.id, { image: url });
        }
      }
    })
  },
  plugins: [nextCookies(), admin()],
  rateLimit: {
    enabled: true,
    window: 10, // time window in seconds
    max: 100 // max requests in the window
  }
});
