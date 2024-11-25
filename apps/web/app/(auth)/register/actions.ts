"use server";

import { sendEmail } from "@/emails";
import VerifyEmail from "@/emails/verify-email";
import { login } from "@/lib/auth";
import {
  createUser,
  createVerifyOTP,
  getUserFromEmail,
  verifyOTP,
} from "@/lib/auth/user";
import { actionClient } from "@/lib/safe-action";
import { registerSchema, signUpSchema } from "./schema";

export const signUpAction = actionClient
  .schema(signUpSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    if (email.includes("+") && email.endsWith("@gmail.com")) {
      throw new Error(
        "Email addresses with + are not allowed. Please use your work email instead.",
      );
    }

    const user_exist = await getUserFromEmail(email);

    if (user_exist) {
      throw new Error("User already exists");
    }

    const code = await createVerifyOTP(email);

    await sendEmail({
      subject: `OTP to verify your account`,
      email,
      react: VerifyEmail({
        email,
        code,
      }),
    });

    return {
      ok: true,
    };
  });

export const registerAction = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput }) => {
    const { username, email, password, code } = parsedInput;

    await verifyOTP(email, code);

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
