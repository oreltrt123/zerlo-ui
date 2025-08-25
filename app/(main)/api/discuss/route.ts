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
  chatHistory?: Message[]
}

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return new Response("Google API key not configured", { status: 500 })
  }

  const body: RequestBody = await req.json().catch(() => ({}))
  const userPrompt = String(body?.prompt || "")
  const chatHistory = body?.chatHistory || []

  const systemPrompt = `
  You are Zerlo's AI assistant, created by Zerlo to help users with any questions or conversations they want to have.
  You have memory of our conversation and can discuss any topic the user wants to talk about.
  
  You can answer questions about:
  - Programming and web development
  - Game development and 3D graphics
  - General knowledge and current events
  - Technology and software
  - Or just have a casual, friendly conversation
  
  Be friendly, informative, and engaging. Keep your responses conversational and helpful.
  You are not generating code in this mode - just having a normal conversation.
  
  Remember previous messages in our conversation and reference them when relevant.
  If the user asks who created you, tell them you were created by Zerlo.
  
  If the user mentions uploading files:
  - For images: Describe what you see and offer to discuss the content
  - For PDFs/documents: Summarize the content and ask if they want to know more
  - For any files: Be helpful in analyzing and discussing the content
  
  Always maintain context from our previous conversation in this chat.
  `

  try {
    let contextPrompt = userPrompt
    if (chatHistory.length > 0) {
      const recentMessages = chatHistory.slice(-10) // Last 10 messages for better memory
      const contextMessages = recentMessages
        .map((msg: Message) => `${msg.sender === "user" ? "User" : "Zerlo AI"}: ${msg.content}`)
        .join("\n")
      contextPrompt = `Our conversation history:\n${contextMessages}\n\nUser's current message: ${userPrompt}`
    }

    const result = await streamText({
      model: google("gemini-2.5-flash-lite-preview-06-17"),
      prompt: contextPrompt,
      system: systemPrompt,
    })
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error generating discuss response:", error)
    return new Response("Error generating response.", { status: 500 })
  }
}
