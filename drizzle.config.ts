import { type Config } from "drizzle-kit"

import { env } from "@/env"

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["practish.com_*"],
} satisfies Config
