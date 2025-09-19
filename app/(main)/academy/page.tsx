"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/supabase/client"
import AcademySidebar from "@/components/academy/academy-sidebar"
import CourseCard from "@/components/academy/course-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Plus } from "lucide-react"
import Link from "next/link"
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
  const [userEmail, setUserEmail] = useState<string | null>(null)

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

  const canCreateCourse = userEmail === "orelrevivo4000@gmail.com"

  return (
    <div className="min-h-screen bg-white text-black">
      <AcademySidebar />
      <div className="ml-64 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="text-center mb-13">
            {/* <h1 className="text-6xl font-bold mb-6 text-balance">
              The best place
              <br />
              to learn <span className="text-blue-500">Zerlo</span>
            </h1> */}
          </div>
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">Featured courses</h2>
              <div className="flex items-center gap-4">
                {canCreateCourse && (
                  <Link href="/academy/create_admin">
                    <Button className="bg-[#0099ffb2] hover:bg-[#0099ffbe] r2552esf25_252trewt3erblueFontDocs">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Course
                    </Button>
                  </Link>
                )}
                <Link href="/academy/courses">
                  <Button className="bg-[#0099ffb2] hover:bg-[#0099ffbe] r2552esf25_252trewt3erblueFontDocs">
                    All courses
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-2.5 gap-y-6"> {/* Two columns, 10px horizontal gap, 20px vertical gap */}
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