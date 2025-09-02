"use client"
import type React from "react"
import { useMemo } from "react"
import DynamicSandbox from "@/components/DynamicSandbox"

interface GeneratedPreviewProps {
  code: string
  editMode: boolean
  setGeneratedComponent: (code: string) => void
}

function stripMarkdownFences(raw: string) {
  let s = raw?.trim() || ""
  s = s.replace(/^```[a-zA-Z0-9_-]*\n?/m, "").replace(/\n?```$/m, "")
  return s
}

const GeneratedPreview: React.FC<GeneratedPreviewProps> = ({ code, editMode, setGeneratedComponent }) => {
  const html = useMemo(() => stripMarkdownFences(code), [code])
  return <DynamicSandbox html={html} editMode={editMode} setGeneratedComponent={setGeneratedComponent} />
}

export default GeneratedPreview