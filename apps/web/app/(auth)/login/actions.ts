"use server";

import { signIn } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";
import { schema } from "./schema";

export const loginAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    return { ok: true };
  });

export const googleLoginAction = async () => {
  await signIn("google", { redirectTo: "/dashboard" });
};
