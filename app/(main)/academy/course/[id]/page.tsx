import { createServerClient } from "@/supabase/server" // ✅ updated import
import { notFound } from "next/navigation"
import AcademySidebar from "@/components/academy/academy-sidebar"
import CoursePlayer from "@/components/academy/course-player"

interface CoursePageProps {
  params: Promise<{ id: string }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params
  const supabase = await createServerClient() // ✅ use server client

  // Fetch course data
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single()

  if (courseError || !course) {
    notFound()
  }

  // Fetch course videos
  const { data: videos, error: videosError } = await supabase
    .from("videos")
    .select("*")
    .eq("course_id", id)
    .order("order_index", { ascending: true })

  if (videosError) {
    console.error("Error fetching videos:", videosError)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <AcademySidebar />

      <div className="ml-64 min-h-screen">
        <CoursePlayer course={course} videos={videos || []} />
      </div>
    </div>
  )
}
