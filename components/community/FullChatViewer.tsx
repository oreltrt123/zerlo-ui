"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Bot, Code2, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  sender: "user" | "ai"
  content: string
  component_code?: string
  component_title?: string
  created_at: string
}

interface FullChatViewerProps {
  communityPostId: string
  postTitle: string
  creatorName: string
  creatorAvatar?: string
}

export default function FullChatViewer({
  communityPostId,
  postTitle,
  creatorName,
  creatorAvatar,
}: FullChatViewerProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [chatStats, setChatStats] = useState({
    totalMessages: 0,
    userMessages: 0,
    aiMessages: 0,
    componentsCreated: 0,
    conversationDate: "",
  })

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    const loadChatSnapshot = async () => {
      try {
        const { data, error } = await supabase
          .from("community_chat_snapshots")
          .select("snapshot_data")
          .eq("community_post_id", communityPostId)
          .single()

        if (error) throw error

        if (data?.snapshot_data?.messages) {
          const chatMessages = data.snapshot_data.messages
          setMessages(chatMessages)

          // Calculate stats
          const userMsgs = chatMessages.filter((m: Message) => m.sender === "user").length
          const aiMsgs = chatMessages.filter((m: Message) => m.sender === "ai").length
          const components = chatMessages.filter((m: Message) => m.component_code).length
          const firstMessage = chatMessages[0]

          setChatStats({
            totalMessages: chatMessages.length,
            userMessages: userMsgs,
            aiMessages: aiMsgs,
            componentsCreated: components,
            conversationDate: firstMessage ? new Date(firstMessage.created_at).toLocaleDateString() : "",
          })
        }
      } catch (error) {
        console.error("Error loading chat snapshot:", error)
        toast.error("Failed to load chat conversation")
      } finally {
        setLoading(false)
      }
    }

    loadChatSnapshot()
  }, [communityPostId, supabase])

  const handleCloneChat = async () => {
    if (!user) {
      toast.error("Please sign in to clone this chat")
      return
    }

    try {
      // Create a new chat
      const { data: newChat, error: chatError } = await supabase
        .from("chats")
        .insert([
          {
            name: `Cloned: ${postTitle}`,
            user_id: user.id,
            description: `Cloned chat conversation from ${creatorName}`,
          },
        ])
        .select()
        .single()

      if (chatError) throw chatError

      // Insert all messages
      const messagesToInsert = messages.map((msg) => ({
        chat_id: newChat.id,
        sender: msg.sender,
        content: msg.content,
        component_code: msg.component_code || null,
        component_title: msg.component_title || null,
        created_at: new Date().toISOString(),
      }))

      const { error: messagesError } = await supabase.from("messages").insert(messagesToInsert)

      if (messagesError) throw messagesError

      toast.success("Chat cloned successfully!")
      router.push(`/chat/${newChat.id}`)
    } catch (error) {
      console.error("Error cloning chat:", error)
      toast.error("Failed to clone chat")
    }
  }

  const copyMessageContent = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Message copied to clipboard")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Chat Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Chat Overview</h3>
            </div>
            <Button onClick={handleCloneChat} className="bg-black text-white hover:bg-gray-800">
              <Copy className="h-4 w-4 mr-2" />
              Clone Chat
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{chatStats.totalMessages}</div>
              <div className="text-sm text-gray-600">Total Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{chatStats.userMessages}</div>
              <div className="text-sm text-gray-600">User Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{chatStats.aiMessages}</div>
              <div className="text-sm text-gray-600">AI Responses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{chatStats.componentsCreated}</div>
              <div className="text-sm text-gray-600">Components</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">{chatStats.conversationDate}</div>
              <div className="text-sm text-gray-600">Date Created</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <div className="space-y-4">
        {messages.map((message, index) => (
          <Card
            key={index}
            className={`${message.sender === "user" ? "ml-8" : "mr-8"} transition-all duration-200 hover:shadow-md`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {message.sender === "user" ? (
                    <>
                      <AvatarImage src={creatorAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {/* <User className="h-4 w-4" /> */}
                        User
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {message.sender === "user" ? creatorName : "AI Assistant"}
                      </span>
                      <Badge variant={message.sender === "user" ? "default" : "secondary"} className="text-xs">
                        {message.sender === "user" ? "User" : "AI"}
                      </Badge>
                      {message.component_code && (
                        <Badge variant="outline" className="text-xs">
                          <Code2 className="h-3 w-3 mr-1" />
                          Component
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyMessageContent(message.content)}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{message.content}</div>
                  </div>

                  {message.component_code && message.component_title && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Code2 className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">{message.component_title}</span>
                      </div>
                      <div className="text-xs text-gray-600">Component code available (click Clone Chat to access)</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="text-center py-12 text-gray-500">No messages found in this chat conversation.</div>
      )}
    </div>
  )
}