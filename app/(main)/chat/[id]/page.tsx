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
  const router = useRouter()
  const chatId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputPrompt, setInputPrompt] = useState<string>("")
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

  // Hook for generating the actual component code
  const { complete: completeComponent, isLoading: isLoadingComponent } = useCompletion({
    api: "/api/generate",
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
        console.log("Saving component code to message:", aiMessageId)
        await saveMessageWithComponent(aiMessageId, completion)
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
          const realAiMessageId = await saveMessage("ai", completion)
          console.log("AI message saved with ID:", realAiMessageId)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId && msg.isStreaming
                ? { ...msg, id: realAiMessageId, content: completion, isStreaming: false }
                : msg,
            ),
          )
          messageContextRef.current = { aiMessageId: realAiMessageId, originalUserPrompt }
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

  const checkMessageLimit = async () => {
    if (!user) return false

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    if (profile.plan === "premium") return true

    const now = new Date()
    const lastReset = new Date(profile.last_message_reset)
    const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60)

    if (hoursSinceReset >= 24) {
      await supabase
        .from("profiles")
        .update({ message_count: 0, last_message_reset: now.toISOString() })
        .eq("id", user.id)
      return true
    }

    if (profile.message_count >= 10) {
      toast.error("Daily message limit reached. Upgrade to premium for unlimited.")
      return false
    }

    await supabase
      .from("profiles")
      .update({ message_count: profile.message_count + 1 })
      .eq("id", user.id)
    return true
  }

  const handleSendMessage = async () => {
    if (!inputPrompt.trim()) {
      toast.warning("Please enter a message.")
      return
    }
    if (!(await checkMessageLimit())) return
    const tempUserMessageId = `temp-user-${Date.now()}`
    const tempAiMessageId = `temp-ai-${Date.now() + 1}`
    const currentInput = inputPrompt
    const userMessage: Message = { id: tempUserMessageId, sender: "user", content: currentInput }
    const aiMessage: Message = { id: tempAiMessageId, sender: "ai", content: "Thinking...", isStreaming: true }
    setMessages((prev) => [...prev, userMessage, aiMessage])
    setInputPrompt("")
    try {
      const userMessageId = await saveMessage("user", currentInput)
      setMessages((prev) => prev.map((msg) => (msg.id === tempUserMessageId ? { ...msg, id: userMessageId } : msg)))
      messageContextRef.current = { aiMessageId: tempAiMessageId, originalUserPrompt: currentInput }
      await completeChat(currentInput)
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
      toast.error("Error sending message")
    }
  }

  // const handleCopyCode = () => {
  //   if (generatedComponent) {
  //     navigator.clipboard.writeText(generatedComponent)
  //     toast.success("Code copied to clipboard!")
  //   }
  // }

  const handleRestoreComponent = (componentCode: string) => {
    setGeneratedComponent(componentCode)
    setIsComponentVisible(true)
    setViewMode("preview")
    toast.success("Component restored!")
  }


  const isGenerating = isLoadingChat || isLoadingComponent

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