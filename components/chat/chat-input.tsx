"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Check, CircleIcon as CircleQuestionMark } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
// import { Badge } from "@/components/ui/badge"
import { SiOpenai, SiAnthropic, SiGooglegemini, SiX } from "@icons-pack/react-simple-icons"
import Image from "next/image"
// import { Tooltip } from "@/components/ui/tooltip"

import TextareaAutosize from 'react-textarea-autosize'
import { RepoBanner } from './repo-banner'
// Updated models data to include Claude

const models: Record<string, { name: string; author: string; description?: string; soon?: string; features?: string[] }> = {
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
  fitness: `Generate a dashboard for fitness tracking with the following data:\nActivity,Duration(min),Calories,HeartRate,Distance(km)\nMorning Run,45,420,145,6.2\nYoga Session,60,180,95,0\nCycling,90,650,138,25.5\nSwimming,30,280,125,1.2\nHIIT Workout,25,310,162,0\nEvening Walk,40,150,98,3.8\nWeight Training,50,220,118,0`,
  library: `Create a sortable table for a library collection:\nTitle,Author,Genre,Rating,Year,Available\nThe Midnight Library,Matt Haig,Fiction,4.8,2020,Yes\nAtomic búAtomic Habits,James Clear,Self-Help,4.9,2018,No\nProject Hail Mary,Andy Weir,Sci-Fi,4.7,2021,Yes\nEducated,Tara Westover,Memoir,4.6,2018,Yes\nThe Silent Patient,Alex Michaelides,Thriller,4.5,2019,No\nSapiens,Yuval Noah Harari,History,4.8,2011,Yes\nDune,Frank Herbert,Sci-Fi,4.9,1965,Yes`,
  orders: `Visualize restaurant orders with a summary and a list:\nOrder ID,Customer,Items,Total,Time,Status\n#1234,Sarah Chen,"Pizza Margherita, Salad",$28.50,12:15 PM,Delivered\n#1235,Mike Johnson,"Burger Deluxe, Fries, Coke",$18.99,12:30 PM,Preparing\n#1236,Emily Davis,"Pasta Carbonara, Wine",$35.00,12:45 PM,Ready\n#1237,Alex Wong,"Sushi Platter, Miso Soup",$42.80,1:00 PM,In Transit\n#1238,Lisa Brown,"Caesar Salad, Smoothie",$16.75,1:15 PM,Confirmed`,
  weather: `Display weather monitoring data in a card layout:\nLocation | Time | Temp(°C) | Humidity(%) | Condition | Wind(km/h)\nTokyo | 08:00 | 22 | 65 | Partly Cloudy | 12\nLondon | 08:00 | 14 | 78 | Light Rain | 18\nNew York | 08:00 | 18 | 52 | Clear | 8\nSydney | 08:00 | 26 | 70 | Sunny | 15\nDubai | 08:00 | 35 | 45 | Hot & Dry | 22\nParis | 08:00 | 16 | 68 | Overcast | 10`,
  employees: `Create an employee directory with search and filter options:\n- John Smith (Engineering) - Senior Developer - john.smith@company.com - Ext: 2154\n- Maria Garcia (Marketing) - Brand Manager - maria.garcia@company.com - Ext: 3287\n- David Lee (Sales) - Account Executive - david.lee@company.com - Ext: 4156\n- Emma Wilson (HR) - Talent Acquisition - emma.wilson@company.com - Ext: 5623\n- Robert Chen (Finance) - Financial Analyst - robert.chen@company.com - Ext: 6789\n- Sophie Turner (Design) - UX Designer - sophie.turner@company.com - Ext: 7432\n- James Park (Engineering) - DevOps Engineer - james.park@company.com - Ext: 8901`,
}

interface ChatInputProps {
  inputPrompt: string
  setInputPrompt: (value: string) => void
  onSendMessage: (model: string) => void
  isGenerating: boolean
}

