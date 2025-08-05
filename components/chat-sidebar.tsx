"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquare } from "lucide-react"
import { User } from "@supabase/supabase-js" // Import User type
import AccountMenu from "@/components/account-menu"

interface Chat {
  id: string
  name: string
  created_at: string
  updated_at: string
}

interface ChatSidebarProps {
  user: User | null // Specify User type
}

export function ChatSidebar({ user }: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const currentChatId = params.id as string
  const supabase = createClient()

  // Memoize fetchChats to prevent recreation
  const fetchChats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .order("updated_at", { ascending: false })
      if (error) throw error
      setChats(data || [])
    } catch (error) {
      console.error("Error fetching chats:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase]) // Add supabase as a dependency

  useEffect(() => {
    fetchChats()
  }, [fetchChats]) // Add fetchChats to dependency array

  const createNewChat = async () => {
    const chatName = `Chat ${new Date().toLocaleString()}`
    try {
      const { data, error } = await supabase
        .from("chats")
        .insert([{ name: chatName, user_id: user?.id }])
        .select()
        .single()

      if (error) throw error
      router.push(`/chat/${data.id}`)
      fetchChats()
    } catch (error) {
      console.error("Error creating chat:", error)
    }
  }

  const selectChat = (chatId: string) => {
    router.push(`/chat/${chatId}`)
  }

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email}</span>
        <AccountMenu user={user} />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto pb-4">
        <Button onClick={createNewChat} className="rounded-none w-full bg-[#0099FF] text-white text-sm">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
        {loading ? (
          <div className="text-xs text-gray-500 dark:text-gray-400">Loading...</div>
        ) : chats.length === 0 ? (
          <div className="text-xs text-gray-500 dark:text-gray-400">No chats yet</div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => selectChat(chat.id)}
              className={`rounded-none w-full flex items-center gap-2 p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                chat.id === currentChatId ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
            >
              <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="truncate text-gray-900 dark:text-white">{chat.name}</span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}