"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TableOfContentsProps {
  activeSection: string
}

interface TocItem {
  id: string
  title: string
  level: number
}

export function TableOfContents({ activeSection }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])

  useEffect(() => {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const items: TocItem[] = []

    headings.forEach((heading) => {
      if (heading.id) {
        items.push({
          id: heading.id,
          title: heading.textContent || "",
          level: Number.parseInt(heading.tagName.charAt(1)),
        })
      }
    })

    setTocItems(items)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="sticky top-20 right-50 w-64 h-fit p-6 bg-[#8888881A] rounded-2xl">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">On this page</h3>
      <nav className="space-y-1">
        {tocItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={cn(
              "block w-full text-left text-sm py-1 px-2 rounded transition-colors",
              "hover:bg-[#88888810]",
              activeSection === item.id ? "text-gray-600 bg-[#8888881A] font-medium" : "text-gray-600",
              item.level > 2 && "ml-4",
              item.level > 3 && "ml-8",
            )}
          >
            {item.title}
          </button>
        ))}
      </nav>
    </div>
  )
}
