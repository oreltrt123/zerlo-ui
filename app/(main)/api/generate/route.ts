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

const GAMING_BUTTON_DESIGN = `
<button class="gaming-button" onclick="startGame()">
  P L A Y
  <div id="clip">
    <div id="leftTop" class="corner"></div>
    <div id="rightBottom" class="corner"></div>
    <div id="rightTop" class="corner"></div> 
    <div id="leftBottom" class="corner"></div> 
  </div> 
  <span id="rightArrow" class="arrow"></span> 
  <span id="leftArrow" class="arrow"></span>
</button>
`

const PLAYSTORE_BUTTON_DESIGN = `
<a class="playstore-button" href="#" onclick="startGame()">
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon" viewBox="0 0 512 512">
    <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path> 
  </svg> 
  <span class="texts"> 
    <span class="text-1">GET IT ON</span> 
    <span class="text-2">Game Store</span> 
  </span>
</a>
`

const PLAY_3D_BUTTON_DESIGN = `
<button class="button-with-icon" onclick="startGame()"> 
  <svg class="icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"> 
    <path class="color000000 svgShape" fill="#ffffff" d="M12 39c-.549 0-1.095-.15-1.578-.447A3.008 3.008 0 0 1 9 36V12c0-1.041.54-2.007 1.422-2.553a3.014 3.014 0 0 1 2.919-.132l24 12a3.003 3.003 0 0 1 0 5.37l-24 12c-.42.21-.885.315-1.341.315z"></path> 
  </svg> 
  <span class="text">Play</span>
</button>
`

const PROFESSIONAL_BUTTON_CSS = `
/* Gaming Button Style */
.gaming-button { 
  position: relative; 
  width: 11em; 
  height: 4em; 
  outline: none; 
  transition: 0.1s; 
  background-color: transparent; 
  border: none; 
  font-size: 13px; 
  font-weight: bold; 
  color: #ddebf0;
  cursor: pointer;
}

.gaming-button #clip { 
  --color: #2761c3; 
  position: absolute; 
  top: 0; 
  overflow: hidden; 
  width: 100%; 
  height: 100%; 
  border: 5px double var(--color); 
  box-shadow: inset 0px 0px 15px #195480; 
  -webkit-clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
}

.gaming-button .arrow { 
  position: absolute; 
  transition: 0.2s; 
  background-color: #2761c3; 
  top: 35%; 
  width: 11%; 
  height: 30%;
}

.gaming-button #leftArrow { 
  left: -13.5%; 
  -webkit-clip-path: polygon(100% 0, 100% 100%, 0 50%);
}

.gaming-button #rightArrow { 
  -webkit-clip-path: polygon(100% 49%, 0 0, 0 100%); 
  left: 102%;
}

.gaming-button:hover #rightArrow { 
  background-color: #27c39f; 
  left: -15%; 
  animation: 0.6s ease-in-out both infinite alternate rightArrow8;
}

.gaming-button:hover #leftArrow { 
  background-color: #27c39f; 
  left: 103%; 
  animation: 0.6s ease-in-out both infinite alternate leftArrow8;
}

.gaming-button .corner { 
  position: absolute; 
  width: 4em; 
  height: 4em; 
  background-color: #2761c3; 
  box-shadow: inset 1px 1px 8px #2781c3; 
  transform: scale(1) rotate(45deg); 
  transition: 0.2s;
}

.gaming-button #rightTop { 
  top: -1.98em; 
  left: 91%;
}

.gaming-button #leftTop { 
  top: -1.96em; 
  left: -3.0em;
}

.gaming-button #leftBottom { 
  top: 2.10em; 
  left: -2.15em;
}

.gaming-button #rightBottom { 
  top: 45%; 
  left: 88%;
}

.gaming-button:hover .corner { 
  transform: scale(1.25) rotate(45deg);
}

/* Play Store Button Style */
.playstore-button { 
  display: inline-flex; 
  align-items: center; 
  justify-content: center; 
  border: 2px solid #000; 
  border-radius: 9999px; 
  background-color: rgba(0, 0, 0, 1); 
  padding: 0.625rem 1.5rem; 
  text-align: center; 
  color: rgba(255, 255, 255, 1); 
  outline: 0; 
  transition: all .2s ease; 
  text-decoration: none;
  cursor: pointer;
}

.playstore-button:hover { 
  background-color: transparent; 
  color: rgba(0, 0, 0, 1);
}

.playstore-button .icon { 
  height: 1.5rem; 
  width: 1.5rem;
}

.playstore-button .texts { 
  margin-left: 1rem; 
  display: flex; 
  flex-direction: column; 
  align-items: flex-start; 
  line-height: 1;
}

.playstore-button .text-1 { 
  margin-bottom: 0.25rem; 
  font-size: 0.75rem; 
  line-height: 1rem;
}

.playstore-button .text-2 { 
  font-weight: 600;
}

/* 3D Play Button Style */
.button-with-icon { 
  overflow: hidden; 
  display: inline-flex; 
  align-items: center; 
  justify-content: center; 
  border: 1px solid #0f988e; 
  font-family: "Istok Web", sans-serif; 
  letter-spacing: 1px; 
  padding: 0 12px; 
  text-align: center; 
  width: 120px; 
  height: 40px; 
  font-size: 14px; 
  text-transform: uppercase; 
  font-weight: normal; 
  border-radius: 3px; 
  outline: none; 
  user-select: none; 
  cursor: pointer; 
  transform: translateY(0px); 
  position: relative; 
  box-shadow: 
    inset 0 30px 30px -15px rgba(255, 255, 255, 0.1), 
    inset 0 0 0 1px rgba(255, 255, 255, 0.3), 
    inset 0 1px 20px rgba(0, 0, 0, 0), 
    0 3px 0 #0f988e, 
    0 3px 2px rgba(0, 0, 0, 0.2), 
    0 5px 10px rgba(0, 0, 0, 0.1), 
    0 10px 20px rgba(0, 0, 0, 0.1); 
  background: #15ccbe; 
  color: white; 
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3); 
  transition: 150ms all ease-in-out;
}

.button-with-icon .icon { 
  margin-right: 8px; 
  width: 24px; 
  height: 24px; 
  transition: all 0.5s ease-in-out;
}

.button-with-icon:active { 
  transform: translateY(3px); 
  box-shadow: 
    inset 0 16px 2px -15px rgba(0, 0, 0, 0), 
    inset 0 0 0 1px rgba(255, 255, 255, 0.15), 
    inset 0 1px 20px rgba(0, 0, 0, 0.1), 
    0 0 0 #0f988e, 
    0 0 0 2px rgba(255, 255, 255, 0.5), 
    0 0 0 rgba(0, 0, 0, 0), 
    0 0 0 rgba(0, 0, 0, 0);
}

.button-with-icon:hover .text { 
  transform: translateX(80px);
}

.button-with-icon:hover .icon { 
  transform: translate(23px);
}

.button-with-icon .text { 
  transition: all 0.5s ease-in-out;
}

/* Animation Keyframes */
@keyframes leftArrow8 { 
  from { transform: translate(0px); } 
  to { transform: translateX(10px); }
}

@keyframes rightArrow8 {
  from { transform: translate(0px); }
  to { transform: translateX(-10px); }
}
`

