import { SQL, sql } from "drizzle-orm";
import {
  AnySQLiteColumn,
  integer,
  sqliteTableCreator,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => `example-app_${name}`);

export const user = createTable(
  "user",
  {
    id: integer("id").primaryKey(),
    email: text("email").notNull(),
    password_hash: text("password_hash").notNull(),
    username: text("username").notNull(),
    email_verified: integer("email_verified").notNull().default(0),
  },
  (table) => ({
    email_idx: uniqueIndex("email_idx").on(lower(table.email)),
  }),
);

export const session = createTable("session", {
  id: text("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => user.id),
  expires_at: integer("expires_at").notNull(),
});

export const email_verification_request = createTable(
  "email_verification_request",
  {
    id: text("id").primaryKey(),
    user_id: integer("user_id")
      .notNull()
      .references(() => user.id),
    email: text("email").notNull(),
    code: text("token").notNull(),
    expires_at: integer("expires_at", {
      mode: "timestamp",
    }).notNull(),
  },
);

export const password_reset_session = createTable("password_reset_session", {
  id: text("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => user.id),
  email: text("email").notNull(),
  code: text("token").notNull(),
  expires_at: integer("expires_at", {
    mode: "timestamp",
  }).notNull(),
  email_verified: integer("email_verified").notNull().default(0),
});

export function lower(email: AnySQLiteColumn): SQL {
  return sql`lower(${email})`;
}
