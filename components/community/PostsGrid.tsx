"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import CommunityCard from "@/components/community/CommunityCard"
import type { CommunityPost } from "@/lib/community-utils" // Fixed: Import from utils where it's exported

type Props = {
  filteredPosts: CommunityPost[]
  isTemplates: boolean
  onLike: (postId: string, liked: boolean) => void
  hasFilter: boolean
}

export default function PostsGrid({ filteredPosts, isTemplates, onLike, hasFilter }: Props) {
  const router = useRouter()

  let emptyMessage: React.ReactNode
  if (isTemplates) {
    emptyMessage = (
      <>
        You have not published any templates yet.{" "}
        <Button variant="link" onClick={() => router.push("/chat")} className="p-0 h-auto">
          Create your first project
        </Button>
      </>
    )
  } else {
    emptyMessage = hasFilter ? "No projects found matching your criteria" : "No projects yet"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPosts.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-500">{emptyMessage}</div>
        </div>
      ) : (
        filteredPosts.map((post) => <CommunityCard key={post.id} post={post} onLike={onLike} />)
      )}
    </div>
  )
}