"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import type { User } from "@supabase/supabase-js"
import { ChatSidebar } from "@/components/chat-sidebar"

// Define custom CSS for animations and layout
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
  }
  .gradient-text {
    background: linear-gradient(90deg, #0099ff, #00ccff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .tab {
    padding: 8px 16px;
    margin-right: 8px;
    border-radius: 8px;
    transition: background-color 0.2s;
  }
  .tab-active {
    background-color: #0099ff;
    color: white;
  }
  .tab-inactive {
    background-color: #f3f4f6;
    color: #374151;
  }
  .tab-inactive:hover {
    background-color: #e5e7eb;
  }
  .menu {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #1a1a1a;
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  .menu-item {
    padding: 8px 16px;
    color: #fff;
    cursor: pointer;
  }
  .menu-item:hover {
    background-color: #333;
  }`

export default function ChatPage() {
  const [chatName, setChatName] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  // Removed setShowRecentGames as it was never used. The sidebar will always show if hasChats is true.
  const showRecentGames = true
  const [hasChats, setHasChats] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const getUser = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error("Error getting user:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const checkChats = useCallback(async () => {
    if (!user) return
    try {
      const { data, error } = await supabase.from("chats").select("id").eq("user_id", user.id)
      if (error) throw error
      setHasChats(data && data.length > 0)
    } catch (error) {
      console.error("Error checking chats:", error)
    }
  }, [supabase, user])

  useEffect(() => {
    getUser()
  }, [getUser])

  useEffect(() => {
    if (user) checkChats()
  }, [user, checkChats])

  const handleCreateChat = async () => {
    if (!chatName.trim() || !user) return
    try {
      const { data, error } = await supabase
        .from("chats")
        .insert([{ name: chatName.trim(), user_id: user.id }])
        .select()
        .single()
      if (error) throw error
      router.push(`/chat/${data.id}`)
      setHasChats(true)
    } catch (error) {
      console.error("Error creating chat:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const handleSettings = () => {
    router.push("/settings")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div
      className="flex min-h-screen bg-white dark:bg-[#0d1117] p-4 relative"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundImage: "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)",
      }}
    >
      <style>{styles}</style>
      <main className="flex flex-1 items-center justify-center">
        <div className="rounded-xl p-6 w-full max-w-xl z-50">
          <h1 className="text-3xl font-bold text-center animate-fadeIn bg-gradient-to-r from-gray-900 via-[#0099FF] to-gray-900 bg-clip-text text-transparent animate-welcome mb-4">
            What game would you build today?
          </h1>
          <div className="bg-white rounded-xl p-6 w-full border border-[#8888881A]">
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={chatName}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleCreateChat()
                    }
                  }}
                  onChange={(e) => setChatName(e.target.value)}
                  placeholder="Share your game idea — start creating, playing, and publishing!"
                  className="w-full rounded-md text-black placeholder-gray-400 focus:outline-none h-[120px] resize-none"
                />
                <button
                  className="absolute bottom-3 right-2 p-2 bg-[rgb(0,153,255)] text-white rounded-[8px] hover:bg-[rgba(0,153,255,0.83)] transition-colors disabled:opacity-50"
                  onClick={handleCreateChat}
                  disabled={!chatName.trim()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showRecentGames && hasChats && (
        <div className="absolute top-5 right-5 bg-white dark:bg-gray-900 rounded-xl w-80 border border-[#8888881A] z-50">
          <ChatSidebar user={user} />
        </div>
      )}
      <div className="absolute top-10 right-10">
        <button
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={() => setShowMenu(!showMenu)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="6" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="18" r="2" />
          </svg>
        </button>
        {showMenu && (
          <div className="menu">
            <div className="menu-item" onClick={handleSettings}>
              Settings
            </div>
            <div className="menu-item" onClick={handleLogout}>
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  )
}