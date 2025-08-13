// File: app/(main)/docs/[...slug]/page.tsx
import { notFound } from "next/navigation"
import Navbar from "@/components/docs/docs-navbar" // Server component
import { DocsLayout } from "@/components/docs/docs-layout"
import { getDocContent } from "@/lib/docs-content"

interface DocsPageProps {
  params: Promise<{ slug: string[] }> // Use Promise for params
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params // Await the params to resolve the Promise
  const slugPath = slug?.join("/") || "getting-started"
  const content = getDocContent(slugPath)

  if (!content) {
    notFound()
  }

  // Render Navbar server-side
  const navbar = await Navbar()

  return (
    <DocsLayout navbar={navbar}>
      <div className="max-w-4xl mx-auto relative top-[50px]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
          <p className="text-xl text-gray-600">{content.description}</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content.content }} />
        </div>
      </div>
    </DocsLayout>
  )
}

export function generateStaticParams() {
  return [
    { slug: ["getting-started"] },
    { slug: ["authentication", "login"] },
    { slug: ["authentication", "signup"] },
    { slug: ["game-development", "quick-start"] },
    { slug: ["game-development", "advanced"] },
    { slug: ["web-development", "basics"] },
    { slug: ["web-development", "deployment"] },
    { slug: ["typescript", "fundamentals"] },
    { slug: ["typescript", "advanced-features"] },
    { slug: ["api-reference"] },
    { slug: ["troubleshooting"] },
  ]
}