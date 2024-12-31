'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { Button, Input, Label } from '@repo/ui';
import { toast } from 'sonner';
import { registerAction } from './actions';
import { schema } from './schema';

export function RegisterForm() {
  const {
    handleSubmitWithAction,
    action: { isExecuting },
    form: {
      register,
      formState: { errors }
    }
  } = useHookFormAction(registerAction, zodResolver(schema), {
    formProps: {
      mode: 'onChange'
    },
    actionProps: {
      onSuccess: () => {
        toast.success('Please verify your email address');
      },
      onError: ({ error }) => {
        if (error?.serverError) {
          toast.error(error.serverError);
        }
      }
    }
  });

  return (
    <>
      <div className="flex flex-col space-y-1.5 pb-6">
        <h1 className="text-center text-lg font-semibold text-gray-800">Register</h1>
        <p className="text-center text-sm text-gray-500">Get started with App</p>
      </div>
      <form onSubmit={handleSubmitWithAction}>
        <div>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Enter your name" {...register('name')} error={errors.name?.message} />
            </div>
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
        </div>
        <div className="flex flex-col items-center pt-6">
          <Button type="submit" text={'Sign up'} loading={isExecuting} />
        </div>
      </form>
    </>
  );
}
