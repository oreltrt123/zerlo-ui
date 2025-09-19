"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import type { User } from "@supabase/supabase-js"
import { toast } from "sonner"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import SearchBar from "@/components/community/SearchBar"
import Categories from "@/components/community/Categories"
import PopularTags from "@/components/community/PopularTags"
import PostsGrid from "@/components/community/PostsGrid"
import CommunityHero from "@/components/community/CommunityHero"
import TemplatesHero from "@/components/community/TemplatesHero"
import Header from "@/components/community/Header"
import "@/styles/button.css"

export interface CommunityPost {
  id: string
  title: string
  description: string
  cover_image?: string  // Made optional to match utils
  hover_image?: string
  profile_picture?: string
  creator_name: string
  creator_email?: string
  creator_phone?: string
  chat_id: string
  component_code?: string  // Made optional to match utils
  created_at: string
  user_id: string
  tags: string[]
  category: string
  post_type: "component" | "full_chat"
  view_count: number
  like_count: number
  user_liked?: boolean
  is_public: boolean  // Added: Required from utils
  updated_at: string  // Added: Required from utils
  community_likes?: CommunityLike[]  // Fixed: Use full type
}

interface CommunityLike {
  id: string
  user_id: string
  community_post_id: string
  created_at: string
}

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"community" | "templates">("community")
  const [popularTags, setPopularTags] = useState<Array<{ tag: string; count: number }>>([])

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

  const loadPosts = useCallback(async () => {
    try {
      const query = supabase
        .from("community_posts")
        .select(`
          *,
          community_likes!left(user_id)
        `)
        .eq("is_public", true)
        .order("created_at", { ascending: false })

      const { data, error } = await query

      if (error) throw error

      const processedPosts = (data || []).map((post: unknown) => {
        const postObj = post as Record<string, unknown>
        // Type guard: Check existence and array type to narrow to unknown[]
        let userLiked = false
        if ('community_likes' in postObj && Array.isArray(postObj.community_likes)) {
          userLiked = postObj.community_likes.some((like: unknown) => {
            const likeObj = like as Record<string, unknown>
            return likeObj.user_id === user?.id
          })
        }

        return {
          ...postObj,
          user_liked: userLiked,
        }
      }) as CommunityPost[]  // Assert final type after processing

      setPosts(processedPosts)
      setFilteredPosts(processedPosts)
    } catch (error) {
      console.error("Error loading posts:", error)
      toast.error("Error loading community posts")
    }
  }, [supabase, user])

  const loadPopularTags = useCallback(async () => {
    try {
      const allTags: { [key: string]: number } = {}
      posts.forEach((post) => {
        post.tags?.forEach((tag) => {
          allTags[tag] = (allTags[tag] || 0) + 1
        })
      })

      const sortedTags = Object.entries(allTags)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      setPopularTags(sortedTags)
    } catch (error) {
      console.error("Error loading popular tags:", error)
    }
  }, [posts])

  const handleSearch = useCallback(() => {
    if (searchQuery.trim() || selectedCategory) {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.set("q", searchQuery.trim())
      if (selectedCategory) params.set("category", selectedCategory)
      router.push(`/community/search?${params.toString()}`)
    }
  }, [searchQuery, selectedCategory, router])

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleFilter = useCallback(() => {
    let filtered = posts

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.creator_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    if (activeTab === "templates") {
      filtered = filtered.filter((post) => post.user_id === user?.id)
    }

    setFilteredPosts(filtered)
  }, [posts, searchQuery, selectedCategory, activeTab, user])

  const handleLike = async (postId: string, liked: boolean) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              user_liked: liked,
              like_count: liked ? post.like_count + 1 : post.like_count - 1,
            }
          : post,
      ),
    )
    setFilteredPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              user_liked: liked,
              like_count: liked ? post.like_count + 1 : post.like_count - 1,
            }
          : post,
      ),
    )
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag)
    handleSearch()
  }

  useEffect(() => {
    getUser()
  }, [getUser])

  useEffect(() => {
    if (user) {
      loadPosts()
    }
  }, [user, loadPosts])

  useEffect(() => {
    handleFilter()
  }, [handleFilter])

  useEffect(() => {
    if (posts.length > 0) {
      loadPopularTags()
    }
  }, [posts, loadPopularTags])

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
      <Header user={user} activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />
        
      <div className="max-w-7xl mx-auto px-4 py-8 relative top-[70px]">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="community" className="space-y-8">
            <CommunityHero />
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              handleSearchKeyPress={handleSearchKeyPress}
            />
            <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            <PopularTags popularTags={popularTags} handleTagClick={handleTagClick} />
            <PostsGrid
              filteredPosts={filteredPosts}
              isTemplates={false}
              onLike={handleLike}
              hasFilter={!!searchQuery || !!selectedCategory}
            />
          </TabsContent>

          <TabsContent value="templates" className="space-y-8">
            <TemplatesHero />
            <PostsGrid
              filteredPosts={filteredPosts}
              isTemplates={true}
              onLike={handleLike}
              hasFilter={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}