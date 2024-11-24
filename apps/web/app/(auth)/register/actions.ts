"use server";

import { login } from "@/lib/auth";
import { createUser, getUserFromEmail } from "@/lib/auth/user";
import { actionClient } from "@/lib/safe-action";
import { schema } from "./schema";

export const registerAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const { username, email, password } = parsedInput;

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
