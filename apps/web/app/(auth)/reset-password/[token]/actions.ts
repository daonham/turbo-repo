'use server';

import { sendEmail } from '@/emails';
import PasswordUpdated from '@/emails/password-updated';
import { hashPassword } from '@/lib/auth/password';
import client from '@/lib/db';
import { actionClient } from '@/lib/safe-action';
import { ratelimit } from '@/lib/upstash';
import { createHash } from 'crypto';
import { schema } from './schema';

export const resetPasswordAction = actionClient.schema(schema).action(async ({ parsedInput }) => {
  const { password, token } = parsedInput;

  const { success } = await ratelimit(2, '1 m').limit(`request-password`);

  if (!success) {
    throw new Error('Too many requests. Please try again later.');
  }
  const db = await client.connect();

  const hashedToken = createHash('sha256').update(token).digest('hex');

  const result = await db
    .db(process.env.MONGODB_DB_NAME)
    .collection('password-reset-tokens')
    .findOne({ token: hashedToken, expiresAt: { $gt: new Date() } });

  if (!result) {
    throw new Error('Password reset token not found or expired. Please request a new one.');
  }

  const { email } = result;

  const user = await db.db(process.env.MONGODB_DB_NAME).collection('users').findOne({ email });

  if (!user) {
    throw new Error('User not found.');
  }

  const update = await db
    .db(process.env.MONGODB_DB_NAME)
    .collection('users')
    .updateOne({ email }, { $set: { password: hashPassword(password), ...(!user.emailVerified && { emailVerified: new Date() }) } });

  if (!update.acknowledged) {
    throw new Error('Failed to update password.');
  }

  await db.db(process.env.MONGODB_DB_NAME).collection('password-reset-tokens').deleteMany({ email: email.toLowerCase() });

  await sendEmail({
    subject: `Your password has been reset`,
    email,
    react: PasswordUpdated({
      email,
      verb: 'reset'
    })
  });

  return { ok: true };
});
