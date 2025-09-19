"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Sparkles, TrendingUp } from "lucide-react"
import CourseCard from "./course-card"

interface Course {
  id: string
  title: string
  description: string
  creator_name: string
  difficulty_level: string
  thumbnail_url?: string
  total_duration?: string
  total_videos: number
}

interface SearchResults {
  courses: Course[]
  aiSuggestions?: {
    suggestions: string[]
    topics: string[]
    skillLevels: string[]
  }
  query: string
}

export default function SmartSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResults | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch("/api/smart-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    performSearch(suggestion)
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent-foreground h-5 w-5" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses with AI assistance..."
          className="pl-12 pr-24 bg-[#8888881A] border-gray-700 text-white placeholder-accent-foreground h-12 rounded-xl"
        />
        <Button
          type="submit"
          disabled={isSearching}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700"
        >
          {isSearching ? <Sparkles className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>

      {/* AI Suggestions */}
      {results?.aiSuggestions && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">AI Suggestions</span>
            </div>

            <div className="space-y-3">
              {results.aiSuggestions.suggestions.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Related searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {results.aiSuggestions.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {results.aiSuggestions.topics.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Suggested topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {results.aiSuggestions.topics.map((topic, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSuggestionClick(topic)}
                        className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {results && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Search Results for &quot;{results.query}&quot; ({results.courses.length} found)
          </h3>

          {results.courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description || ""}
                  creator_name={course.creator_name}
                  difficulty_level={course.difficulty_level}
                  thumbnail_url={course.thumbnail_url}
                  total_duration={course.total_duration}
                  total_videos={course.total_videos}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No courses found matching your search.</p>
              <p className="text-sm">Try the AI suggestions above or search for different terms.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}