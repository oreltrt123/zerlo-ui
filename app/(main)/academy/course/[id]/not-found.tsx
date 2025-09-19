import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowLeft } from "lucide-react"
import AcademySidebar from "@/components/academy/academy-sidebar"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white">
      <AcademySidebar />

      <div className="ml-64 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="text-gray-400">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
            <p className="text-gray-400 mb-6">The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          </div>
          <Link href="/academy">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Academy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}