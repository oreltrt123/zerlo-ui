"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/supabase/client"
import AcademySidebar from "@/components/academy/academy-sidebar"
import CourseCard from "@/components/academy/course-card"
import { BookOpen } from "lucide-react"
import "@/styles/button.css"

interface Course {
  id: string
  title: string
  description: string
  creator_name: string
  difficulty_level: string
  thumbnail_url?: string
  total_duration?: string
  total_videos: number
  published: boolean
}

export default function Academy() {
  const supabase = createClient()
  const [courses, setCourses] = useState<Course[]>([])
  const [, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6)
      if (data) setCourses(data)
    }
    fetchData()
  }, [supabase])

  const handleDeleteCourse = async (id: string) => {
    await supabase.from("courses").delete().eq("id", id)
    setCourses((prev) => prev.filter((course) => course.id !== id))
  }


  return (
    <div className="min-h-screen bg-white text-black">
      <AcademySidebar />
      <div className="ml-64 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-12">
               <div className="text-center mb-12">
      </div>
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.length > 0 ? (
                courses.map((course) => (
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
                    onDelete={handleDeleteCourse}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No courses available yet</p>
                    <p className="text-sm">Check back soon for new content!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}