"use client";

import { Button, Input, Label } from "@repo/ui";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction } from "./actions";

const initialState = {
  status: "",
  message: "",
};

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);
  const { pending } = useFormStatus();

  return (
    <form action={formAction}>
      <div className="p-6 pt-0">
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              name="password"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center p-6 pt-0">
        <Button type="submit" text={"Login"} />
        <p>{state.message}</p>
      </div>
    </form>
  );
}
