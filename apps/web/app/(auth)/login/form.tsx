"use client";

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
      <label htmlFor="form-login.email">Email</label>
      <input
        type="email"
        id="form-login.email"
        name="email"
        autoComplete="username"
      />
      <br />
      <label htmlFor="form-login.password">Password</label>
      <input
        type="password"
        id="form-login.password"
        name="password"
        autoComplete="current-password"
      />
      <br />
      <button type="submit">{pending ? "Loading" : "Login"}</button>
      <p>{state.message}</p>
    </form>
  );
}
