'use client';

import { signIn } from '@/lib/auth/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { Button, Input, Label } from '@repo/ui';
import { Google } from '@repo/ui/src/icons';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { loginAction } from './actions';
import { schema } from './schema';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    handleSubmitWithAction,
    action: { isExecuting },
    form: {
      register,
      formState: { errors },
      getValues
    }
  } = useHookFormAction(loginAction, zodResolver(schema), {
    formProps: {
      mode: 'onChange'
    },
    actionProps: {
      onSuccess: () => {
        toast.success('Login successful!');
        router.push(searchParams.get('from') || '/dashboard');
      },
      onError: ({ error }) => {
        if (error?.serverError) {
          toast.error(error.serverError);
        }
      }
    }
  });

  useEffect(() => {
    // If next-auth callback error. set error page in next-auth options
    const error = searchParams?.get('error');
    if (error) {
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }, [searchParams]);

  return (
    <div>
      <form onSubmit={handleSubmitWithAction}>
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
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href={`/forgot-password?email=${encodeURIComponent(getValues('email') || '')}`}
                className="text-sm text-gray-500 transition-colors hover:text-black"
              >
                Forgot password?
              </Link>
            </div>
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
          <Button type="submit" text="Sign in" loading={isExecuting} />
        </div>
      </form>

      <div className="flex flex-col items-center pt-0">
        <Button
          variant="secondary"
          onClick={() =>
            signIn.social({
              provider: 'google',
              callbackURL: '/dashboard'
            })
          }
          text="Sign in with Google"
          icon={<Google className="size-4" />}
        />
      </div>
    </div>
  );
}
