import { streamText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export const runtime = "edge"

const googleData = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY || "" })

export async function POST() {
  if (!process.env.GOOGLE_API_KEY) return new Response("Google API key not configured", { status: 500 })

  const systemPrompt = `
    Generate realistic sample tabular data in CSV format.
    Rules:
    1) Only raw CSV. No markdown, no explanations.
    2) 8–12 rows with headers.
    3) Use realistic fields and values.
  `

  try {
    const result = await streamText({ model: googleData("gemini-2.5-flash-lite-preview-06-17"), prompt: systemPrompt })
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error generating data:", error)
    return new Response("Error generating sample data.", { status: 500 })
  }
}