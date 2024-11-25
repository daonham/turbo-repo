import { db } from "@/lib/db";
import { session, user } from "@/lib/db/schema";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export interface Session {
  id: string;
  expires_at: Date;
  user_id: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export async function createSession(
  token: string,
  userId: number,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const data: Session = {
    id: sessionId,
    user_id: userId,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };

  const result = await db
    .insert(session)
    .values({
      id: data.id,
      user_id: data.user_id,
      expires_at: Math.floor(data.expires_at.getTime() / 1000),
    })
    .returning()
    .get();

  if (!result) {
    throw new Error("Failed to create session");
  }

  return data;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const row = await db
    .select({
      id: session.id,
      user_id: session.user_id,
      expires_at: session.expires_at,
      email: user.email,
      username: user.username,
    })
    .from(session)
    .innerJoin(user, eq(session.user_id, user.id))
    .where(eq(session.id, sessionId))
    .limit(1)
    .get();

  if (!row) {
    return { session: null, user: null };
  }

  const data_session: Session = {
    id: row.id,
    expires_at: new Date(row.expires_at * 1000),
    user_id: row.user_id,
  };
  const data_user: User = {
    id: row.user_id,
    email: row.email,
    username: row.username,
  };

  if (Date.now() >= data_session.expires_at.getTime()) {
    await db.delete(session).where(eq(session.id, sessionId));

    return { session: null, user: null };
  }

  if (
    Date.now() >=
    data_session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 15
  ) {
    data_session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(session)
      .set({ expires_at: Math.floor(data_session.expires_at.getTime() / 1000) })
      .where(eq(session.id, sessionId));
  }

  return { session: data_session, user: data_user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  const row = await db
    .delete(session)
    .where(eq(session.id, sessionId))
    .returning({ deletedId: session.id })
    .get();

  if (!row?.deletedId) {
    throw new Error("Cannot delete session");
  }
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  (await cookies()).set("session", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  (await cookies()).set("session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}

export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();

  return token;
}