const PROFESSIONAL_BACKGROUND_CSS = `
.professional-game-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  --s: 60px;
  --c1: #180a22; 
  --c2: #5b42f3; 
  --_g: radial-gradient( 
    25% 25% at 25% 25%, 
    var(--c1) 99%, 
    rgba(0, 0, 0, 0) 101% 
  ); 
  background: var(--_g) var(--s) var(--s) / calc(2 * var(--s)) 
  calc(2 * var(--s)), 
  var(--_g) 0 0 / calc(2 * var(--s)) calc(2 * var(--s)), 
  radial-gradient(50% 50%, var(--c2) 98%, rgba(0, 0, 0, 0)) 0 0 / var(--s) 
  var(--s), 
  repeating-conic-gradient(var(--c2) 0 50%, var(--c1) 0 100%) 
  calc(0.5 * var(--s)) 0 / calc(2 * var(--s)) var(--s);
}
`

const getSystemPrompt = (language: string, selectedStyle: string, selectedGameType: string, slashCommand?: string) => {
  const getButtonDesign = (style: string) => {
    switch (style) {
      case "gaming":
        return GAMING_BUTTON_DESIGN
      case "playstore":
        return PLAYSTORE_BUTTON_DESIGN
      case "3d-play":
        return PLAY_3D_BUTTON_DESIGN
      default:
        return GAMING_BUTTON_DESIGN
    }
  }

  const getButtonClass = (style: string) => {
    switch (style) {
      case "gaming":
        return "gaming-button"
      case "playstore":
        return "playstore-button"
      case "3d-play":
        return "button-with-icon"
      default:
        return "gaming-button"
    }
  }

  const getGameTypeInstructions = (type: string) => {
    switch (type) {
      case "2d":
        return `
2D GAME REQUIREMENTS - STRICTLY 2D ONLY:
- NEVER use Three.js or any 3D libraries
- Use HTML5 Canvas 2D context ONLY for rendering
- Implement sprite-based graphics and 2D animations
- Create flat 2D environments with layered backgrounds
- Use 2D physics for collision detection (no Z-axis)
- Focus on classic 2D gameplay mechanics (platformer, top-down, side-scroller)
- All movement and interactions must be in 2D plane only`
      case "3d":
        return `
3D GAME REQUIREMENTS - STRICTLY 3D ONLY:
- MUST use Three.js for 3D rendering
- Create realistic 3D environments with proper lighting
- Implement 3D physics and collision detection
- Use PBR materials and advanced shaders
- Focus on immersive 3D gameplay with depth and perspective
- All objects must have proper 3D positioning (x, y, z coordinates)`
      case "vr":
        return `
VR GAME REQUIREMENTS - STRICTLY VR ONLY:
- MUST use WebXR APIs for VR support
- Implement spatial tracking and hand interactions
- Create immersive VR environments with room-scale support
- Focus on VR-specific UI and interaction patterns
- Use VR controllers and head tracking for gameplay`
      default:
        return `
3D GAME REQUIREMENTS:
- Use Three.js for 3D rendering
- Create realistic 3D environments
- Implement professional 3D gameplay`
    }
  }

  const getSlashCommandInstructions = (command?: string) => {
    if (!command) return ""

    switch (command) {
      case "edit":
        return `
SLASH COMMAND: EDIT MODE
- Modify and improve the existing game from chat history
- Keep the same core concept but enhance features
- Improve graphics, gameplay, and user experience
- Maintain compatibility with existing game structure`
      case "add":
        return `
SLASH COMMAND: ADD MODE
- Add new features to the existing game from chat history
- Extend current functionality with new elements
- Add new weapons, characters, levels, or game modes
- Integrate seamlessly with existing game systems`
      case "style":
        return `
SLASH COMMAND: STYLE MODE
- Update visual styling of the existing game
- Change colors, themes, and visual aesthetics
- Improve UI/UX design and visual appeal
- Maintain gameplay while enhancing appearance`
      case "fix":
        return `
SLASH COMMAND: FIX MODE
- Fix bugs and issues in the existing game
- Improve performance and stability
- Resolve gameplay problems and glitches
- Optimize code and enhance reliability`
      default:
        return ""
    }
  }

  const basePrompt = `You are Zerlo's professional ${selectedGameType.toUpperCase()} game generator that creates stunning, working games with PROFESSIONAL DESIGNS.

CRITICAL GAME TYPE ENFORCEMENT:
${selectedGameType === "2d" ? "- YOU MUST CREATE A 2D GAME ONLY - NO 3D ELEMENTS ALLOWED" : ""}
${selectedGameType === "3d" ? "- YOU MUST CREATE A 3D GAME ONLY - USE THREE.JS REQUIRED" : ""}
${selectedGameType === "vr" ? "- YOU MUST CREATE A VR GAME ONLY - USE WEBXR REQUIRED" : ""}

CURRENT USER PREFERENCES:
- Game Type: ${selectedGameType.toUpperCase()} (STRICTLY ENFORCE THIS)
- Button Style: ${selectedStyle}
- Programming Language: ${language.toUpperCase()}
${slashCommand ? `- Slash Command: ${slashCommand}` : ""}

${getGameTypeInstructions(selectedGameType)}

${getSlashCommandInstructions(slashCommand)}

MANDATORY DESIGN REQUIREMENTS:
- ALWAYS use the ${selectedStyle} button design provided below for ALL buttons
- ALWAYS include the professional gaming background design
- NEVER use basic HTML buttons - ONLY use the ${selectedStyle} button design
- Support color customization when user specifies colors

SELECTED BUTTON DESIGN TO USE (${selectedStyle}):
${getButtonDesign(selectedStyle)}

PROFESSIONAL BUTTON CSS (ALWAYS INCLUDE):
${PROFESSIONAL_BUTTON_CSS}

PROFESSIONAL BACKGROUND CSS (ALWAYS INCLUDE):
${PROFESSIONAL_BACKGROUND_CSS}

COLOR CUSTOMIZATION RULES:
- If user specifies colors, modify the CSS variables --c1 and --c2 in the background
- If user specifies button colors, modify the button-specific color variables
- Default colors: Background (#180a22, #5b42f3), Button (varies by style)
- Always maintain professional appearance

CORE REQUIREMENTS:
- Generate EXACTLY 1400-1600 lines of code maximum
- Create: Professional Lobby → Professional ${selectedStyle} Play Button → ${selectedGameType.toUpperCase()} Game Map
- ALWAYS include the professional background as body background
- ALWAYS use ${selectedStyle} buttons for ALL interactive elements

GAME STRUCTURE (ALWAYS INCLUDE):
1. **Professional Lobby**: Use professional background + ${selectedStyle} button design
2. **${selectedGameType.toUpperCase()} Game Map**: ${selectedGameType === "3d" ? "3D environment with professional styling" : selectedGameType === "2d" ? "2D environment with sprite graphics" : "VR environment with immersive interactions"}
3. **Professional HUD**: Styled to match the professional theme
4. **Professional Assets**: High-quality ${selectedGameType === "3d" ? "models and textures" : selectedGameType === "2d" ? "sprites and animations" : "VR interactions and environments"}
`

  switch (language) {
    case "html":
      return `${basePrompt}

Your output is a COMPLETE, professional single-file **HTML + JavaScript** ${selectedGameType.toUpperCase()} game.

TECHNICAL REQUIREMENTS:
${selectedGameType === "3d" ? "- MUST load Three.js from CDN and use 3D rendering" : selectedGameType === "2d" ? "- MUST use HTML5 Canvas 2D context ONLY - NO Three.js allowed" : "- MUST use WebXR APIs for VR support"}
- ALWAYS include professional background: <div class="professional-game-background"></div>
- ALWAYS use ${selectedStyle} button design (class="${getButtonClass(selectedStyle)}") for play button and ALL buttons
- Include professional CSS for buttons and background
- Create professional ${selectedGameType.toUpperCase()} environments
- Keep code under 1600 lines but prioritize professional appearance

MANDATORY STRUCTURE TEMPLATE:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  ${selectedGameType === "3d" ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>' : selectedGameType === "2d" ? "2D Canvas Game - No Three.js " : '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'}
  <style>
    ${PROFESSIONAL_BACKGROUND_CSS}
    ${PROFESSIONAL_BUTTON_CSS}
    /* Additional professional ${selectedGameType} game styles */
  </style>
</head>
<body>
  <div class="professional-game-background"></div>
  
   Professional Lobby 
  <div id="lobby">
    ${getButtonDesign(selectedStyle)}
  </div>
  
   Professional HUD 
  <div id="gameHUD">
     Professional UI elements 
  </div>
  
  <canvas id="gameCanvas"></canvas>
  
  <script>
    // Professional ${selectedGameType.toUpperCase()} game code
    ${selectedGameType === "2d" ? "// STRICTLY 2D CANVAS RENDERING ONLY" : selectedGameType === "3d" ? "// STRICTLY THREE.JS 3D RENDERING" : "// STRICTLY WEBXR VR RENDERING"}
  </script>
</body>
</html>
\`\`\`

IMPORTANT: ALWAYS use ${selectedStyle} button design, support color customization, keep code under 1600 lines.
NO explanations, NO markdown fences - return ONLY the complete HTML code.`

    case "typescript":
      return `${basePrompt}

Your output is professional **TypeScript** code for stunning ${selectedGameType.toUpperCase()} games.

TECHNICAL REQUIREMENTS:
- ALWAYS include ${selectedStyle} button and background designs
- Use TypeScript with professional ${selectedGameType} game architecture
- Support color customization through CSS variables
- Create professional ${selectedGameType === "3d" ? "Three.js" : selectedGameType === "2d" ? "Canvas 2D" : "WebXR"} implementations

IMPORTANT: ALWAYS use ${selectedStyle} button design, keep code under 1600 lines.
NO explanations, NO markdown fences - return ONLY the TypeScript code.`

    case "javascript":
      return `${basePrompt}

Your output is professional **JavaScript** code for stunning ${selectedGameType.toUpperCase()} games.

TECHNICAL REQUIREMENTS:
- ALWAYS include ${selectedStyle} button and background designs
- Use modern JavaScript with professional ${selectedGameType} game patterns
- Support color customization through CSS variables
- Create professional ${selectedGameType === "3d" ? "Three.js" : selectedGameType === "2d" ? "Canvas 2D" : "WebXR"} implementations

IMPORTANT: ALWAYS use ${selectedStyle} button design, keep code under 1600 lines.
NO explanations, NO markdown fences - return ONLY the JavaScript code.`

    case "python":
      return `${basePrompt}

Your output is professional **Python** code for stunning ${selectedGameType} games.

TECHNICAL REQUIREMENTS:
- Create professional ${selectedGameType} game interfaces
- Support color customization
- Use professional design patterns for ${selectedGameType} games

IMPORTANT: Keep code under 1600 lines, focus on professional appearance.
NO explanations, NO markdown fences - return ONLY the Python code.`
  }
}

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return new Response("Google API key not configured", { status: 500 })
  }

  const body: RequestBody = await req.json().catch(() => ({}))
  const userPrompt = String(body?.prompt || "Create a professional game")
  const language = String(body?.language || "html")
  const chatHistory = body?.chatHistory || []
  const selectedStyle = String(body?.selectedStyle || "gaming")
  const selectedGameType = String(body?.selectedGameType || "3d")
  const slashCommand = body?.slashCommand

  const enhancePrompt = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase()
    let enhancedPrompt = prompt

    // Extract color preferences
    const colorMatches = prompt.match(
      /(?:color|background|button).*?(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|red|blue|green|purple|orange|yellow|pink|cyan|black|white)/gi,
    )
    if (colorMatches) {
      enhancedPrompt += `\n\nCOLOR CUSTOMIZATION: Use these colors: ${colorMatches.join(", ")}`
    }

    // Add game type specific enhancements
    if (selectedGameType === "2d") {
      enhancedPrompt += `\n\nCreate a professional 2D game with sprite-based graphics, pixel art aesthetics, and classic 2D gameplay mechanics.`
    } else if (selectedGameType === "3d") {
      enhancedPrompt += `\n\nCreate a professional 3D game with realistic graphics, advanced lighting, and immersive 3D environments.`
    } else if (selectedGameType === "vr") {
      enhancedPrompt += `\n\nCreate a professional VR game with immersive experiences, spatial interactions, and room-scale VR mechanics.`
    }

    // Add style-specific enhancements
    enhancedPrompt += `\n\nUse ${selectedStyle} button style for all interactive elements with professional animations and effects.`

    if (lowerPrompt.includes("1v1") || lowerPrompt.includes("shooter")) {
      return `Create a professional ${selectedGameType.toUpperCase()} tactical game with:
- Professional lobby with character selection and ${selectedStyle} play button
- Well-designed ${selectedGameType === "2d" ? "2D map with sprite-based environments" : selectedGameType === "3d" ? "3D map with cover and realistic environment" : "VR arena with immersive spatial design"}
- Professional weapons and character ${selectedGameType === "2d" ? "sprites" : selectedGameType === "3d" ? "models" : "VR interactions"}
- Professional HUD with health, ammo, and score
- Smooth ${selectedGameType} gameplay mechanics and professional visuals
${enhancedPrompt}`
    }

    if (lowerPrompt.includes("racing") || lowerPrompt.includes("car")) {
      return `Create a professional ${selectedGameType.toUpperCase()} racing game with:
- Professional garage lobby with car selection and ${selectedStyle} play button
- Well-designed ${selectedGameType === "2d" ? "2D race track with sprite-based graphics" : selectedGameType === "3d" ? "3D race track with professional visuals" : "VR racing environment with immersive cockpit view"}
- Realistic car ${selectedGameType === "2d" ? "sprites" : selectedGameType === "3d" ? "models" : "VR interactions"} with smooth physics
- Professional racing HUD and controls
- Professional lighting and environmental effects
${enhancedPrompt}`
    }

    if (lowerPrompt.includes("space") || lowerPrompt.includes("sci-fi")) {
      return `Create a professional ${selectedGameType.toUpperCase()} space game with:
- Professional space station lobby with ship selection and ${selectedStyle} play button
- Well-designed ${selectedGameType === "2d" ? "2D space environment with sprite-based planets/asteroids" : selectedGameType === "3d" ? "3D space environment with planets/asteroids" : "VR space environment with immersive zero-gravity interactions"}
- Professional spacecraft and space effects
- Professional space HUD and controls
- Smooth space physics and professional visuals
${enhancedPrompt}`
    }

    return `${enhancedPrompt}

Make this a professional ${selectedGameType.toUpperCase()} game with:
- Professional lobby with ${selectedStyle} play button design
- Well-designed ${selectedGameType} game map with professional styling
- Professional ${selectedGameType === "2d" ? "sprites" : selectedGameType === "3d" ? "models" : "VR interactions"} and environments
- Professional UI and smooth ${selectedGameType} gameplay
- Professional background design`
  }

  const enhancedPrompt = enhancePrompt(userPrompt)

  try {
    let contextPrompt = enhancedPrompt
    if (chatHistory.length > 0) {
      const recentMessages = chatHistory.slice(-4)
      const contextMessages = recentMessages
        .map((msg: Message) => `${msg.sender === "user" ? "User" : "AI"}: ${msg.content}`)
        .join("\n")
      contextPrompt = `Context:\n${contextMessages}\n\nRequest: ${enhancedPrompt}`
    }

    const result = await streamText({
      model: google("gemini-2.5-flash-lite-preview-06-17"),
      system: getSystemPrompt(language, selectedStyle, selectedGameType, slashCommand),
      prompt: contextPrompt,
    })

    return result.toDataStreamResponse()
  } catch (err) {
    console.error("/api/generate error", err)
    return new Response("Error generating professional game code.", { status: 500 })
  }
}

