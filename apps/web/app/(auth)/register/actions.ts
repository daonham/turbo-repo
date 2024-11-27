'use server';

import { sendEmail } from '@/emails';
import VerifyEmail from '@/emails/verify-email';
import { signIn } from '@/lib/auth';
import { hashPassword } from '@/lib/auth/password';
import { getRole } from '@/lib/auth/utils';
import client from '@/lib/db';
import { actionClient } from '@/lib/safe-action';
import { ratelimit } from '@/lib/upstash';
import { z } from 'zod';
import { schema } from './schema';

export const sendOTPAction = actionClient.schema(schema).action(async ({ parsedInput }) => {
  const { email } = parsedInput;

  const { success } = await ratelimit(2, '1 m').limit(`sendOTPAction`);

  if (!success) {
    throw new Error('Too many requests. Please try again later.');
  }

  if (email.includes('+') && email.endsWith('@gmail.com')) {
    throw new Error('Email addresses with + are not allowed. Please use your work email instead.');
  }

  const db = await client.connect();

  const userExists = await db.db(process.env.MONGODB_DB_NAME).collection('users').findOne({ email: email.toLowerCase() });

  if (userExists) {
    throw new Error('User already exists');
  }

  const emailVerificationTokenCollection = db.db(process.env.MONGODB_DB_NAME).collection('emailVerificationToken');

  // Delete all email verification tokens for the user.
  await emailVerificationTokenCollection.deleteMany({
    email: email.toLowerCase()
  });

  // Generate a new verification token.
  const code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');

  await emailVerificationTokenCollection.insertOne({
    email: email.toLowerCase(),
    token: code,
    expires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  });

  await sendEmail({
    subject: `OTP to verify your account`,
    email,
    react: VerifyEmail({
      email,
      code
    })
  });

  return {
    ok: true
  };
});

export const registerAction = actionClient
  .schema(schema)
  .schema(async (prevSchema) => {
    return prevSchema.extend({ code: z.string().min(6, 'OTP must be 6 characters long.') });
  })
  .action(async ({ parsedInput }) => {
    const { username, email, password, code } = parsedInput;

    const { success } = await ratelimit(2, '1 m').limit(`registerAction`);

    if (!success) {
      throw new Error('Too many requests. Please try again later.');
    }

    const db = await client.connect();

    const emailVerificationTokenCollection = db.db(process.env.MONGODB_DB_NAME).collection('emailVerificationToken');

    const verifyOTP = await emailVerificationTokenCollection.findOne({
      email: email.toLowerCase(),
      token: code,
      expires: { $gt: new Date() }
    });

    if (!verifyOTP) {
      throw new Error('Invalid OTP');
    }

    await emailVerificationTokenCollection.deleteOne({ email, token: code });

    const userCollection = db.db(process.env.MONGODB_DB_NAME).collection('users');

    await userCollection.insertOne({
      email: email.toLowerCase(),
      name: username,
      password: hashPassword(password),
      emailVerified: new Date(),
      role: getRole(email)
    });

    await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    return {
      ok: true
    };
  });
