"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Users, MessageSquare, Code2, TrendingUp, Eye, Heart } from "lucide-react"

interface CommunityStatsProps {
  className?: string
}

export default function CommunityStats({ className }: CommunityStatsProps) {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalUsers: 0,
    chatPosts: 0,
    componentPosts: 0,
  })
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get post counts and aggregated stats
        const { data: postStats, error: postError } = await supabase
          .from("community_posts")
          .select("post_type, view_count, like_count")
          .eq("is_public", true)

        if (postError) throw postError

        // Get unique user count
        const { data: userStats, error: userError } = await supabase
          .from("community_posts")
          .select("user_id")
          .eq("is_public", true)

        if (userError) throw userError

        const uniqueUsers = new Set(userStats?.map((p) => p.user_id) || []).size
        const totalViews = postStats?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0
        const totalLikes = postStats?.reduce((sum, post) => sum + (post.like_count || 0), 0) || 0
        const chatPosts = postStats?.filter((p) => p.post_type === "full_chat").length || 0
        const componentPosts = postStats?.filter((p) => p.post_type === "component").length || 0

        setStats({
          totalPosts: postStats?.length || 0,
          totalViews,
          totalLikes,
          totalUsers: uniqueUsers,
          chatPosts,
          componentPosts,
        })
      } catch (error) {
        console.error("Error loading community stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [supabase])

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statItems = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Chat Posts",
      value: stats.chatPosts,
      icon: MessageSquare,
      color: "text-green-600",
    },
    {
      title: "Components",
      value: stats.componentPosts,
      icon: Code2,
      color: "text-purple-600",
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      color: "text-orange-600",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes,
      icon: Heart,
      color: "text-red-600",
    },
    {
      title: "Contributors",
      value: stats.totalUsers,
      icon: Users,
      color: "text-indigo-600",
    },
  ]

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
      {statItems.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              </div>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
