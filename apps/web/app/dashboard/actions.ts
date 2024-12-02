'use server';

import { auth, signOut } from '@/lib/auth';

export async function logoutAction() {
  const session = await auth();

  if (!session) {
    return {
      message: 'Not authenticated'
    };
  }

  await signOut({
    redirectTo: '/'
  });
}
