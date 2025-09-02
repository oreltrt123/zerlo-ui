"use client"
import { useState, useRef } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Check,
  FileQuestion as CircleQuestionMark,
  MessageCircle,
  Paperclip,
  X,
  Search,
  Mic,
  Wand2,
  Pencil,
} from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import {
  SiOpenai,
  SiAnthropic,
  SiGooglegemini,
  SiX,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiHtml5,
} from "@icons-pack/react-simple-icons"
import Image from "next/image"
import "@/styles/button.css"
import TextareaAutosize from "react-textarea-autosize"

// Define Web Speech API types
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

interface SpeechRecognitionResult {
  [index: number]: SpeechAlternative
  isFinal: boolean
}

interface SpeechAlternative {
  transcript: string
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent {
  error: string
}

interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResult
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

const models: Record<
  string,
  { name: string; author: string; description?: string; soon?: string; features?: string[] }
> = {
  "gemini-2.5-flash": {
    name: "Gemini 2.5 Flash",
    author: "Google",
    description: "Fast and creative AI model.",
    features: ["fast", "vision"],
  },
  "claude-3-5-sonnet": {
    name: "Claude 3.5 Sonnet",
    author: "Anthropic",
    description: "Fast and strong conversational AI.",
    features: ["reasoning"],
  },
}

const exampleData = {
  battleRoyale: `Create a professional 3D Battle Royale game:
- Complete lobby system with 100-player matchmaking and squad formation
- Massive open-world map with cities, forests, mountains, and military bases
- Realistic parachute drop system with wind physics and landing mechanics
- Advanced loot system with weapon tiers, attachments, armor, and consumables
- Dynamic storm circle with visual effects and damage zones
- Vehicles: cars, motorcycles, boats, helicopters with realistic physics
- Building destruction system and interactive environment objects
- Professional HUD with minimap, inventory, health/armor indicators
- Spectator mode and replay system with cinematic camera angles`,

  tacticalFPS: `Design a tactical 3D FPS with complete game systems:
- Lobby with team formation, map voting, and tactical planning phase
- Realistic military environments: urban warfare, desert compounds, jungle bases
- Professional weapon system: assault rifles, SMGs, snipers, explosives with realistic ballistics
- Character classes: Assault, Support, Sniper, Engineer with unique abilities
- Advanced AI enemies with cover system, flanking tactics, and communication
- Destructible environments and breach mechanics for doors/walls
- Real-time voice chat integration and tactical marking system
- Match statistics, ranking system, and unlockable content progression`,

  racingSimulator: `Build a professional 3D racing simulator:
- Complete career mode with championships, sponsors, and team management
- Realistic car physics with tire wear, fuel consumption, and damage modeling
- Multiple racing disciplines: Formula 1, Rally, GT, Street Racing
- Professional race tracks with dynamic weather and day/night cycles
- Advanced car customization: engine tuning, aerodynamics, livery editor
- AI opponents with realistic racing behavior and difficulty scaling
- Multiplayer lobby with custom tournaments and leaderboards
- Pit stop strategy, tire selection, and real-time telemetry data`,

  spaceExploration: `Create an advanced 3D space exploration game:
- Complete space station hub with mission briefings and ship customization
- Realistic solar system with planets, moons, asteroids, and space stations
- Advanced spacecraft with Newtonian physics and orbital mechanics
- Resource mining, trading, and base building on planetary surfaces
- Space combat with energy weapons, missiles, and shield systems
- Procedural planet generation with diverse biomes and alien life
- Multiplayer cooperation for large-scale construction projects
- Research tree for technology advancement and ship upgrades`,
}

interface ChatInputProps {
  inputPrompt: string
  setInputPrompt: (value: string) => void
  onSendMessage: (model: string, language: string, discussMode?: boolean, files?: File[], searchMode?: boolean) => void
  isGenerating: boolean
  setEditMode: (mode: boolean) => void
}

export function ChatInput({ inputPrompt, setInputPrompt, onSendMessage, isGenerating, setEditMode }: ChatInputProps) {
  const [model, setModel] = useState<string>("gemini-2.5-flash")
  const [language, setLanguage] = useState<string>("html")
  const [modelOpen, setModelOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [discussMode, setDiscussMode] = useState(false)
  const [searchMode, setSearchMode] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const handleExampleClick = (exampleText: string) => {
    setInputPrompt(exampleText)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
    setDiscussMode(true)
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    if (uploadedFiles.length === 1) {
      setDiscussMode(false)
    }
  }

  const handleSendClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isGenerating && inputPrompt.trim()) {
      console.log("Sending message with model:", model)
      onSendMessage(model, language, discussMode, uploadedFiles, searchMode)
      setUploadedFiles([])
      setSearchMode(false)
    }
  }

