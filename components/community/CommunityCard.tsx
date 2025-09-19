"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, Eye, Code2, MessageSquare } from "lucide-react"
import { createClient } from "@/supabase/client"
import { toast } from "sonner"
import Link from "next/link"

interface CommunityCardProps {
  post: {
    id: string
    title: string
    description: string
    cover_image?: string
    hover_image?: string
    profile_picture?: string
    creator_name: string
    category: string
    tags: string[]
    post_type: "component" | "full_chat"
    view_count: number
    like_count: number
    created_at: string
    user_liked?: boolean
  }
  onLike?: (postId: string, liked: boolean) => void
}

export default function CommunityCard({ post, onLike }: CommunityCardProps) {
  const [isLiked, setIsLiked] = useState(post.user_liked || false)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [isHovered, setIsHovered] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const supabase = createClient()

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLiking) return
    setIsLiking(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Please sign in to like posts")
        return
      }

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from("community_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("community_post_id", post.id)

        if (error) throw error

        setIsLiked(false)
        setLikeCount((prev) => prev - 1)
        onLike?.(post.id, false)
      } else {
        // Like
        const { error } = await supabase.from("community_likes").insert({
          user_id: user.id,
          community_post_id: post.id,
        })

        if (error) throw error

        setIsLiked(true)
        setLikeCount((prev) => prev + 1)
        onLike?.(post.id, true)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Failed to update like")
    } finally {
      setIsLiking(false)
    }
  }

  const displayImage = isHovered && post.hover_image ? post.hover_image : post.cover_image

  return (
    <Link href={`/community/${post.id}`}>
      <Card
        className="w-[470px] mx-[5px] my-[10px] flex-shrink-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          {/* Cover Image */}
          <div className="w-[470px] h-[264.38px] bg-[#8888881A] rounded-t-lg overflow-hidden">
            {displayImage ? (
              <img
                src={displayImage || "/placeholder.svg"}
                alt={post.title}
                className="w-[470px] h-[264.38px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                {post.post_type === "full_chat" ? (
                  <MessageSquare className="h-12 w-12 text-gray-400" />
                ) : (
                  <Code2 className="h-12 w-12 text-gray-400" />
                )}
              </div>
            )}

            {/* Post Type Badge */}
            {/* <div className="relative top-3 left-3">
              <Badge variant={post.post_type === "full_chat" ? "default" : "secondary"} className="text-xs font-medium">
                {post.post_type === "full_chat" ? "Full Chat" : "Component"}
              </Badge>
            </div> */}

            {/* Category Badge */}
            {/* <div className="relative top-3 right-3">
              <Badge variant="outline" className="bg-white/90 text-xs">
                {post.category}
              </Badge>
            </div> */}
          </div>

          {/* Content */}
            <div className="w-[470px] p-3">
            {/* Title */}
            <h3 className="text-lg font-sans font-light text-black line-clamp-3 w-full">
              {post.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-400 line-clamp-4 font-sans font-light text-[12px] w-full">{post.description}</p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Creator Info */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.profile_picture || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{post.creator_name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700 font-medium">{post.creator_name}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span className="text-xs">{post.view_count}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto p-0 hover:bg-transparent ${
                    isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                  }`}
                  onClick={handleLike}
                  disabled={isLiking}
                >
                  <div className="flex items-center gap-1">
                    <Heart className={`h-3 w-3 ${isLiked ? "fill-current" : ""}`} />
                    <span className="text-xs">{likeCount}</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
