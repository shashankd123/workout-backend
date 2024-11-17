import OpenAI from "openai";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY environment variable is not set');
}
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

const openai = new OpenAI({
  apiKey: OPENROUTER_API_KEY,
  baseURL: OPENROUTER_BASE_URL,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5000",
    "X-Title": "Workout Generator App",
  }
});

async function main() {
  try {
    console.log("Testing OpenRouter API connection...");
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Say this is a test" }],
      model: "anthropic/claude-3-haiku",
    });

    console.log("Success! Response:", completion.choices[0].message);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("API Error Response:", error.response.data);
    }
  }
}

main();
