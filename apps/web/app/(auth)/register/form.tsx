"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { registerAction } from "./actions";

const initialState = {
  message: "",
};

export default function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);
  const { pending } = useFormStatus();

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" name="username" required />

      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" required />

      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" required />

      <button type="submit">{pending ? "Loading" : "Register"}</button>
      <p>{state.message}</p>
    </form>
  );
}
