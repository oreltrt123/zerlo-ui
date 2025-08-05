import { notFound } from "next/navigation"
import { readFile } from "fs/promises"
import { join } from "path"

interface DomainPageProps {
  params: Promise<{ domain: string }>
}

export default async function DomainPage({ params }: DomainPageProps) {
  const { domain } = await params // Unwrap the Promise

  // Check if this is a deployed site (domain should start with "zerlo.online.")
  if (!domain.startsWith("zerlo.online.")) {
    notFound()
  }

  // Extract the site name from the domain
  const siteName = domain.replace("zerlo.online.", "")

  if (!siteName) {
    notFound()
  }

  try {
    // Read the deployed HTML file
    const filePath = join(process.cwd(), "public", "deployed", `${siteName}.html`)
    const htmlContent = await readFile(filePath, "utf8")

    // Return the HTML content directly using dangerouslySetInnerHTML
    return <div style={{ width: "100vw", height: "100vh" }} dangerouslySetInnerHTML={{ __html: htmlContent }} />
  } catch (error) {
    console.error("Error loading deployed site:", error)
    notFound()
  }
}

// Generate metadata for the deployed site
export async function generateMetadata({ params }: DomainPageProps) {
  const { domain } = await params // Unwrap the Promise
  const siteName = domain.replace("zerlo.online.", "")
  return {
    title: siteName,
    description: `Deployed site: ${siteName}`,
  }
}