'use server';

import { signIn } from '@/lib/auth';
import { actionClient } from '@/lib/safe-action';
import { schema } from './schema';

export const loginAction = actionClient.schema(schema).action(async ({ parsedInput }) => {
  const { email, password } = parsedInput;

  // refactor: code
  try {
    await signIn('credentials', {
      redirect: false,
      email: email.toLowerCase(),
      password
    });
  } catch (error: any) {
    throw new Error(error?.message || 'Invalid credentials');
  }

  return { ok: true };
});

export const googleLoginAction = async () => {
  await signIn('google', { redirectTo: '/dashboard' });
};
