"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreativeCommons, Settings, LogOut, ArrowLeft } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import "@/styles/button.css"

type Props = {
  user: User | null
  activeTab?: "community" | "templates"
  setActiveTab?: (value: "community" | "templates") => void
  handleLogout: () => Promise<void>
  isSearchPage?: boolean
}

export default function Header({ user, activeTab = "community", setActiveTab, handleLogout, isSearchPage = false }: Props) {
  const router = useRouter()

  return (
    <div className="fixed top-0 left-0 w-full z-50 border-b border-[#8888881A] bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {isSearchPage ? (
              <>
                <Button variant="ghost" onClick={() => router.push("/community")} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Community
                </Button>
                <h1 className="text-2xl font-light font-sans text-black">Search <span className="text-[17px]">Results</span></h1>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-light font-sans text-black cursor-pointer" onClick={() => router.push("/")}>
                  Zerlo <span className="text-[17px]">Community</span>
                </h1>
<Tabs value={activeTab} onValueChange={(value) => {
  if (value === "search") {
    router.push("/community/search")   // 👈 navigate to Search page
  } else {
    setActiveTab?.(value as "community" | "templates")
  }
}}>
  <TabsList className="grid w-full grid-cols-3 h-10">
    <TabsTrigger value="community" className="text-sm font-medium">
      Community
    </TabsTrigger>
    <TabsTrigger value="search" className="text-sm font-medium">
      Search
    </TabsTrigger>
    <TabsTrigger value="templates" className="text-sm font-medium">
      My Templates
    </TabsTrigger>
  </TabsList>
</Tabs>

              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gray-700 text-white">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate max-w-32">{user?.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/chat")}>
                  <CreativeCommons className="h-4 w-4 mr-2" />
                  Create New
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}