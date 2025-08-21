import { streamText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export const runtime = "edge"

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY || "" })

const SYSTEM_HTML_3D = `
You are an expert AI game generator.
Your default output is a COMPLETE, runnable single-file **HTML + JavaScript** program suitable for browsers.

CRITICAL RULES:
- Unless the user explicitly asks for another language or framework, output **pure HTML + vanilla JS**.
- For anything involving "3D", generate a **map-like professional 3D scene** with terrain, lighting, and multiple interactive objects, not just a cube.
- Prefer **Three.js** or **Babylon.js** for 3D. Load them from a public CDN.
- Do **NOT** use React, Next.js, Tailwind, shadcn/ui, Recharts, or any UI library unless the user explicitly asks.
- Do **NOT** write TypeScript unless the user explicitly asks.
- Always return **large, professional-quality code** with multiple elements, cameras, lights, and interactions.
- Include everything needed in one file: <script> tags, <canvas> if needed, and a minimal style reset.
- No explanations, no markdown fences—**return ONLY the code**.
- If external assets are required, fetch them via URL and handle errors gracefully.
- Auto-resize the canvas to the window and handle resize events.
`

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return new Response("Google API key not configured", { status: 500 })
  }

  const body = await req.json().catch(() => ({}))
  const userPrompt = String(body?.prompt || "Create a professional 3D terrain map with lighting and controls using Three.js")

  try {
    const result = await streamText({
      model: google("gemini-2.5-flash-lite-preview-06-17"),
      system: SYSTEM_HTML_3D,
      prompt: userPrompt,
    })

    return result.toDataStreamResponse()
  } catch (err) {
    console.error("/api/generate error", err)
    return new Response("Error generating code.", { status: 500 })
  }
}