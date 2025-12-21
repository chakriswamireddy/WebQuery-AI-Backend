import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/models/scrapSchema.js",
  out: "./drizzle",
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
  // url: process.env.DB_URL
});
