import { createClient } from "@/supabase/client"

export interface CommunityPost {
  id: string
  title: string
  description: string
  cover_image?: string
  hover_image?: string
  profile_picture?: string
  creator_name: string
  creator_email?: string
  creator_phone?: string
  chat_id: string
  component_code?: string
  user_id: string
  tags: string[]
  category: string
  post_type: "component" | "full_chat"
  view_count: number
  like_count: number
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface ChatSnapshot {
  id: string
  community_post_id: string
  original_chat_id: string
  snapshot_data: {
    messages: Array<{
      id: string
      sender: "user" | "ai"
      content: string
      component_code?: string
      component_title?: string
      created_at: string
    }>
    total_messages: number
    created_at: string
    updated_at: string
  }
  created_at: string
}

interface CommunityLike {
  id: string
  user_id: string
  community_post_id: string
  created_at: string
}

export const communityCategories = [
  { id: "games", name: "Games", icon: "🎮" },
  { id: "apps", name: "Apps", icon: "📱" },
  { id: "components", name: "Components", icon: "🧩" },
  { id: "templates", name: "Templates", icon: "📄" },
  { id: "tools", name: "Tools", icon: "🔧" },
  { id: "other", name: "Other", icon: "✨" },
]

export async function getCommunityPosts(
  options: {
    limit?: number
    offset?: number
    category?: string
    search?: string
    userId?: string
    postType?: "component" | "full_chat"
  } = {},
) {
  const supabase = createClient()

  let query = supabase
    .from("community_posts")
    .select(`
      *,
      community_likes!left(user_id)
    `)
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  if (options.limit) {
    query = query.limit(options.limit)
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  if (options.category) {
    query = query.eq("category", options.category)
  }

  if (options.userId) {
    query = query.eq("user_id", options.userId)
  }

  if (options.postType) {
    query = query.eq("post_type", options.postType)
  }

  if (options.search) {
    query = query.or(
      `title.ilike.%${options.search}%,description.ilike.%${options.search}%,creator_name.ilike.%${options.search}%`,
    )
  }

  const { data, error } = await query

  if (error) throw error

  return (
    data?.map((post) => ({
      ...post,
      user_liked: post.community_likes?.some((like: CommunityLike) => like.user_id === options.userId) || false,
    })) || []
  )
}

export async function getCommunityPost(postId: string, userId?: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("community_posts")
    .select(`
      *,
      community_likes!left(user_id)
    `)
    .eq("id", postId)
    .eq("is_public", true)
    .single()

  if (error) throw error

  return {
    ...data,
    user_liked: data.community_likes?.some((like: CommunityLike) => like.user_id === userId) || false,
  }
}

export async function getChatSnapshot(communityPostId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("community_chat_snapshots")
    .select("*")
    .eq("community_post_id", communityPostId)
    .single()

  if (error) throw error
  return data
}

export async function togglePostLike(postId: string, userId: string) {
  const supabase = createClient()

  // Check if already liked
  const { data: existingLike } = await supabase
    .from("community_likes")
    .select("id")
    .eq("user_id", userId)
    .eq("community_post_id", postId)
    .single()

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from("community_likes")
      .delete()
      .eq("user_id", userId)
      .eq("community_post_id", postId)

    if (error) throw error
    return false
  } else {
    // Like
    const { error } = await supabase.from("community_likes").insert({
      user_id: userId,
      community_post_id: postId,
    })

    if (error) throw error
    return true
  }
}

export async function incrementPostView(postId: string, userId?: string) {
  const supabase = createClient()

  // Increment view count
  await supabase.rpc("increment_post_view_count", { post_id: postId })

  // Track individual view
  if (userId) {
    await supabase.from("community_views").insert({
      user_id: userId,
      community_post_id: postId,
    })
  }
}

export function formatPostDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    return "Just now"
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24)
    return `${days}d ago`
  } else {
    return date.toLocaleDateString()
  }
}