// api/generate.ts
// import { streamText } from "ai"
// import { createGoogleGenerativeAI } from "@ai-sdk/google"

// export const runtime = "edge"

// const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY || "" })

// interface Message {
//   sender: "user" | "ai"
//   content: string
// }

// interface RequestBody {
//   prompt?: string
//   language?: string
//   chatHistory?: Message[]
//   selectedStyle?: string
//   selectedGameType?: string
//   slashCommand?: string
// }

// const GAMING_BUTTON_DESIGN = `
// <button class="gaming-button" onclick="startGame()">
//   P L A Y
//   <div id="clip">
//     <div id="leftTop" class="corner"></div>
//     <div id="rightBottom" class="corner"></div>
//     <div id="rightTop" class="corner"></div> 
//     <div id="leftBottom" class="corner"></div> 
//   </div> 
//   <span id="rightArrow" class="arrow"></span> 
//   <span id="leftArrow" class="arrow"></span>
// </button>
// `

// const PLAYSTORE_BUTTON_DESIGN = `
// <a class="playstore-button" href="#" onclick="startGame()">
//   <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon" viewBox="0 0 512 512">
//     <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path> 
//   </svg> 
//   <span class="texts"> 
//     <span class="text-1">GET IT ON</span> 
//     <span class="text-2">Game Store</span> 
//   </span>
// </a>
// `

