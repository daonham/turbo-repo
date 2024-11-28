'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label } from '@repo/ui';
import { Google } from '@repo/ui/src/icons';
import { useAction } from 'next-safe-action/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { googleLoginAction, loginAction } from './actions';
import { schema } from './schema';

type loginProps = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<loginProps>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    const error = searchParams?.get('error');
    if (error) {
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }, [searchParams]);

  const { executeAsync, isExecuting } = useAction(loginAction, {
    onSuccess: () => {
      toast.success('Login successful!');
      router.push(searchParams.get('from') || '/dashboard');
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    }
  });

  return (
    <div>
      <form onSubmit={handleSubmit((data) => executeAsync({ email: data.email, password: data.password }))}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoCapitalize="none"
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoCapitalize="none"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>
        </div>
        <div className="flex flex-col items-center pb-3 pt-6">
          <Button type="submit" text="Login" loading={isExecuting} />
        </div>
      </form>

      <div className="flex flex-col items-center pt-0">
        <Button variant="secondary" onClick={googleLoginAction} text="Sign in with Google" icon={<Google className="size-4" />} />
      </div>
    </div>
  );
}
