"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ChatSidebar } from "@/components/chat-sidebar"
import { User } from "@supabase/supabase-js"

// Define custom CSS for animations
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
`

export default function ChatPage() {
  const [chatName, setChatName] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const getUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error("Error getting user:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    getUser()
  }, [getUser])

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
    } catch (error) {
      console.error("Error creating chat:", error)
    }
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
    <SidebarProvider>
      <ChatSidebar user={user} />
      <SidebarInset>
        <style>{styles}</style>
        <main className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0d1117] p-4"
        style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        background: "linear-gradient(90deg,rgba(230, 247, 255, 1) 1%, rgba(255, 255, 255, 1) 19%, rgba(255, 255, 255, 1) 47%, rgba(255, 255, 255, 1) 86%, rgba(230, 247, 255, 1) 100%)",
        }}>
          <div className="rounded-xl p-6 w-full max-w-xl z-50">
            <h1 className="text-3xl font-bold text-center mb-1 text-gray-900 animate-fadeIn">
              What game would you build today?
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6 animate-fadeIn">
              Describe your game idea below, submit it, publish it, and start earning.
            </p>
          <div className="bg-[#8888880a] rounded-xl p-6 w-full max-w-xl">
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
                  className="w-full p-3 border rounded-md text-black placeholder-gray-400 focus:outline-none h-[120px] resize-none"
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
      </SidebarInset>
    </SidebarProvider>
  )
}