// const PLAY_3D_BUTTON_DESIGN = `
// <button class="button-with-icon" onclick="startGame()"> 
//   <svg class="icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"> 
//     <path class="color000000 svgShape" fill="#ffffff" d="M12 39c-.549 0-1.095-.15-1.578-.447A3.008 3.008 0 0 1 9 36V12c0-1.041.54-2.007 1.422-2.553a3.014 3.014 0 0 1 2.919-.132l24 12a3.003 3.003 0 0 1 0 5.37l-24 12c-.42.21-.885.315-1.341.315z"></path> 
//   </svg> 
//   <span class="text">Play</span>
// </button>
// `

// const PROFESSIONAL_BUTTON_CSS = `
// /* Gaming Button Style */
// .gaming-button { 
//   position: relative; 
//   width: 11em; 
//   height: 4em; 
//   outline: none; 
//   transition: 0.1s; 
//   background-color: transparent; 
//   border: none; 
//   font-size: 13px; 
//   font-weight: bold; 
//   color: #ddebf0;
//   cursor: pointer;
// }

// .gaming-button #clip { 
//   --color: #2761c3; 
//   position: absolute; 
//   top: 0; 
//   overflow: hidden; 
//   width: 100%; 
//   height: 100%; 
//   border: 5px double var(--color); 
//   box-shadow: inset 0px 0px 15px #195480; 
//   -webkit-clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
// }

// .gaming-button .arrow { 
//   position: absolute; 
//   transition: 0.2s; 
//   background-color: #2761c3; 
//   top: 35%; 
//   width: 11%; 
//   height: 30%;
// }

// .gaming-button #leftArrow { 
//   left: -13.5%; 
//   -webkit-clip-path: polygon(100% 0, 100% 100%, 0 50%);
// }

// .gaming-button #rightArrow { 
//   -webkit-clip-path: polygon(100% 49%, 0 0, 0 100%); 
//   left: 102%;
// }

// .gaming-button:hover #rightArrow { 
//   background-color: #27c39f; 
//   left: -15%; 
//   animation: 0.6s ease-in-out both infinite alternate rightArrow8;
// }

// .gaming-button:hover #leftArrow { 
//   background-color: #27c39f; 
//   left: 103%; 
//   animation: 0.6s ease-in-out both infinite alternate leftArrow8;
// }

// .gaming-button .corner { 
//   position: absolute; 
//   width: 4em; 
//   height: 4em; 
//   background-color: #2761c3; 
//   box-shadow: inset 1px 1px 8px #2781c3; 
//   transform: scale(1) rotate(45deg); 
//   transition: 0.2s;
// }

// .gaming-button #rightTop { 
//   top: -1.98em; 
//   left: 91%;
// }

// .gaming-button #leftTop { 
//   top: -1.96em; 
//   left: -3.0em;
// }

// .gaming-button #leftBottom { 
//   top: 2.10em; 
//   left: -2.15em;
// }

