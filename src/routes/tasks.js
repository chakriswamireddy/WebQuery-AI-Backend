
import express from "express";

// import { taskQueue } from "../config/queue.js";
import { db } from "../config/db.js";
import { tasks } from "../models/scrapSchema.js";
import { enqueueScrapeJob } from "../aws/queue-setup.js";

const taskRouter = express.Router();

taskRouter.post("/", async (req, res) => {
  const { url, question } = req.body;

  const [task] = await db
    .insert(tasks)
    .values({
      url,
      question,
      status: "processing"
    })
    .returning();


    const qRes = await enqueueScrapeJob({
      taskId: task.id,
      url,
      question
    })
    
    res.json({ status: "queued", qRes, task })

});


taskRouter.get("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await db.query(
      "SELECT status, answer FROM tasks WHERE id = $1",
      [taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    const task = result.rows[0];

    return res.json({
      status: task.status,
      answer: task.answer
    });
  } catch (err) {
    console.error("Error fetching task", err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

export default taskRouter;
