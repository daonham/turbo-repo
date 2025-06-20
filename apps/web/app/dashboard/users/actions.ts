'use server';

import { headers } from 'next/headers';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import { authActionClient } from '@/lib/safe-action';

export const removeUserAction = authActionClient
  .inputSchema(
    z.object({
      userId: z.string()
    })
  )
  .action(async ({ parsedInput }) => {
    const { userId } = parsedInput;

    await auth.api.removeUser({
      headers: await headers(),
      body: {
        userId
      }
    });

    return { ok: true };
  });
