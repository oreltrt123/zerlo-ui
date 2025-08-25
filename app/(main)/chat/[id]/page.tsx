"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useCompletion } from "ai/react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import { Toaster, toast } from "sonner"
import type { User } from "@supabase/supabase-js"
import { ChatNavbar } from "@/components/chat/chat-navbar"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatInput } from "@/components/chat/chat-input"
import { ComponentPreview } from "@/components/chat/component-preview"
import { handleRestoreComponent } from "@/components/chat/chat-messages"

interface Message {
  id: string
  sender: "user" | "ai"
  content: string
  component_code?: string
  component_title?: string
  isStreaming?: boolean
  isGeneratingComponent?: boolean
}

interface Chat {
  id: string
  name: string
  user_id: string
}

export default function ChatIdPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputPrompt, setInputPrompt] = useState<string>("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("html")
  const [generatedComponent, setGeneratedComponent] = useState<string>("")
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview")
  const [loading, setLoading] = useState(true)
  const [isComponentVisible, setIsComponentVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Refs for layout and resizing
  const chatPanelRef = useRef<HTMLDivElement>(null)
  const chatMessagesRef = useRef<HTMLDivElement>(null)
  const [chatMessagesPanelHeight, setChatMessagesPanelHeight] = useState(0)

  // Resizing state and handlers
  const isResizing = useRef(false)
  const startY = useRef(0)
  const startHeight = useRef(0)

  const NAVBAR_HEIGHT = 64
  const CHAT_INPUT_HEIGHT = 150
  const DIVIDER_HEIGHT = 4

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return
    const deltaY = e.clientY - startY.current
    let newHeight = startHeight.current + deltaY
    if (chatPanelRef.current) {
      const totalAvailableHeight =
        chatPanelRef.current.offsetHeight - NAVBAR_HEIGHT - CHAT_INPUT_HEIGHT - DIVIDER_HEIGHT
      const minHeight = 100
      const maxHeight = totalAvailableHeight - 50
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
  }, [handleMouseMove])

  const supabase = createClient()

  const handleCloseComponent = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsComponentVisible(false)
      setGeneratedComponent("")
      setIsAnimating(false)
    }, 300)
  }, [])

  const messageContextRef = useRef<{
    aiMessageId: string
    originalUserPrompt: string
    chatHistory: Message[]
  } | null>(null)

  // Hook for generating the actual component code
  const { complete: completeComponent, isLoading: isLoadingComponent } = useCompletion({
    api: "/api/generate",
    body: {
      language: selectedLanguage,
      chatHistory: messages.slice(-10), // Last 10 messages for context
    },
    onFinish: async (prompt, completion) => {
      console.log("Component generation finished:", completion)
      setGeneratedComponent(completion)
      setIsAnimating(true)
      setTimeout(() => {
        setIsComponentVisible(true)
        setIsAnimating(false)
      }, 100)
      toast.success("Component generated successfully!")
      setViewMode("preview")
      if (messageContextRef.current) {
        const { aiMessageId } = messageContextRef.current
        const componentTitle = generateComponentTitle(messageContextRef.current.originalUserPrompt)
        await saveMessageWithComponent(aiMessageId, completion, componentTitle)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  component_code: completion,
                  component_title: componentTitle,
                  isGeneratingComponent: false,
                }
              : msg,
          ),
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

  // Handle component generation start
  useEffect(() => {
    if (isLoadingComponent && messageContextRef.current) {
      const { aiMessageId } = messageContextRef.current
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, isGeneratingComponent: true, component_title: "Generating component..." }
            : msg,
        ),
      )
    }
  }, [isLoadingComponent])

  // Hook for generating the AI's chat response
  const {
    completion: chatCompletionText,
    isLoading: isLoadingChat,
    complete: completeChat,
  } = useCompletion({
    api: "/api/chat-response",
    body: {
      language: selectedLanguage,
      chatHistory: messages.slice(-10),
    },
    onFinish: async (prompt, completion) => {
      console.log("Chat response finished:", completion)
      if (messageContextRef.current) {
        const { aiMessageId, originalUserPrompt, chatHistory } = messageContextRef.current
        try {
          const realAiMessageId = await saveMessage("ai", completion)
          console.log("AI message saved with ID:", realAiMessageId)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId && msg.isStreaming
                ? { ...msg, id: realAiMessageId, content: completion, isStreaming: false }
                : msg,
            ),
          )
          messageContextRef.current = { aiMessageId: realAiMessageId, originalUserPrompt, chatHistory }
          if (!isDiscussMode.current) {
            completeComponent(originalUserPrompt)
          }
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

  const { complete: completeDiscuss, isLoading: isLoadingDiscuss } = useCompletion({
    api: "/api/discuss",
    body: {
      chatHistory: messages.slice(-10),
    },
    onFinish: async (prompt, completion) => {
      console.log("Discuss response finished:", completion)
      if (messageContextRef.current) {
        const { aiMessageId } = messageContextRef.current
        try {
          const realAiMessageId = await saveMessage("ai", completion)
          console.log("AI discuss message saved with ID:", realAiMessageId)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId && msg.isStreaming
                ? { ...msg, id: realAiMessageId, content: completion, isStreaming: false }
                : msg,
            ),
          )
        } catch (error) {
          console.error("Error saving AI discuss message:", error)
          toast.error("Error saving AI response")
        }
      }
    },
    onError: (err) => {
      console.error("Discuss response error:", err)
      toast.error("Error getting AI response.", { description: err.message })
      setMessages((prev) =>
        prev.map((msg) => (msg.isStreaming ? { ...msg, content: `Error: ${err.message}`, isStreaming: false } : msg)),
      )
    },
  })

  // Hook for handling web search responses
  const { complete: completeSearch, isLoading: isLoadingSearch } = useCompletion({
    api: "/api/search",
    body: {
      chatHistory: messages.slice(-10),
    },
    onFinish: async (prompt, completion) => {
      console.log("Search response finished:", completion)
      if (messageContextRef.current) {
        const { aiMessageId } = messageContextRef.current
        try {
          const realAiMessageId = await saveMessage("ai", completion)
          console.log("AI search message saved with ID:", realAiMessageId)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId && msg.isStreaming
                ? { ...msg, id: realAiMessageId, content: completion, isStreaming: false }
                : msg,
            ),
          )
        } catch (error) {
          console.error("Error saving AI search message:", error)
          toast.error("Error saving AI response")
        }
      }
    },
    onError: (err) => {
      console.error("Search response error:", err)
      toast.error("Error getting search response.", { description: err.message })
      setMessages((prev) =>
        prev.map((msg) => (msg.isStreaming ? { ...msg, content: `Error: ${err.message}`, isStreaming: false } : msg)),
      )
    },
  })

  const isDiscussMode = useRef(false)

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
        component_title: msg.component_title,
      }))
      console.log("Processed messages:", loadedMessages)
      setMessages(loadedMessages)

      const messagesWithComponents = data.filter((msg) => msg.component_code)
      console.log("Messages with components:", messagesWithComponents)
      if (messagesWithComponents.length > 0) {
        const lastMessageWithComponent = messagesWithComponents[messagesWithComponents.length - 1]
        console.log("Setting latest component:", lastMessageWithComponent.component_code)
        setGeneratedComponent(lastMessageWithComponent.component_code)
        setIsComponentVisible(true)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
      toast.error("Error loading messages")
    }
  }, [chatId, supabase])

  // Initialize chat
  const initializeChat = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)

      const { data: chatData, error: chatError } = await supabase.from("chats").select("*").eq("id", chatId).single()
      if (chatError) throw chatError
      setChat(chatData)

      await loadMessages()
    } catch (error) {
      console.error("Error initializing chat:", error)
      toast.error("Error loading chat")
    } finally {
      setLoading(false)
    }
  }, [chatId, supabase, loadMessages, router])

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
      await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", chatId)
      return data.id
    } catch (error) {
      console.error("Error saving message:", error)
      throw error
    }
  }

  const saveMessageWithComponent = async (messageId: string, componentCode: string, componentTitle?: string) => {
    try {
      console.log("Updating message with component code:", { messageId, codeLength: componentCode.length })
      const { data, error } = await supabase
        .from("messages")
        .update({
          component_code: componentCode,
          component_title: componentTitle || "Generated Component",
        })
        .eq("id", messageId)
        .select()

      if (error) {
        console.error("Error updating message with component:", error)
        if (error.code === "PGRST204" && error.message?.includes("component_title")) {
          console.warn("component_title column not found - please run the database migration script")
          toast.error("Database needs to be updated. Please run the migration script.")
          return
        }
        throw error
      }
      console.log("Message updated successfully:", data)
    } catch (error) {
      console.error("Error saving component code:", error)
      throw error
    }
  }

  const handleSendMessage = async (
    model: string,
    language: string,
    discussMode?: boolean,
    files?: File[],
    searchMode?: boolean,
  ) => {
    if (!inputPrompt.trim()) {
      toast.warning("Please enter a message.")
      return
    }

    setSelectedLanguage(language)
    isDiscussMode.current = discussMode || false

    const tempUserMessageId = `temp-user-${Date.now()}`
    const tempAiMessageId = `temp-ai-${Date.now() + 1}`
    const currentInput = inputPrompt

    let userMessageContent = currentInput
    if (files && files.length > 0) {
      const fileNames = files.map((f) => f.name).join(", ")
      userMessageContent += `\n\n[Uploaded files: ${fileNames}]`
    }
    if (searchMode) {
      userMessageContent += `\n\n[Web search enabled]`
    }

    const userMessage: Message = { id: tempUserMessageId, sender: "user", content: userMessageContent }
    const aiMessage: Message = {
      id: tempAiMessageId,
      sender: "ai",
      content: searchMode ? "Searching the web..." : "Thinking...",
      isStreaming: true,
    }
    setMessages((prev) => [...prev, userMessage, aiMessage])
    setInputPrompt("")

    try {
      const userMessageId = await saveMessage("user", userMessageContent)
      setMessages((prev) => prev.map((msg) => (msg.id === tempUserMessageId ? { ...msg, id: userMessageId } : msg)))

      const currentChatHistory = [...messages, userMessage]
      messageContextRef.current = {
        aiMessageId: tempAiMessageId,
        originalUserPrompt: currentInput,
        chatHistory: currentChatHistory,
      }

      if (searchMode) {
        let promptWithSearch = currentInput
        if (files && files.length > 0) {
          promptWithSearch = await processFilesForDiscuss(files, currentInput)
        }
        try {
          await completeSearch(promptWithSearch)
        } catch (searchError) {
          console.error("Search completion error:", searchError)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAiMessageId
                ? {
                    ...msg,
                    content: "Sorry, I encountered an error while searching. Let me help you without web search.",
                    isStreaming: false,
                  }
                : msg,
            ),
          )
        }
      } else if (discussMode) {
        let promptWithFiles = currentInput
        if (files && files.length > 0) {
          promptWithFiles = await processFilesForDiscuss(files, currentInput)
        }
        await completeDiscuss(promptWithFiles)
      } else {
        await completeChat(currentInput)
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
      toast.error("Error sending message")
      setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessageId && msg.id !== tempAiMessageId))
    }
  }

  const generateComponentTitle = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase()
    if (lowerPrompt.includes("game")) return "3D Game Component"
    if (lowerPrompt.includes("player")) return "Player System"
    if (lowerPrompt.includes("weapon")) return "Weapon System"
    if (lowerPrompt.includes("match") || lowerPrompt.includes("history")) return "Match History"
    if (lowerPrompt.includes("arena") || lowerPrompt.includes("map")) return "Arena System"
    if (lowerPrompt.includes("dashboard")) return "Dashboard Component"
    if (lowerPrompt.includes("form")) return "Form Component"
    if (lowerPrompt.includes("chart") || lowerPrompt.includes("graph")) return "Chart Component"
    return "Generated Component"
  }

  const processFilesForDiscuss = async (files: File[], userPrompt: string): Promise<string> => {
    let processedPrompt = userPrompt

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        processedPrompt += `\n\nI've uploaded an image: ${file.name}. Please describe what you see in this image.`
      } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        processedPrompt += `\n\nI've uploaded a PDF file: ${file.name}. Please summarize the content of this document.`
      } else if (
        file.type.startsWith("text/") ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".doc") ||
        file.name.endsWith(".docx")
      ) {
        processedPrompt += `\n\nI've uploaded a document: ${file.name}. Please analyze and summarize the content.`
      }
    }

    return processedPrompt
  }

  const isGenerating = isLoadingChat || isLoadingComponent || isLoadingDiscuss || isLoadingSearch

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

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [messages, chatMessagesPanelHeight])

  useEffect(() => {
    const calculateInitialHeight = () => {
      if (chatPanelRef.current) {
        const initialMessagesHeight =
          chatPanelRef.current.offsetHeight - NAVBAR_HEIGHT - CHAT_INPUT_HEIGHT - DIVIDER_HEIGHT
        setChatMessagesPanelHeight(initialMessagesHeight)
      }
    }
    const timeoutId = setTimeout(calculateInitialHeight, 100)
    window.addEventListener("resize", calculateInitialHeight)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", calculateInitialHeight)
    }
  }, [loading])

  useEffect(() => {
    console.log("Messages state updated:", messages)
    console.log(
      "Messages with component_code:",
      messages.filter((msg) => msg.component_code),
    )
  }, [messages])

  useEffect(() => {
    initializeChat()
  }, [initializeChat])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !chat) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-slate-600">Chat not found or access denied</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Toaster richColors position="top-center" />

      <div
        className={`flex transition-all duration-300 ease-in-out ${
          isComponentVisible && !isAnimating ? "w-1/2" : "w-full justify-center"
        }`}
      >
        {/* Chat Interface */}
        <div
          ref={chatPanelRef}
          className={`flex flex-col bg-background transition-all duration-300 ease-in-out ${
            isComponentVisible && !isAnimating ? "w-full" : "w-full max-w-4xl"
          }`}
        >
          <ChatNavbar
            chatName={chat.name}
            messages={messages}
            user={user}
            showLogin={() => router.push("/login")}
            signOut={async () => {
              await supabase.auth.signOut()
              router.push("/login")
            }}
            onSocialClick={(target: "github" | "x" | "discord") => {
              const urls = {
                github: "https://github.com/oreltrt123",
                discord: "https://discord.com/invite/zerlo",
                x: "https://x.com/zerlo_online",
              }
              window.open(urls[target], "_blank")
            }}
          />

          {/* Resizable Chat Messages Area */}
          <div
            ref={chatMessagesRef}
            style={{ height: `${chatMessagesPanelHeight}px` }}
            className="relative overflow-y-auto flex flex-col gap-4 px-4 py-6"
          >
            <div className="max-w-2xl mx-auto w-full">
              <ChatMessages messages={messages} onRestoreComponent={handleRestoreComponent} />
            </div>
          </div>

          <div className="px-4 py-6 bg-background">
            <div className="max-w-2xl mx-auto">
              <ChatInput
                inputPrompt={inputPrompt}
                setInputPrompt={setInputPrompt}
                onSendMessage={handleSendMessage}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </div>
      </div>

      {isComponentVisible && (
        <div
          className={`w-1/2 flex flex-col bg-background overflow-hidden transition-all duration-300 ease-in-out ${
            isAnimating ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
          }`}
        >
          <ComponentPreview
            generatedComponent={generatedComponent}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onCloseComponent={handleCloseComponent}
          />
        </div>
      )}
    </div>
  )
}
