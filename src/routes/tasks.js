
import express from "express";

import { taskQueue } from "../config/queue.js";
import { db } from "../config/db.js";
import { tasks } from "../models/scrapSchema.js";

const taskRouter = express.Router();

taskRouter.post("/", async (req, res) => {
  const { url, question } = req.body;

  const [task] = await db
    .insert(tasks)
    .values({
      url,
      question,
      status: "pending"
    })
    .returning();

  await taskQueue.add("scrape-and-answer", {
    taskId: task.id,
    url,
    question
  },
    {
      removeOnComplete: false,
      removeOnFail: false,
    });

  res.json(task);
});

taskRouter.get("/:id", async (req, res) => {
  const task = await db.query.tasks.findFirst({
    where: (t, { eq }) => eq(t.id, req.params.id)
  });

  res.json(task);
});

export default taskRouter;
