import { streamText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export const runtime = "edge"

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY || "" })

interface Message {
  sender: "user" | "ai"
  content: string
}

interface RequestBody {
  prompt?: string
  language?: string
  chatHistory?: Message[]
}

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) return new Response("Google API key not configured", { status: 500 })

  const body: RequestBody = await req.json().catch(() => ({}))
  const userPrompt = String(body?.prompt || "")
  const language = String(body?.language || "html")
  const chatHistory = body?.chatHistory || []

  const systemPrompt = `
  You are Zerlo's AI assistant for the 3D game generator, created by Zerlo. Acknowledge the request and describe (briefly) what will be generated in ${language.toUpperCase()}.
  Do not generate code here. Keep replies under 25 words.
  Mention the programming language that will be used for the implementation.
  Remember our conversation history and reference previous requests when relevant.
  `

  try {
    let contextPrompt = userPrompt
    if (chatHistory.length > 0) {
      const recentMessages = chatHistory.slice(-8) // Last 8 messages for better context
      const contextMessages = recentMessages
        .map((msg: Message) => `${msg.sender === "user" ? "User" : "Zerlo AI"}: ${msg.content}`)
        .join("\n")
      contextPrompt = `Previous conversation:\n${contextMessages}\n\nCurrent request: ${userPrompt}`
    }

    const result = await streamText({
      model: google("gemini-2.5-flash-lite-preview-06-17"),
      prompt: contextPrompt,
      system: systemPrompt,
    })
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error generating chat response:", error)
    return new Response("Error generating chat response.", { status: 500 })
  }
}
