import { streamText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export const runtime = "edge"

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
})

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return new Response("Google API key not configured", { status: 500 })
  }

  const body = await req.json()
  const userPrompt = body.prompt || ""

  const systemPrompt = `
    You are an AI assistant that acknowledges user requests and confirms what you are about to do.
    Do not generate code. Just provide a brief, helpful, and encouraging response.
    For example, if the user provides data or asks for a component, you might say:
    "Understood! I'm now generating a component based on your request. Please wait a moment..."
    Keep your responses concise and to the point.
  `

  try {
    const result = await streamText({
      model: google("gemini-2.5-flash-lite-preview-06-17"),
      prompt: userPrompt,
      system: systemPrompt,
    })
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error generating chat response:", error)
    return new Response("Error generating chat response.", { status: 500 })
  }
}
