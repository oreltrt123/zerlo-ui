"use client"

import { useState, useEffect } from "react"
import { Play, Clock, User, CheckCircle, Circle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import "@/styles/button.css"

interface Course {
  id: string
  title: string
  description: string
  creator_name: string
  difficulty_level: string
  thumbnail_url?: string
  total_videos: number
  total_duration?: string
}

interface Video {
  id: string
  title: string
  description: string
  video_url: string
  duration: string
  order_index: number
  platform: string
}

interface CoursePlayerProps {
  course: Course
  videos: Video[]
}

function getYouTubeEmbedUrl(url: string): string {
  let videoId = ""
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0]
  } else if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1].split("&")[0]
  }
  return `https://www.youtube.com/embed/${videoId}`
}

function getTikTokEmbedUrl(url: string): string {
  const match = url.match(/\/video\/(\d+)/)
  const videoId = match ? match[1] : ""
  return `https://www.tiktok.com/embed/v2/${videoId}`
}

export default function CoursePlayer({ course, videos }: CoursePlayerProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [completedVideos, setCompletedVideos] = useState<Set<number>>(new Set())

  const currentVideo = videos[currentVideoIndex]

  const hasXVideo = videos.some((v) => v.platform === "x")

  useEffect(() => {
    if (hasXVideo) {
      const script = document.createElement("script")
      script.src = "https://platform.twitter.com/widgets.js"
      script.async = true
      script.charset = "utf-8"
      document.body.appendChild(script)
      return () => {
        document.body.removeChild(script)
      }
    }
  }, [hasXVideo])

  const markVideoComplete = (index: number) => {
    setCompletedVideos((prev) => new Set([...prev, index]))
  }

  const selectVideo = (index: number) => {
    setCurrentVideoIndex(index)
  }

  const nextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      markVideoComplete(currentVideoIndex)
      setCurrentVideoIndex(currentVideoIndex + 1)
    }
  }

  const prevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1)
    }
  }

  const renderVideoPlayer = () => {
    if (!currentVideo?.video_url) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <Play className="h-16 w-16 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">
              {videos.length === 0 ? "No videos available" : "Select a video to start learning"}
            </p>
          </div>
        </div>
      )
    }

    if (currentVideo.platform === "youtube") {
      return (
        <iframe
          width="100%"
          height="100%"
          src={getYouTubeEmbedUrl(currentVideo.video_url)}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    } else if (currentVideo.platform === "tiktok") {
      return (
        <iframe
          width="100%"
          height="100%"
          src={getTikTokEmbedUrl(currentVideo.video_url)}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    } else if (currentVideo.platform === "x") {
      return <div dangerouslySetInnerHTML={{ __html: `<blockquote class="twitter-tweet"><a href="${currentVideo.video_url}"></a></blockquote>` }} />
    } else {
      // direct or other
      return (
        <video key={currentVideo.id} controls className="w-full h-full" poster={course.thumbnail_url}>
          <source src={currentVideo.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )
    }
  }

  return (
    <div className="flex h-screen">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">     <div className="text-center mb-12">
      </div>
        {/* Video Player Section */}
        <div className="bg-white p-8 border-b border-[#8888881A]">
          <div className="max-w-4xl mx-auto">
            {/* Video Player */}
            <div className="aspect-video bg-white rounded-lg mb-6 overflow-hidden">
              {renderVideoPlayer()}
            </div>

            {/* Course Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-gray-400 text-lg leading-relaxed">{course.description}</p>
              </div>

              {currentVideo && (
                <div className="border-t border-[#8888881A] pt-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {currentVideoIndex + 1}. {currentVideo.title}
                  </h2>
                  {currentVideo.description && <p className="text-gray-400">{currentVideo.description}</p>}
                </div>
              )}

              {/* Navigation Controls */}
              {videos.length > 0 && (
                <div className="flex items-center gap-4 pt-4">
                  <Button
                    onClick={prevVideo}
                    disabled={currentVideoIndex === 0}
                    variant="outline"
                    className="text-accent-foreground border border-[#8888881A] hover:bg-gray-800 bg-transparent shadow-none r2552esf25_252trewt3erblueFontDocs"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={nextVideo}
                    disabled={currentVideoIndex === videos.length - 1}
                    className="bg-[#0099ffb2] hover:bg-[#0099ffbe] r2552esf25_252trewt3erblueFontDocs"
                  >
                    {currentVideoIndex === videos.length - 1 ? "Complete Course" : "Next Video"}
                  </Button>
                  <Button
                    onClick={() => markVideoComplete(currentVideoIndex)}
                    variant="ghost"
                    className="r2552esf25_252trewt3erblueFontDocs text-green-400 hover:text-accent-foreground hover:bg-[#8888881A]"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Course Content */}
      <div className="w-80 bg-white border-l border-[#8888881A] flex flex-col">     <div className="text-center mb-12">
      </div>
        <div className="p-6 border-b border-[#8888881A]">
          <h3 className="font-semibold mb-2">Course Content</h3>
          <div className="flex items-center gap-4 text-sm text-accent-foreground">
            <div className="flex items-center gap-1">
              <Play className="h-4 w-4" />
              <span>{course.total_videos} videos</span>
            </div>
            {course.total_duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.total_duration}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{course.creator_name}</span>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {videos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No videos available</p>
              </div>
            ) : (
              videos.map((video, index) => (
                <Card
                  key={video.id}
                  className={`cursor-pointer transition-colors ${
                    index === currentVideoIndex
                      ? "bg-blue-900/30 border-[#0099FF]"
                      : "bg-gray-800 border-gray-700 hover:bg-gray-750"
                  }`}
                  onClick={() => selectVideo(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {completedVideos.has(index) ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500 font-mono">{String(index + 1).padStart(2, "0")}</span>
                          <Play className="h-3 w-3 text-gray-500" />
                        </div>
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">{video.title}</h4>
                        {video.duration && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{video.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Course Progress */}
        <div className="p-4 border-t border-[#8888881A]">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-white">
                {completedVideos.size} / {videos.length}
              </span>
            </div>
            <div className="w-full bg-[#8888881A] rounded-full h-2">
              <div
                className="bg-[#0099FF] h-2 rounded-full transition-all duration-300"
                style={{
                  width: videos.length > 0 ? `${(completedVideos.size / videos.length) * 100}%` : "0%",
                }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {videos.length > 0 && completedVideos.size === videos.length
                ? "Course completed!"
                : `${Math.round((completedVideos.size / Math.max(videos.length, 1)) * 100)}% complete`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}