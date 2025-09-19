import type React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import "@/styles/button.css"

type Props = {
  searchQuery: string
  setSearchQuery: (q: string) => void
  handleSearch: () => void
  handleSearchKeyPress: (e: React.KeyboardEvent) => void
  isSearching?: boolean
  isSearchPage?: boolean
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleSearchKeyPress,
  isSearching = false,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <form
          onSubmit={handleSearch}
          className="relative w-full text-center"
        >
          <Input
            type="text"
            placeholder="Search projects, creators, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="w-full pl-3 pr-24 bg-[#8888881A] border-gray-700 text-white placeholder:text-sm placeholder-accent-foreground h-10 rounded-xl"
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#0099FF] hover:bg-blue-700 r2552esf25_252trewt3erblueFontDocs"
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>
      </div>
    </div>
  )
}
