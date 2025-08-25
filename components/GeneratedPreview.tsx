"use client"
import type React from "react"
import { useMemo } from "react"
import DynamicSandbox from "@/components/DynamicSandbox"

interface GeneratedPreviewProps {
  code: string
}

function stripMarkdownFences(raw: string) {
  let s = raw?.trim() || ""
  s = s.replace(/^```[a-zA-Z0-9_-]*\n?/m, "").replace(/\n?```$/m, "")
  return s
}

const GeneratedPreview: React.FC<GeneratedPreviewProps> = ({ code }) => {
  const html = useMemo(() => stripMarkdownFences(code), [code])
  return <DynamicSandbox html={html} />
}

export default GeneratedPreview
