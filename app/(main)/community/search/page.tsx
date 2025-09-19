"use client"
import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/supabase/client"
import type { User } from "@supabase/supabase-js"
import { toast } from "sonner"
import Header from "@/components/community/Header"
import SearchBar from "@/components/community/SearchBar"
import Categories from "@/components/community/Categories"
import ResultsSummary from "@/components/community/ResultsSummary"

export interface CommunityPost {
  id: string
  title: string
  description: string
  cover_image: string
  hover_image?: string
  profile_picture: string
  creator_name: string
  creator_email?: string
  creator_phone?: string
  chat_id: string
  component_code: string
  created_at: string
  user_id: string
  tags: string[]
  category: string
}

function SearchPageContent() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [, setPosts] = useState<CommunityPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [totalResults, setTotalResults] = useState(0)

  const router = useRouter()
  const searchParams = useSearchParams()
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

  const performSearch = useCallback(
    async (query: string, category: string | null) => {
      setIsSearching(true)
      try {
        let supabaseQuery = supabase.from("community_posts").select("*", { count: "exact" }).order("created_at", { ascending: false })

        if (query.trim()) {
          supabaseQuery = supabaseQuery.or(
            `title.ilike.%${query}%,description.ilike.%${query}%,creator_name.ilike.%${query}%`,
          )
        }

        if (category) {
          supabaseQuery = supabaseQuery.eq("category", category)
        }

        const { data, error, count } = await supabaseQuery

        if (error) throw error

        setPosts(data || [])
        setTotalResults(count || 0)
      } catch (error) {
        console.error("Error searching posts:", error)
        toast.error("Error searching community posts")
      } finally {
        setIsSearching(false)
      }
    },
    [supabase],
  )

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set("q", searchQuery.trim())
    if (selectedCategory) params.set("category", selectedCategory)

    router.push(`/community/search?${params.toString()}`)
    performSearch(searchQuery, selectedCategory)
  }, [searchQuery, selectedCategory, router, performSearch])

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
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
    getUser()
  }, [getUser])

  useEffect(() => {
    const query = searchParams.get("q") || ""
    const category = searchParams.get("category") || null

    setSearchQuery(query)
    setSelectedCategory(category)

    if (query || category) {
      performSearch(query, category)
    }
  }, [searchParams, performSearch])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth/login")
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} handleLogout={handleLogout} isSearchPage={true} />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        <div className="space-y-6">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            handleSearchKeyPress={handleSearchKeyPress}
            isSearching={isSearching}
            isSearchPage={true}
          />
          <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          <ResultsSummary isSearching={isSearching} totalResults={totalResults} searchQuery={searchQuery} selectedCategory={selectedCategory} />
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}