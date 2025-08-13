"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

const exampleData = {
  fitness: `Generate a dashboard for fitness tracking with the following data:\nActivity,Duration(min),Calories,HeartRate,Distance(km)\nMorning Run,45,420,145,6.2\nYoga Session,60,180,95,0\nCycling,90,650,138,25.5\nSwimming,30,280,125,1.2\nHIIT Workout,25,310,162,0\nEvening Walk,40,150,98,3.8\nWeight Training,50,220,118,0`,
  library: `Create a sortable table for a library collection:\nTitle,Author,Genre,Rating,Year,Available\nThe Midnight Library,Matt Haig,Fiction,4.8,2020,Yes\nAtomic Habits,James Clear,Self-Help,4.9,2018,No\nProject Hail Mary,Andy Weir,Sci-Fi,4.7,2021,Yes\nEducated,Tara Westover,Memoir,4.6,2018,Yes\nThe Silent Patient,Alex Michaelides,Thriller,4.5,2019,No\nSapiens,Yuval Noah Harari,History,4.8,2011,Yes\nDune,Frank Herbert,Sci-Fi,4.9,1965,Yes`,
  orders: `Visualize restaurant orders with a summary and a list:\nOrder ID,Customer,Items,Total,Time,Status\n#1234,Sarah Chen,"Pizza Margherita, Salad",$28.50,12:15 PM,Delivered\n#1235,Mike Johnson,"Burger Deluxe, Fries, Coke",$18.99,12:30 PM,Preparing\n#1236,Emily Davis,"Pasta Carbonara, Wine",$35.00,12:45 PM,Ready\n#1237,Alex Wong,"Sushi Platter, Miso Soup",$42.80,1:00 PM,In Transit\n#1238,Lisa Brown,"Caesar Salad, Smoothie",$16.75,1:15 PM,Confirmed`,
  weather: `Display weather monitoring data in a card layout:\nLocation | Time | Temp(°C) | Humidity(%) | Condition | Wind(km/h)\nTokyo | 08:00 | 22 | 65 | Partly Cloudy | 12\nLondon | 08:00 | 14 | 78 | Light Rain | 18\nNew York | 08:00 | 18 | 52 | Clear | 8\nSydney | 08:00 | 26 | 70 | Sunny | 15\nDubai | 08:00 | 35 | 45 | Hot & Dry | 22\nParis | 08:00 | 16 | 68 | Overcast | 10`,
  employees: `Create an employee directory with search and filter options:\n- John Smith (Engineering) - Senior Developer - john.smith@company.com - Ext: 2154\n- Maria Garcia (Marketing) - Brand Manager - maria.garcia@company.com - Ext: 3287\n- David Lee (Sales) - Account Executive - david.lee@company.com - Ext: 4156\n- Emma Wilson (HR) - Talent Acquisition - emma.wilson@company.com - Ext: 5623\n- Robert Chen (Finance) - Financial Analyst - robert.chen@company.com - Ext: 6789\n- Sophie Turner (Design) - UX Designer - sophie.turner@company.com - Ext: 7432\n- James Park (Engineering) - DevOps Engineer - james.park@company.com - Ext: 8901`,
}

interface ChatInputProps {
  inputPrompt: string
  setInputPrompt: (value: string) => void
  onSendMessage: (model: "gemini" | "gpt") => void
  isGenerating: boolean
}

export function ChatInput({ inputPrompt, setInputPrompt, onSendMessage, isGenerating }: ChatInputProps) {
  const [model, setModel] = useState<"gemini" | "gpt">("gemini")

  const handleExampleClick = (exampleText: string) => {
    setInputPrompt(exampleText)
  }

  const handleSendClick = () => {
    if (!isGenerating && inputPrompt.trim()) {
      onSendMessage(model)
    }
  }

  const labelMap: Record<string, { label: string; image: string }> = {
    fitness: { label: "Fitness Tracking", image: "/placeholder.svg?height=16&width=16" },
    library: { label: "Library Collection", image: "/placeholder.svg?height=16&width=16" },
    orders: { label: "Restaurant Orders", image: "/placeholder.svg?height=16&width=16" },
    weather: { label: "Weather Monitoring", image: "/placeholder.svg?height=16&width=16" },
    employees: { label: "Employee Directory", image: "/placeholder.svg?height=16&width=16" },
  }

  return (
    <div className="p-6 bg-white dark:bg-[#161b22] border-t border-[#e6e6e6] dark:border-[#30363d]">
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(exampleData).map(([key, exampleText]) => {
            const { label, image } = labelMap[key] || { label: key, image: "" }
            return (
              <Button
                key={key}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-muted-foreground hover:text-muted-foreground text-xs shadow-none font-medium hover:border-blue-300 dark:hover:border-blue-400 bg-gray-50 flex items-center gap-2"
                onClick={() => handleExampleClick(exampleText)}
              >
                {image && <Image src={image || "/placeholder.svg"} alt={`${label} icon`} width={16} height={16} />}
                {label}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="flex items-center bg-white rounded-2xl px-4 py-6 gap-3 shadow-lg border">
            <Textarea
              className="min-h-[24px] max-h-[120px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400 text-base p-0"
              placeholder="Describe the component you want to build, or paste structured data (CSV, JSON, etc.)."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendClick()
                }
              }}
            />

            {/* Model selector dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute bottom-2 right-12 h-8 px-3 hover:bg-gray-100 text-muted-foreground hover:text-muted-foreground rounded-lg border-0 font-medium text-xs"
                  aria-label="Select model"
                  title={`Current model: ${model === "gemini" ? "Gemini 2.5 Flash" : "GPT-4"}`}
                >
                  {model === "gemini" ? (
                    <Image
                      src="/placeholder.svg?height=24&width=24"
                      alt="Gemini"
                      width={24}
                      height={24}
                      className="mr-1"
                    />
                  ) : (
                    <Image
                      src="/placeholder.svg?height=24&width=24"
                      alt="GPT"
                      width={24}
                      height={24}
                      className="mr-1"
                    />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white rounded-md shadow-lg border" align="end" sideOffset={8}>
                <DropdownMenuItem
                  className={`cursor-pointer p-3 text-muted-foreground hover:text-muted-foreground ${
                    model === "gemini" ? "font-bold bg-gray-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setModel("gemini")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm">✨</span>
                    </div>
                    <div>
                      <div className="font-semibold">Gemini 2.5 Flash</div>
                      <div className="text-xs text-gray-500">Fast & Creative</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`cursor-pointer p-3 text-muted-foreground hover:text-muted-foreground ${
                    model === "gpt" ? "font-bold bg-gray-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setModel("gpt")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm">🤖</span>
                    </div>
                    <div>
                      <div className="font-semibold">GPT-4</div>
                      <div className="text-xs text-gray-500">Powerful & Precise</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Send button */}
            <Button
              onClick={handleSendClick}
              disabled={isGenerating || !inputPrompt.trim()}
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg border-0 disabled:bg-gray-300 disabled:text-gray-500 shadow-none"
              aria-label="Send message"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
