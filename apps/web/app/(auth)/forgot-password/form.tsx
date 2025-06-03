'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { toast } from 'sonner';
import { Button, Input, Label } from '@repo/ui';

import { forgotAction } from './actions';
import { schema } from './schema';

export function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    handleSubmitWithAction,
    action: { isExecuting },
    form: {
      register,
      formState: { errors }
    }
  } = useHookFormAction(forgotAction, zodResolver(schema), {
    formProps: {
      mode: 'onChange',
      defaultValues: {
        email: searchParams.get('email') || ''
      }
    },
    actionProps: {
      onSuccess: () => {
        toast.success('You will receive an email with instructions to reset your password.');
        router.push('/login');
      },
      onError: ({ error }) => {
        if (error?.serverError) {
          toast.error(error.serverError);
        }
      }
    }
  });

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
        </div>
        <div className="flex flex-col items-center pb-3 pt-6">
          <Button type="submit" text={isExecuting ? 'Sending...' : 'Send reset link'} loading={isExecuting} />
        </div>
      </form>
    </div>
  );
}
