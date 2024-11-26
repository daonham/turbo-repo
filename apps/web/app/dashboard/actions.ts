'use server';

import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';

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

  redirect('/login');
}
