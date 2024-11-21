import { sqliteTableCreator, text, integer } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => `example-app_${name}`);

export const user = createTable("user", {
  id: integer("id").primaryKey(),
});

export const session = createTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: integer("expires_at", {
    mode: "timestamp",
  }).notNull(),
});
