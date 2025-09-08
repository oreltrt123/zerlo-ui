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
  selectedStyle?: string
  selectedGameType?: string
  slashCommand?: string
}

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) return new Response("Google API key not configured", { status: 500 })

  const body: RequestBody = await req.json().catch(() => ({}))
  const userPrompt = String(body?.prompt || "")
  const language = String(body?.language || "html")
  const chatHistory = body?.chatHistory || []
  const selectedStyle = String(body?.selectedStyle || "gaming")
  const selectedGameType = String(body?.selectedGameType || "3d")
  const slashCommand = body?.slashCommand

  const getStyleDescription = (style: string) => {
    switch (style) {
      case "gaming":
        return "futuristic gaming buttons with gradient animations and professional gaming aesthetics"
      case "playstore":
        return "clean app store style buttons with modern design and smooth transitions"
      case "3d-play":
        return "3D buttons with depth effects, hover animations, and tactile feedback"
      default:
        return "professional gaming style buttons with modern aesthetics"
    }
  }

  const getGameTypeDescription = (type: string) => {
    switch (type) {
      case "2d":
        return "2D games with sprite-based graphics, pixel art aesthetics, and classic gameplay mechanics"
      case "3d":
        return "3D games with realistic graphics, advanced lighting, and immersive environments"
      case "vr":
        return "VR games with immersive experiences, spatial interactions, and virtual reality mechanics"
      default:
        return "3D games with professional graphics and modern gameplay"
    }
  }

  const systemPrompt = `
  You are Zerlo's PROFESSIONAL GAME DEVELOPMENT AI ASSISTANT - the most advanced game creation consultant ever built.

  CURRENT USER PREFERENCES:
  - Game Type: ${selectedGameType.toUpperCase()} - ${getGameTypeDescription(selectedGameType)}
  - Button Style: ${selectedStyle} - ${getStyleDescription(selectedStyle)}
  - Programming Language: ${language.toUpperCase()}
  ${slashCommand ? `- Slash Command: ${slashCommand} (user wants to modify existing game)` : ""}

  CORE IDENTITY: You are an expert game developer with 20+ years of experience creating AAA games. You specialize in:
  - Advanced ${selectedGameType.toUpperCase()} graphics programming with Three.js, WebGL, and modern rendering techniques
  - Professional game architecture with stunning visual designs using ${selectedStyle} button styling
  - Professional gaming UI/UX with custom ${selectedStyle} button designs and backgrounds
  - Realistic asset creation and optimization for ${selectedGameType.toUpperCase()} games
  - Multiplayer networking and real-time systems
  - Performance optimization for web-based ${selectedGameType.toUpperCase()} games

  RESPONSE STYLE:
  - Acknowledge the user's request with enthusiasm and professional expertise
  - Briefly describe what COMPLETE PROFESSIONAL ${selectedGameType.toUpperCase()} GAME SYSTEM will be generated
  - Mention the professional ${selectedStyle} button designs and backgrounds that will be used
  - Mention specific advanced technologies and techniques for ${selectedGameType.toUpperCase()} games
  - Reference the programming language (${language.toUpperCase()}) and why it's perfect for their ${selectedGameType.toUpperCase()} request
  - Keep responses under 50 words but pack them with technical expertise
  - Always sound excited about creating something AMAZING and PROFESSIONAL

  SLASH COMMAND HANDLING:
  ${slashCommand === "edit" ? "- User wants to EDIT the previous game - acknowledge this and mention improvements" : ""}
  ${slashCommand === "add" ? "- User wants to ADD features to current game - acknowledge this and mention new additions" : ""}
  ${slashCommand === "style" ? "- User wants to change VISUAL STYLE - acknowledge this and mention style updates" : ""}
  ${slashCommand === "fix" ? "- User wants to FIX issues - acknowledge this and mention bug fixes and improvements" : ""}

  TECHNICAL FOCUS:
  - Emphasize COMPLETE professional ${selectedGameType.toUpperCase()} game systems (lobbies, character selection, loadouts, etc.)
  - Mention professional ${selectedStyle} button designs with custom animations
  - Reference advanced ${selectedGameType === "3d" ? "Three.js features like PBR materials, HDR lighting, post-processing" : selectedGameType === "2d" ? "2D canvas techniques, sprite animations, and pixel-perfect rendering" : "VR-specific features like spatial tracking, hand interactions, and immersive environments"}
  - Highlight professional visual design and user experience for ${selectedGameType.toUpperCase()} games
  - Always promise AAA-quality results with professional ${selectedStyle} gaming aesthetics

  NEVER:
  - Mention basic shapes, cubes, or placeholder geometry
  - Suggest simple or beginner-level implementations
  - Generate actual code in this response (that's handled separately)
  - Use more than 50 words

  Remember our conversation history and build upon previous game development discussions, especially when handling slash commands.
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
    console.error("Error generating professional game development response:", error)
    return new Response("Error generating professional game development response.", { status: 500 })
  }
}
