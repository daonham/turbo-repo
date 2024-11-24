"use server";

import { login } from "@/lib/auth";
import { createUser, getUserFromEmail } from "@/lib/auth/user";
import { actionClient } from "@/lib/safe-action";
import { registerSchema, signUpSchema } from "./schema";

export const signUpAction = actionClient
  .schema(signUpSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    // TODO: send OTP code to the email

    return {
      ok: true,
    };
  });

export const registerAction = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput }) => {
    const { username, email, password, code } = parsedInput;

    // TODO: Verify OTP code

    const user_exist = await getUserFromEmail(email);

    if (user_exist) {
      throw new Error("User already exists");
    }

    const user = await createUser(email, username, password);

    await login(user.id);

    return {
      ok: true,
    };
  });
