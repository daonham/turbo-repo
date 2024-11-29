'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label } from '@repo/ui';
import { useAction } from 'next-safe-action/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { forgotAction } from './actions';
import { schema } from './schema';

type formProps = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<formProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: searchParams.get('email') || ''
    }
  });

  const { executeAsync, isExecuting } = useAction(forgotAction, {
    onSuccess() {
      toast.success('You will receive an email with instructions to reset your password.');
      router.push('/login');
    },
    onError({ error }) {
      toast.error(error.serverError);
    }
  });

  return (
    <div>
      <form onSubmit={handleSubmit((data) => executeAsync({ email: data.email }))}>
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
