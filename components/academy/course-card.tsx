"use client"

import Link from "next/link"
import { Clock, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createClient } from "@/supabase/client"

interface CourseCardProps {
  id: string
  title: string
  description: string
  creator_name: string
  difficulty_level: string
  thumbnail_url?: string
  total_duration?: string
  total_videos: number
  onDelete: (id: string) => void
}

export default function CourseCard({
  id,
  title,
  description,
  difficulty_level,
  thumbnail_url,
  total_duration,
  total_videos,
  onDelete,
}: CourseCardProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
    }
    fetchUser()
  }, [supabase])

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete(id)
  }

  const canDeleteCourse = userEmail === "orelrevivo4000@gmail.com"

  return (
    <div className="w-[470px] mx-[5px] my-[10px] flex-shrink-0"> {/* Adjusted margins for 10px horizontal gap; prevent shrinking */}
      <Link href={`/academy/course/${id}`}>
        <Card className="transition-colors cursor-pointer group relative w-[470px]">
          {/* Delete button (only admin) */}
          {canDeleteCourse && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-red-100"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}

          <CardContent className="p-0">
            {/* Fixed image size */}
            <div className="w-[470px] h-[264.38px] bg-[#8888881A] rounded-t-lg overflow-hidden">
              {thumbnail_url ? (
                <img
                  src={thumbnail_url}
                  alt={title}
                  className="w-[470px] h-[264.38px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">Z</span>
                  </div>
                </div>
              )}
            </div>

            {/* Title + description full width */}
            <div className="w-[470px] p-3">
              <h3 className="text-lg font-sans font-light text-black line-clamp-3 w-full">
                {title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-4 font-sans font-light text-[12px] w-full">
                {description}
              </p>

              {/* Bottom row */}
              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <span className="font-sans font-light text-[14px]">{difficulty_level}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{total_videos} videos</span>
                  </div>
                  {total_duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{total_duration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}


// "use client"

// import Link from "next/link"
// import { Clock, Trash2 } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { useEffect, useState } from "react"
// import { createClient } from "@/supabase/client"
// import Image from "next/image"

// interface CourseCardProps {
//   id: string
//   title: string
//   description: string
//   creator_name: string
//   difficulty_level: string
//   thumbnail_url?: string
//   total_duration?: string
//   total_videos: number
//   onDelete: (id: string) => void
// }

// export default function CourseCard({
//   id,
//   title,
//   description,
//   difficulty_level,
//   thumbnail_url,
//   total_duration,
//   total_videos,
//   onDelete,
// }: CourseCardProps) {
//   const [userEmail, setUserEmail] = useState<string | null>(null)
//   const supabase = createClient()

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser()
//       setUserEmail(user?.email || null)
//     }
//     fetchUser()
//   }, [supabase])

//   const handleDelete = (e: React.MouseEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     onDelete(id)
//   }

//   const canDeleteCourse = userEmail === "orelrevivo4000@gmail.com"

//   return (
//     <div className="w-[470px] mx-[5px] my-[10px] flex-shrink-0"> {/* Adjusted margins for 10px horizontal gap; prevent shrinking */}
//       <Link href={`/academy/course/${id}`}>
//         <Card className="transition-colors cursor-pointer group relative w-[470px]">
//           {/* Delete button (only admin) */}
//           {canDeleteCourse && (
//             <Button
//               variant="ghost"
//               size="icon"
//               className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-red-100"
//               onClick={handleDelete}
//             >
//               <Trash2 className="h-4 w-4 text-red-500" />
//             </Button>
//           )}

//           <CardContent className="p-0">
//             {/* Fixed image size */}
//             <div className="w-[470px] h-[264.38px] bg-[#8888881A] rounded-t-lg overflow-hidden">
//               {thumbnail_url ? (
//                 <Image
//                   src={thumbnail_url}
//                   alt={title}
//                   width={470}
//                   height={264.38}
//                   className="w-[470px] h-[264.38px] object-cover group-hover:scale-105 transition-transform duration-300"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                   <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
//                     <span className="text-2xl font-bold text-white">Z</span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Title + description full width */}
//             <div className="w-[470px] p-3">
//               <h3 className="text-lg font-sans font-light text-black line-clamp-3 w-full">
//                 {title}
//               </h3>
//               <p className="text-sm text-gray-400 line-clamp-4 font-sans font-light text-[12px] w-full">
//                 {description}
//               </p>

//               {/* Bottom row */}
//               <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
//                 <span className="font-sans font-light text-[14px]">{difficulty_level}</span>
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-1">
//                     <Clock className="h-3 w-3" />
//                     <span>{total_videos} videos</span>
//                   </div>
//                   {total_duration && (
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-3 w-3" />
//                       <span>{total_duration}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </Link>
//     </div>
//   )
// }