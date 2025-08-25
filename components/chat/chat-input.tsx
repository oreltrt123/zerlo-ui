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
} from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
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
import { RepoBanner } from "./repo-banner"

const models: Record<
  string,
  { name: string; author: string; description?: string; soon?: string; features?: string[] }
> = {
  "gpt-4o-mini": {
    name: "GPT-4o Mini",
    author: "OpenAI",
    description: "Powerful and precise language model.",
    features: ["vision", "reasoning"],
    soon: "(Coming soon)",
  },
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
    soon: "(Coming soon)",
  },
  "grok-4": {
    name: "Grok 4",
    author: "xAI",
    description: "Advanced truth-seeking AI built by xAI.",
    features: ["reasoning", "multimodal"],
    soon: "(Coming soon)",
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
}

export function ChatInput({ inputPrompt, setInputPrompt, onSendMessage, isGenerating }: ChatInputProps) {
  const [model, setModel] = useState<string>("gemini-2.5-flash")
  const [language, setLanguage] = useState<string>("html")
  const [modelOpen, setModelOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [discussMode, setDiscussMode] = useState(false)
  const [searchMode, setSearchMode] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      onSendMessage(model, language, discussMode, uploadedFiles, searchMode)
      setUploadedFiles([])
      setSearchMode(false)
    }
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

      <div className="max-w-2xl mx-auto relative top-[33px]">
        <form onSubmit={handleSendClick} onKeyDown={onEnter} className="mb-2 mt-auto flex flex-col bg-background">
          <div className="relative">
            <RepoBanner className="absolute bottom-full inset-x-2 translate-y-1 z-0 pb-2" />
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
                      className="h-8 px-3 hover:bg-[#88888811] text-muted-foreground hover:text-preview-foreground rounded-lg border-0 font-medium text-xs"
                      aria-label="Select model"
                      title={`Current model: ${models[model]?.name || model}`}
                    >
                      {getModelIcon(model)}
                      <span className="hidden md:inline">{models[model]?.name || model}</span>
                    </Button>
                  </PopoverTrigger>
                  {modelOpen && (
                    <PopoverContent className="p-0 w-[300px]">
                      <Command>
                        <CommandInput placeholder="Select model..." />
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
                  )}
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
                    {languageOpen && (
                      <PopoverContent className="p-0 w-[300px]">
                        <Command>
                          <CommandInput placeholder="Select language..." />
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
                    )}
                  </Popover>
                )}
                <Button
                  variant="ghost"
                  className={`h-8 px-3 hover:bg-[#88888811] rounded-lg border-0 font-medium text-xs ${
                    discussMode
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
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
                      ? "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
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
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This is an open-source project made by{" "}
            <a href="https://zerlo.online" target="_blank" className="text-[#0099FF]" rel="noreferrer">
              ✶ Zerlo
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}