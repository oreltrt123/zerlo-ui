"use client"

import { forwardRef } from "react"
import { Sparkles } from "lucide-react"

interface Message {
  id: string
  sender: "user" | "ai"
  content: string
  component_code?: string
  isStreaming?: boolean
}

interface ChatMessagesProps {
  messages: Message[]
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(({ messages }, ref) => {
  return (
    <div ref={ref} className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
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
            {msg.content}
            {msg.isStreaming && <span className="ml-2 animate-pulse">...</span>}
          </div>
        </div>
      ))}
    </div>
  )
})

ChatMessages.displayName = "ChatMessages"