export function ChatInput({ inputPrompt, setInputPrompt, onSendMessage, isGenerating }: ChatInputProps) {
  const [model, setModel] = useState<string>("gemini-2.5-flash")
  const [open, setOpen] = useState(false)

  const handleExampleClick = (exampleText: string) => {
    setInputPrompt(exampleText)
  }

  const handleSendClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isGenerating && inputPrompt.trim()) {
      onSendMessage(model)
    }
  }

  const labelMap: Record<string, { label: string; image: string }> = {
    fitness: { label: "Fitness Tracking", image: "/assets/images/fitness.png" },
    library: { label: "Library Collection", image: "/assets/images/library.png" },
    orders: { label: "Restaurant Orders", image: "/assets/images/orders.png" },
    weather: { label: "Weather Monitoring", image: "/assets/images/weather.png" },
    employees: { label: "Employee Directory", image: "/assets/images/employees.png" },
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

  function onEnter(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      if (e.currentTarget.checkValidity()) {
        handleSendClick(e)
      }
    }
  }

  return (
    <div className="p-6 bg-background">
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(exampleData).map(([key, exampleText]) => {
            const { label, image } = labelMap[key] || { label: key, image: "" }
            return (
              <Button
                key={key}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-muted-foreground hover:text-muted-foreground text-xs shadow-none font-[500] hover:border-[rgba(0,153,255,0.25)] dark:hover:border-[#58a6ff] bg-[#8888881A] flex items-center gap-2"
                onClick={() => handleExampleClick(exampleText)}
              >
                {image && <Image src={image || "/placeholder.svg"} alt={`${label} icon`} width={16} height={16} />}
                {label}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="max-w-2xl mx-auto relative top-[33px]">
        <form
          onSubmit={handleSendClick}
          onKeyDown={onEnter}
          className="mb-2 mt-auto flex flex-col bg-background"
        >
          <div className="relative">
            <RepoBanner className="absolute bottom-full inset-x-2 translate-y-1 z-0 pb-2" />
            <div className="rounded-2xl relative z-10 bg-background border dark:border-[#30363d]">
              <div className="flex items-center px-3 py-2 gap-1">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 px-3 hover:bg-[#88888811] text-muted-foreground hover:text-muted-foreground rounded-lg border-0 font-medium text-xs"
                      aria-label="Select model"
                      title={`Current model: ${models[model]?.name || model}`}
                    >
                      {getModelIcon(model)}
                      <span className="hidden md:inline">{models[model]?.name || model}</span>
                    </Button>
                  </PopoverTrigger>
                  {open && (
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
                                  setOpen(false)
                                }}
                              >
                                {/* <Tooltip
                                  content={
                                    <div className="p-2 max-w-xs">
                                      <div className="font-semibold text-foreground text-sm mb-1">
                                        {models[modelOption]?.name || modelOption}
                                      </div>
                                      <div className="text-xs text-muted-foreground mb-2">
                                        by {models[modelOption]?.author}
                                      </div>
                                      {models[modelOption]?.description && (
                                        <div className="text-xs text-muted-foreground mb-2 w-full">
                                          {models[modelOption].description}
                                        </div>
                                      )}
                                      {models[modelOption]?.features && models[modelOption].features.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                          {models[modelOption].features.map((feature) => (
                                            <Badge key={feature} variant="secondary" className="text-xs">
                                              {feature}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  }
                                  className="bg-muted max-w-xs min-w-xs w-xs"
                                  side="left"
                                > */}
                                  <div className="flex items-center w-full">
                                    {modelOption === model && <Check className="mr-2 h-4 w-4" />}
                                    {modelOption !== model && getModelIcon(modelOption)}
                                      <div className="flex flex-col">
                                        <span>{models[modelOption]?.name || modelOption}</span>
                                        <span style={{ fontSize: "13px", color: "gray" }}>
                                        {models[modelOption].description}
                                        </span>
                                        <span style={{ fontSize: "13px", color: "gray" }}>
                                        {models[modelOption].soon}
                                        </span>
                                      </div>
                                  </div>
                                {/* </Tooltip> */}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  )}
                </Popover>
              </div>
              <TextareaAutosize
                autoFocus={true}
                minRows={1}
                maxRows={5}
                className="text-normal px-3 resize-none ring-0 bg-inherit w-full m-0 outline-none dark:text-white"
                required={true}
                placeholder="Describe the component you want to build, or paste structured data (CSV, JSON, etc.)."
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
              />
              <div className="flex p-3 gap-2 items-center">
                <div className="flex items-center flex-1 gap-2"></div>
                <Button
                  disabled={isGenerating || !inputPrompt.trim() || !model}
                  variant="default"
                  size="icon"
                  type="submit"
                  className="rounded-xl h-10 w-10 bg-[#0099FF] text-white dark:bg-[#58a6ff] dark:text-white disabled:bg-[#e6e6e6] disabled:text-[#8c9196]"
                >
                  <Sparkles className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This is an open-source project made by{' '}
            <a href="https://zerlo.online" target="_blank" className="text-[#0099FF]">
              ✶ Zerlo
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}