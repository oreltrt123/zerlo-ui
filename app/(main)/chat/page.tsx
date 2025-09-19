"use client"
import { useState, useEffect, useCallback, } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TooltipProvider } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { Settings, LogOut, Plus, Users } from "lucide-react"
import { Input } from "@/components/ui"
import "@/styles/hover_cardReds.css"
import { motion } from "framer-motion";
import Image from "next/image";

interface Chat {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [chats, setChats] = useState<Chat[]>([])
  const [filteredChats, setFilteredChats] = useState<Chat[]>([])
  const [searchQuery, setSearchQuery] = useState("")

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

  const loadChats = useCallback(async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) throw error
      const chatsWithDescription = data.map((chat: Chat) => ({
        ...chat,
        description: chat.description || "A conversation about your next great app idea",
      }))
      setChats(chatsWithDescription)
      setFilteredChats(chatsWithDescription)
    } catch (error) {
      console.error("Error loading chats:", error)
    }
  }, [supabase, user])

  const handleStartNewChat = async () => {
    if (!message.trim() || !user) return

    try {
      const { data, error } = await supabase
        .from("chats")
        .insert([
          {
            name: message.trim().slice(0, 50) + (message.length > 50 ? "..." : ""),
            user_id: user.id,
            description: "A conversation about your next great app idea",
          },
        ])
        .select()
        .single()

      if (error) throw error

      router.push(`/chat/${data.id}`)
      setMessage("")
    } catch (error) {
      console.error("Error creating chat:", error)
      toast.error("Failed to create chat")
    }
  }


  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChats(chats)
    } else {
      const filtered = chats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredChats(filtered)
    }
  }, [searchQuery, chats])

  useEffect(() => {
    getUser()
  }, [getUser])

  useEffect(() => {
    if (user) {
      loadChats()
    }
  }, [user, loadChats])

  const handleCreateNewChat = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("chats")
        .insert([
          {
            name: "New Chat",
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      router.push(`/chat/${data.id}`)
      loadChats()
    } catch (error) {
      console.error("Error creating chat:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth/login")
    return null
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col"
    style={{
      backgroundSize: "100% auto", // full width, auto height
      backgroundPosition: "center -130px", // move image down
      backgroundRepeat: "no-repeat",
      backgroundImage: 'url("/assets/images/bg.jpg")'
    }}
      >
        <div className="flex-1 flex flex-col items-center px-4 pt-16">
          <div className="max-w-2xl w-full text-center space-y-8">
            <h1 className="text-4xl font-light font-sans text-black">What would you like to create?</h1>
            <div className="relative">
                <div className="flex-1">

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              className="bg-[#ffffffea] rounded-lg p-4 border border-[#0099ff21] w-[500px] max-w-full mx-auto"
            >
              <div className="space-y-3">
                {/* Textarea + Submit */}
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What idea do you have to add, upgrade, improve, create, import or think about?"
                    className="w-full p-2 rounded-md text-sm text-gray-800 
                      placeholder-gray-400 focus:outline-none h-[80px] resize-none"
                  />
                    <button
                      className="absolute right-0 bottom-0 p-2 bg-[#0099ffb2] hover:bg-[#0099ffbe] text-white 
                        rounded-full transition-colors cursor-pointer"
                        onClick={handleStartNewChat}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
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
                  <button
                    className="absolute right-10 bottom-0 p-2 bg-[#88888817] hover:bg-[#8888880a] text-white 
                      rounded-full transition-colors cursor-pointer"
                    onClick={() => setIsDemoOpen(true)}
                  >
                    <Image
                      className="w-[14px] h-[14px]"
                      src="/assets/images/play.png"
                      alt={'test'}
                      width={48}
                      height={48}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
              </div>
            </div>
          </div>
        </div>
      {isDemoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setIsDemoOpen(false)}
        >
          <div
            className="relative w-full max-w-6xl h-[65vh] bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src="/assets/video/ADzerlo.mp4"
              autoPlay
              muted
              loop
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={() => setIsDemoOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}
        <div className="py-12 px-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between mb-6">
            {/* Left side: Title */}
            <h1 className="text-2xl font-light font-sans text-black">
              My Recent <span className="bg-[#8888881A] px-1 rounded">Chats</span>
            </h1>

            {/* Right side: Plus + Search */}
            <div className="flex items-center gap-2">
              {/* Search input with animation */}
              <div className="transition-all duration-300 ease-in-out w-[200px] focus-within:w-[300px]">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-24 focus:w-48 transition-all duration-300 ease-in-out text-sm placeholder:text-gray-400 resize-none r2552esf25_252trewt3er border-[#8888881A] focus-visible:border-ring  aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content rounded-md border bg-transparent px-3 py-2 outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>

              {/* Plus button */}
              <button
                onClick={handleCreateNewChat}
                className="hover:bg-[#8888881A] p-2 rounded-full cursor-pointer transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredChats.length === 0 ? (
              <div className="text-xs text-gray-500 text-center p-4 col-span-3">
                {searchQuery ? "No chats found" : "No chats yet"}
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className="holographic-card bg-white rounded-lg p-4 transition-shadow cursor-pointer"
                  onClick={() => router.push(`/chat/${chat.id}`)}
                >
                  <h3 className="text-lg font-medium text-black truncate">{chat.name}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{chat.description}</p>
                  <p className="text-xs text-gray-400 mt-4">
                    Created: {new Date(chat.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="fixed bottom-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-muted-foreground hover:bg-[#8888881A] rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gray-700 text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuItem onClick={() => router.push("/community")}>
                <Users className="h-4 w-4 mr-2" />
                Community
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  )
}