"use server";

import { login } from "@/lib/auth";
import { verifyPasswordHash } from "@/lib/auth/password";
import { getUserFromEmail, getUserPasswordHash } from "@/lib/auth/user";

interface ActionResult {
  message: string;
}

export async function loginAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { message: "Please provide both an email and a password." };
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      message: "Invalid or missing fields",
    };
  }

  try {
    const user = await getUserFromEmail(email);

    if (!user) {
      return { message: "User not found." };
    }

    const passwordHash = await getUserPasswordHash(user.id);

    if (!passwordHash) {
      return { message: "Password hash not found." };
    }

    const validPassword = verifyPasswordHash(passwordHash, password);

    if (!validPassword) {
      return { message: "Invalid password." };
    }

    await login(user.id);

    return { message: "Login successful!" };
  } catch (error) {
    console.error("Error logging in:", error);
    return { message: "An error occurred while logging in." };
  }
}
