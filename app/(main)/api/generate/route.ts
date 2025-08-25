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

const getSystemPrompt = (language: string) => {
  const basePrompt = `You are Zerlo's game generator that creates simple, working games.

CORE REQUIREMENTS:
- Generate EXACTLY 1400-1600 lines of code maximum
- Keep each line short and simple (under 80 characters when possible)
- Create basic but functional games: Lobby → Play Button → Game Map
- Focus on working code over visual quality

GAME STRUCTURE (ALWAYS INCLUDE):
1. **Simple Lobby**: Basic UI with play button
2. **Game Map**: Simple 3D environment that works
3. **Basic HUD**: Health, score if needed
4. **Simple Assets**: Use basic models/shapes, focus on functionality

ENHANCEMENT RULES:
- Keep requests simple and achievable
- Focus on working code over complex visuals
- Use Three.js but keep it basic
- Prioritize line count limits over advanced features`

  switch (language) {
    case "html":
      return `${basePrompt}

Your output is a COMPLETE, simple single-file **HTML + JavaScript** game.

TECHNICAL REQUIREMENTS:
- Load Three.js from CDN
- Create: Simple Lobby → Play Button → Basic 3D Game
- Use basic shapes and simple textures
- Include simple UI with basic CSS
- Add basic lighting
- Keep code simple and under 1600 lines
- Focus on working functionality over visuals

STRUCTURE TEMPLATE:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>/* Simple CSS */</style>
</head>
<body>
  <!-- Simple Lobby -->
  <div id="lobby">
    <button onclick="startGame()">Play</button>
  </div>
  
  <!-- Basic HUD -->
  <div id="gameHUD">
    <!-- Simple UI elements -->
  </div>
  
  <canvas id="gameCanvas"></canvas>
  
  <script>
    // Simple, working game code
    // Focus on functionality within line limits
  </script>
</body>
</html>
\`\`\`

IMPORTANT: Keep code under 1600 lines, prioritize working over beautiful.
NO explanations, NO markdown fences - return ONLY the complete HTML code.`

    case "typescript":
      return `${basePrompt}

Your output is simple **TypeScript** code for basic 3D games.

TECHNICAL REQUIREMENTS:
- Use basic TypeScript with simple types
- Create: Lobby → Play → Simple Game structure
- Keep interfaces minimal
- Use Three.js simply
- Focus on working code under 1600 lines

EXAMPLE STRUCTURE:
\`\`\`typescript
interface GameState {
  mode: 'lobby' | 'playing'
  player: Player
  score: number
}

interface Player {
  id: string
  position: THREE.Vector3
  health: number
}

class Game {
  private scene: THREE.Scene
  private renderer: THREE.WebGLRenderer
  
  constructor() {
    // Clean initialization
  }
  
  createLobby() {
    // Simple lobby with play button
  }
  
  startGame() {
    // Simple 3D game map
  }
}
\`\`\`

IMPORTANT: Keep code under 1600 lines, focus on working implementation.
NO explanations, NO markdown fences - return ONLY the TypeScript code.`

    case "javascript":
      return `${basePrompt}

Your output is simple **modern JavaScript** code for basic 3D games.

TECHNICAL REQUIREMENTS:
- Use simple JavaScript syntax
- Create: Lobby → Play → Basic Game structure
- Use Three.js simply
- Keep code basic and under 1600 lines
- Focus on working functionality

EXAMPLE STRUCTURE:
\`\`\`javascript
class Game {
  constructor() {
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer()
    this.gameState = 'lobby'
  }
  
  createLobby() {
    // Simple lobby with play button
  }
  
  startGame() {
    // Simple 3D game map
  }
  
  update() {
    // Simple game loop
  }
}
\`\`\`

IMPORTANT: Keep code under 1600 lines, prioritize functionality.
NO explanations, NO markdown fences - return ONLY the JavaScript code.`

    case "python":
      return `${basePrompt}

Your output is simple **Python** code for basic games.

TECHNICAL REQUIREMENTS:
- Use basic Python with simple libraries
- Create: Lobby → Play → Simple Game structure
- Keep code simple and under 1600 lines
- Focus on working functionality over visuals

EXAMPLE STRUCTURE:
\`\`\`python
class Game:
    def __init__(self):
        self.game_state = 'lobby'
        self.player = None
        self.score = 0
    
    def create_lobby(self):
        # Simple lobby with play button
        pass
    
    def start_game(self):
        # Simple 3D game map
        pass
    
    def update(self):
        # Simple game loop
        pass
\`\`\`

IMPORTANT: Keep code under 1600 lines, focus on working code.
NO explanations, NO markdown fences - return ONLY the Python code.`
  }
}

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return new Response("Google API key not configured", { status: 500 })
  }

  const body: RequestBody = await req.json().catch(() => ({}))
  const userPrompt = String(body?.prompt || "Create a professional 3D game")
  const language = String(body?.language || "html")
  const chatHistory = body?.chatHistory || []

  const enhancePrompt = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase()

    if (lowerPrompt.includes("1v1") || lowerPrompt.includes("shooter")) {
      return `Create a clean 3D tactical game with:
- Professional lobby with character selection and play button
- Well-designed map with cover and realistic environment
- Good-looking weapons and character models
- Clean HUD with health, ammo, and score
- Smooth gameplay mechanics and professional visuals
Original: ${prompt}`
    }

    if (lowerPrompt.includes("racing") || lowerPrompt.includes("car")) {
      return `Create a professional racing game with:
- Clean garage lobby with car selection and play button
- Well-designed race track with good visuals
- Realistic car models with smooth physics
- Professional racing HUD and controls
- Good lighting and environmental effects
Original: ${prompt}`
    }

    if (lowerPrompt.includes("space") || lowerPrompt.includes("sci-fi")) {
      return `Create a professional space game with:
- Clean space station lobby with ship selection
- Well-designed space environment with planets/asteroids
- Good-looking spacecraft and space effects
- Professional space HUD and controls
- Smooth space physics and visuals
Original: ${prompt}`
    }

    // Keep simple requests focused
    if (prompt.length < 100) {
      return `${prompt}

Make this a professional game with:
- Clean lobby with play button
- Well-designed 3D game map
- Good-looking models and environments
- Professional UI and smooth gameplay`
    }

    return prompt
  }

  const enhancedPrompt = enhancePrompt(userPrompt)

  try {
    let contextPrompt = enhancedPrompt
    if (chatHistory.length > 0) {
      const recentMessages = chatHistory.slice(-4) // Reduced context further to save tokens
      const contextMessages = recentMessages
        .map((msg: Message) => `${msg.sender === "user" ? "User" : "AI"}: ${msg.content}`)
        .join("\n")
      contextPrompt = `Context:\n${contextMessages}\n\nRequest: ${enhancedPrompt}`
    }

    const result = await streamText({
      model: google("gemini-2.5-flash-lite-preview-06-17"),
      system: getSystemPrompt(language),
      prompt: contextPrompt,
    })

    return result.toDataStreamResponse()
  } catch (err) {
    console.error("/api/generate error", err)
    return new Response("Error generating code.", { status: 500 })
  }
}
