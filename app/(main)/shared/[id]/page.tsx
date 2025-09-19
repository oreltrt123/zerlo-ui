"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/supabase/client"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ComponentPreview } from "@/components/chat/component-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import type { SketchfabModel } from "@/lib/sketchfab-api"
import { toast } from "sonner"
import { useCompletion } from "ai/react"

interface Message {
  id: string
  sender: "user" | "ai"
  content: string
  component_code?: string
  component_title?: string
  isStreaming?: boolean
  isGeneratingComponent?: boolean
}

interface SharedChat {
  id: string
  name: string
  is_public: boolean
  allow_messages: boolean
  allow_deploy: boolean
  allow_copy: boolean
}

export default function SharedChatPage() {
  const params = useParams()
  const shareId = params.id as string
  const [chat, setChat] = useState<SharedChat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [generatedComponent, setGeneratedComponent] = useState<string>("")
  const [viewMode, setViewMode] = useState<"preview" | "code" | "settings" | "assets" | "terminal">("preview")
  const [editMode, setEditMode] = useState<boolean>(false)
  const [isComponentVisible, setIsComponentVisible] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inputPrompt, setInputPrompt] = useState<string>("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("html")
  const deployButtonRef = useRef<HTMLButtonElement | null>(null)
  const supabase = createClient()
  const isDiscussMode = useRef<boolean>(false)
  const currentSelectedStyle = useRef<string>("gaming")
  const currentSelectedGameType = useRef<string>("3d")
  const currentSlashCommand = useRef<string | null>(null)
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
        const { aiMessageId, originalUserPrompt } = messageContextRef.current
        const componentTitle = generateComponentTitle(originalUserPrompt)
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

  const { complete: completeDiscuss, } = useCompletion({
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

  const { complete: completeSearch, } = useCompletion({
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

  const handleCloseComponent = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsComponentVisible(false)
      setGeneratedComponent("")
      setEditMode(false)
      setIsAnimating(false)
    }, 300)
  }, [])

  const generateComponentTitle = useCallback((prompt: string): string => {
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
  }, [])

  const processFilesForDiscuss = useCallback(async (files: File[], userPrompt: string): Promise<string> => {
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
  }, [])

  const saveMessage = useCallback(
    async (sender: "user" | "ai", content: string) => {
      try {
        console.log("Saving message:", { sender, content: content.substring(0, 100) + "..." })
        const { data, error } = await supabase
          .from("messages")
          .insert([
            {
              chat_id: chat?.id,
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
        await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", chat?.id)
        return data.id
      } catch (error) {
        console.error("Error saving message:", error)
        throw error
      }
    },
    [chat, supabase],
  )

  const saveMessageWithComponent = useCallback(
    async (messageId: string, componentCode: string, componentTitle?: string) => {
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
    },
    [supabase],
  )

  const handleSendMessage = useCallback(
    async (
      model: string,
      language: string,
      discussMode: boolean = false,
      files?: File[],
      searchMode: boolean = false,
      selectedStyle: string = "gaming",
      selectedGameType: string = "3d",
      slashCommand: string | null = null,
    ) => {
      if (!inputPrompt.trim()) {
        toast.warning("Please enter a message.")
        return
      }

      if (!chat?.allow_messages) {
        toast.error("Messaging is disabled for this shared chat.")
        return
      }

      setSelectedLanguage(language)
      isDiscussMode.current = discussMode

      currentSelectedStyle.current = selectedStyle
      currentSelectedGameType.current = selectedGameType
      currentSlashCommand.current = slashCommand

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
              language,
              chatHistory: messages.slice(-10),
              selectedStyle,
              selectedGameType,
              slashCommand,
            },
          })
        }
      } catch (error) {
        console.error("Error in handleSendMessage:", error)
        toast.error("Error sending message")
        setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessageId && msg.id !== tempAiMessageId))
      }
    },
    [
      inputPrompt,
      chat,
      messages,
      setSelectedLanguage,
      saveMessage,
      processFilesForDiscuss,
      completeSearch,
      completeDiscuss,
      completeChat,
      setMessages,
      setInputPrompt,
    ],
  )

  const handleRestoreComponent = useCallback((componentCode: string) => {
    setGeneratedComponent(componentCode)
    setViewMode("preview")
    setIsComponentVisible(true)
  }, [])

  const handleAssetSelect = useCallback(
    async (asset: SketchfabModel) => {
      const assetPrompt =
        asset.uid === "fix-error"
          ? `Fix the error in the current component: ${asset.description}`
          : `Add this 3D asset to my game: "${asset.name}" by ${asset.user.displayName}. ${
              asset.description || "A professional 3D model from Sketchfab."
            } Please integrate it seamlessly into the current game with proper positioning, scaling, and interactions.`

      setInputPrompt(assetPrompt)
      await handleSendMessage("gemini", "html", false, undefined, false, "gaming", "3d")
      toast.success(`Integrating ${asset.name} into your game!`)
    },
    [handleSendMessage, setInputPrompt],
  )

  useEffect(() => {
    const loadSharedChat = async () => {
      try {
        const { data: chatData, error: chatError } = await supabase
          .from("chats")
          .select("id, name, is_public, allow_messages, allow_deploy, allow_copy")
          .eq("share_id", shareId)
          .single()

        if (chatError) {
          setError("Shared chat not found or access denied")
          return
        }

        if (!chatData.is_public) {
          setError("This chat is private and cannot be accessed")
          return
        }

        setChat(chatData)

        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .eq("chat_id", chatData.id)
          .order("created_at", { ascending: true })

        if (messagesError) throw messagesError

        const loadedMessages: Message[] = messagesData.map((msg) => ({
          id: msg.id,
          sender: msg.sender,
          content: msg.content,
          component_code: msg.component_code,
          component_title: msg.component_title,
        }))

        setMessages(loadedMessages)

        const messagesWithComponents = messagesData.filter((msg) => msg.component_code)
        if (messagesWithComponents.length > 0) {
          const lastMessageWithComponent = messagesWithComponents[messagesWithComponents.length - 1]
          setGeneratedComponent(lastMessageWithComponent.component_code)
          setIsComponentVisible(true)
        }
      } catch (error) {
        console.error("Error loading shared chat:", error)
        setError("Error loading shared chat")
      } finally {
        setLoading(false)
      }
    }

    loadSharedChat()
  }, [shareId, supabase])

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Chat Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {chat?.is_public ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
              <h1 className="text-lg font-semibold">{chat?.name}</h1>
              <span className="text-sm text-gray-500">(Shared)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {chat?.allow_messages && <span>✓ Messages</span>}
            {chat?.allow_deploy && <span>✓ Deploy</span>}
            {chat?.allow_copy && <span>✓ Copy</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full pt-16">
        {/* Left: Chat Messages */}
        <div
          className={`flex flex-col transition-all duration-300 ease-in-out ${
            isComponentVisible && !isAnimating ? "w-1/2" : "w-full max-w-4xl mx-auto"
          }`}
        >
          <div className="flex-1 overflow-y-auto px-4 py-6 bg-white shadow-lg border-r border-slate-200">
            <div className="max-w-2xl mx-auto w-full">
              <ChatMessages messages={messages} onRestoreComponent={handleRestoreComponent} />
            </div>
          </div>

          {chat?.allow_messages && (
            <div className="px-4 py-4 bg-gray-50 border-t">
              <div className="text-center text-sm text-gray-500">Message sending is enabled for this shared chat</div>
            </div>
          )}
        </div>

        {/* Right: Component Preview */}
        {isComponentVisible && (
          <div
            className={`w-1/2 flex flex-col bg-white shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
              isAnimating ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
            }`}
          >
            <ComponentPreview
              generatedComponent={generatedComponent}
              setGeneratedComponent={setGeneratedComponent}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onCloseComponent={handleCloseComponent}
              editMode={editMode}
              deployButtonRef={deployButtonRef}
              setIsChatHidden={() => {}}
              onAssetSelect={handleAssetSelect}
            />
          </div>
        )}
      </div>
    </div>
  )
}