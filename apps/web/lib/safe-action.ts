import { headers } from 'next/headers';
import { createSafeActionClient } from 'next-safe-action';

import { auth } from '@/lib/auth';

export const actionClient = createSafeActionClient({
  handleServerError: (e) => {
    console.error('Server action error:', e);

    if (e instanceof Error) {
      return e.message;
    }

    return 'An unknown error occurred.';
  }
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
