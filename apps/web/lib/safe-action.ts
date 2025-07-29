import { headers } from 'next/headers';
import { createSafeActionClient } from 'next-safe-action';
import * as z from 'zod';

import { auth } from '@/lib/auth';

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({ name: z.string() });
  },
  handleServerError: (e) => {
    console.error('Server action error:', e);

    if (e instanceof Error) {
      return e.message;
    }

    return 'An unknown error occurred.';
  }
}).use(async ({ next, metadata }) => {
  // TODO: write logs in line with the rest of the logs
  console.log(`[${new Date().toISOString()}] Calling action: ${metadata.name}`);

  return next();
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return next({ ctx: { user: session.user } });
});