  const handleMicClick = () => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      alert("Sorry, your browser does not support speech recognition.")
      return
    }

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognitionConstructor()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      setInputPrompt(finalTranscript + interimTranscript)
    }

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error)
      setIsRecording(false)
      alert("An error occurred during speech recognition: " + event.error)
    }

    recognitionRef.current.onend = () => {
      setIsRecording(false)
    }

    if (!isRecording) {
      recognitionRef.current.start()
      setIsRecording(true)
    } else {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  const enhancePrompt = (prompt: string): string => {
    if (prompt.toLowerCase().includes("computer game with sheets")) {
      return `Develop a professional 2D puzzle game inspired by spreadsheet mechanics:
- Create a grid-based interface resembling a digital spreadsheet
- Implement puzzle mechanics where players manipulate cells using formulas and data
- Include vibrant, modern visuals with a clean, minimalist UI using Inter font
- Add progression system with levels, challenges, and unlockable themes
- Support keyboard inputs for formula entry and mouse-based cell selection
- Include a tutorial mode to guide new players
- Optimize for performance on web browsers using TypeScript and Pixi.js`
    }
    return `Enhanced prompt: ${prompt} with detailed specifications, modern UI, and optimized performance using best practices for web-based game development.`
  }

  const handleEnhanceClick = async () => {
    if (!inputPrompt.trim()) {
      alert("Please enter a prompt to enhance.")
      return
    }

    setIsEnhancing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const enhancedPrompt = enhancePrompt(inputPrompt)
      setInputPrompt(enhancedPrompt)
    } catch (error) {
      console.error("Prompt enhancement error:", error)
      alert("An error occurred while enhancing the prompt.")
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleEditClick = () => {
    setIsEditing(!isEditing)
    setEditMode(!isEditing)
  }

  const labelMap: Record<string, { label: string; imageLight: string; imageDark: string }> = {
    battleRoyale: {
      label: "Battle Royale",
      imageLight: "/assets/images/arena-conditions-light.png",
      imageDark: "/assets/images/arena-conditions-dark.png",
    },
    tacticalFPS: {
      label: "Tactical FPS",
      imageLight: "/assets/images/match-history-light.png",
      imageDark: "/assets/images/match-history-dark.png",
    },
    racingSimulator: {
      label: "Racing Simulator",
      imageLight: "/assets/images/weapon-loadouts-light.png",
      imageDark: "/assets/images/weapon-loadouts-dark.png",
    },
    spaceExploration: {
      label: "Space Exploration",
      imageLight: "/assets/images/player-stats-light.png",
      imageDark: "/assets/images/player-stats-dark.png",
    },
  }

  const getModelIcon = (modelId: string) => {
    switch (models[modelId]?.author) {
      case "OpenAI":
        return <SiOpenai className="h-4 w-4 mr-2" />
      case "Anthropic":
        return <SiAnthropic className="h-4 w-4 mr-2" />
      case "Google":
        return <SiGooglegemini className="h-4 w-4 mr-2" />
      case "xAI":
        return <SiX className="h-4 w-4 mr-2" />
      default:
        return <CircleQuestionMark className="h-4 w-4 mr-2" />
    }
  }

  const getLanguageIcon = (languageId: string) => {
    switch (languageId) {
      case "typescript":
        return <SiTypescript className="h-4 w-4 mr-2" />
      case "javascript":
        return <SiJavascript className="h-4 w-4 mr-2" />
      case "python":
        return <SiPython className="h-4 w-4 mr-2" />
      case "html":
        return <SiHtml5 className="h-4 w-4 mr-2" />
      default:
        return null
    }
  }

  function onEnter(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      if (e.currentTarget.checkValidity()) {
        handleSendClick(e)
      }
    }
  }

  return (
    <div className="p-6 bg-background">
      {!discussMode && (
        <div className="space-y-4 mb-4">
          <div className="flex flex-wrap gap-2 relative left-[6%]">
            {Object.entries(exampleData).map(([key, exampleText]) => {
              const { label, imageLight, imageDark } = labelMap[key] || { label: key, imageLight: "", imageDark: "" }
              return (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  className="r2552esf25_252trewt3erblueFontDocs h-8 px-3 text-muted-foreground dark:text-white hover:text-muted-foreground text-xs shadow-none font-[500] bg-[#8888881A] dark:bg-[#303030] flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  onClick={() => handleExampleClick(exampleText)}
                >
                  {imageLight && imageDark && (
                    <>
                      <Image
                        src={imageLight || "/placeholder.svg"}
                        alt={`${label} icon light`}
                        width={16}
                        height={16}
                        className="dark:hidden"
                      />
                      <Image
                        src={imageDark || "/placeholder.svg"}
                        alt={`${label} icon dark`}
                        width={16}
                        height={16}
                        className="hidden dark:block"
                      />
                    </>
                  )}
                  {label}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto relative">
        <form onSubmit={handleSendClick} onKeyDown={onEnter} className="mb-2 mt-auto flex flex-col bg-background">
          <div className="relative">
            {uploadedFiles.length > 0 && (
              <div className="mb-2 p-2 bg-gray-50 dark:bg-[#404040] rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white dark:bg-[#303030] px-2 py-1 rounded text-xs"
                    >
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="rounded-2xl relative z-10 bg-background dark:bg-[#303030] border dark:border-[#444444]">
              <div className="flex items-center px-3 py-2 gap-1">
                <Popover open={modelOpen} onOpenChange={setModelOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`h-8 px-3 text-xs font-medium rounded-lg border-0 ${
                        model === "claude-3-5-sonnet"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "text-muted-foreground hover:text-muted-foreground hover:bg-[#88888811]"
                      }`}
                      aria-label="Select model"
                      title={`Current model: ${models[model]?.name || model}`}
                    >
                      {getModelIcon(model)}
                      <span className="hidden md:inline">{models[model]?.name || model}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[300px]">
                    <Command>
                      <CommandList>
                        <CommandEmpty>No models found.</CommandEmpty>
                        <CommandGroup>
                          {Object.keys(models).map((modelOption) => (
                            <CommandItem
                              key={modelOption}
                              value={modelOption}
                              onSelect={(value) => {
                                setModel(value)
                                setModelOpen(false)
                                console.log("Model selected:", value)
                              }}
                            >
                              <div className="flex items-center w-full">
                                {modelOption === model && <Check className="mr-2 h-4 w-4" />}
                                {modelOption !== model && getModelIcon(modelOption)}
                                <div className="flex flex-col">
                                  <span>{models[modelOption]?.name || modelOption}</span>
                                  <span style={{ fontSize: "13px", color: "gray" }}>
                                    {models[modelOption].description}
                                  </span>
                                  <span style={{ fontSize: "13px", color: "gray" }}>{models[modelOption].soon}</span>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {!discussMode && (
                  <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 px-3 hover:bg-[#88888811] text-muted-foreground hover:text-muted-foreground rounded-lg border-0 font-medium text-xs"
                        aria-label="Select language"
                        title={`Current language: ${language}`}
                      >
                        {getLanguageIcon(language)}
                        <span className="hidden md:inline">{language}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[300px]">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No languages found.</CommandEmpty>
                          <CommandGroup>
                            {["html", "typescript", "javascript", "python"].map((languageOption) => (
                              <CommandItem
                                key={languageOption}
                                value={languageOption}
                                onSelect={(value) => {
                                  setLanguage(value)
                                  setLanguageOpen(false)
                                }}
                              >
                                <div className="flex items-center w-full">
                                  {languageOption === language && <Check className="mr-2 h-4 w-4" />}
                                  {languageOption !== language && getLanguageIcon(languageOption)}
                                  <div className="flex flex-col">
                                    <span>{languageOption}</span>
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
                <Button
                  variant="ghost"
                  className={`h-8 px-3 hover:bg-[#88888811] rounded-lg border-0 font-medium text-xs ${
                    isEditing
                      ? "bg-[#0099ff34] hover:bg-[#0099ff2c] dark:bg-blue-900/30 text-accent-foreground dark:text-accent-foreground"
                      : "text-muted-foreground hover:text-muted-foreground"
                  }`}
                  onClick={handleEditClick}
                  aria-label="Toggle edit mode"
                  title={isEditing ? "Exit edit mode" : "Enter edit mode"}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  className={`h-8 px-3 hover:bg-[#88888811] rounded-lg border-0 font-medium text-xs ${
                    discussMode
                      ? "bg-[#0099ff34] hover:bg-[#0099ff2c] dark:bg-[#0099ff34] text-accent-foreground dark:text-accent-foreground"
                      : "text-muted-foreground hover:text-muted-foreground"
                  }`}
                  onClick={() => setDiscussMode(!discussMode)}
                  aria-label="Toggle discuss mode"
                  title={discussMode ? "Exit discuss mode" : "Enter discuss mode"}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Discuss</span>
                </Button>
              </div>
              <TextareaAutosize
                autoFocus={true}
                minRows={1}
                maxRows={5}
                className="text-normal px-3 resize-none ring-0 bg-inherit w-full m-0 outline-none dark:text-white"
                required={true}
                placeholder={
                  discussMode
                    ? "Ask me anything about game development, 3D graphics, or professional game design..."
                    : "Describe your dream game - I'll create a complete 3D experience with lobbies, realistic assets, and professional gameplay systems."
                }
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
              />
              <div className="flex p-3 gap-2 items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.webp,.glb,.gltf,.obj,.fbx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  title="Upload 3D models, textures, or reference images"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchMode(!searchMode)}
                  className={`h-8 w-8 p-0 ${
                    searchMode
                      ? "bg-[#0099ff34] hover:bg-[#0099ff2c] dark:bg-blue-900/30 text-accent-foreground dark:text-accent-foreground"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title={
                    searchMode
                      ? "Disable web search for latest game dev resources"
                      : "Enable web search for latest game dev resources"
                  }
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleMicClick}
                  className={`h-8 w-8 p-0 ${
                    isRecording
                      ? "bg-[#0099ff34] hover:bg-[#0099ff2c] dark:bg-blue-900/30 text-accent-foreground dark:text-accent-foreground"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title={isRecording ? "Stop recording" : "Start voice input"}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleEnhanceClick}
                  disabled={isEnhancing || !inputPrompt.trim()}
                  className={`h-8 w-8 p-0 ${
                    isEnhancing
                      ? "bg-[#0099ff34] hover:bg-[#0099ff2c] dark:bg-blue-900/30 text-accent-foreground dark:text-accent-foreground"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title={isEnhancing ? "Enhancing prompt..." : "Enhance prompt with AI"}
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
                <div className="flex items-center flex-1 gap-2"></div>
                <Button
                  disabled={isGenerating || !inputPrompt.trim() || !model || (!discussMode && !language)}
                  variant="default"
                  size="icon"
                  type="submit"
                  className="rounded-xl h-10 w-10 bg-[#0099FF] hover:bg-[#0099ffbe] disabled:bg-[#e6e6e6] disabled:text-[#8c9196] transition-all duration-200"
                >
                  <Sparkles className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}