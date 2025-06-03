'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { toast } from 'sonner';
import { Button, Input, Label } from '@repo/ui';

import { resetPasswordAction } from './actions';
import { schema } from './schema';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    handleSubmitWithAction,
    action: { isExecuting },
    form: {
      register,
      formState: { errors }
    }
  } = useHookFormAction(resetPasswordAction, zodResolver(schema), {
    formProps: {
      mode: 'onChange'
    },
    actionProps: {
      onSuccess: () => {
        toast.success('Your password has been reset. You can now log in with your new password.');
        router.replace('/login');
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
        <Input type="hidden" value={searchParams.get('token') || ''} {...register('token')} error={errors.token?.message} />
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoCapitalize="none" {...register('password')} error={errors.password?.message} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              autoCapitalize="none"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
          </div>
        </div>
        <div className="flex flex-col items-center pb-3 pt-6">
          <Button type="submit" text="Reset Password" loading={isExecuting} />
        </div>
      </form>
    </div>
  );
}
