'use server';

import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/safe-action';
import { ratelimit } from '@/lib/upstash';
import { schema } from './schema';

export const registerAction = actionClient.schema(schema).action(async ({ parsedInput }) => {
  const { name, email, password } = parsedInput;

  const { success } = await ratelimit(2, '1 m').limit(`registerAction`);

  if (!success) {
    throw new Error('Too many requests. Please try again later.');
  }

  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      image: '',
      callbackURL: '/login'
    }
  });

  return {
    ok: true
  };
});
