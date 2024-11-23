import { db } from "@/lib/db";
import { user as userDB } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "./password";

export interface User {
  id: number;
  email: string;
  username: string;
  email_verified: boolean;
}

export function verifyUsernameInput(username: string): boolean {
  return (
    username.length > 3 && username.length < 32 && username.trim() === username
  );
}

export async function createUser(
  email: string,
  username: string,
  password: string,
): Promise<User> {
  const passwordHash = hashPassword(password);

  const row = await db
    .insert(userDB)
    .values({
      email,
      username,
      password_hash: passwordHash,
    })
    .returning()
    .get();

  if (row === null) {
    throw new Error("Unexpected error");
  }

  const user: User = {
    id: row.id,
    username: row.username,
    email: row.email,
    email_verified: !!row.email_verified,
  };

  return user;
}

export async function getUserFromEmail(email: string): Promise<User | null> {
  const row = await db
    .select()
    .from(userDB)
    .where(eq(userDB.email, email))
    .get();

  if (!row) {
    return null;
  }

  const user: User = {
    id: row.id,
    username: row.username,
    email: row.email,
    email_verified: !!row.email_verified,
  };

  return user;
}

export async function getUserPasswordHash(
  user_id: number,
): Promise<string | null> {
  const row = await db
    .select({
      password_hash: userDB.password_hash,
    })
    .from(userDB)
    .where(eq(userDB.id, user_id))
    .get();

  if (!row) {
    return null;
  }

  const passwordHash: string = row.password_hash;

  return passwordHash;
}
