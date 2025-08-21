import { NextRequest } from "next/server"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  console.log("POST /api/ai/grok - Start")

  const body = await req.json()
  const userInput = body.prompt || body.data || ""

  if (!userInput) {
    return new Response("No prompt provided", { status: 400 })
  }

  const XAI_API_KEY = process.env.XAI_API_KEY || "xai-MJpQ1L2lRRH9uHhNvM9yubJeQLnUBR7UP2gKhDCqNyrSbOYt3XTMOwgrvcgNN5Z96Eb1PqlfMbcqbJvw"
  if (!XAI_API_KEY) {
    return new Response("xAI API key not configured", { status: 500 })
  }

  try {
    console.log("Calling xAI Grok...")
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content: `
You are an expert at creating React components using shadcn/ui and Tailwind CSS.
A user has provided the following data:

---
${userInput}
---

Create a React component that visualizes this data. Follow these EXACT rules:

1. Generate code or files in any programming language specified by the user (e.g., JavaScript, Python, HTML, etc.).
2. Focus on gaming-related tasks, such as creating game logic, game assets, or visualizations (e.g., leaderboards, player stats).
3. If requested, act as a user by simulating game interactions or generating game-related outputs (e.g., moves in a game).
4. Optionally include graphs or visualizations for game data using Chart.js or other libraries, but only if specified.
5. Avoid restrictive rules (e.g., no forced use of specific libraries like shadcn/ui or Tailwind CSS).
6. Handle errors gracefully by suggesting fixes or alternative outputs.
7. If the user requests a specific file type (e.g., .html, .py), return the code in the appropriate format with clear file structure.
8. If no language is specified, default to JavaScript for browser-based games or visualizations.

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
          { role: "user", content: userInput },
        ],
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`xAI API error: ${response.status} - ${errorText}`)
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error calling Grok:", error)
    return new Response("Error generating component with Grok.", { status: 500 })
  }
}
