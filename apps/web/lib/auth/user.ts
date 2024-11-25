import { db } from "@/lib/db";
import {
  email_verification_request as emailVerifyDB,
  lower,
  user as userDB,
} from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { hashPassword } from "./password";
import { generateOTP } from "./utils";

export interface User {
  id: number;
  email: string;
  username: string;
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
  };

  return user;
}

export async function getUserFromEmail(email: string): Promise<User | null> {
  const row = await db
    .select()
    .from(userDB)
    .where(eq(lower(userDB.email), email.toLowerCase()))
    .get();

  if (!row) {
    return null;
  }

  const user: User = {
    id: row.id,
    username: row.username,
    email: row.email,
  };

  return user;
}

export async function getUserPasswordHash(
  email: string,
): Promise<string | null> {
  const row = await db
    .select({
      password_hash: userDB.password_hash,
    })
    .from(userDB)
    .where(eq(userDB.email, email))
    .get();

  if (!row) {
    return null;
  }

  const passwordHash: string = row.password_hash;

  return passwordHash;
}

export async function createVerifyOTP(email: string): Promise<string> {
  const otp = generateOTP();

  // Delete all existing OTPs for the email.
  await db
    .delete(emailVerifyDB)
    .where(eq(lower(emailVerifyDB.email), email.toLowerCase()));

  const expire = new Date(Date.now() + 2 * 60 * 1000);

  // Insert OTP to DB
  const result = await db
    .insert(emailVerifyDB)
    .values({
      email: email.toLowerCase(),
      code: otp,
      expires_at: Math.floor(expire.getTime() / 1000),
    })
    .returning({ code: emailVerifyDB.code })
    .get();

  return result.code;
}

export async function verifyOTP(email: string, otp: string): Promise<string> {
  const row = await db
    .select()
    .from(emailVerifyDB)
    .where(
      sql`${emailVerifyDB.email} = ${email} and ${emailVerifyDB.code} = ${otp}`,
    )
    .get();

  if (!row) {
    throw new Error("Invalid OTP");
  }

  const expire = new Date(row.expires_at * 1000);

  if (Date.now() >= expire.getTime()) {
    await db
      .delete(emailVerifyDB)
      .where(
        sql`${emailVerifyDB.email} = ${email} and ${emailVerifyDB.code} = ${otp}`,
      );
    throw new Error("OTP expired");
  }

  return row.email;
}
