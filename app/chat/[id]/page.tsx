"use client"

import { useState, useEffect, useRef } from "react"
import { useCompletion } from "ai/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Toaster, toast } from "sonner"
import { Sparkles, Copy } from "lucide-react"
import DynamicComponent from "@/components/dynamic-component"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams, useSearchParams } from "next/navigation"

// Updated exampleData to contain natural language prompts that include data
const exampleData = {
  fitness: `Generate a dashboard for fitness tracking with the following data:\nActivity,Duration(min),Calories,HeartRate,Distance(km)\nMorning Run,45,420,145,6.2\nYoga Session,60,180,95,0\nCycling,90,650,138,25.5\nSwimming,30,280,125,1.2\nHIIT Workout,25,310,162,0\nEvening Walk,40,150,98,3.8\nWeight Training,50,220,118,0`,
  library: `Create a sortable table for a library collection:\nTitle,Author,Genre,Rating,Year,Available\nThe Midnight Library,Matt Haig,Fiction,4.8,2020,Yes\nAtomic Habits,James Clear,Self-Help,4.9,2018,No\nProject Hail Mary,Andy Weir,Sci-Fi,4.7,2021,Yes\nEducated,Tara Westover,Memoir,4.6,2018,Yes\nThe Silent Patient,Alex Michaelides,Thriller,4.5,2019,No\nSapiens,Yuval Noah Harari,History,4.8,2011,Yes\nDune,Frank Herbert,Sci-Fi,4.9,1965,Yes`,
  orders: `Visualize restaurant orders with a summary and a list:\nOrder ID,Customer,Items,Total,Time,Status\n#1234,Sarah Chen,"Pizza Margherita, Salad",$28.50,12:15 PM,Delivered\n#1235,Mike Johnson,"Burger Deluxe, Fries, Coke",$18.99,12:30 PM,Preparing\n#1236,Emily Davis,"Pasta Carbonara, Wine",$35.00,12:45 PM,Ready\n#1237,Alex Wong,"Sushi Platter, Miso Soup",$42.80,1:00 PM,In Transit\n#1238,Lisa Brown,"Caesar Salad, Smoothie",$16.75,1:15 PM,Confirmed`,
  weather: `Display weather monitoring data in a card layout:\nLocation | Time | Temp(°C) | Humidity(%) | Condition | Wind(km/h)\nTokyo | 08:00 | 22 | 65 | Partly Cloudy | 12\nLondon | 08:00 | 14 | 78 | Light Rain | 18\nNew York | 08:00 | 18 | 52 | Clear | 8\nSydney | 08:00 | 26 | 70 | Sunny | 15\nDubai | 08:00 | 35 | 45 | Hot & Dry | 22\nParis | 08:00 | 16 | 68 | Overcast | 10`,
  employees: `Create an employee directory with search and filter options:\n- John Smith (Engineering) - Senior Developer - john.smith@company.com - Ext: 2154\n- Maria Garcia (Marketing) - Brand Manager - maria.garcia@company.com - Ext: 3287\n- David Lee (Sales) - Account Executive - david.lee@company.com - Ext: 4156\n- Emma Wilson (HR) - Talent Acquisition - emma.wilson@company.com - Ext: 5623\n- Robert Chen (Finance) - Financial Analyst - robert.chen@company.com - Ext: 6789\n- Sophie Turner (Design) - UX Designer - sophie.turner@company.com - Ext: 7432\n- James Park (Engineering) - DevOps Engineer - james.park@company.com - Ext: 8901`,
}

interface Message {
  id: string
  sender: "user" | "ai"
  text: string
  isStreaming?: boolean
}

