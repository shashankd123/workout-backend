import OpenAI from "openai";

const OPENROUTER_API_KEY = "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";
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
