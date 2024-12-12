'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { Button, Input, InputOTP, InputOTPGroup, InputOTPSlot, Label } from '@repo/ui';
import { useAction } from 'next-safe-action/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { registerAction, sendOTPAction } from './actions';
import { RegisterProvider, useRegisterContext } from './context';
import { schema } from './schema';

export function RegisterForm() {
  return (
    <RegisterProvider>
      <RegisterFlow />
    </RegisterProvider>
  );
}

const RegisterFlow = () => {
  const { step } = useRegisterContext();

  return {
    signup: <SignUpForm />,
    verify: <VerifyForm />
  }[step];
};

function SignUpForm() {
  const { setStep, setName, setEmail, setPassword } = useRegisterContext();

  const {
    handleSubmitWithAction,
    action: { isExecuting },
    form: {
      register,
      formState: { errors },
      getValues
    }
  } = useHookFormAction(sendOTPAction, zodResolver(schema), {
    formProps: {
      mode: 'onChange'
    },
    actionProps: {
      onSuccess: () => {
        setName(getValues('name'));
        setEmail(getValues('email'));
        setPassword(getValues('password'));
        setStep('verify');
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

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { name, email, password } = useRegisterContext();
  const [isInvalidCode, setIsInvalidCode] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [code, setCode] = useState('');

  const { executeAsync, isExecuting } = useAction(registerAction, {
    onSuccess: () => {
      toast.success('Account created! Redirecting...');
      setIsRedirecting(true);
      router.push(searchParams.get('from') || '/dashboard');
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError);
      }
      setCode('');
      setIsInvalidCode(true);
    }
  });

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h1 className="text-xl font-bold text-gray-800">Verify your email address</h1>
        <p className="text-sm text-gray-600">
          Enter the six digit verification code sent to{' '}
          <strong className="font-medium text-gray-800" title={email}>
            {email}
          </strong>
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeAsync({ name, email, password, code });
        }}
      >
        <div className="p-6 pt-0">
          <InputOTP
            maxLength={6}
            value={code}
            containerClassName="group flex items-center justify-center"
            onChange={(code: string) => {
              setIsInvalidCode(false);
              setCode(code);
            }}
            onComplete={() => {
              executeAsync({ name, email, password, code });
            }}
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {isInvalidCode && <p className="mt-2 text-center text-sm text-red-500">Invalid code. Please try again.</p>}
        </div>
        <div className="flex flex-col items-center p-6 pt-0">
          <Button
            type="submit"
            text={isExecuting ? 'Verifying...' : 'Continue'}
            loading={isExecuting || isRedirecting}
            disabled={!code || code.length < 6}
          />
        </div>
      </form>
    </>
  );
}