// .gaming-button #rightBottom { 
//   top: 45%; 
//   left: 88%;
// }

// .gaming-button:hover .corner { 
//   transform: scale(1.25) rotate(45deg);
// }

// /* Play Store Button Style */
// .playstore-button { 
//   display: inline-flex; 
//   align-items: center; 
//   justify-content: center; 
//   border: 2px solid #000; 
//   border-radius: 9999px; 
//   background-color: rgba(0, 0, 0, 1); 
//   padding: 0.625rem 1.5rem; 
//   text-align: center; 
//   color: rgba(255, 255, 255, 1); 
//   outline: 0; 
//   transition: all .2s ease; 
//   text-decoration: none;
//   cursor: pointer;
// }

// .playstore-button:hover { 
//   background-color: transparent; 
//   color: rgba(0, 0, 0, 1);
// }

// .playstore-button .icon { 
//   height: 1.5rem; 
//   width: 1.5rem;
// }

// .playstore-button .texts { 
//   margin-left: 1rem; 
//   display: flex; 
//   flex-direction: column; 
//   align-items: flex-start; 
//   line-height: 1;
// }

// .playstore-button .text-1 { 
//   margin-bottom: 0.25rem; 
//   font-size: 0.75rem; 
//   line-height: 1rem;
// }

// .playstore-button .text-2 { 
//   font-weight: 600;
// }

// /* 3D Play Button Style */
// .button-with-icon { 
//   overflow: hidden; 
//   display: inline-flex; 
//   align-items: center; 
//   justify-content: center; 
//   border: 1px solid #0f988e; 
//   font-family: "Istok Web", sans-serif; 
//   letter-spacing: 1px; 
//   padding: 0 12px; 
//   text-align: center; 
//   width: 120px; 
//   height: 40px; 
//   font-size: 14px; 
//   text-transform: uppercase; 
//   font-weight: normal; 
//   border-radius: 3px; 
//   outline: none; 
//   user-select: none; 
//   cursor: pointer; 
//   transform: translateY(0px); 
//   position: relative; 
//   box-shadow: 
//     inset 0 30px 30px -15px rgba(255, 255, 255, 0.1), 
//     inset 0 0 0 1px rgba(255, 255, 255, 0.3), 
//     inset 0 1px 20px rgba(0, 0, 0, 0), 
//     0 3px 0 #0f988e, 
//     0 3px 2px rgba(0, 0, 0, 0.2), 
//     0 5px 10px rgba(0, 0, 0, 0.1), 
//     0 10px 20px rgba(0, 0, 0, 0.1); 
//   background: #15ccbe; 
//   color: white; 
//   text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3); 
//   transition: 150ms all ease-in-out;
// }

// .button-with-icon .icon { 
//   margin-right: 8px; 
//   width: 24px; 
//   height: 24px; 
//   transition: all 0.5s ease-in-out;
// }

// .button-with-icon:active { 
//   transform: translateY(3px); 
//   box-shadow: 
//     inset 0 16px 2px -15px rgba(0, 0, 0, 0), 
//     inset 0 0 0 1px rgba(255, 255, 255, 0.15), 
//     inset 0 1px 20px rgba(0, 0, 0, 0.1), 
//     0 0 0 #0f988e, 
//     0 0 0 2px rgba(255, 255, 255, 0.5), 
//     0 0 0 rgba(0, 0, 0, 0), 
//     0 0 0 rgba(0, 0, 0, 0);
// }

// .button-with-icon:hover .text { 
//   transform: translateX(80px);
// }

// .button-with-icon:hover .icon { 
//   transform: translate(23px);
// }

// .button-with-icon .text { 
//   transition: all 0.5s ease-in-out;
// }

// /* Animation Keyframes */
// @keyframes leftArrow8 { 
//   from { transform: translate(0px); } 
//   to { transform: translateX(10px); }
// }

// @keyframes rightArrow8 {
//   from { transform: translate(0px); }
//   to { transform: translateX(-10px); }
// }
// `

// const PROFESSIONAL_BACKGROUND_CSS = `
// .professional-game-background {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   z-index: -1;
//   --s: 60px;
//   --c1: #180a22; 
//   --c2: #5b42f3; 
//   --_g: radial-gradient( 
//     25% 25% at 25% 25%, 
//     var(--c1) 99%, 
//     rgba(0, 0, 0, 0) 101% 
//   ); 
//   background: var(--_g) var(--s) var(--s) / calc(2 * var(--s)) 
//   calc(2 * var(--s)), 
//   var(--_g) 0 0 / calc(2 * var(--s)) calc(2 * var(--s)), 
//   radial-gradient(50% 50%, var(--c2) 98%, rgba(0, 0, 0, 0)) 0 0 / var(--s) 
//   var(--s), 
//   repeating-conic-gradient(var(--c2) 0 50%, var(--c1) 0 100%) 
//   calc(0.5 * var(--s)) 0 / calc(2 * var(--s)) var(--s);
// }
// `

// const SKETCHFAB_INTEGRATION = `
// HOW TO LOAD SKETCHFAB MODELS DYNAMICALLY (FOR 3D GAMES ONLY):
// - When the user requests to add a Sketchfab model with a specific UID (e.g., "UID: abc123"), integrate it as a walking character on the map.
// - Use the Sketchfab Download API to get a temporary download URL without manual downloads.
// - Include these CDNs in the HTML:
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
// - In the script, add code like this to load the model:

// async function loadSketchfabModel(modelUid) {
//   const SKETCHFAB_API_KEY = 'YOUR_VALID_API_KEY_HERE'; // Replace with a valid Sketchfab API key
//   const toast = (msg) => alert(msg); // Replace with actual toast notification in client code

//   try {
//     // Validate modelUid
//     if (!modelUid || typeof modelUid !== 'string' || modelUid.trim() === '') {
//       throw new Error('Invalid or missing model UID');
//     }

//     // Step 1: Get download URL from Sketchfab API
//     const response = await fetch(\`https://api.sketchfab.com/v3/models/\${modelUid}/download\`, {
//       headers: {
//         'Authorization': \`Token \${SKETCHFAB_API_KEY}\`
//       }
//     });

//     if (!response.ok) {
//       throw new Error(\`Sketchfab API request failed: \${response.status} \${response.statusText}\`);
//     }

//     const data = await response.json();
//     if (!data?.gltf?.url) {
//       throw new Error('No valid GLTF download URL found in API response');
//     }
//     const zipUrl = data.gltf.url;

//     // Step 2: Fetch ZIP file
//     const zipResponse = await fetch(zipUrl);
//     if (!zipResponse.ok) {
//       throw new Error(\`Failed to fetch ZIP file: \${zipResponse.status} \${response.statusText}\`);
//     }
//     const zipBlob = await zipResponse.blob();

//     // Step 3: Extract ZIP file
//     const zip = await JSZip.loadAsync(zipBlob);
//     const gltfFileName = Object.keys(zip.files).find(name => name.endsWith('.gltf') || name.endsWith('.glb'));

