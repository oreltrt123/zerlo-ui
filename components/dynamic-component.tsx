"use client"
import React, { useState, useEffect } from "react"

interface DynamicComponentProps {
  code: string
}

const DynamicComponent: React.FC<DynamicComponentProps> = ({ code }) => {
  const [html, setHtml] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) return

    try {
      // Clean AI output (remove markdown ``` blocks if present)
      const cleaned = code.replace(/^```[a-z]*\n?/, "").replace(/```$/, "").trim()

      // If AI generates full HTML, use it directly
      if (cleaned.includes("<html") || cleaned.includes("<canvas")) {
        setHtml(cleaned)
      } else {
        // Otherwise wrap in a <div>
        setHtml(`<div>${cleaned}</div>`)
      }
      setError(null)
    } catch (err) {
      setError("Failed to render: " + (err as Error).message)
    }
  }, [code])

  if (error) return <pre className="text-red-500">{error}</pre>

  return (
    <div
      className="p-4 border"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default DynamicComponent