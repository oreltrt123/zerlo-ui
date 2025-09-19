"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import AcademySidebar from "@/components/academy/academy-sidebar"
import AICourseGenerator from "@/components/academy/ai-course-generator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Plus, Trash2, GripVertical, Sparkles, Upload, BarChart3 } from "lucide-react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import "@/styles/button.css"

interface Video {
  id: string
  title: string
  description: string
  video_url: string
  duration: string
  order_index: number
  platform: "direct" | "youtube" | "x" | "tiktok" | "other"
  uploadType: "link" | "file"
  file?: File
}

interface ContentAnalysis {
  qualityScore: number
  improvements: string[]
  seoTips: string[]
  engagementTips: string[]
  clarityImprovements: string[]
}

interface CourseOutline {
  title: string
  description: string
  videos: Array<{
    title: string
    description: string
    estimatedDuration: string
  }>
}

export default function CreateCourse() {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysis | null>(null)
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    creator_name: "",
    difficulty_level: "",
    thumbnail_url: "",
    published: false,
  })
  const [videos, setVideos] = useState<Video[]>([])

  const handleAIOutline = (outline: CourseOutline) => {
    setCourseData((prev) => ({
      ...prev,
      title: outline.title,
      description: outline.description,
      published: false,
    }))
    const aiVideos = outline.videos.map((video, index) => ({
      id: `ai-video-${Date.now()}-${index}`,
      title: video.title,
      description: video.description,
      video_url: "",
      duration: video.estimatedDuration,
      order_index: index,
      platform: "direct" as const,
      uploadType: "link" as const,
    }))
    setVideos(aiVideos)
    setShowAIGenerator(false)
  }

  const analyzeContent = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `${courseData.title} - ${courseData.description}`,
          type: "course",
        }),
      })
      if (response.ok) {
        const analysis = await response.json()
        setContentAnalysis(analysis)
      }
    } catch (error) {
      console.error("Content analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const addVideo = () => {
    const newVideo: Video = {
      id: `video-${Date.now()}`,
      title: "",
      description: "",
      video_url: "",
      duration: "",
      order_index: videos.length,
      platform: "youtube",
      uploadType: "link",
    }
    setVideos([...videos, newVideo])
  }

  const removeVideo = (id: string) => {
    setVideos(videos.filter((video) => video.id !== id))
  }

  const updateVideoField = (id: string, field: keyof Video, value: string) => {
    setVideos(videos.map((video) => (video.id === id ? { ...video, [field]: value } : video)))
  }

  const setVideoFile = (id: string, file: File | undefined) => {
    setVideos(videos.map((video) => (video.id === id ? { ...video, file } : video)))
  }

const onDragEnd = (result: DropResult) => {
  if (!result.destination) return
  const items = Array.from(videos)
  const [reorderedItem] = items.splice(result.source.index, 1)
  items.splice(result.destination.index, 0, reorderedItem)
  const updatedItems = items.map((item, index) => ({
    ...item,
    order_index: index,
  }))
  setVideos(updatedItems)
}

  const enhanceWithAI = async () => {
    setIsEnhancing(true)
    try {
      const response = await fetch("/api/enhance-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: courseData.title,
          description: courseData.description,
          videos: videos,
        }),
      })
      if (response.ok) {
        const enhanced = await response.json()
        setCourseData((prev) => ({
          ...prev,
          title: enhanced.title || prev.title,
          description: enhanced.description || prev.description,
        }))
        if (enhanced.videos) {
          setVideos(enhanced.videos.map((v: Video) => ({ ...v, platform: v.platform || "direct", uploadType: v.uploadType || "link" })))
        }
      }
    } catch (error) {
      console.error("AI enhancement failed:", error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) throw new Error("Authentication error")
      if (user.email !== "orelrevivo4000@gmail.com") throw new Error("Unauthorized")

      const courseInsertData = {
        title: courseData.title,
        description: courseData.description,
        creator_email: user.email,
        creator_name: courseData.creator_name,
        difficulty_level: courseData.difficulty_level.toLowerCase(),
        thumbnail_url: courseData.thumbnail_url || null,
        published: courseData.published,
        category: "general",
        estimated_duration: videos.reduce((total, video) => {
          const parts = video.duration.split(":")
          return parts.length === 2 ? total + Number.parseInt(parts[0]) + Number.parseInt(parts[1]) / 60 : total
        }, 0),
        tags: [],
        price: 0.0,
        currency: "USD",
      }

      const { data: course, error: courseError } = await supabase
        .from("courses")
        .insert(courseInsertData)
        .select()
        .single()
      if (courseError || !course) throw new Error(courseError?.message || "Course creation failed")

      const processedVideos = [...videos]
      for (const video of processedVideos) {
        if (video.uploadType === "file" && video.file) {
          const filePath = `courses/${course.id}/${video.id}-${video.file.name}`
          const { error: uploadError } = await supabase.storage
            .from("course-videos")
            .upload(filePath, video.file)
          if (uploadError) throw new Error(`Video upload failed: ${uploadError.message}`)
          const { data: urlData } = supabase.storage.from("course-videos").getPublicUrl(filePath)
          video.video_url = urlData.publicUrl
          video.platform = "direct"
        }
      }

      if (processedVideos.length > 0) {
        const videosToInsert = processedVideos.map((video, index) => ({
          course_id: course.id,
          title: video.title || `Video ${index + 1}`,
          description: video.description || "",
          video_url: video.video_url || "",
          duration: video.duration ? Number.parseInt(video.duration.split(":")[0]) * 60 + Number.parseInt(video.duration.split(":")[1] || "0") : 0,
          order_index: video.order_index,
          is_preview: index === 0,
          thumbnail_url: null,
          platform: video.platform || "direct",
        }))
        const { error: videosError } = await supabase.from("videos").insert(videosToInsert)
        if (videosError) throw new Error(videosError.message)
      }

      alert(`Course "${course.title}" created successfully!`)
      router.push(`/academy/course/${course.id}`)
    } catch (error) {
      alert(`Error creating course: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <AcademySidebar />
      <div className="ml-64 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
            <p className="text-gray-400">Build an engaging course for the Zerlo Academy</p>
          </div>
          <div className="mb-6">
            <Button
              type="button"
              onClick={() => setShowAIGenerator(!showAIGenerator)}
              className="bg-[#0099ffb2] hover:bg-[#0099ffbe] r2552esf25_252trewt3erblueFontDocs shadow-none"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {showAIGenerator ? "Hide AI Generator" : "Generate Course with AI"}
            </Button>
          </div>
          {showAIGenerator && <AICourseGenerator onOutlineGenerated={handleAIOutline} />}
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="border border-[#8888881A]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Course Details</CardTitle>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={analyzeContent}
                    disabled={isAnalyzing || !courseData.title || !courseData.description}
                    className="shadow-none border-purple-600 text-accent-foreground hover:bg-purple-600 hover:text-accent-foreground bg-transparent r2552esf25_252trewt3erblueFontDocs"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {isAnalyzing ? "Analyzing..." : "Analyze Content"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={enhanceWithAI}
                    disabled={isEnhancing}
                    className="shadow-none border-purple-600 text-accent-foreground hover:bg-[#8888881A] hover:text-accent-foreground bg-transparent r2552esf25_252trewt3erblueFontDocs"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isEnhancing ? "Enhancing..." : "Enhance with AI"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {contentAnalysis && (
                  <Card className="bg-green-900/20 border-green-600/30">
                    <CardHeader>
                      <CardTitle className="text-green-300 text-sm">Content Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Quality Score:</span>
                        <span className="text-lg font-bold text-green-400">{contentAnalysis.qualityScore}/10</span>
                      </div>
                      {contentAnalysis.improvements.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Improvements:</p>
                          <ul className="text-xs text-gray-300 space-y-1">
                            {contentAnalysis.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-400">•</span>
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      value={courseData.title}
                      onChange={(e) => setCourseData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter course title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creator">Creator Name</Label>
                    <Input
                      id="creator"
                      value={courseData.creator_name}
                      onChange={(e) => setCourseData((prev) => ({ ...prev, creator_name: e.target.value }))}
                      placeholder="Enter creator name"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select
                      value={courseData.difficulty_level}
                      onValueChange={(value) => setCourseData((prev) => ({ ...prev, difficulty_level: value }))}
                      required
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                    <Input
                      id="thumbnail"
                      value={courseData.thumbnail_url}
                      onChange={(e) => setCourseData((prev) => ({ ...prev, thumbnail_url: e.target.value }))}
                      placeholder="Enter thumbnail URL"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea
                    id="description"
                    value={courseData.description}
                    onChange={(e) => setCourseData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what students will learn"
                    className="bg-gray-800 border-gray-700 min-h-[120px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="published">Publish Course</Label>
                  <input
                    type="checkbox"
                    id="published"
                    checked={courseData.published}
                    onChange={(e) => setCourseData((prev) => ({ ...prev, published: e.target.checked }))}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="border border-[#8888881A]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Course Videos</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVideo}
                  className="bg-[#0099ffb2] hover:bg-[#0099ffbe] r2552esf25_252trewt3erblueFontDocs text-white hover:text-white shadow-none"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Video
                </Button>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="videos">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {videos.map((video, index) => (
                          <Draggable key={video.id} draggableId={video.id} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} className="bg-[#8888881A] rounded-lg p-4">
                                <div className="flex items-start gap-4">
                                  <div {...provided.dragHandleProps} className="mt-2">
                                    <GripVertical className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <Input
                                        value={video.title}
                                        onChange={(e) => updateVideoField(video.id, "title", e.target.value)}
                                        placeholder="Video title"
                                      />
                                      <Input
                                        value={video.duration}
                                        onChange={(e) => updateVideoField(video.id, "duration", e.target.value)}
                                        placeholder="Duration (e.g., 5:30)"
                                      />
                                    </div>
                                    <Select
                                      value={video.uploadType}
                                      onValueChange={(value) => updateVideoField(video.id, "uploadType", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select upload type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="link">Link from Platform</SelectItem>
                                        <SelectItem value="file">Upload from Computer</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    {video.uploadType === "link" ? (
                                      <>
                                        <Select
                                          value={video.platform}
                                          onValueChange={(value) => updateVideoField(video.id, "platform", value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select platform" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="youtube">YouTube</SelectItem>
                                            <SelectItem value="x">X</SelectItem>
                                            <SelectItem value="tiktok">TikTok</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                            <SelectItem value="direct">Direct URL</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <Input
                                          value={video.video_url}
                                          onChange={(e) => updateVideoField(video.id, "video_url", e.target.value)}
                                          placeholder="Paste video URL"
                                        />
                                      </>
                                    ) : (
                                      <Input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => setVideoFile(video.id, e.target.files?.[0])}
                                      />
                                    )}
                                    <Textarea
                                      value={video.description}
                                      onChange={(e) => updateVideoField(video.id, "description", e.target.value)}
                                      placeholder="Video description"
                                      rows={2}
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeVideo(video.id)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                {videos.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No videos added yet. Click &quot;Add Video&quot; to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="shadow-none text-accent-foreground hover:bg-[#8888881A] hover:text-accent-foreground bg-transparent r2552esf25_252trewt3erblueFontDocs"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-[#0099ffb2] hover:bg-[#0099ffbe] r2552esf25_252trewt3erblueFontDocs">
                {isLoading ? "Creating Course..." : "Create Course"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}