//     if (!gltfFileName) {
//       throw new Error('No GLTF or GLB file found in ZIP archive');
//     }

//     // Step 4: Initialize Three.js scene (assumes global scene, camera, renderer)
//     if (!window.scene || !window.camera || !window.renderer) {
//       throw new Error('Three.js scene, camera, or renderer not initialized');
//     }

//     // Step 5: Handle GLTF vs GLB
//     const loader = new THREE.GLTFLoader();
//     let gltf;
//     if (gltfFileName.endsWith('.glb')) {
//       // Handle binary GLB file
//       const glbBuffer = await zip.file(gltfFileName).async('arraybuffer');
//       gltf = await new Promise((resolve, reject) => {
//         loader.parse(glbBuffer, '', resolve, reject);
//       });
//     } else {
//       // Handle JSON-based GLTF file
//       const gltfContent = await zip.file(gltfFileName).async('string');
//       if (!gltfContent) {
//         throw new Error('GLTF file content is empty');
//       }

//       let gltfJson;
//       try {
//         gltfJson = JSON.parse(gltfContent);
//       } catch (parseError) {
//         throw new Error(\`Failed to parse GLTF JSON: \${parseError.message}\`);
//       }

//       // Load binaries and textures
//       loader.setPath(''); // Base path for relative URLs
//       const originalLoad = loader.loadAsync;
//       loader.loadAsync = async (url, onProgress) => {
//         const fileName = url.split('/').pop();
//         const file = zip.files[fileName] || zip.files[Object.keys(zip.files).find(name => name.includes(fileName))];
//         if (file) {
//           const buffer = await file.async('arraybuffer');
//           return loader.parse(buffer, '', onProgress);
//         }
//         return originalLoad(url, onProgress);
//       };

//       gltf = await new Promise((resolve, reject) => {
//         loader.parse(gltfJson, '', resolve, reject);
//       });
//     }

//     // Step 6: Load model into scene
//     const model = gltf.scene;
//     model.position.set(0, 0, 0);
//     model.scale.set(1, 1, 1);
//     window.scene.add(model);

//     // Step 7: Handle animations
//     if (gltf.animations && gltf.animations.length > 0) {
//       const mixer = new THREE.AnimationMixer(model);
//       const walkClip = THREE.AnimationClip.findByName(gltf.animations, 'walk') || gltf.animations[0];
//       const action = mixer.clipAction(walkClip);
//       action.play();

//       // Animation loop
//       const clock = new THREE.Clock();
//       function animate() {
//         const delta = clock.getDelta();
//         mixer.update(delta);
//         model.position.z += 0.01; // Move forward
//         if (model.position.z > 10) model.position.z = -10; // Loop
//         requestAnimationFrame(animate);
//       }
//       animate();
//     }

//     toast('Character loaded successfully!');
//     return model;
//   } catch (error) {
//     console.error('Error loading Sketchfab model:', error);
//     toast('Failed to load character: ' + error.message);
//     // Fallback: Load a default model
//     const geometry = new THREE.BoxGeometry(1, 1, 1);
//     const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//     const cube = new THREE.Mesh(geometry, material);
//     cube.position.set(0, 0, 0);
//     window.scene.add(cube);
//     toast('Loaded fallback model (red cube) due to error');
//     return cube;
//   }
// }

// // Call example: loadSketchfabModel('YOUR_MODEL_UID_HERE');
// // Ensure the model is downloadable and the API key is valid.
// // Integrate the model as a character that walks on the map, using animations if available.
// `

// const getSystemPrompt = (language: string, selectedStyle: string, selectedGameType: string, slashCommand?: string) => {
//   const getButtonDesign = (style: string) => {
//     switch (style) {
//       case "gaming":
//         return GAMING_BUTTON_DESIGN
//       case "playstore":
//         return PLAYSTORE_BUTTON_DESIGN
//       case "3d-play":
//         return PLAY_3D_BUTTON_DESIGN
//       default:
//         return GAMING_BUTTON_DESIGN
//     }
//   }

//   const getButtonClass = (style: string) => {
//     switch (style) {
//       case "gaming":
//         return "gaming-button"
//       case "playstore":
//         return "playstore-button"
//       case "3d-play":
//         return "button-with-icon"
//       default:
//         return "gaming-button"
//     }
//   }

//   const getGameTypeInstructions = (type: string) => {
//     switch (type) {
//       case "2d":
//         return `
// 2D GAME REQUIREMENTS - STRICTLY 2D ONLY:
// - NEVER use Three.js or any 3D libraries
// - Use HTML5 Canvas 2D context ONLY for rendering
// - Implement sprite-based graphics and 2D animations
// - Create flat 2D environments with layered backgrounds
// - Use 2D physics for collision detection (no Z-axis)
// - Focus on classic 2D gameplay mechanics (platformer, top-down, side-scroller)
// - All movement and interactions must be in 2D plane only`
//       case "3d":
//         return `
// 3D GAME REQUIREMENTS - STRICTLY 3D ONLY:
// - MUST use Three.js for 3D rendering
// - Create realistic 3D environments with proper lighting
// - Implement 3D physics and collision detection
// - Use PBR materials and advanced shaders
// - Focus on immersive 3D gameplay with depth and perspective
// - All objects must have proper 3D positioning (x, y, z coordinates)
// ${SKETCHFAB_INTEGRATION}`
//       case "vr":
//         return `
// VR GAME REQUIREMENTS - STRICTLY VR ONLY:
// - MUST use WebXR APIs for VR support
// - Implement spatial tracking and hand interactions
// - Create immersive VR environments with room-scale support
// - Focus on VR-specific UI and interaction patterns
// - Use VR controllers and head tracking for gameplay`
//       default:
//         return `
// 3D GAME REQUIREMENTS:
// - Use Three.js for 3D rendering
// - Create realistic 3D environments
// - Implement professional 3D gameplay
// ${SKETCHFAB_INTEGRATION}`
//     }
//   }

//   const getSlashCommandInstructions = (command?: string) => {
//     if (!command) return ""

//     switch (command) {
//       case "edit":
//         return `
// SLASH COMMAND: EDIT MODE
// - Modify and improve the existing game from chat history
// - Keep the same core concept but enhance features
// - Improve graphics, gameplay, and user experience
// - Maintain compatibility with existing game structure`
//       case "add":
//         return `
// SLASH COMMAND: ADD MODE
// - Add new features to the existing game from chat history
// - Extend current functionality with new elements
// - Add new weapons, characters, levels, or game modes
// - Integrate seamlessly with existing game systems`
//       case "style":
//         return `
// SLASH COMMAND: STYLE MODE
// - Update visual styling of the existing game
// - Change colors, themes, and visual aesthetics
// - Improve UI/UX design and visual appeal
// - Maintain gameplay while enhancing appearance`
//       case "fix":
//         return `
// SLASH COMMAND: FIX MODE
// - Fix bugs and issues in the existing game
// - Improve performance and stability
// - Resolve gameplay problems and glitches
// - Optimize code and enhance reliability`
//       default:
//         return ""
//     }
//   }

