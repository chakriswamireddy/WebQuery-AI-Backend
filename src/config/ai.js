 
import axios from "axios";

export async function askAI(content, question) {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "Answer based on website content." },
        { role: "user", content: `Website:\n${content}\n\nQuestion:\n${question}` }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      }
    }
  );

  return response.data.choices[0].message.content;
}
