'use client';

import { Button, Input, InputOTP, InputOTPGroup, InputOTPSlot, Label } from '@repo/ui';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { registerAction, sendOTPAction } from './actions';
import { schema } from './schema';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { RegisterProvider, useRegisterContext } from './context';

type SignUpFormProps = z.infer<typeof schema>;

export function RegisterForm() {
  return (
    <RegisterProvider>
      <RegisterFlow />
    </RegisterProvider>
  );
}

const RegisterFlow = () => {
  const { step } = useRegisterContext();

  if (step === 'signup') return <SignUpForm />;
  if (step === 'verify') return <VerifyForm />;
};

function SignUpForm() {
  const { setStep, setUsername, setEmail, setPassword } = useRegisterContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<SignUpFormProps>({
    resolver: zodResolver(schema)
  });

  const { executeAsync, isExecuting } = useAction(sendOTPAction, {
    onSuccess: () => {
      setUsername(getValues('username'));
      setEmail(getValues('email'));
      setPassword(getValues('password'));
      setStep('verify');
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    }
  });

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h1 className="text-xl font-bold text-gray-800">Register</h1>
        <p className="text-sm text-gray-600">Get started with App</p>
      </div>
      <form
        onSubmit={handleSubmit((data) =>
          executeAsync({
            username: data.username,
            email: data.email,
            password: data.password
          })
        )}
      >
        <div className="p-6 pt-0">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="Enter your username" {...register('username')} error={errors.username?.message} />
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
        <div className="flex flex-col items-center p-6 pt-0">
          <Button type="submit" text={'Sign up'} loading={isExecuting} />
        </div>
      </form>
    </>
  );
}

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { username, email, password } = useRegisterContext();
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
          executeAsync({ username, email, password, code });
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
              executeAsync({ username, email, password, code });
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
