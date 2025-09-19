import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

type Props = {
  popularTags: Array<{ tag: string; count: number }>
  handleTagClick: (tag: string) => void
}

export default function PopularTags({ popularTags, handleTagClick }: Props) {
  if (popularTags.length === 0) return null

  return (
    <div className="text-center space-y-3">
      <div className="flex items-center justify-center gap-2">
        <TrendingUp className="h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-700">Popular Tags</h3>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {popularTags.map(({ tag, count }) => (
          <Badge
            key={tag}
            variant="secondary"
            className="cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => handleTagClick(tag)}
          >
            {tag} ({count})
          </Badge>
        ))}
      </div>
    </div>
  )
}