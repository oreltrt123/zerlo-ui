"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface Chat {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface ChatSidebarProps {
  user: User | null;
}

export function ChatSidebar({ user }: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const currentChatId = params.id as string;
  const supabase = createClient();

  const fetchChats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user?.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    if (user) fetchChats();
  }, [fetchChats, user]);

  const selectChat = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const handleDeleteAllChats = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("chats")
        .delete()
        .eq("user_id", user.id);
      if (error) throw error;
      setChats([]);
    } catch (error) {
      console.error("Error deleting chats:", error);
    }
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4 p-2">
        <span className="text-sm font-medium text-gray-900 dark:text-white truncate relative top-[-4px] left-[10px]">{user?.email}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative h-8 w-8">
              <Avatar className="h-4 w-4 text-black/70">
                <AvatarImage
                 src="/assets/images/more.png" 
                 alt="User Avatar"
                 />
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36 relative top-[-15px]" align="end" forceMount>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteAllChats} className="text-white">
                <Image
                  src="/assets/images/delete_chat.png"
                  alt="Analytics Dashboard"
                  width={16}
                  height={16}
                />
              <span>Delete All Chats</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings}>
                <Image
                  src="/assets/images/settings.png"
                  alt="Analytics Dashboard"
                  width={16}
                  height={16}
                />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
                <Image
                  src="/assets/images/log_out.png"
                  alt="Analytics Dashboard"
                  width={16}
                  height={16}
                />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-4">
        My Recent Games
      </h2>
      {loading ? (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">Loading...</div>
      ) : chats.length === 0 ? (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">No chats yet</div>
      ) : (
      <div className="overflow-hidden border border-[#E9E9E980]" style={{ borderRadius: "0 0 0.5rem 0.5rem" }}>
          {chats.slice(0, 5).map((chat, index) => (
            <button
              key={chat.id}
              onClick={() => selectChat(chat.id)}
              className={`tab flex items-center gap-2 text-sm px-3 w-full py-1 min-h-[2.5rem] max-h-[3rem] ${
              chat.id === currentChatId ? "tab-active" : "tab-inactive"
              }`}
              style={{
              backgroundColor: "transparent", // no background
              borderRadius:
              index === chats.slice(0, 5).length - 1
              ? "0 0 0.5rem 0.5rem" // only last button rounded corners
              : "0", // all others no border radius
              maxWidth: "100%",
              }}
            >
              <span className="truncate text-ellipsis overflow-hidden">{chat.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { createClient } from "@/supabase/client";
// import { User } from "@supabase/supabase-js";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import Image from "next/image";

// interface Chat {
//   id: string;
//   name: string;
//   created_at: string;
//   updated_at: string;
// }

// interface ChatSidebarProps {
//   user: User | null;
// }

// export function ChatSidebar({ user }: ChatSidebarProps) {
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const params = useParams();
//   const currentChatId = params.id as string;
//   const supabase = createClient();

//   const fetchChats = useCallback(async () => {
//     try {
//       const { data, error } = await supabase
//         .from("chats")
//         .select("*")
//         .eq("user_id", user?.id)
//         .order("updated_at", { ascending: false });
//       if (error) throw error;
//       setChats(data || []);
//     } catch (error) {
//       console.error("Error fetching chats:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [supabase, user]);

//   useEffect(() => {
//     if (user) fetchChats();
//   }, [fetchChats, user]);

//   const selectChat = (chatId: string) => {
//     router.push(`/chat/${chatId}`);
//   };

//   const handleDeleteAllChats = async () => {
//     if (!user) return;
//     try {
//       const { error } = await supabase
//         .from("chats")
//         .delete()
//         .eq("user_id", user.id);
//       if (error) throw error;
//       setChats([]);
//     } catch (error) {
//       console.error("Error deleting chats:", error);
//     }
//   };

//   const handleSettings = () => {
//     router.push("/settings");
//   };

//   const handleLogout = async () => {
//     try {
//       await supabase.auth.signOut();
//       router.push("/login");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   return (
//     <div className="relative">
//       <div className="flex justify-between items-center mb-4">
//         <span className="text-sm font-medium text-gray-400 truncate">{user?.email}</span>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <button className="relative h-8 w-8">
//               <Avatar className="h-4 w-4 text-black/70">
//                 <AvatarImage
//                  src="/assets/images/more.png" 
//                  alt="User Avatar"
//                  />
//               </Avatar>
//             </button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-36 relative top-[-15px]" align="end" forceMount>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={handleDeleteAllChats} className="text-white">
//                 <Image
//                   src="/assets/images/delete_chat.png"
//                   alt="Analytics Dashboard"
//                   width={16}
//                   height={16}
//                 />
//               <span>Delete All Chats</span>
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={handleSettings}>
//                 <Image
//                   src="/assets/images/settings.png"
//                   alt="Analytics Dashboard"
//                   width={16}
//                   height={16}
//                 />
//               <span>Settings</span>
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={handleLogout}>
//                 <Image
//                   src="/assets/images/log_out.png"
//                   alt="Analytics Dashboard"
//                   width={16}
//                   height={16}
//                 />
//               <span>Log Out</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//       <h2 className="text-xl font-semibold text-center text-gray-400 mb-4">
//         My Recent Games
//       </h2>
//       {loading ? (
//         <div className="text-xs text-gray-500 dark:text-gray-400 text-center">Loading...</div>
//       ) : chats.length === 0 ? (
//         <div className="text-xs text-gray-500 dark:text-gray-400 text-center">No chats yet</div>
//       ) : (
//         <div className="flex flex-wrap gap-2 justify-center">
//           {chats.slice(0, 5).map((chat) => (
//             <button
//               key={chat.id}
//               onClick={() => selectChat(chat.id)}
//               className={`tab flex items-center gap-2 text-sm px-3 py-1 min-h-[2.5rem] max-h-[3rem] ${
//                 chat.id === currentChatId ? "tab-active" : "tab-inactive"
//               }`}
//               style={{ maxWidth: 'calc(100% / 2 - 0.5rem)' }}
//             >
//               <span className="truncate text-ellipsis overflow-hidden text-gray-400">{chat.name}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }