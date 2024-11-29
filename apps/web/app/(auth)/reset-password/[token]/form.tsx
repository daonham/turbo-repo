'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label } from '@repo/ui';
import { useAction } from 'next-safe-action/hooks';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { resetPasswordAction } from './actions';
import { schema } from './schema';

type formProps = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const { token } = useParams<{ token: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<formProps>({
    resolver: zodResolver(schema)
  });

  const { executeAsync, isExecuting } = useAction(resetPasswordAction, {
    onSuccess() {
      toast.success('Your password has been reset. You can now log in with your new password.');
      router.replace('/login');
    },
    onError({ error }) {
      toast.error(error.serverError);
    }
  });

  return (
    <div>
      <form onSubmit={handleSubmit((data) => executeAsync({ token: data.token, password: data.password, confirmPassword: data.confirmPassword }))}>
        <input type="hidden" value={token} {...register('token')} />
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
