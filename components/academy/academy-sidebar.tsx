"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Search, BookOpen, FileText, HelpCircle } from "lucide-react" // Play
import Navbar from "@/components/academy/navbar";

const navigation = [
  { name: "Academy", href: "/academy", icon: Home },
  { name: "Search", href: "/academy/search", icon: Search },
]

const learnSection = [
  { name: "Courses", href: "/academy/courses", icon: BookOpen },
  // { name: "Videos", href: "/academy/videos", icon: Play },
]

const helpSection = [
  { name: "Articles", href: "https://docs.zerlo.online/", icon: FileText },
  { name: "Support", href: "/contact", icon: HelpCircle },
]

export default function AcademySidebar() {
  const pathname = usePathname()

  return (
  <div>
  <Navbar />
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#8888881A] p-6 z-10">
     <div className="text-center mb-12">
      </div>
      <div className="space-y-8">
        {/* Main Navigation */}
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-[#8888881A] text-accent-foreground"
                    : "text-gray-400 hover:text-accent-foreground hover:bg-[#8888881A]",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Learn Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Learn</h3>
          <div className="space-y-2">
            {learnSection.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                    ? "bg-[#8888881A] text-accent-foreground"
                    : "text-gray-400 hover:text-accent-foreground hover:bg-[#8888881A]",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Help</h3>
          <div className="space-y-2">
            {helpSection.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                    ? "bg-[#8888881A] text-accent-foreground"
                    : "text-gray-400 hover:text-accent-foreground hover:bg-[#8888881A]",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
