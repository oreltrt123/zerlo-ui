"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useCompletion } from "ai/react"
import { useParams } from "next/navigation"
import { createClient } from "@/supabase/client"
import { Toaster, toast } from "sonner"
import type { User } from "@supabase/supabase-js"
import { ChatNavbar } from "@/components/chat/chat-navbar"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatInput } from "@/components/chat/chat-input"
import { ComponentPreview } from "@/components/chat/component-preview"

interface Message {
  id: string
  sender: "user" | "ai"
  content: string
  component_code?: string
  isStreaming?: boolean
}

interface Chat {
  id: string
  name: string
  user_id: string
}

export default function ChatIdPage() {
  const params = useParams()
  const chatId = params.id as string
  const [user, setUser] = useState<User | null>(null)
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputPrompt, setInputPrompt] = useState<string>("")
  const [generatedComponent, setGeneratedComponent] = useState<string>("")
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview")
  const [loading, setLoading] = useState(true)

  // Refs for layout and resizing
  const chatPanelRef = useRef<HTMLDivElement>(null)
  const chatMessagesRef = useRef<HTMLDivElement>(null) // Ref for the scrollable messages container
  const [chatMessagesPanelHeight, setChatMessagesPanelHeight] = useState(0)

  // Resizing state and handlers
  const isResizing = useRef(false)
  const startY = useRef(0)
  const startHeight = useRef(0)

  const NAVBAR_HEIGHT = 64 // px, approximate height of ChatNavbar
  const CHAT_INPUT_HEIGHT = 150 // px, approximate height of ChatInput
  const DIVIDER_HEIGHT = 4 // px, height of the resizer div

  // Moved handleMouseMove and handleMouseUp definitions before handleMouseDown
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return
    const deltaY = e.clientY - startY.current
    let newHeight = startHeight.current + deltaY
    if (chatPanelRef.current) {
      const totalAvailableHeight =
        chatPanelRef.current.offsetHeight - NAVBAR_HEIGHT - CHAT_INPUT_HEIGHT - DIVIDER_HEIGHT
      const minHeight = 100 // Minimum height for messages
      const maxHeight = totalAvailableHeight - 50 // Ensure input area has at least 50px
      newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight))
    }
    setChatMessagesPanelHeight(newHeight)
  }, [])

  const handleMouseUp = useCallback(() => {
    isResizing.current = false
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }, [handleMouseMove]) // Added handleMouseMove to dependencies

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isResizing.current = true
      startY.current = e.clientY
      if (chatMessagesRef.current) {
        startHeight.current = chatMessagesRef.current.offsetHeight
      }
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "ns-resize"
      document.body.style.userSelect = "none"
    },
    [handleMouseMove, handleMouseUp],
  ) // Added handleMouseMove and handleMouseUp to dependencies

  const supabase = createClient()

  // Hook for generating the actual component code
  const { complete: completeComponent, isLoading: isLoadingComponent } = useCompletion({
    api: "/api/generate",
    onFinish: async (prompt, completion) => {
      console.log("Component generation finished:", completion)
      setGeneratedComponent(completion)
      toast.success("Component generated successfully!")
      setViewMode("preview")
      // Save the component code to the last AI message
      if (messageContextRef.current) {
        const { aiMessageId } = messageContextRef.current
        console.log("Saving component code to message:", aiMessageId)
        await saveMessageWithComponent(aiMessageId, completion)
        // Update the message in state immediately
        setMessages((prev) =>
          prev.map((msg) => (msg.id === aiMessageId ? { ...msg, component_code: completion } : msg)),
        )
      }
    },
    onError: (err) => {
      console.error("Component generation error:", err)
      toast.error("Error generating component.", { description: err.message })
      setMessages((prev) =>
        prev.map((msg) => (msg.isStreaming ? { ...msg, content: `Error: ${err.message}`, isStreaming: false } : msg)),
      )
    },
  })

  // Hook for generating the AI's chat response
  const messageContextRef = useRef<{ aiMessageId: string; originalUserPrompt: string } | null>(null)
  const {
    completion: chatCompletionText,
    isLoading: isLoadingChat,
    complete: completeChat,
  } = useCompletion({
    api: "/api/chat-response",
    onFinish: async (prompt, completion) => {
      console.log("Chat response finished:", completion)
      if (messageContextRef.current) {
        const { aiMessageId, originalUserPrompt } = messageContextRef.current
        try {
          // Save AI message and get the real ID
          const realAiMessageId = await saveMessage("ai", completion)
          console.log("AI message saved with ID:", realAiMessageId)
          // Update the AI message in state with real ID and remove streaming
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId && msg.isStreaming
                ? { ...msg, id: realAiMessageId, content: completion, isStreaming: false }
                : msg,
            ),
          )
          // Update context with real ID for component saving
          messageContextRef.current = { aiMessageId: realAiMessageId, originalUserPrompt }
          // Generate component
          completeComponent(originalUserPrompt)
        } catch (error) {
          console.error("Error saving AI message:", error)
          toast.error("Error saving AI response")
        }
      }
    },
    onError: (err) => {
      console.error("Chat response error:", err)
      toast.error("Error getting AI response.", { description: err.message })
      setMessages((prev) =>
        prev.map((msg) => (msg.isStreaming ? { ...msg, content: `Error: ${err.message}`, isStreaming: false } : msg)),
      )
    },
  })

  // Load messages from database
  const loadMessages = useCallback(async () => {
    try {
      console.log("Loading messages for chat:", chatId)
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true })
      if (error) {
        console.error("Error loading messages:", error)
        throw error
      }
      console.log("Loaded messages from database:", data)
      const loadedMessages: Message[] = data.map((msg) => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        component_code: msg.component_code,
      }))
      console.log("Processed messages:", loadedMessages)
      console.log(
        "Messages with component_code:",
        loadedMessages.filter((msg) => msg.component_code),
      )
      setMessages(loadedMessages)
      // Set the latest component code if available
      const messagesWithComponents = data.filter((msg) => msg.component_code)
      console.log("Messages with components:", messagesWithComponents)
      if (messagesWithComponents.length > 0) {
        const lastMessageWithComponent = messagesWithComponents[messagesWithComponents.length - 1]
        console.log("Setting latest component:", lastMessageWithComponent.component_code)
        setGeneratedComponent(lastMessageWithComponent.component_code)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
      toast.error("Error loading messages")
    }
  }, [chatId, supabase])

  // Initialize chat
  const initializeChat = useCallback(async () => {
    try {
      // Get user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
      // Get chat details
      const { data: chatData, error: chatError } = await supabase.from("chats").select("*").eq("id", chatId).single()
      if (chatError) throw chatError
      setChat(chatData)
      // Load messages
      await loadMessages()
    } catch (error) {
      console.error("Error initializing chat:", error)
      toast.error("Error loading chat")
    } finally {
      setLoading(false)
    }
  }, [chatId, supabase, loadMessages])

  const saveMessage = async (sender: "user" | "ai", content: string) => {
    try {
      console.log("Saving message:", { sender, content: content.substring(0, 100) + "..." })
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            chat_id: chatId,
            sender,
            content,
          },
        ])
        .select()
        .single()
      if (error) {
        console.error("Error inserting message:", error)
        throw error
      }
      console.log("Message saved with ID:", data.id)
      // Update chat's updated_at timestamp
      await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", chatId)
      return data.id // Return the generated ID
    } catch (error) {
      console.error("Error saving message:", error)
      throw error
    }
  }

  const saveMessageWithComponent = async (messageId: string, componentCode: string) => {
    try {
      console.log("Updating message with component code:", { messageId, codeLength: componentCode.length })
      const { data, error } = await supabase
        .from("messages")
        .update({ component_code: componentCode })
        .eq("id", messageId)
        .select()
      if (error) {
        console.error("Error updating message with component:", error)
        throw error
      }
      console.log("Message updated successfully:", data)
    } catch (error) {
      console.error("Error saving component code:", error)
      throw error
    }
  }

  const handleSendMessage = async () => {
    if (!inputPrompt.trim()) {
      toast.warning("Please enter a message.")
      return
    }
    const tempUserMessageId = `temp-user-${Date.now()}`
    const tempAiMessageId = `temp-ai-${Date.now() + 1}`
    const currentInput = inputPrompt
    const userMessage: Message = { id: tempUserMessageId, sender: "user", content: currentInput }
    const aiMessage: Message = { id: tempAiMessageId, sender: "ai", content: "Thinking...", isStreaming: true }
    setMessages((prev) => [...prev, userMessage, aiMessage])
    setInputPrompt("")
    setGeneratedComponent("")
    try {
      // Save user message and get the real ID
      const userMessageId = await saveMessage("user", currentInput)
      // Update the message in state with the real ID
      setMessages((prev) => prev.map((msg) => (msg.id === tempUserMessageId ? { ...msg, id: userMessageId } : msg)))
      // Store context for AI message
      messageContextRef.current = { aiMessageId: tempAiMessageId, originalUserPrompt: currentInput }
      // Generate AI response
      await completeChat(currentInput)
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
      toast.error("Error sending message")
    }
  }

  const handleCopyCode = () => {
    if (generatedComponent) {
      navigator.clipboard.writeText(generatedComponent)
      toast.success("Code copied to clipboard!")
    }
  }

  const isGenerating = isLoadingChat || isLoadingComponent

  useEffect(() => {
    initializeChat()
  }, [initializeChat])

  useEffect(() => {
    if (isLoadingChat && chatCompletionText) {
      setMessages((prev) => {
        const lastAiMessage = prev[prev.length - 1]
        if (lastAiMessage && lastAiMessage.sender === "ai" && lastAiMessage.isStreaming) {
          return prev.map((msg, index) => (index === prev.length - 1 ? { ...msg, content: chatCompletionText } : msg))
        }
        return prev
      })
    }
  }, [chatCompletionText, isLoadingChat])

  // Scroll to bottom of messages
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [messages, chatMessagesPanelHeight]) // Also scroll if panel height changes

  // Initialize chatMessagesPanelHeight on mount and when chatPanelRef is available
  useEffect(() => {
    const calculateInitialHeight = () => {
      if (chatPanelRef.current) {
        const initialMessagesHeight =
          chatPanelRef.current.offsetHeight - NAVBAR_HEIGHT - CHAT_INPUT_HEIGHT - DIVIDER_HEIGHT
        setChatMessagesPanelHeight(initialMessagesHeight)
      }
    }
    // Use a small timeout to ensure all elements are rendered and measured
    const timeoutId = setTimeout(calculateInitialHeight, 100)
    // Recalculate on window resize
    window.addEventListener("resize", calculateInitialHeight)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", calculateInitialHeight)
    }
  }, [loading]) // Depend on loading to ensure initial calculation after data fetch

  // Debug effect to log messages changes
  useEffect(() => {
    console.log("Messages state updated:", messages)
    console.log(
      "Messages with component_code:",
      messages.filter((msg) => msg.component_code),
    )
  }, [messages])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user || !chat) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Chat not found or access denied</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Toaster richColors position="top-center" />
      {/* Left Column: Chat Interface */}
      <div
        ref={chatPanelRef}
        className="w-1/2 flex flex-col border-r border-[#e6e6e6] dark:border-[#30363d] bg-white dark:bg-[#161b22]"
      >
        <ChatNavbar chatName={chat.name} messages={messages} />
        {/* Resizable Chat Messages Area */}
        <div
          ref={chatMessagesRef}
          style={{ height: `${chatMessagesPanelHeight}px` }}
          className="relative overflow-y-auto flex flex-col gap-4 p-6"
        >
          <ChatMessages messages={messages} />
        </div>
        {/* Resizer */}
        <div
          onMouseDown={handleMouseDown}
          className="h-1 bg-gray-200 dark:bg-gray-700 cursor-ns-resize flex items-center justify-center"
        >
          <div className="w-8 h-0.5 bg-gray-400 dark:bg-gray-500 rounded-full" />
        </div>
        {/* Chat Input */}
        <ChatInput
          inputPrompt={inputPrompt}
          setInputPrompt={setInputPrompt}
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
        />
      </div>
      {/* Right Column: Generated Component Preview/Code */}
      <div className="w-1/2 flex flex-col bg-white dark:bg-[#161b22] overflow-hidden">
        <ComponentPreview
          generatedComponent={generatedComponent}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onCopyCode={handleCopyCode}
        />
      </div>
    </div>
  )
}
