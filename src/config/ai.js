import axios from "axios";

export async function askAI(content, question) {
  const startTime = Date.now();

  console.log("[AI] Starting AI request");
  console.log(`[AI] Content length: ${content?.length ?? 0}`);
  console.log(`[AI] Question length: ${question?.length ?? 0}`);

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Answer based only on the provided website content.",
          },
          {
            role: "user",
            content: `Website:\n${content}\n\nQuestion:\n${question}`,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30_000,
      }
    );

    const duration = Date.now() - startTime;

    console.log(`[AI] Request completed in ${duration}ms`);
    console.log(
      `[AI] Model: ${response.data?.model ?? "unknown"}, tokens used: ${response.data?.usage?.total_tokens ?? "n/a"}`
    );

    const answer = response?.data?.choices?.[0]?.message?.content;

    if (!answer) {
      console.error("[AI] No answer returned from model", {
        response: response.data,
      });
      throw new Error("AI response did not contain an answer");
    }

    console.log(`[AI] Answer length: ${answer.length}`);

    return answer;
  } catch (error) {
    const duration = Date.now() - startTime;

    console.error("[AI] Request failed", {
      duration,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    throw error; 
  }
}
