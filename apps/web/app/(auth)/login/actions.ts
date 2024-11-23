"use server";

import { login } from "@/lib/auth";
import { verifyPasswordHash } from "@/lib/auth/password";
import { getUserFromEmail, getUserPasswordHash } from "@/lib/auth/user";
import { z } from "zod";

interface ActionResult {
  status: "error" | "success";
  message: string;
}

const schema = z.object({
  email: z.string({ message: "Email is required." }).email({
    message: "Email must be a valid email.",
  }),
  password: z
    .string({
      message: "Password is required.",
    })
    .min(6, {
      message: "Password must be at least 6 characters long.",
    }),
});

export async function loginAction(
  _prev: any,
  data: FormData,
): Promise<ActionResult> {
  const formData = Object.fromEntries(data);

  try {
    const result = await schema.safeParseAsync(formData);

    if (!result.success) {
      throw new Error(
        result?.error?.errors[0]?.message || "Login validate failed.",
      );
    }

    const user = await getUserFromEmail(result.data.email);

    if (!user) {
      throw new Error("User not found.");
    }

    const passwordHash = await getUserPasswordHash(user.id);

    if (!passwordHash) {
      throw new Error("Password hash not found.");
    }

    const validPassword = verifyPasswordHash(
      passwordHash,
      result.data.password,
    );

    if (!validPassword) {
      throw new Error("Invalid password.");
    }

    await login(user.id);

    return {
      status: "success",
      message: "Login successful.",
    };
  } catch (error: any) {
    console.error(error);
    return {
      status: "error",
      message:
        error?.message || "Something went wrong. Please try again later.",
    };
  }
}