//   const basePrompt = `You are Zerlo's professional ${selectedGameType.toUpperCase()} game generator that creates stunning, working games with PROFESSIONAL DESIGNS.

// CRITICAL GAME TYPE ENFORCEMENT:
// ${selectedGameType === "2d" ? "- YOU MUST CREATE A 2D GAME ONLY - NO 3D ELEMENTS ALLOWED" : ""}
// ${selectedGameType === "3d" ? "- YOU MUST CREATE A 3D GAME ONLY - USE THREE.JS REQUIRED" : ""}
// ${selectedGameType === "vr" ? "- YOU MUST CREATE A VR GAME ONLY - USE WEBXR REQUIRED" : ""}

// CURRENT USER PREFERENCES:
// - Game Type: ${selectedGameType.toUpperCase()} (STRICTLY ENFORCE THIS)
// - Button Style: ${selectedStyle}
// - Programming Language: ${language.toUpperCase()}
// ${slashCommand ? `- Slash Command: ${slashCommand}` : ""}

// ${getGameTypeInstructions(selectedGameType)}

// ${getSlashCommandInstructions(slashCommand)}

// MANDATORY DESIGN REQUIREMENTS:
// - ALWAYS use the ${selectedStyle} button design provided below for ALL buttons
// - ALWAYS include the professional gaming background design
// - NEVER use basic HTML buttons - ONLY use the ${selectedStyle} button design
// - Support color customization when user specifies colors

// SELECTED BUTTON DESIGN TO USE (${selectedStyle}):
// ${getButtonDesign(selectedStyle)}

// PROFESSIONAL BUTTON CSS (ALWAYS INCLUDE):
// ${PROFESSIONAL_BUTTON_CSS}

// PROFESSIONAL BACKGROUND CSS (ALWAYS INCLUDE):
// ${PROFESSIONAL_BACKGROUND_CSS}

// COLOR CUSTOMIZATION RULES:
// - If user specifies colors, modify the CSS variables --c1 and --c2 in the background
// - If user specifies button colors, modify the button-specific color variables
// - Default colors: Background (#180a22, #5b42f3), Button (varies by style)
// - Always maintain professional appearance

// CORE REQUIREMENTS:
// - Generate EXACTLY 1400-1600 lines of code maximum
// - Create: Professional Lobby → Professional ${selectedStyle} Play Button → ${selectedGameType.toUpperCase()} Game Map
// - ALWAYS include the professional background as body background
// - ALWAYS use ${selectedStyle} buttons for ALL interactive elements

// GAME STRUCTURE (ALWAYS INCLUDE):
// 1. **Professional Lobby**: Use professional background + ${selectedStyle} button design
// 2. **${selectedGameType.toUpperCase()} Game Map**: ${selectedGameType === "3d" ? "3D environment with professional styling" : selectedGameType === "2d" ? "2D environment with sprite graphics" : "VR environment with immersive interactions"}
// 3. **Professional HUD**: Styled to match the professional theme
// 4. **Professional Assets**: High-quality ${selectedGameType === "2d" ? "sprites and animations" : selectedGameType === "3d" ? "models and textures" : "VR interactions and environments"}
// `

//   switch (language) {
//     case "html":
//       return `${basePrompt}

// Your output is a COMPLETE, professional single-file **HTML + JavaScript** ${selectedGameType.toUpperCase()} game.

// TECHNICAL REQUIREMENTS:
// ${selectedGameType === "3d" ? "- MUST load Three.js from CDN and use 3D rendering\n- Initialize a Three.js scene, camera, and renderer before calling loadSketchfabModel" : selectedGameType === "2d" ? "- MUST use HTML5 Canvas 2D context ONLY - NO Three.js allowed" : "- MUST use WebXR APIs for VR support"}
// - ALWAYS include professional background: <div class="professional-game-background"></div>
// - ALWAYS use ${selectedStyle} button design (class="${getButtonClass(selectedStyle)}") for play button and ALL buttons
// - Include professional CSS for buttons and background
// - Create professional ${selectedGameType.toUpperCase()} environments
// - Keep code under 1600 lines but prioritize professional appearance

// MANDATORY STRUCTURE TEMPLATE:
// \`\`\`html
// <!DOCTYPE html>
// <html>
// <head>
//   ${selectedGameType === "3d" ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>' : selectedGameType === "2d" ? "2D Canvas Game - No Three.js " : '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'}
//   <style>
//     ${PROFESSIONAL_BACKGROUND_CSS}
//     ${PROFESSIONAL_BUTTON_CSS}
//     /* Additional professional ${selectedGameType} game styles */
//   </style>
// </head>
// <body>
//   <div class="professional-game-background"></div>
  
//   <!-- Professional Lobby -->
//   <div id="lobby">
//     ${getButtonDesign(selectedStyle)}
//   </div>
  
//   <!-- Professional HUD -->
//   <div id="gameHUD">
//     <!-- Professional UI elements -->
//   </div>
  
//   <canvas id="gameCanvas"></canvas>
  
//   <script>
//     // Professional ${selectedGameType.toUpperCase()} game code
//     ${selectedGameType === "2d" ? "// STRICTLY 2D CANVAS RENDERING ONLY" : selectedGameType === "3d" ? "// STRICTLY THREE.JS 3D RENDERING\n// Initialize Three.js scene before calling loadSketchfabModel" : "// STRICTLY WEBXR VR RENDERING"}
//   </script>
// </body>
// </html>
// \`\`\`

// IMPORTANT: ALWAYS use ${selectedStyle} button design, support color customization, keep code under 1600 lines, and initialize Three.js for 3D games.
// NO explanations, NO markdown fences - return ONLY the complete HTML code.`

//     case "typescript":
//       return `${basePrompt}

// Your output is professional **TypeScript** code for stunning ${selectedGameType.toUpperCase()} games.

// TECHNICAL REQUIREMENTS:
// - ALWAYS include ${selectedStyle} button and background designs
// - Use TypeScript with professional ${selectedGameType} game architecture
// - Support color customization through CSS variables
// - Create professional ${selectedGameType === "3d" ? "Three.js" : selectedGameType === "2d" ? "Canvas 2D" : "WebXR"} implementations

// IMPORTANT: ALWAYS use ${selectedStyle} button design, keep code under 1600 lines.
// NO explanations, NO markdown fences - return ONLY the TypeScript code.`

//     case "javascript":
//       return `${basePrompt}

// Your output is professional **JavaScript** code for stunning ${selectedGameType.toUpperCase()} games.

