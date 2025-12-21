import "dotenv/config";


import express from "express";
import cors from "cors";
import taskRouter from "./routes/tasks.js";
 

const app = express();

app.use(cors());
app.use(express.json());

app.use("/tasks", taskRouter);

// health
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
