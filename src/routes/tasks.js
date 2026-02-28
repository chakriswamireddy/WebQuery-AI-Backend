
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


taskRouter.get("/:taskId/stream", async (req, res) => {
  const { taskId } = req.params

  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.flushHeaders()

  let closed = false

  req.on("close", () => {
    closed = true
  })

  const interval = setInterval(async () => {
    if (closed) {
      clearInterval(interval)
      return
    }

    const result = await db.query(
      "SELECT status, answer FROM tasks WHERE id = $1",
      [taskId]
    )

    if (result.rows.length === 0) return

    const task = result.rows[0]

    res.write(
      `data: ${JSON.stringify({
        status: task.status,
        answer: task.answer
      })}\n\n`
    )

    if (task.status === "completed" || task.status === "failed") {
      clearInterval(interval)
      res.end()
    }
  }, 2000)
})

export default taskRouter;
