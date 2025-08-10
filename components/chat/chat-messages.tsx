"use client";
import { Sparkles } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  component_code?: string;
  isStreaming?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
}

// No changes needed here per your instructions
export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  return (
    <div className="flex flex-col gap-4">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center text-[#666666] dark:text-[#8b949e]">
          <Sparkles className="h-8 w-8 mb-2" />
          <p>Start by typing a message or choosing an example below.</p>
        </div>
      )}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-lg ${
              msg.sender === "user"
                ? "bg-[#E9E9E980] text-[#0d0d0ddc]"
                : "bg-white text-[#0d0d0db6]"
            }`}
          >
            {msg.content}
            {msg.isStreaming && <span className="ml-2 animate-pulse">...</span>}
          </div>
        </div>
      ))}
    </div>
  );
};
