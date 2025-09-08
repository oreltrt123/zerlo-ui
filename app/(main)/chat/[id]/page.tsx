// chat/[id]/page.tsx
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import { Toaster, toast } from "sonner"
import type { User } from "@supabase/supabase-js"
import { ChatNavbar } from "@/components/chat/chat-navbar"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatInput } from "@/components/chat/chat-input"
import { ComponentPreview } from "@/components/chat/component-preview"
import { PasswordPromptModal } from "@/components/chat/password-prompt-modal"
import { handleRestoreComponent } from "@/components/chat/chat-messages"
import type { SketchfabModel } from "@/lib/sketchfab-api"
import * as React from "react"
import { useCompletion } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import "@/styles/button.css"
import "@/styles/loader3D.css"

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

interface DeployModalProps {
  isOpen: boolean
  onClose: () => void
  onOtherClose: () => void
  messages: Message[]
  buttonRef: React.RefObject<HTMLButtonElement | null>
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ChatIdPage({ params }: PageProps) {
  const resolvedParams = React.use(params)
  const chatId = resolvedParams.id
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputPrompt, setInputPrompt] = useState<string>("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("html")
  const [generatedComponent, setGeneratedComponent] = useState<string>("")
  const [viewMode, setViewMode] = useState<"preview" | "code" | "settings" | "assets">("preview")
  const [editMode, setEditMode] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [isComponentVisible, setIsComponentVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isChatHidden, setIsChatHidden] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [, setPasswordHash] = useState<string | null>(null)
  const deployButtonRef = useRef<HTMLButtonElement>(null)
  const chatPanelRef = useRef<HTMLDivElement>(null)
  const chatMessagesRef = useRef<HTMLDivElement>(null)
  const [chatMessagesPanelHeight, setChatMessagesPanelHeight] = useState(0)

  const isResizing = useRef(false)
  const startY = useRef(0)
  const startHeight = useRef(0)

  const NAVBAR_HEIGHT = 64
  const CHAT_INPUT_HEIGHT = 150
  const DIVIDER_HEIGHT = 4

  const supabase = createClient()

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

  const handleCloseComponent = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsComponentVisible(false)
      setGeneratedComponent("")
      setEditMode(false)
      setIsAnimating(false)
      setIsChatHidden(false)
    }, 300)
  }, [])

  const handleSettingsClick = useCallback(() => {
    setGeneratedComponent("")
    setViewMode("settings")
    if (!isComponentVisible) {
      setIsAnimating(true)
      setTimeout(() => {
        setIsComponentVisible(true)
        setIsAnimating(false)
      }, 100)
    }
  }, [isComponentVisible])

  const messageContextRef = useRef<{
    aiMessageId: string
    originalUserPrompt: string
    chatHistory: Message[]
  } | null>(null)

  const { complete: completeComponent, isLoading: isLoadingComponent } = useCompletion({
    api: "/api/generate",
    body: {
      language: selectedLanguage,
      chatHistory: messages.slice(-10),
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
      console.error("[v0] Component generation error:", err)
      toast.error("Error generating component.", { description: err.message })
      setMessages((prev) =>
        prev.map((msg) => (msg.isStreaming ? { ...msg, content: `Error: ${err.message}`, isStreaming: false } : msg)),
      )
    },
  })

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

  const {
    completion: chatCompletionText,
    isLoading: isLoadingChat,
    complete: completeChat,
  } = useCompletion({
    api: "/api/chat",
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
            completeComponent(originalUserPrompt, {
              body: {
                language: selectedLanguage,
                chatHistory: messages.slice(-10),
                selectedStyle: currentSelectedStyle.current,
                selectedGameType: currentSelectedGameType.current,
                slashCommand: currentSlashCommand.current,
              },
            })
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
  const currentSelectedStyle = useRef<string>("gaming")
  const currentSelectedGameType = useRef<string>("3d")
  const currentSlashCommand = useRef<string | null>(null)

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
      if (chatError) {
        console.error("Error fetching chat:", chatError)
        throw chatError
      }
      setChat(chatData)

      // Check security settings
      const { data: securityData, error: securityError } = await supabase
        .from("chat_security_beta")
        .select("*")
        .eq("chat_id", chatId)
        .single()

      if (securityError && securityError.code !== "PGRST116") {
        console.error("Error loading security data:", securityError)
        toast.error("Failed to load security settings")
        throw securityError
      }

      if (securityData && securityData.password_protected) {
        setIsPasswordProtected(true)
        setPasswordHash(securityData.password_hash)
        setIsPasswordModalOpen(true)
      } else {
        await loadMessages()
      }
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
        console.error("[v0] Error updating message with component:", error)
        if (error.code === "PGRST204" && error.message?.includes("component_title")) {
          console.warn("[v0] component_title column not found - please run the database migration script")
          toast.error("Database needs to be updated. Please run the migration script.")
          return
        }
        throw error
      }
      console.log("Message updated successfully:", data)
    } catch (error) {
      console.error("[v0] Error saving component code:", error)
      throw error
    }
  }

  const handleSendMessage = async (
    model: string,
    language: string,
    discussMode?: boolean,
    files?: File[],
    searchMode?: boolean,
    selectedStyle?: string,
    selectedGameType?: string,
    slashCommand?: string,
  ) => {
    if (!inputPrompt.trim()) {
      toast.warning("Please enter a message.")
      return
    }

    setSelectedLanguage(language)
    isDiscussMode.current = discussMode || false

    currentSelectedStyle.current = selectedStyle || "gaming"
    currentSelectedGameType.current = selectedGameType || "3d"
    currentSlashCommand.current = slashCommand || null

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
    if (selectedStyle && selectedGameType && !discussMode) {
      userMessageContent += `\n\n[Game Type: ${selectedGameType.toUpperCase()}, Button Style: ${selectedStyle}]`
    }
    if (slashCommand) {
      userMessageContent += `\n\n[Slash Command: ${slashCommand}]`
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
        await completeChat(currentInput, {
          body: {
            language: selectedLanguage,
            chatHistory: messages.slice(-10),
            selectedStyle: selectedStyle || "gaming",
            selectedGameType: selectedGameType || "3d",
            slashCommand: slashCommand || null,
          },
        })
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

  const handlePasswordSuccess = async () => {
    setIsPasswordModalOpen(false)
    await loadMessages()
  }

  const handlePasswordClose = () => {
    setIsPasswordModalOpen(false)
    router.push("/dashboard") // Redirect to dashboard or home if password entry is canceled
  }

  const handleAssetSelect = async (asset: SketchfabModel) => {
    const assetPrompt =
      asset.uid === "fix-error"
        ? `Fix the error in the current component: ${asset.description}`
        : `Add this 3D asset to my game: "${asset.name}" by ${asset.user.displayName}. UID: ${asset.uid} ${asset.description || "A professional 3D model from Sketchfab."} Please integrate it seamlessly into the current game with proper positioning, scaling, and interactions as a character that walks on the map.`

    setInputPrompt(assetPrompt)

    // Auto-send the message
    await handleSendMessage("gemini", "html", false, undefined, false, "gaming", "3d",)

    toast.success(`Integrating ${asset.name} into your game!`)
  }

  useEffect(() => {
    const handleSandboxError = (event: CustomEvent) => {
      console.error("[v0] Sandbox error detected:", event.detail)
      // Trigger error state in ComponentPreview
      window.dispatchEvent(
        new CustomEvent("componentError", {
          detail: event.detail,
        }),
      )
    }

    window.addEventListener("sandboxError", handleSandboxError as EventListener)
    return () => window.removeEventListener("sandboxError", handleSandboxError as EventListener)
  }, [])

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
        <div className="loader">
          <div className="box box0">
            <div></div>
          </div>
          <div className="box box1">
            <div></div>
          </div>
          <div className="box box2">
            <div></div>
          </div>
          <div className="box box3">
            <div></div>
          </div>
          <div className="box box4">
            <div></div>
          </div>
          <div className="box box5">
            <div></div>
          </div>
          <div className="box box6">
            <div></div>
          </div>
          <div className="box box7">
            <div></div>
          </div>
          <div className="ground">
            <div></div>
          </div>
        </div>
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
    <div className="relative flex h-screen bg-background">
      <Toaster richColors position="top-center" />
      {isPasswordModalOpen && isPasswordProtected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <PasswordPromptModal
            isOpen={isPasswordModalOpen}
            onClose={handlePasswordClose}
            onSuccess={handlePasswordSuccess}
            chatName={chat.name}
            chatId={chatId}
          />
        </div>
      )}
      <div
        className={`flex transition-all duration-300 ease-in-out ${
          isComponentVisible && !isAnimating && !isChatHidden ? "w-1/2" : "w-full justify-center"
        } ${isChatHidden || isPasswordModalOpen ? "hidden" : ""}`}
      >
        <div
          ref={chatPanelRef}
          className={`flex flex-col bg-background transition-all duration-300 ease-in-out ${
            isComponentVisible && !isAnimating && !isChatHidden ? "w-full" : "w-full max-w-4xl"
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
            onSettingsClick={handleSettingsClick}
          />
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
                setEditMode={setEditMode}
                messages={messages}
              />
            </div>
          </div>
        </div>
      </div>
      {isComponentVisible && (
        <div
          className={`flex flex-col bg-background overflow-hidden transition-all duration-300 ease-in-out ${
            isAnimating ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
          } ${isChatHidden ? "w-full" : isComponentVisible && !isAnimating ? "w-1/2" : "w-0"}`}
        >
          <ComponentPreview
            generatedComponent={generatedComponent}
            setGeneratedComponent={setGeneratedComponent}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onCloseComponent={handleCloseComponent}
            editMode={editMode}
            deployButtonRef={deployButtonRef}
            setIsChatHidden={setIsChatHidden}
            onAssetSelect={handleAssetSelect}
          />
          <DeployModal
            isOpen={viewMode === "settings"}
            onClose={() => setViewMode("preview")}
            onOtherClose={handleCloseComponent}
            messages={messages}
            buttonRef={deployButtonRef}
          />
        </div>
      )}
    </div>
  )
}

function DeployModal({ isOpen, onClose, messages, buttonRef }: DeployModalProps) {
  const [selectedMessageId, setSelectedMessageId] = useState("")
  const [siteName, setSiteName] = useState("")
  const [isDeploying, setIsDeploying] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const deployableMessages = messages.filter((msg) => msg.component_code && msg.sender === "ai")

  const handleDeploy = async () => {
    if (!selectedMessageId || !siteName.trim()) {
      toast.error("Please select a message and enter a site name")
      return
    }

    const siteNameRegex = /^[a-zA-Z0-9-]+$/
    if (!siteNameRegex.test(siteName)) {
      toast.error("Site name can only contain letters, numbers, and hyphens")
      return
    }

    setIsDeploying(true)

    try {
      const selectedMessage = messages.find((msg) => msg.id === selectedMessageId)
      if (!selectedMessage?.component_code) throw new Error("Selected message has no component code")

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data: existingSite } = await supabase
        .from("deployed_sites")
        .select("id")
        .eq("site_name", siteName)
        .single()

      if (existingSite) {
        toast.error("Site name already exists. Please choose a different name.")
        setIsDeploying(false)
        return
      }

      const { data: deployment, error } = await supabase
        .from("deployed_sites")
        .insert([
          {
            user_id: user.id,
            site_name: siteName,
            component_code: selectedMessage.component_code,
            message_content: selectedMessage.content,
            message_id: selectedMessage.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName,
          componentCode: selectedMessage.component_code,
          deploymentId: deployment.id,
        }),
      })

      if (!response.ok) throw new Error("Failed to deploy site")

      await response.json()
      toast.success(`Site deployed successfully! Visit: zerlo.online.${siteName}`)
      onClose()
      setSiteName("")
      setSelectedMessageId("")
    } catch (error) {
      console.error("Deployment error:", error)
      toast.error("Failed to deploy site. Please try again.")
    } finally {
      setIsDeploying(false)
    }
  }

  if (!isOpen || !buttonRef.current) return null

  const buttonRect = buttonRef.current.getBoundingClientRect()
  const top = buttonRect.bottom + window.scrollY + 5
  const left = buttonRect.left + window.scrollX

  return (
    <div
      ref={modalRef}
      className="fixed bg-white rounded-lg p-4 w-64 z-50"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
      }}
    >
      <div className="space-y-2">
        <Label>Site Name</Label>
        <Input value={siteName} onChange={(e) => setSiteName(e.target.value.toLowerCase())} placeholder="my-site" />
        <p className="text-xs text-gray-500">{siteName || "NameSite"}.zerlo.online</p>

        <Label>Select Component</Label>
        <RadioGroup value={selectedMessageId} onValueChange={setSelectedMessageId} className="space-y-1">
          {deployableMessages.length === 0 ? (
            <p className="text-xs text-gray-500">No deployable components.</p>
          ) : (
            deployableMessages.map((message) => (
              <div key={message.id} className="flex items-center space-x-1">
                <RadioGroupItem value={message.id} id={message.id} />
                <Label htmlFor={message.id} className="text-xs line-clamp-1">
                  {message.content}
                </Label>
              </div>
            ))
          )}
        </RadioGroup>

        <div className="flex justify-end space-x-1">
          <Button variant="ghost" onClick={onClose} size="sm">
            Close
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={!selectedMessageId || !siteName.trim() || isDeploying}
            size="sm"
            className="bg-[#009009] hover:bg-[#0099ffde] text-white r2552esf25_252trewt3erblueFontDocs"
          >
            {isDeploying ? "Deploying..." : "Deploy"}
          </Button>
        </div>
      </div>
    </div>
  )
}