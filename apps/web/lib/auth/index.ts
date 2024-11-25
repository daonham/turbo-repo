import type { Session, User } from "@/lib/auth/session";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  invalidateSession,
  setSessionTokenCookie,
  validateSessionToken,
} from "@/lib/auth/session";
import { cookies } from "next/headers";
import { cache } from "react";

export const auth = cache(
  async (): Promise<{
    isAuth: boolean;
    session: Session | null;
    user: User | null;
  }> => {
    const token = (await cookies()).get("session")?.value ?? null;

    if (token === null) {
      return { isAuth: false, session: null, user: null };
    }

    const result = await validateSessionToken(token);

    return {
      isAuth: Boolean(result.session && result.user),
      session: result.session,
      user: result.user,
    };
  },
);

export async function login(userId: number) {
  try {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, userId);
    await setSessionTokenCookie(sessionToken, session.expires_at);
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Failed to log in");
  }
}

export async function logout() {
  deleteSessionTokenCookie();
  await invalidateSession((await auth())?.session?.id || "");
}
