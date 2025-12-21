 
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  question: text("question").notNull(),
  status: text("status").notNull(), // pending | processing | completed | failed
  answer: text("answer"),
  createdAt: timestamp("created_at").defaultNow()
});
