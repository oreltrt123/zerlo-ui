"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DocsSidebar } from "./docs-sidebar"
import { TableOfContents } from "./table-of-contents"

interface DocsLayoutProps {
  children: React.ReactNode
  navbar: React.ReactNode // Navbar passed from parent server component
}

export function DocsLayout({ children, navbar }: DocsLayoutProps) {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0px -80% 0px" }
    )

    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {navbar}
      <div className="flex">
        <DocsSidebar />
        <div className="flex-1 ml-64">
          <div className="flex">
            <main className="flex-1 px-8 py-6">{children}</main>
            <TableOfContents activeSection={activeSection} />
          </div>
        </div>
      </div>
    </div>
  )
}
