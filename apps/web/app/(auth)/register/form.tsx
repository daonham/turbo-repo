"use client";

import { Button, Input, Label } from "@repo/ui";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerAction, signUpAction } from "./actions";
import { signUpSchema } from "./schema";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { RegisterProvider, useRegisterContext } from "./context";

type SignUpFormProps = z.infer<typeof signUpSchema>;

export function RegisterForm() {
  return (
    <RegisterProvider>
      <RegisterFlow />
    </RegisterProvider>
  );
}

const RegisterFlow = () => {
  const { step } = useRegisterContext();

  if (step === "signup") return <SignUpForm />;
  if (step === "verify") return <VerifyForm />;
};

function SignUpForm() {
  const { setStep, setUsername, setEmail, setPassword } = useRegisterContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignUpFormProps>({
    resolver: zodResolver(signUpSchema),
  });

  const { executeAsync, isExecuting } = useAction(signUpAction, {
    onSuccess: () => {
      setUsername(getValues("username"));
      setEmail(getValues("email"));
      setPassword(getValues("password"));
      setStep("verify");
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
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
            password: data.password,
          }),
        )}
      >
        <div className="p-6 pt-0">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...register("username")}
                error={errors.username?.message}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                autoCapitalize="none"
                autoComplete="email"
                {...register("email")}
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
                {...register("password")}
                error={errors.password?.message}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center p-6 pt-0">
          <Button type="submit" text={"Sign up"} loading={isExecuting} />
        </div>
      </form>
    </>
  );
}

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { username, email, password } = useRegisterContext();
  const [code, setCode] = useState("");

  const { executeAsync, isExecuting } = useAction(registerAction, {
    onSuccess: () => {
      toast.success("Register successful!");
      router.push(searchParams.get("from") || "/dashboard");
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
  });

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h1 className="text-xl font-bold text-gray-800">
          Verify your email address
        </h1>
        <p className="text-sm text-gray-600">
          Enter the six digit verification code sent to{" "}
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
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="opt">Username</Label>
              <Input
                id="opt"
                type="text"
                placeholder="Enter your OTP"
                name="opt"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center p-6 pt-0">
          <Button
            type="submit"
            text={isExecuting ? "Verifying..." : "Continue"}
            loading={isExecuting}
          />
        </div>
      </form>
    </>
  );
}
