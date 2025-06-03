'use server';

import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/safe-action';
import { ratelimit } from '@/lib/upstash';
import { schema } from './schema';

export const resetPasswordAction = actionClient.inputSchema(schema).action(async ({ parsedInput }) => {
  const { password, token } = parsedInput;

  const { success } = await ratelimit(2, '1 m').limit(`request-password`);

  if (!success) {
    throw new Error('Too many requests. Please try again later.');
  }

  await auth.api.resetPassword({
    body: {
      newPassword: password,
      token
    }
  });

  return { ok: true };
});
