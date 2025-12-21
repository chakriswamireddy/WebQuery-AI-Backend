 
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { scrapeWebsite } from "./config/scrapper.js";
import { askAI } from "./config/ai.js";
import { tasks } from "./models/scrapSchema.js";
import { redisConnection } from "./config/queue.js";
 
 
new Worker(
  "tasks",
  async (job) => {
    const { taskId, url, question } = job.data;

    await db.update(tasks)
      .set({ status: "processing" })
      .where(eq(tasks.id, taskId));

    const content = await scrapeWebsite(url);
    const answer = await askAI(content, question);

    await db.update(tasks)
      .set({
        status: "completed",
        answer
      })
      .where(eq(tasks.id, taskId));
  },
  {connection:  redisConnection }
);
