import { streamText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export const runtime = "edge"

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY || "" })

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) return new Response("Google API key not configured", { status: 500 })

  const body = await req.json().catch(() => ({}))
  const userPrompt = String(body?.prompt || "")

  const systemPrompt = `
  You are a concise assistant for a 3D game generator. Acknowledge the request and describe (briefly) what will be generated.
  Do not generate code here. Keep replies under 25 words.
  `

  try {
    const result = await streamText({ model: google("gemini-2.5-flash-lite-preview-06-17"), prompt: userPrompt, system: systemPrompt })
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error generating chat response:", error)
    return new Response("Error generating chat response.", { status: 500 })
  }
}