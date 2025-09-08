import { streamText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export const runtime = "edge"

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
})

interface GameGenerationRequest {
  prompt: string
  gameType: "minecraft" | "fps" | "rpg" | "racing"
  selectedAssets: Array<{
    uid: string
    name: string
    description: string
  }>
  chatHistory?: Array<{
    sender: "user" | "ai"
    content: string
  }>
}

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return new Response("Google API key not configured", { status: 500 })
  }

  const body: GameGenerationRequest = await req.json().catch(() => ({}))
  const { prompt, gameType, selectedAssets, chatHistory } = body

  const systemPrompt = `
  You are Zerlo's PROFESSIONAL 3D GAME DEVELOPMENT AI - the most advanced game creation system ever built.

  CORE IDENTITY: You are an expert game developer with 20+ years of experience creating AAA games. You specialize in:
  - Advanced 3D graphics programming with Three.js, WebGL, and modern rendering techniques
  - Professional game architecture using React Three Fiber and modern web technologies
  - Realistic asset integration and optimization for ${gameType.toUpperCase()} games
  - Performance optimization for web-based 3D games
  - Professional UI/UX design for gaming interfaces

  CURRENT GAME CONTEXT:
  - Game Type: ${gameType.toUpperCase()}
  - Selected 3D Assets: ${selectedAssets.map((asset) => `${asset.name} (${asset.description})`).join(", ")}
  - User Request: ${prompt}

  RESPONSE REQUIREMENTS:
  1. Generate COMPLETE, PROFESSIONAL HTML5 game code using Three.js
  2. Include ALL selected 3D assets in meaningful ways
  3. Create ${
    gameType === "minecraft"
      ? "voxel-based building mechanics"
      : gameType === "fps"
        ? "first-person shooter mechanics"
        : gameType === "rpg"
          ? "character progression and quest systems"
          : gameType === "racing"
            ? "vehicle physics and racing mechanics"
            : "advanced gameplay mechanics"
  }
  4. Add professional game UI with HUD, menus, and controls
  5. Include realistic physics, lighting, and post-processing effects
  6. Ensure mobile-responsive design and touch controls
  7. Add professional sound effects and background music
  8. Include save/load functionality and settings menu

  TECHNICAL REQUIREMENTS:
  - Use Three.js r150+ with modern ES6+ syntax
  - Implement proper asset loading with progress indicators
  - Add realistic PBR materials and HDR lighting
  - Include post-processing effects (bloom, SSAO, etc.)
  - Optimize for 60fps performance on all devices
  - Add proper error handling and fallbacks
  - Include accessibility features (keyboard navigation, screen reader support)

  GAME-SPECIFIC FEATURES:
  ${
    gameType === "minecraft"
      ? `
  - Voxel-based world generation and editing
  - Block placement/destruction mechanics
  - Inventory system with crafting
  - Day/night cycle with dynamic lighting
  - Procedural terrain generation
  `
      : gameType === "fps"
        ? `
  - First-person camera with mouse look
  - Weapon system with realistic ballistics
  - Enemy AI with pathfinding
  - Health/armor system with regeneration
  - Multiplayer-ready networking foundation
  `
        : gameType === "rpg"
          ? `
  - Character stats and leveling system
  - Quest system with dialogue trees
  - Inventory management with equipment
  - Magic/skill system with visual effects
  - NPC interaction system
  `
          : gameType === "racing"
            ? `
  - Realistic vehicle physics and handling
  - Track system with checkpoints and lap timing
  - Multiple camera angles (cockpit, chase, etc.)
  - Damage system with visual effects
  - Leaderboard and ghost car functionality
  `
            : ""
  }

  ASSET INTEGRATION:
  For each selected asset, create specific gameplay integration:
  ${selectedAssets
    .map(
      (asset) => `
  - ${asset.name}: Integrate as ${
    asset.name.toLowerCase().includes("character") || asset.name.toLowerCase().includes("player")
      ? "playable character with animations"
      : asset.name.toLowerCase().includes("weapon") ||
          asset.name.toLowerCase().includes("sword") ||
          asset.name.toLowerCase().includes("gun")
        ? "interactive weapon with combat mechanics"
        : asset.name.toLowerCase().includes("vehicle") || asset.name.toLowerCase().includes("car")
          ? "driveable vehicle with physics"
          : asset.name.toLowerCase().includes("building") || asset.name.toLowerCase().includes("house")
            ? "interactive environment structure"
            : "interactive game object with physics and collision"
  }
  `,
    )
    .join("")}

  OUTPUT FORMAT:
  Generate a COMPLETE, SELF-CONTAINED HTML file with:
  1. All necessary Three.js imports via CDN
  2. Professional CSS styling for game UI
  3. Complete JavaScript game engine
  4. Asset loading and management system
  5. Game loop with proper timing
  6. Professional error handling
  7. Mobile touch controls
  8. Settings and pause menus

  QUALITY STANDARDS:
  - Code must be production-ready and bug-free
  - Performance optimized for all devices
  - Professional visual design and UX
  - Comprehensive feature set rivaling Unity/Unreal games
  - Proper code organization and documentation
  - Accessibility compliance (WCAG 2.1 AA)

  Remember: You're creating a PROFESSIONAL, COMPLETE game that users can immediately play and enjoy. This should rival commercial game engines in quality and features.
  `

  try {
    let contextPrompt = prompt
    if (chatHistory && chatHistory.length > 0) {
      const recentMessages = chatHistory.slice(-6)
      const contextMessages = recentMessages
        .map((msg) => `${msg.sender === "user" ? "User" : "Zerlo AI"}: ${msg.content}`)
        .join("\n")
      contextPrompt = `Previous conversation:\n${contextMessages}\n\nCurrent request: ${prompt}`
    }

    const result = await streamText({
      model: google("gemini-2.5-flash-lite-preview-06-17"),
      prompt: contextPrompt,
      system: systemPrompt,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error generating game:", error)
    return new Response("Error generating professional 3D game.", { status: 500 })
  }
}
