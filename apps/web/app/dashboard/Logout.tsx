"use client";

import { useActionState } from "react";
import { logoutAction } from "./actions";

const initialState = {
  message: "",
};

export default function Logout() {
  const [state, formAction] = useActionState(logoutAction, initialState);
  console.log(state);

  return (
    <form action={formAction}>
      <button type="submit">Logout</button>
    </form>
  );
}
