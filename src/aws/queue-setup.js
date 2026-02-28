import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"

const sqs = new SQSClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

export async function enqueueScrapeJob({ taskId, url, question }) {
  const messageBody = JSON.stringify({
    jobId: `job-${Date.now()}`,
    payload: {
      taskId,
      url,
      question
    }
  })

  const command = new SendMessageCommand({
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageBody: messageBody
  })

  await sqs.send(command)
}