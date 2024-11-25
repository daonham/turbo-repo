"use server";

import { login } from "@/lib/auth";
import { verifyPasswordHash } from "@/lib/auth/password";
import { getUserFromEmail, getUserPasswordHash } from "@/lib/auth/user";
import { actionClient } from "@/lib/safe-action";
import { schema } from "./schema";

export const loginAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput;

    const user = await getUserFromEmail(email);

    if (!user) {
      throw new Error("User not found.");
    }

    const passwordHash = await getUserPasswordHash(email);

    if (!passwordHash) {
      throw new Error("User not found.");
    }

    const validPassword = verifyPasswordHash(passwordHash, password);

    if (!validPassword) {
      throw new Error("Invalid password.");
    }

    await login(user.id);

    return { ok: true };
  });
