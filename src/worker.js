 
import { Worker } from "bullmq";

import { scrapeWebsite } from "./config/scrapper.js";
import { askAI } from "./config/ai.js";
import { tasks } from "./models/scrapSchema.js";
import { redisConnection } from "./config/queue.js";
import { db } from "./config/db.js";
import { eq } from "drizzle-orm";
 
console.log("Worker process started");

new Worker(
  "tasks",
  async (job) => {
    console.log("Picked job", job.id);

    const { taskId, url, question } = job.data;

    console.log("Updating status to processing");
    await db.update(tasks)
      .set({ status: "processing" })
      .where(eq(tasks.id, taskId));

    console.log("Starting scrape");
    const content = await scrapeWebsite(url);

    console.log("Scrape done, calling AI");
    const answer = await askAI(content, question);

    console.log("Updating status to completed");
    await db.update(tasks)
      .set({ status: "completed", answer })
      .where(eq(tasks.id, taskId));
  },
  { connection: redisConnection }
);
