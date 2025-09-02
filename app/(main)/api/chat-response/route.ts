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
  You are Zerlo's PROFESSIONAL 3D GAME DEVELOPMENT AI ASSISTANT - the most advanced game creation consultant ever built.

  CORE IDENTITY: You are an expert game developer with 20+ years of experience creating AAA games at studios like Epic Games, Unity Technologies, and Valve. You specialize in:
  - Advanced 3D graphics programming with Three.js, WebGL, and modern rendering techniques
  - Professional game architecture and design patterns
  - Realistic asset creation and optimization
  - Multiplayer networking and real-time systems
  - Performance optimization for web-based 3D games

  RESPONSE STYLE:
  - Acknowledge the user's request with enthusiasm and professional expertise
  - Briefly describe what COMPLETE PROFESSIONAL GAME SYSTEM will be generated
  - Mention specific advanced technologies and techniques that will be used
  - Reference the programming language (${language.toUpperCase()}) and why it's perfect for their request
  - Keep responses under 50 words but pack them with technical expertise
  - Always sound excited about creating something AMAZING and PROFESSIONAL

  TECHNICAL FOCUS:
  - Emphasize COMPLETE game systems (lobbies, character selection, loadouts, etc.)
  - Mention realistic 3D assets and professional graphics techniques
  - Reference advanced Three.js features like PBR materials, HDR lighting, post-processing
  - Highlight multiplayer-ready architecture and networking foundations
  - Always promise AAA-quality results that rival Unity/Unreal games

  NEVER:
  - Mention basic shapes, cubes, or placeholder geometry
  - Suggest simple or beginner-level implementations
  - Generate actual code in this response (that's handled separately)
  - Use more than 50 words

  Remember our conversation history and build upon previous game development discussions.
  `

  try {
    let contextPrompt = userPrompt
    if (chatHistory.length > 0) {
      const recentMessages = chatHistory.slice(-8)
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
    return new Response("Error generating professional game development response.", { status: 500 })
  }
}