"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Wand2, BookOpen } from "lucide-react"

interface CourseOutline {
  title: string
  description: string
  learningObjectives: string[]
  videos: Array<{
    title: string
    description: string
    estimatedDuration: string
  }>
}

interface AICourseGeneratorProps {
  onOutlineGenerated: (outline: CourseOutline) => void
}

export default function AICourseGenerator({ onOutlineGenerated }: AICourseGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    topic: "",
    difficulty: "",
    targetAudience: "",
  })

  const generateOutline = async () => {
    if (!formData.topic || !formData.difficulty || !formData.targetAudience) {
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-course-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const outline = await response.json()
        onOutlineGenerated(outline)
      }
    } catch (error) {
      console.error("Failed to generate outline:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-purple-[#0099FF] to-blue-900/20 border-[#0099FF]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent-foreground">
          <Wand2 className="h-5 w-5" />
          AI Course Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Course Topic</Label>
          <Input
            id="topic"
            value={formData.topic}
            onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
            placeholder="e.g., React Fundamentals, Python for Beginners"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, difficulty: value }))}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Input
              id="audience"
              value={formData.targetAudience}
              onChange={(e) => setFormData((prev) => ({ ...prev, targetAudience: e.target.value }))}
              placeholder="e.g., Web developers, Students"
            />
          </div>
        </div>

        <Button
          onClick={generateOutline}
          disabled={isGenerating || !formData.topic || !formData.difficulty || !formData.targetAudience}
          className="w-full text-accent-foreground hover:text-accent-foreground bg-[#0099ffb2] hover:bg-[#0099ffbe] r2552esf25_252trewt3erblueFontDocs shadow-none"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Generating Course Outline...
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4 mr-2" />
              Generate Course Outline
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}