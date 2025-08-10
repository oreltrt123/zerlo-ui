import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const runtime = "edge";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

// Helper function for calling OpenAI GPT chat completions streaming
async function callOpenAIChatCompletion(prompt: string) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  // OpenAI Chat Completions endpoint (v1/chat/completions)
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // or any GPT model you want to use here
      messages: [
        {
          role: "system",
          content: `
You are an expert at creating React components using shadcn/ui and Tailwind CSS.
A user has provided the following data:

---
${prompt}
---

Create a React component that visualizes this data. Follow these EXACT rules:

Follow these guidelines:
1. Generate code or files in any programming language specified by the user (e.g., JavaScript, Python, HTML, etc.).
2. Focus on gaming-related tasks, such as creating game logic, game assets, or visualizations (e.g., leaderboards, player stats).
3. If requested, act as a user by simulating game interactions or generating game-related outputs (e.g., moves in a game).
4. Optionally include graphs or visualizations for game data using Chart.js or other libraries, but only if specified.
5. Avoid restrictive rules (e.g., no forced use of specific libraries like shadcn/ui or Tailwind CSS).
6. Handle errors gracefully by suggesting fixes or alternative outputs.
7. If the user requests a specific file type (e.g., .html, .py), return the code in the appropriate format with clear file structure.
8. If no language is specified, default to JavaScript for browser-based games or visualizations.

Example:
- Input: "Create a Python script for a text-based adventure game"
- Output: A Python script with game logic, saved as 'adventure.py'
- Input: "Generate a leaderboard chart for game scores"
- Output: A JavaScript-based chart using Chart.js to display scores

EXAMPLE FORMAT:
const DataVisualization = () => {
  // component logic here
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        {/* content here */}
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
          `,
        },
        { role: "user", content: prompt },
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  return response.body; // This is a ReadableStream of chunks for streaming
}

export async function POST(req: Request) {
  console.log("POST /api/generate - Start");

  const body = await req.json();
  console.log("Request body:", JSON.stringify(body));

  const userInput = body.prompt || body.data || "";
  const modelChoice = body.model || "gemini"; // default to google Gemini if no model specified

  if (!userInput) {
    return new Response("No prompt provided", { status: 400 });
  }

  try {
    if (modelChoice === "gemini") {
      if (!process.env.GOOGLE_API_KEY) {
        return new Response("Google API key not configured", { status: 500 });
      }

      const systemPrompt = `
        You are an expert at creating React components using shadcn/ui and Tailwind CSS.
        A user has provided the following data:

        ---
        ${userInput}
        ---
 
        Create a React component that visualizes this data. Follow these EXACT rules:

      Follow these guidelines:
      1. Generate code or files in any programming language specified by the user (e.g., JavaScript, Python, HTML, etc.).
      2. Focus on gaming-related tasks, such as creating game logic, game assets, or visualizations (e.g., leaderboards, player stats).
      3. If requested, act as a user by simulating game interactions or generating game-related outputs (e.g., moves in a game).
      4. Optionally include graphs or visualizations for game data using Chart.js or other libraries, but only if specified.
      5. Avoid restrictive rules (e.g., no forced use of specific libraries like shadcn/ui or Tailwind CSS).
      6. Handle errors gracefully by suggesting fixes or alternative outputs.
      7. If the user requests a specific file type (e.g., .html, .py), return the code in the appropriate format with clear file structure.
      8. If no language is specified, default to JavaScript for browser-based games or visualizations.

      Example:
      - Input: "Create a Python script for a text-based adventure game"
      - Output: A Python script with game logic, saved as 'adventure.py'
      - Input: "Generate a leaderboard chart for game scores"
      - Output: A JavaScript-based chart using Chart.js to display scores

        EXAMPLE FORMAT:
        const DataVisualization = () => {
          // component logic here
          return (
            <Card>
              <CardHeader>
                <CardTitle>Title</CardTitle>
              </CardHeader>
              <CardContent>
                {/* content here */}
              </CardContent>
            </Card>
          );
        };

        export default DataVisualization;
      `;

      console.log("Calling Google Gemini model...");
      const result = await streamText({
        model: google("gemini-2.5-flash-lite-preview-06-17"),
        prompt: systemPrompt,
      });

      return result.toDataStreamResponse();

    } else if (modelChoice === "gpt") {
      console.log("Calling OpenAI GPT chat model...");
      const stream = await callOpenAIChatCompletion(userInput);

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });

    } else {
      return new Response("Invalid model specified", { status: 400 });
    }
  } catch (error) {
    console.error("Error generating component:", error);
    return new Response("Error generating component.", { status: 500 });
  }
}