// TECHNICAL REQUIREMENTS:
// - ALWAYS include ${selectedStyle} button and background designs
// - Use modern JavaScript with professional ${selectedGameType} game patterns
// - Support color customization through CSS variables
// - Create professional ${selectedGameType === "3d" ? "Three.js" : selectedGameType === "2d" ? "Canvas 2D" : "WebXR"} implementations

// IMPORTANT: ALWAYS use ${selectedStyle} button design, keep code under 1600 lines.
// NO explanations, NO markdown fences - return ONLY the JavaScript code.`

//     case "python":
//       return `${basePrompt}

// Your output is professional **Python** code for stunning ${selectedGameType} games.

// TECHNICAL REQUIREMENTS:
// - Create professional ${selectedGameType} game interfaces
// - Support color customization
// - Use professional design patterns for ${selectedGameType} games

// IMPORTANT: Keep code under 1600 lines, focus on professional appearance.
// NO explanations, NO markdown fences - return ONLY the Python code.`
//   }
// }

// export async function POST(req: Request) {
//   if (!process.env.GOOGLE_API_KEY) {
//     return new Response("Google API key not configured", { status: 500 })
//   }

//   const body: RequestBody = await req.json().catch(() => ({}))
//   const userPrompt = String(body?.prompt || "Create a professional game")
//   const language = String(body?.language || "html")
//   const chatHistory = body?.chatHistory || []
//   const selectedStyle = String(body?.selectedStyle || "gaming")
//   const selectedGameType = String(body?.selectedGameType || "3d")
//   const slashCommand = body?.slashCommand

//   // Validate prompt
//   if (!userPrompt.trim()) {
//     return new Response("Prompt cannot be empty", { status: 400 })
//   }

//   // Extract model UID
//   let modelUid = null;
//   const uidMatch = userPrompt.match(/UID:\s*([a-zA-Z0-9]+)/i);
//   if (uidMatch) {
//     modelUid = uidMatch[1];
//   }

//   const enhancePrompt = (prompt: string): string => {
//     const lowerPrompt = prompt.toLowerCase()
//     let enhancedPrompt = prompt

//     // Extract color preferences
//     const colorMatches = prompt.match(
//       /(?:color|background|button).*?(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|red|blue|green|purple|orange|yellow|pink|cyan|black|white)/gi,
//     )
//     if (colorMatches) {
//       enhancedPrompt += `\n\nCOLOR CUSTOMIZATION: Use these colors: ${colorMatches.join(", ")}`
//     }

//     // Add game type specific enhancements
//     if (selectedGameType === "2d") {
//       enhancedPrompt += `\n\nCreate a professional 2D game with sprite-based graphics, pixel art aesthetics, and classic 2D gameplay mechanics.`
//     } else if (selectedGameType === "3d") {
//       enhancedPrompt += `\n\nCreate a professional 3D game with realistic graphics, advanced lighting, and immersive 3D environments.`
//       if (modelUid) {
//         enhancedPrompt += `\n\nIntegrate a 3D model with UID: ${modelUid} as a walking character on the map, using the loadSketchfabModel function. Ensure the Three.js scene is initialized before calling loadSketchfabModel.`
//       }
//     } else if (selectedGameType === "vr") {
//       enhancedPrompt += `\n\nCreate a professional VR game with immersive experiences, spatial interactions, and room-scale VR mechanics.`
//     }

//     // Add style-specific enhancements
//     enhancedPrompt += `\n\nUse ${selectedStyle} button style for all interactive elements with professional animations and effects.`

//     if (lowerPrompt.includes("1v1") || lowerPrompt.includes("shooter")) {
//       return `Create a professional ${selectedGameType.toUpperCase()} tactical game with:
// - Professional lobby with character selection and ${selectedStyle} play button
// - Well-designed ${selectedGameType === "2d" ? "2D map with sprite-based environments" : selectedGameType === "3d" ? "3D map with cover and realistic environment" : "VR arena with immersive spatial design"}
// - Professional weapons and character ${selectedGameType === "2d" ? "sprites" : selectedGameType === "3d" ? "models" : "VR interactions"}
// - Professional HUD with health, ammo, and score
// - Smooth ${selectedGameType} gameplay mechanics and professional visuals
// ${enhancedPrompt}`
//     }

//     if (lowerPrompt.includes("racing") || lowerPrompt.includes("car")) {
//       return `Create a professional ${selectedGameType.toUpperCase()} racing game with:
// - Professional garage lobby with car selection and ${selectedStyle} play button
// - Well-designed ${selectedGameType === "2d" ? "2D race track with sprite-based graphics" : selectedGameType === "3d" ? "3D race track with professional visuals" : "VR racing environment with immersive cockpit view"}
// - Realistic car ${selectedGameType === "2d" ? "sprites" : selectedGameType === "3d" ? "models" : "VR interactions"} with smooth physics
// - Professional racing HUD and controls
// - Professional lighting and environmental effects
// ${enhancedPrompt}`
//     }

//     if (lowerPrompt.includes("space") || lowerPrompt.includes("sci-fi")) {
//       return `Create a professional ${selectedGameType.toUpperCase()} space game with:
// - Professional space station lobby with ship selection and ${selectedStyle} play button
// - Well-designed ${selectedGameType === "2d" ? "2D space environment with sprite-based planets/asteroids" : selectedGameType === "3d" ? "3D space environment with planets/asteroids" : "VR space environment with immersive zero-gravity interactions"}
// - Professional spacecraft and space effects
// - Professional space HUD and controls
// - Smooth space physics and professional visuals
// ${enhancedPrompt}`
//     }

//     return `${enhancedPrompt}

// Make this a professional ${selectedGameType.toUpperCase()} game with:
// - Professional lobby with ${selectedStyle} play button design
// - Well-designed ${selectedGameType} game map with professional styling
// - Professional ${selectedGameType === "2d" ? "sprites" : selectedGameType === "3d" ? "models" : "VR interactions"} and environments
// - Professional UI and smooth ${selectedGameType} gameplay
// - Professional background design`
//   }

//   const enhancedPrompt = enhancePrompt(userPrompt)

//   try {
//     let contextPrompt = enhancedPrompt
//     if (chatHistory.length > 0) {
//       const recentMessages = chatHistory.slice(-4)
//       const contextMessages = recentMessages
//         .map((msg: Message) => `${msg.sender === "user" ? "User" : "AI"}: ${msg.content}`)
//         .join("\n")
//       contextPrompt = `Context:\n${contextMessages}\n\nRequest: ${enhancedPrompt}`
//     }

//     const result = await streamText({
//       model: google("gemini-2.5-flash-lite-preview-06-17"),
//       system: getSystemPrompt(language, selectedStyle, selectedGameType, slashCommand),
//       prompt: contextPrompt,
//     })

//     return result.toDataStreamResponse()
//   } catch (err) {
//     console.error("/api/generate error", err)
//     return new Response(`Error generating professional game code: ${err.message}`, { status: 500 })
//   }
// }