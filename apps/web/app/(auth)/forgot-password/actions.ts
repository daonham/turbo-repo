'use server';

import { sendEmail } from '@/emails';
import ResetPasswordLink from '@/emails/reset-password-link';
import client from '@/lib/db';
import { actionClient } from '@/lib/safe-action';
import { ratelimit } from '@/lib/upstash';
import { createHash, randomBytes } from 'crypto';
import { schema } from './schema';

export const forgotAction = actionClient.schema(schema).action(async ({ parsedInput }) => {
  const { email } = parsedInput;

  const { success } = await ratelimit(2, '1 m').limit(`request-password-reset:${email.toLowerCase()}`);

  if (!success) {
    throw new Error('Too many requests. Please try again later.');
  }

  const db = await client.connect();

  const user = await db.db(process.env.MONGODB_DB_NAME).collection('users').findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new Error('User not found');
  }

  const token = randomBytes(20).toString('hex');
  const tokenHash = createHash('sha256').update(token).digest('hex');

  // Delete all existing password reset tokens for this user.
  await db.db(process.env.MONGODB_DB_NAME).collection('passwordResetToken').deleteMany({ email: email.toLowerCase() });

  // Insert new password reset token.
  await db
    .db(process.env.MONGODB_DB_NAME)
    .collection('passwordResetToken')
    .insertOne({
      email: email.toLowerCase(),
      token: tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 1) // 1 hours
    });

  await sendEmail({
    subject: `Password reset instructions`,
    email,
    react: ResetPasswordLink({
      email,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`
    })
  });

  console.log('Password reset link:', `http://localhost:3000/reset-password?token=${token}`);

  return { ok: true };
});
