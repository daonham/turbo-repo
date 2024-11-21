import { type Config } from "drizzle-kit";

export default {
  schema: "./server/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  tablesFilter: ["example-app_*"],
} satisfies Config;
