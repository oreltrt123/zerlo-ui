// app/(main)/chat/page.tsx
"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { Send, Mic, Settings, LogOut, Plus } from "lucide-react"
import { Input } from "@/components/ui"
import "@/styles/hover_cardReds.css"

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleStartNewChat()
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
      <div className="flex min-h-screen flex-col bg-white">
        <div className="flex-1 flex flex-col items-center px-4 pt-16">
          <div className="max-w-2xl w-full text-center space-y-8">
            <h1 className="text-4xl font-light font-sans text-black">What would you like to create?</h1>
            <div className="relative">
              <div
                className="flex items-center bg-white rounded-full px-4 py-3 gap-3 shadow-2xl"
                style={{
                  boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
                }}
              >
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="What idea do you have to add, upgrade, improve, create, import or think about?"
                    className="bg-white resize-none  border-none placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    rows={1}
                  />
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-[#8888881A] rounded-full p-2">
                      <Mic className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Voice input</TooltipContent>
                </Tooltip>

                {message.trim() && (
                  <Button
                    onClick={handleStartNewChat}
                    size="sm"
                    className="bg-white text-black hover:bg-gray-200 rounded-full p-2 transition-all duration-200"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

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
                  className="holographic-card bg-white rounded-lg p-4 border border-[#8888881A] transition-shadow cursor-pointer"
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
// "use client"

// import type React from "react"
// import { useState, useEffect, useCallback, useRef } from "react"
// import { useRouter } from "next/navigation"
// import { createClient } from "@/supabase/client"
// import type { User } from "@supabase/supabase-js"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textareaChat"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { InviteModal } from "@/components/chat/invite-modal"
// import { toast } from "react-toastify"
// import {
//   Send,
//   ImageIcon,
//   Paperclip,
//   Mic,
//   MoreHorizontal,
//   Plus,
//   MessageSquare,
//   Settings,
//   LogOut,
//   FileText,
//   Camera,
//   Edit3,
//   Trash2,
//   UserPlus,
// } from "lucide-react"
// import "@/styles/button.css"

// interface Chat {
//   id: string
//   name: string
//   created_at: string
//   updated_at: string
// }

// interface Invite {
//   id: string
//   sender_name: string
//   sender_email: string
//   recipient_email: string
//   status: string
// }

// export default function ModernChatPage() {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [message, setMessage] = useState("")
//   const [chats, setChats] = useState<Chat[]>([])
//   const [filteredChats, setFilteredChats] = useState<Chat[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [editingChatId, setEditingChatId] = useState<string | null>(null)
//   const [editingChatName, setEditingChatName] = useState("")
//   const [showInviteModal, setShowInviteModal] = useState(false)
//   const [pendingInvites, setPendingInvites] = useState<Invite[]>([])

//   const router = useRouter()
//   const supabase = createClient()
//   const textareaRef = useRef<HTMLTextAreaElement>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const getUser = useCallback(async () => {
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser()
//       setUser(user)
//     } catch (error) {
//       console.error("Error getting user:", error)
//     } finally {
//       setLoading(false)
//     }
//   }, [supabase])

//   const loadChats = useCallback(async () => {
//     if (!user) return
//     try {
//       const { data, error } = await supabase
//         .from("chats")
//         .select("*")
//         .eq("user_id", user.id)
//         .order("updated_at", { ascending: false })

//       if (error) throw error
//       setChats(data || [])
//       setFilteredChats(data || [])
//     } catch (error) {
//       console.error("Error loading chats:", error)
//     }
//   }, [supabase, user])

//   const loadPendingInvites = useCallback(async () => {
//     if (!user) return
//     try {
//       const { data, error } = await supabase
//         .from("invites")
//         .select("*")
//         .eq("recipient_email", user.email)
//         .eq("status", "pending")

//       if (error) throw error
//       setPendingInvites(data || [])
//     } catch (error) {
//       console.error("Error loading pending invites:", error)
//     }
//   }, [supabase, user])

//   const handleApproveInvite = async (inviteId: string) => {
//     try {
//       const { error } = await supabase.from("invites").update({ status: "approved" }).eq("id", inviteId)

//       if (error) throw error
//       toast.success("Invite approved!")
//       loadPendingInvites()
//     } catch (error) {
//       console.error("Error approving invite:", error)
//       toast.error("Failed to approve invite")
//     }
//   }

//   const handleRejectInvite = async (inviteId: string) => {
//     try {
//       const { error } = await supabase.from("invites").update({ status: "rejected" }).eq("id", inviteId)

//       if (error) throw error
//       toast.success("Invite rejected")
//       loadPendingInvites()
//     } catch (error) {
//       console.error("Error rejecting invite:", error)
//       toast.error("Failed to reject invite")
//     }
//   }

//   const handleCreateNewChat = async () => {
//     if (!user) return

//     try {
//       const { data, error } = await supabase
//         .from("chats")
//         .insert([
//           {
//             name: "New Chat",
//             user_id: user.id,
//           },
//         ])
//         .select()
//         .single()

//       if (error) throw error

//       router.push(`/chat/${data.id}`)
//       loadChats()
//     } catch (error) {
//       console.error("Error creating chat:", error)
//     }
//   }

//   const handleDeleteChat = async (chatId: string) => {
//     if (!user) return
//     try {
//       const { error } = await supabase.from("chats").delete().eq("id", chatId).eq("user_id", user.id)

//       if (error) throw error
//       loadChats()
//     } catch (error) {
//       console.error("Error deleting chat:", error)
//     }
//   }

//   const handleEditChat = async (chatId: string, newName: string) => {
//     if (!user || !newName.trim()) return
//     try {
//       const { error } = await supabase
//         .from("chats")
//         .update({ name: newName.trim() })
//         .eq("id", chatId)
//         .eq("user_id", user.id)

//       if (error) throw error
//       setEditingChatId(null)
//       setEditingChatName("")
//       loadChats()
//     } catch (error) {
//       console.error("Error updating chat:", error)
//     }
//   }

//   const startEditingChat = (chat: Chat) => {
//     setEditingChatId(chat.id)
//     setEditingChatName(chat.name)
//   }

//   const handleStartNewChat = async () => {
//     if (!message.trim() || !user) return

//     try {
//       const { data, error } = await supabase
//         .from("chats")
//         .insert([
//           {
//             name: message.trim().slice(0, 50) + (message.length > 50 ? "..." : ""),
//             user_id: user.id,
//           },
//         ])
//         .select()
//         .single()

//       if (error) throw error

//       // Save the first message
//       await supabase.from("messages").insert([
//         {
//           content: message.trim(),
//           sender: "user",
//           chat_id: data.id,
//           user_id: user.id,
//         },
//       ])

//       // Navigate to the new chat with the message as a query parameter
//       const encodedMessage = encodeURIComponent(message.trim())
//       router.push(`/chat/${data.id}?initialMessage=${encodedMessage}`)
//       setMessage("") // Clear the input after creating the chat
//     } catch (error) {
//       console.error("Error creating chat:", error)
//     }
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleStartNewChat()
//     }
//   }

//   const handleLogout = async () => {
//     try {
//       await supabase.auth.signOut()
//       router.push("/login")
//     } catch (error) {
//       console.error("Error logging out:", error)
//     }
//   }

//   const adjustTextareaHeight = () => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto"
//       textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
//     }
//   }

//   useEffect(() => {
//     adjustTextareaHeight()
//   }, [message])

//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setFilteredChats(chats)
//     } else {
//       const filtered = chats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
//       setFilteredChats(filtered)
//     }
//   }, [searchQuery, chats])

//   useEffect(() => {
//     getUser()
//   }, [getUser])

//   useEffect(() => {
//     if (user) {
//       loadChats()
//       loadPendingInvites()
//     }
//   }, [user, loadChats, loadPendingInvites])

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-950">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//       </div>
//     )
//   }

//   if (!user) {
//     router.push("/login")
//     return null
//   }

//   return (
//     <TooltipProvider>
//       <div className="flex h-screen bg-white">
//         {/* Sidebar */}
//         <div className="w-64 bg-[#f9f9f9] border-r border-[#8888881A] flex flex-col">
//           {/* Header */}
//           <div className="p-4 border-b border-[#8888881A] space-y-2">
//             <Button
//               onClick={handleCreateNewChat}
//               className="w-full justify-start gap-2 bg-[#8888881A] text-muted-foreground hover:bg-[#88888811] font-medium shadow-none"
//             >
//               <Plus className="h-4 w-4" />
//               New Chat
//             </Button>

//             <Button
//               onClick={() => setShowInviteModal(true)}
//               className="w-full justify-start gap-2 bg-[#0099FF1A] text-[#0099FF] hover:bg-[#0099FF11] font-medium shadow-none"
//             >
//               <UserPlus className="h-4 w-4" />
//               Invite User
//             </Button>
//           </div>

//           {pendingInvites.length > 0 && (
//             <div className="p-4 border-b border-[#8888881A]">
//               <h3 className="text-sm font-medium text-gray-700 mb-2">Pending Invites</h3>
//               {pendingInvites.map((invite) => (
//                 <div key={invite.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg mb-2">
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">{invite.sender_name || invite.sender_email}</p>
//                     <p className="text-xs text-gray-500">wants to collaborate</p>
//                   </div>
//                   <div className="flex gap-1">
//                     <Button
//                       size="sm"
//                       className="h-6 px-2 text-xs bg-green-600 text-white"
//                       onClick={() => handleApproveInvite(invite.id)}
//                     >
//                       Accept
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="h-6 px-2 text-xs bg-transparent"
//                       onClick={() => handleRejectInvite(invite.id)}
//                     >
//                       Decline
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Search */}
//           <div className="p-4 border-b border-[#8888881A]">
//             <div className="relative">
//               <Input
//                 placeholder="Search conversations..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Chat List */}
//           <div className="flex-1 overflow-y-auto p-2">
//             {filteredChats.length === 0 ? (
//               <div className="text-xs text-gray-500 text-center p-4">
//                 {searchQuery ? "No chats found" : "No chats yet"}
//               </div>
//             ) : (
//               filteredChats.map((chat) => (
//                 <div key={chat.id} className="group relative mb-1">
//                   {editingChatId === chat.id ? (
//                     <div className="flex items-center gap-2 p-2">
//                       <Input
//                         value={editingChatName}
//                         onChange={(e) => setEditingChatName(e.target.value)}
//                         onKeyPress={(e) => {
//                           if (e.key === "Enter") {
//                             handleEditChat(chat.id, editingChatName)
//                           } else if (e.key === "Escape") {
//                             setEditingChatId(null)
//                             setEditingChatName("")
//                           }
//                         }}
//                         autoFocus
//                       />
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={() => handleEditChat(chat.id, editingChatName)}
//                         className="r2552esf25_252trewt3erblueFontDocs h-8 w-8 justify-start gap-2 bg-[#8888881A] text-muted-foreground hover:text-muted-foreground hover:bg-[#88888811] font-medium shadow-none"
//                       >
//                         <Send className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="flex items-center">
//                       <Button
//                         variant="ghost"
//                         className="r2552esf25_252trewt3erblueFontDocs flex-1 justify-start h-auto p-3 pr-8 text-muted-foreground hover:bg-[#8888881A] hover:text-muted-foreground"
//                         onClick={() => router.push(`/chat/${chat.id}`)}
//                       >
//                         <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
//                         <span className="truncate text-left">{chat.name}</span>
//                       </Button>

//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-muted-foreground"
//                           >
//                             <MoreHorizontal className="h-3 w-3" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent
//                           align="end"
//                           className="w-32 bg-white"
//                           style={{
//                             boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
//                           }}
//                         >
//                           <DropdownMenuItem
//                             onClick={() => startEditingChat(chat)}
//                             className="hover:bg-[#8888881A] text-muted-foreground hover:text-muted-foreground"
//                           >
//                             <Edit3 className="h-3 w-3 mr-2" />
//                             Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => handleDeleteChat(chat.id)}
//                             className="hover:bg-[#f831310e] text-[#f8313198] hover:text-[#f8313198]"
//                           >
//                             <Trash2 className="h-3 w-3 mr-2 text-[#f8313198]" />
//                             Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </div>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>

//           {/* User Menu */}
//           <div className="p-4 border-t border-[#8888881A]">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="w-full justify-start gap-2 text-muted-foreground hover:text-muted-foreground hover:bg-[#8888881A]"
//                 >
//                   <Avatar className="h-6 w-6">
//                     <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
//                     <AvatarFallback className="bg-gray-700 text-white">
//                       {user.email?.charAt(0).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="truncate">{user.email}</span>
//                   <MoreHorizontal className="h-4 w-4 ml-auto" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 align="end"
//                 className="w-56 bg-white"
//                 style={{
//                   boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
//                 }}
//               >
//                 <DropdownMenuItem
//                   onClick={() => router.push("/settings")}
//                   className="text-muted-foreground hover:text-muted-foreground hover:bg-[#8888881A]"
//                 >
//                   <Settings className="h-4 w-4 mr-2" />
//                   Settings
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   onClick={handleLogout}
//                   className="text-muted-foreground hover:text-muted-foreground hover:bg-[#8888881A]"
//                 >
//                   <LogOut className="h-4 w-4 mr-2" />
//                   Log out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>

//         {/* Main Chat Area */}
//         <div className="flex-1 flex flex-col">
//           {/* Welcome Screen */}
//           <div className="flex-1 flex flex-col items-center justify-center px-4">
//             <div className="max-w-2xl w-full text-center space-y-8">
//               <div className="space-y-6">
//                 <h1 className="text-4xl font-normal text-black">What can I help with?</h1>

//                 <div className="max-w-2xl mx-auto">
//                   <div className="relative">
//                     <div
//                       className="flex items-center bg-white rounded-full px-4 py-3 gap-3 shadow-2xl"
//                       style={{
//                         boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
//                       }}
//                     >
//                       {/* Plus Button with Attachment Options */}
//                       <AttachmentButton />

//                       {/* Text Input */}
//                       <div className="flex-1">
//                         <Textarea
//                           ref={textareaRef}
//                           value={message}
//                           onChange={(e) => setMessage(e.target.value)}
//                           onKeyPress={handleKeyPress}
//                           placeholder="Ask anything"
//                           className="min-h-[24px] max-h-[120px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400 text-base p-0"
//                           rows={1}
//                         />
//                       </div>

//                       {/* Voice Input */}
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-gray-400 hover:bg-[#8888881A] rounded-full p-2"
//                           >
//                             <Mic className="h-5 w-5" />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>Voice input</TooltipContent>
//                       </Tooltip>

//                       {/* Send Button */}
//                       {message.trim() && (
//                         <Button
//                           onClick={handleStartNewChat}
//                           size="sm"
//                           className="bg-white text-black hover:bg-gray-200 rounded-full p-2 transition-all duration-200"
//                         >
//                           <Send className="h-4 w-4" />
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Hidden file input */}
//         <input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*,.pdf,.doc,.docx,.txt" />

//         <InviteModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} />
//       </div>
//     </TooltipProvider>
//   )
// }

// function AttachmentButton() {
//   const [isOpen, setIsOpen] = useState(false)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   return (
//     <div className="relative">
//       <Button
//         variant="ghost"
//         size="sm"
//         onClick={() => setIsOpen(!isOpen)}
//         className="text-gray-400 hover:bg-[#8888881A] rounded-full p-2 transition-all duration-200"
//       >
//         <Plus className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`} />
//       </Button>

//       {isOpen && (
//         <div
//           className="absolute bottom-full left-0 mb-2 bg-white rounded-xl p-2 shadow-2xl animate-in slide-in-from-bottom-2 duration-200"
//           style={{
//             boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
//           }}
//         >
//           <div className="grid grid-cols-2 gap-2 w-48">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => fileInputRef.current?.click()}
//                   className="flex flex-col items-center gap-2 h-16 text-gray-700 hover:bg-[#8888881A] rounded-lg"
//                 >
//                   <Paperclip className="h-5 w-5" />
//                   <span className="text-xs">File</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Upload file</TooltipContent>
//             </Tooltip>

//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="flex flex-col items-center gap-2 h-16 text-gray-700 hover:bg-[#8888881A] rounded-lg"
//                 >
//                   <ImageIcon className="h-5 w-5" />
//                   <span className="text-xs">Image</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Upload image</TooltipContent>
//             </Tooltip>

//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="flex flex-col items-center gap-2 h-16 text-gray-700 hover:bg-[#8888881A] rounded-lg"
//                 >
//                   <Camera className="h-5 w-5" />
//                   <span className="text-xs">Camera</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Take photo</TooltipContent>
//             </Tooltip>

//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="flex flex-col items-center gap-2 h-16 text-gray-700 hover:bg-[#8888881A] rounded-lg"
//                 >
//                   <FileText className="h-5 w-5" />
//                   <span className="text-xs">Document</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Upload document</TooltipContent>
//             </Tooltip>
//           </div>
//         </div>
//       )}

//       <input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*,.pdf,.doc,.docx,.txt" />
//     </div>
//   )
// }