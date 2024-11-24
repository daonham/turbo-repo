"use client";

import { Button, Input, Label } from "@repo/ui";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginAction } from "./actions";
import { schema } from "./schema";

type loginProps = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<loginProps>({
    resolver: zodResolver(schema),
  });

  const { executeAsync, isExecuting } = useAction(loginAction, {
    onSuccess: () => {
      toast.success("Login successful!");
      router.push(searchParams.get("from") || "/dashboard");
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) =>
        executeAsync({ email: data.email, password: data.password }),
      )}
    >
      <div className="p-6 pt-0">
        <div className="grid w-full items-center gap-4">
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
        <Button type="submit" text={"Login"} loading={isExecuting} />
      </div>
    </form>
  );
}
