 
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { scrapeWebsite } from "./config/scrapper";
import { askAI } from "./config/ai";
import { tasks } from "./models/scrapSchema";
 

const connection = new IORedis("redis://localhost:6379");

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
  { connection }
);
