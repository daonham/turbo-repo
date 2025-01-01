import { sendEmail } from '@/emails';
import ResetPasswordLink from '@/emails/reset-password-link';
import VerifyEmail from '@/emails/verify-email';
import client from '@/lib/db';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins';

export const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.MONGODB_DB_NAME)),
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
      trustedProviders: ['google']
    }
  },
  plugins: [nextCookies(), admin()],
  rateLimit: {
    window: 10, // time window in seconds
    max: 100 // max requests in the window
  }
});
