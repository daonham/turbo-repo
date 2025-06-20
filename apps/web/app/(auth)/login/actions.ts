'use server';

import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/safe-action';
import { ratelimit } from '@/lib/upstash';
import { schema } from './schema';

export const loginAction = actionClient
  .metadata({ name: 'login' })
  .inputSchema(schema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput;

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

    return { ok: true };
  });
