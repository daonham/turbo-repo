'use server';

import { headers } from 'next/headers';
import * as z from 'zod/v4';

import { auth } from '@/lib/auth';
import { authActionClient } from '@/lib/safe-action';

export const removeUserAction = authActionClient
  .metadata({ name: 'adminRemoveUser' })
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
