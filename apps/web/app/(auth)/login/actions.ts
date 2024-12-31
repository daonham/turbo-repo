'use server';

import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/safe-action';
import { ratelimit } from '@/lib/upstash';
import { schema } from './schema';

export const loginAction = actionClient.schema(schema).action(async ({ parsedInput }) => {
  const { email, password } = parsedInput;

  try {
    const { success } = await ratelimit(5, '1 m').limit(`login-attempts:${email}`);

    if (!success) {
      throw new Error('Too many requests. Please try again later.');
    }

    await auth.api.signInEmail({
      body: {
        email: email.toLowerCase(),
        password
      }
    });
  } catch (error: any) {
    throw new Error(error?.message || 'Invalid credentials');
  }

  return { ok: true };
});
