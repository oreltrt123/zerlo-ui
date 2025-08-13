"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/supabase/client"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ComponentPreview } from "@/components/chat/component-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  sender: "user" | "ai"
  content: string
  component_code?: string
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
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const loadSharedChat = async () => {
      try {
        // Load shared chat details
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

        // Load messages
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
        }))

        setMessages(loadedMessages)

        // Set the latest component
        const messagesWithComponents = messagesData.filter((msg) => msg.component_code)
        if (messagesWithComponents.length > 0) {
          const lastMessageWithComponent = messagesWithComponents[messagesWithComponents.length - 1]
          setGeneratedComponent(lastMessageWithComponent.component_code)
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

  const handleRestoreComponent = (componentCode: string) => {
    setGeneratedComponent(componentCode)
    setViewMode("preview")
  }

  const handleCopyCode = () => {
    if (generatedComponent && chat?.allow_copy) {
      navigator.clipboard.writeText(generatedComponent)
      // Could add toast here if available
    }
  }

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
        <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white shadow-lg">
          <div className="flex-1 overflow-y-auto px-4 py-6">
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
        <div className="w-1/2 flex flex-col bg-white shadow-lg overflow-hidden">
          <ComponentPreview
            generatedComponent={generatedComponent}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onCopyCode={handleCopyCode}
          />
        </div>
      </div>
    </div>
  )
}
