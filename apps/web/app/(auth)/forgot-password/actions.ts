'use server';

import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/safe-action';
import { ratelimit } from '@/lib/upstash';
import { schema } from './schema';

export const forgotAction = actionClient.inputSchema(schema).action(async ({ parsedInput }) => {
  const { email } = parsedInput;

  try {
    const { success } = await ratelimit(2, '1 m').limit(`request-password-reset:${email.toLowerCase()}`);

    if (!success) {
      throw new Error('Too many requests. Please try again later.');
    }

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: '/reset-password'
      }
    });
  } catch (error: any) {
    throw new Error(error?.message || 'Invalid credentials');
  }

  return { ok: true };
});
