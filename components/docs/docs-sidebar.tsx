"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BookOpen, Gamepad2, Globe, Code, Shield, Settings, HelpCircle, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import "@/styles/button.css"

const navigation = [
  {
    title: "Getting Started",
    icon: BookOpen,
    href: "/docs/getting-started",
  },
  {
    title: "Authentication",
    icon: Shield,
    items: [
      { title: "Login Process", href: "/docs/authentication/login" },
      { title: "Sign Up Process", href: "/docs/authentication/signup" },
    ],
  },
  {
    title: "Game Development",
    icon: Gamepad2,
    items: [
      { title: "Quick Start Guide", href: "/docs/game-development/quick-start" },
      { title: "Advanced Features", href: "/docs/game-development/advanced" },
    ],
  },
  {
    title: "Web Development",
    icon: Globe,
    items: [
      { title: "Basic Concepts", href: "/docs/web-development/basics" },
      { title: "Deployment", href: "/docs/web-development/deployment" },
    ],
  },
  {
    title: "TypeScript",
    icon: Code,
    items: [
      { title: "Fundamentals", href: "/docs/typescript/fundamentals" },
      { title: "Advanced Features", href: "/docs/typescript/advanced-features" },
    ],
  },
  {
    title: "API Reference",
    icon: Settings,
    href: "/docs/api-reference",
  },
  {
    title: "Troubleshooting",
    icon: HelpCircle,
    href: "/docs/troubleshooting",
  },
]

export function DocsSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "Authentication",
    "Game Development",
    "Web Development",
    "TypeScript",
  ])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-14 overflow-y-auto">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Documentation</h2>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <div key={item.title}>
              {item.items ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className="r2552esf25_252trewt3erblueFontDocs w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-[#8888881A] hover:text-gray-900 transition-colors"
                  >
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4 mr-3 text-gray-500" />
                      <span>{item.title}</span>
                    </div>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {expandedItems.includes(item.title) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "block px-3 py-2 text-sm rounded-md transition-colors cursor-default r2552esf25_252trewt3erblueFontDocs",
                            pathname === subItem.href
                              ? "bg-[#8888881A] text-gray-700 font-medium"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          )}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-default r2552esf25_252trewt3erblueFontDocs",
                    pathname === item.href
                      ? "bg-[#8888881A] text-gray-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <item.icon className="h-4 w-4 mr-3 text-gray-500" />
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
