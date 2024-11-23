"use server";

import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/auth/session";
import { createUser } from "@/lib/auth/user";

interface ActionResult {
  message: string;
}

export async function registerAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return {
      message: "Invalid or missing fields",
    };
  }

  const user = await createUser(email, username, password);

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);

  await setSessionTokenCookie(sessionToken, session.expires_at);

  return {
    message: `Welcome ${user.username}!`,
  };
}
