// ./app/(main)/community/[id]/page.tsx
"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { ArrowLeft, Copy, Mail, Phone, Calendar, Tag, Heart, Eye, Code2, MessageSquare } from "lucide-react"
import * as React from "react"
import Image from "next/image"
import FullChatViewer from "@/components/community/FullChatViewer"

interface CommunityPost {
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
  post_type: "component" | "full_chat"
  view_count: number
  like_count: number
  user_liked?: boolean
  community_likes?: Array<{ user_id: string }>
}

interface Message {
  sender: "user" | "ai"
  content: string
  component_code?: string
  component_title?: string
  created_at?: string
}

interface CommunityLike {
  id: string
  user_id: string
  community_post_id: string
  created_at: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function CommunityPostPage({ params }: PageProps) {
  const resolvedParams = React.use(params)
  const postId = resolvedParams.id
  const [user, setUser] = useState<User | null>(null)
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiking, setIsLiking] = useState(false)

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
    }
  }, [supabase])

  const loadPost = useCallback(async () => {
    try {
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

      const userLiked = data.community_likes?.some((like: CommunityLike) => like.user_id === user?.id) || false

      setPost(data)
      setIsLiked(userLiked)
      setLikeCount(data.like_count || 0)

      await supabase.rpc("increment_post_view_count", { post_id: postId })

      if (user) {
        await supabase.from("community_views").insert({
          user_id: user.id,
          community_post_id: postId,
        })
      }
    } catch (error) {
      console.error("Error loading post:", error)
      toast.error("Error loading post")
      router.push("/community")
    } finally {
      setLoading(false)
    }
  }, [supabase, postId, router, user])

  const handleLike = async () => {
    if (!user) {
      toast.error("Please sign in to like posts")
      return
    }

    if (isLiking) return
    setIsLiking(true)

    try {
      if (isLiked) {
        const { error } = await supabase
          .from("community_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("community_post_id", postId)

        if (error) throw error

        setIsLiked(false)
        setLikeCount((prev) => prev - 1)
      } else {
        const { error } = await supabase.from("community_likes").insert({
          user_id: user.id,
          community_post_id: postId,
        })

        if (error) throw error

        setIsLiked(true)
        setLikeCount((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Failed to update like")
    } finally {
      setIsLiking(false)
    }
  }

  const handleCloneProject = async () => {
    if (!user || !post) {
      toast.error("Please login to clone projects")
      return
    }

    try {
      const { data: newChat, error: chatError } = await supabase
        .from("chats")
        .insert([
          {
            name: `Cloned: ${post.title}`,
            user_id: user.id,
            description: `Cloned from ${post.creator_name}'s ${post.post_type === "full_chat" ? "chat" : "project"}`,
          },
        ])
        .select()
        .single()

      if (chatError) throw chatError

      if (post.post_type === "component" && post.component_code) {
        const { error: messageError } = await supabase.from("messages").insert([
          {
            chat_id: newChat.id,
            sender: "ai",
            content: `This is a cloned project: ${post.title}\n\n${post.description}`,
            component_code: post.component_code,
            component_title: post.title,
          },
        ])

        if (messageError) throw messageError
      } else if (post.post_type === "full_chat") {
        const { data: snapshot, error: snapshotError } = await supabase
          .from("community_chat_snapshots")
          .select("snapshot_data")
          .eq("community_post_id", postId)
          .single()

        if (snapshotError) throw snapshotError

        if (snapshot?.snapshot_data?.messages) {
          const messagesToInsert = snapshot.snapshot_data.messages.map((msg: Message) => ({
            chat_id: newChat.id,
            sender: msg.sender,
            content: msg.content,
            component_code: msg.component_code || null,
            component_title: msg.component_title || null,
            created_at: new Date().toISOString(),
          }))

          const { error: messagesError } = await supabase.from("messages").insert(messagesToInsert)

          if (messagesError) throw messagesError
        }
      }

      toast.success(`${post.post_type === "full_chat" ? "Chat" : "Project"} cloned successfully!`)
      router.push(`/chat/${newChat.id}`)
    } catch (error) {
      console.error("Error cloning project:", error)
      toast.error(`Failed to clone ${post.post_type === "full_chat" ? "chat" : "project"}`)
    }
  }

  useEffect(() => {
    getUser()
  }, [getUser])

  useEffect(() => {
    if (user !== undefined) {
      loadPost()
    }
  }, [loadPost, user])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-light text-black mb-4">Post not found</h1>
          <Button onClick={() => router.push("/community")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Community
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#8888881A] bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push("/community")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Community
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.view_count}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={isLiking || !user}
                  className={`flex items-center gap-1 ${
                    isLiked ? "text-red-500 hover:text-red-600" : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                  <span>{likeCount}</span>
                </Button>
              </div>
              <Button onClick={handleCloneProject} className="bg-black text-white hover:bg-gray-800">
                <Copy className="h-4 w-4 mr-2" />
                Clone {post.post_type === "full_chat" ? "Chat" : "Project"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              {post.cover_image ? (
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                  {post.post_type === "full_chat" ? (
                    <MessageSquare className="h-16 w-16 text-gray-400" />
                  ) : (
                    <Code2 className="h-16 w-16 text-gray-400" />
                  )}
                </div>
              )}
              <div className="absolute top-4 left-4">
                <Badge
                  variant={post.post_type === "full_chat" ? "default" : "secondary"}
                  className="text-sm font-medium"
                >
                  {post.post_type === "full_chat" ? "Full Chat" : "Component"}
                </Badge>
              </div>
            </div>

            {/* Project Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-light text-black mb-2">{post.title}</h1>
                <p className="text-lg text-gray-600">{post.description}</p>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Tabs */}
              <Tabs defaultValue={post.post_type === "full_chat" ? "chat" : "preview"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  {post.post_type === "component" && <TabsTrigger value="preview">Live Preview</TabsTrigger>}
                  {post.post_type === "full_chat" && <TabsTrigger value="chat">Chat Conversation</TabsTrigger>}
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                {post.post_type === "component" && (
                  <TabsContent value="preview" className="mt-4">
                    <div className="border border-[#8888881A] rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b border-[#8888881A]">
                        <h3 className="font-medium text-black">Live Preview</h3>
                      </div>
                      <div className="aspect-video bg-black">
                        <iframe
                          title={`Preview of ${post.title}`}
                          sandbox="allow-scripts allow-downloads allow-pointer-lock allow-modals allow-popups allow-same-origin allow-fullscreen"
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            background: "#000",
                          }}
                          srcDoc={post.component_code}
                        />
                      </div>
                    </div>
                  </TabsContent>
                )}

                {post.post_type === "full_chat" && (
                  <TabsContent value="chat" className="mt-4">
                    <FullChatViewer
                      communityPostId={post.id}
                      postTitle={post.title}
                      creatorName={post.creator_name}
                      creatorAvatar={post.profile_picture}
                    />
                  </TabsContent>
                )}

                <TabsContent value="details" className="mt-4">
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <h3 className="font-medium text-black">Project Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Type:</span>
                        <span className="ml-2 text-gray-600">
                          {post.post_type === "full_chat" ? "Full Chat Conversation" : "Component/Project"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Category:</span>
                        <span className="ml-2 text-gray-600">{post.category}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Created:</span>
                        <span className="ml-2 text-gray-600">{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Views:</span>
                        <span className="ml-2 text-gray-600">{post.view_count}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Creator Info */}
          <div className="space-y-6">
            {/* Creator Card */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="font-medium text-black">Created by</h3>

              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.profile_picture || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gray-200">{post.creator_name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-black">{post.creator_name}</h4>
                  <p className="text-sm text-gray-500">Community Member</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                {post.creator_email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${post.creator_email}`} className="hover:text-blue-600">
                      {post.creator_email}
                    </a>
                  </div>
                )}
                {post.creator_phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${post.creator_phone}`} className="hover:text-blue-600">
                      {post.creator_phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Created {new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button onClick={handleCloneProject} className="w-full bg-black text-white hover:bg-gray-800">
                <Copy className="h-4 w-4 mr-2" />
                Clone & Customize
              </Button>
              <Button
                variant="ghost"
                onClick={handleLike}
                disabled={isLiking || !user}
                className={`w-full ${isLiked ? "text-red-500 hover:text-red-600" : "text-gray-600 hover:text-red-500"}`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Liked" : "Like"} ({likeCount})
              </Button>
            </div>

            {/* Project Stats */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-black">Project Stats</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Views:</span>
                  <span>{post.view_count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Likes:</span>
                  <span>{likeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span>{post.post_type === "full_chat" ? "Chat" : "Component"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span>{post.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}