export default function ChatPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const chatId = params.id
  const chatName = searchParams.get("name") || "Untitled Chat"

  const [messages, setMessages] = useState<Message[]>([])
  const [inputPrompt, setInputPrompt] = useState<string>("")
  const [generatedComponent, setGeneratedComponent] = useState<string>("")
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview")

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messageContextRef = useRef<{ aiMessageId: string; originalUserPrompt: string } | null>(null)

  // Hook for generating the actual component code
  const {
    complete: completeComponent,
    isLoading: isLoadingComponent,
  } = useCompletion({
    api: "/api/generate",
    onFinish: (prompt, completion) => {
      console.log("Component generation finished:", completion)
      setGeneratedComponent(completion)
      toast.success("Component generated successfully!")
      setViewMode("preview")
    },
    onError: (err) => {
      console.error("Component generation error:", err)
      toast.error("Error generating component.", { description: err.message })
      setMessages((prev) =>
        prev.map((msg) => (msg.isStreaming ? { ...msg, text: `Error: ${err.message}`, isStreaming: false } : msg))
      )
    },
  })

  // Hook for generating the AI's chat response (textual acknowledgment)
  const {
    completion: chatCompletionText,
    isLoading: isLoadingChat,
    complete: completeChat,
  } = useCompletion({
    api: "/api/chat-response",
    onFinish: (prompt, completion) => {
      console.log("Chat response finished:", completion)
      if (messageContextRef.current) {
        const { aiMessageId, originalUserPrompt } = messageContextRef.current
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId && msg.isStreaming
              ? { ...msg, text: completion, isStreaming: false }
              : msg
          )
        )
        completeComponent(originalUserPrompt)
      }
    },
    onError: (err) => {
      console.error("Chat response error:", err)
      toast.error("Error getting AI response.", { description: err.message })
      setMessages((prev) =>
        prev.map((msg) => (msg.isStreaming ? { ...msg, text: `Error: ${err.message}`, isStreaming: false } : msg))
      )
    },
  })

  // Effect to update streaming AI message in chat
  useEffect(() => {
    if (isLoadingChat && chatCompletionText) {
      setMessages((prev) => {
        const lastAiMessage = prev[prev.length - 1]
        if (lastAiMessage && lastAiMessage.sender === "ai" && lastAiMessage.isStreaming) {
          return prev.map((msg, index) => (index === prev.length - 1 ? { ...msg, text: chatCompletionText } : msg))
        }
        return prev
      })
    }
  }, [chatCompletionText, isLoadingChat])

  // Effect for auto-scrolling chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputPrompt.trim()) {
      toast.warning("Please enter a message.")
      return
    }

    const userMessageId = Date.now().toString()
    const aiMessageId = (Date.now() + 1).toString()
    const currentInput = inputPrompt

    messageContextRef.current = { aiMessageId, originalUserPrompt: currentInput }

    setMessages((prev) => [
      ...prev,
      { id: userMessageId, sender: "user", text: currentInput },
      { id: aiMessageId, sender: "ai", text: "Thinking...", isStreaming: true },
    ])
    setInputPrompt("")
    setGeneratedComponent("") // Clear previous component when new request is made

    await completeChat(currentInput)
  }

  const handleCopyCode = () => {
    if (generatedComponent) {
      navigator.clipboard.writeText(generatedComponent)
      toast.success("Code copied to clipboard!")
    }
  }

  const handleExampleClick = (exampleText: string) => {
    setInputPrompt(exampleText)
  }

  const isGenerating = isLoadingChat || isLoadingComponent

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-[#0d1117]">
      <Toaster richColors position="top-center" />
      {/* Main Content - Two Columns */}
      <div className="flex flex-col lg:flex-row h-[100vh]">
        {/* Left Column: Chat Interface */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-[#161b22] flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-[#f6f6f6] dark:bg-[#21262d] rounded-lg">
                <Sparkles className="h-4 w-4 text-[#666666] dark:text-[#8b949e]" />
              </div>
              <div>
                <h2 className="text-[#0f1419] dark:text-[#f0f6fc] font-[600] text-base">
                  AI Chat for {chatName} (ID: {chatId})
                </h2>
                <p className="text-[#666666] dark:text-[#8b949e] text-sm font-[450]">
                  Describe the component you want to build or paste data.
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-[#666666] dark:text-[#8b949e]">
                <Sparkles className="h-8 w-8 mb-2" />
                <p>Start by typing a message or choosing an example below.</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                    msg.sender === "user"
                      ? "bg-white border border-gray-200 dark:border-[#30363d] text-[#0f1419] dark:text-[#f0f6fc]"
                      : "bg-gray-100 dark:bg-[#21262d] text-[#0f1419] dark:text-[#f0f6fc]"
                  }`}
                >
                  {msg.text}
                  {msg.isStreaming && <span className="ml-2 animate-pulse">...</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input and Examples */}
          <div className="p-6 bg-white dark:bg-[#161b22]">
            <div className="space-y-4 mb-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs shadow-none font-[500] hover:border-[rgba(0,153,255,0.25)] dark:hover:border-[#58a6ff] text-[#0f1419] dark:text-[#f0f6fc] bg-[#8888881A]"
                  onClick={() => handleExampleClick(exampleData.fitness)}
                >
                  🏃 Fitness Tracking
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs shadow-none font-[500] hover:border-[rgba(0,153,255,0.25)] dark:hover:border-[#58a6ff] text-[#0f1419] dark:text-[#f0f6fc] bg-[#8888881A]"
                  onClick={() => handleExampleClick(exampleData.library)}
                >
                  📚 Library Collection
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs shadow-none font-[500] hover:border-[rgba(0,153,255,0.25)] dark:hover:border-[#58a6ff] text-[#0f1419] dark:text-[#f0f6fc] bg-[#8888881A]"
                  onClick={() => handleExampleClick(exampleData.orders)}
                >
                  🍕 Restaurant Orders
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs shadow-none font-[500] hover:border-[rgba(0,153,255,0.25)] dark:hover:border-[#58a6ff] text-[#0f1419] dark:text-[#f0f6fc] bg-[#8888881A]"
                  onClick={() => handleExampleClick(exampleData.weather)}
                >
                  🌡️ Weather Monitoring
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs shadow-none font-[500] hover:border-[rgba(0,153,255,0.25)] dark:hover:border-[#58a6ff] text-[#0f1419] dark:text-[#f0f6fc] bg-[#8888881A]"
                  onClick={() => handleExampleClick(exampleData.employees)}
                >
                  💼 Employee Directory
                </Button>
              </div>
            </div>
            <div className="relative">
              <Textarea
                className="min-h-[60px] font-mono text-xs border-[#e6e6e6] dark:border-[#30363d] focus:border-[#0969da] dark:focus:border-[#58a6ff] focus:ring-1 focus:ring-[#0969da] dark:focus:ring-[#58a6ff] resize-none bg-[#fafafa] dark:bg-[#0d1117] text-[#0f1419] dark:text-[#f0f6fc] pr-12"
                placeholder="Describe the component you want to build, or paste structured data (CSV, JSON, etc.)."
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isGenerating || !inputPrompt.trim()}
                size="icon"
                className="absolute bottom-2 right-2 h-8 w-8 bg-[#0969da] dark:bg-[#58a6ff] hover:bg-[#0860ca] dark:hover:bg-[#4493f8] text-white rounded-[8px] border-0 disabled:bg-[#e6e6e6] dark:disabled:bg-[#30363d] disabled:text-[#8c9196] dark:disabled:text-[#6e7681]"
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

        {/* Right Column: Generated Component Preview/Code */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-[#161b22] overflow-hidden flex flex-col">
          {generatedComponent ? (
            <div className="border border-[#e6e6e6] dark:border-[#30363d] rounded-[12px] m-4 flex-1 flex flex-col">
              <div className="p-4 border-b border-[#e6e6e6] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#22c55e] dark:bg-[#3fb950] rounded-full" />
                  <span className="text-sm font-[500] text-[#0f1419] dark:text-[#f0f6fc]">Generated Component</span>
                </div>
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "preview" | "code")}>
                  <TabsList className="grid w-full grid-cols-2 h-8">
                    <TabsTrigger value="preview" className="text-xs font-[450]">
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="code" className="text-xs font-[450]">
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="code" className="text-xs font-[450]" onClick={handleCopyCode}>
                      <Copy className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Tabs value={viewMode} className="flex-1 flex flex-col">
                <TabsContent value="preview" className="flex-1 overflow-auto">
                  <DynamicComponent componentCode={generatedComponent} />
                </TabsContent>
                <TabsContent value="code" className="flex-1 overflow-auto">
                  <div className="relative p-4">
                    <pre className="text-sm bg-[#fafafa] dark:bg-[#0d1117] text-[#0f1419] dark:text-[#f0f6fc] rounded-md p-4 overflow-auto">
                      <code>{generatedComponent}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-[#666666] dark:text-[#8b949e]">
              <Sparkles className="h-8 w-8 mb-2" />
              <p>Your generated component will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}