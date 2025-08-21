"use client"
import { Sparkles, X, Copy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import GeneratedPreview from "@/components/GeneratedPreview"

interface ComponentPreviewProps {
  generatedComponent: string
  viewMode: "preview" | "code"
  setViewMode: (mode: "preview" | "code") => void
  onFullScreenPreview?: () => void
  onCloseComponent?: () => void
}

export function ComponentPreview({
  generatedComponent,
  viewMode,
  setViewMode,
  onFullScreenPreview,
  onCloseComponent,
}: ComponentPreviewProps) {
  const [deploymentDomain, setDeploymentDomain] = useState<string | null>(null)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedComponent)
  }

  if (!generatedComponent) {
    return (
      <div className="border border-[#e6e6e6] dark:border-[#30363d] rounded-[12px] m-4 flex-1 flex flex-col items-center justify-center h-full text-center text-[#666666] dark:text-[#8b949e]">
        <Sparkles className="h-8 w-8 mb-2" />
        <p>Your generated component will appear here.</p>
      </div>
    )
  }

  return (
    <div className="border border-[#e6e6e6] dark:border-[#30363d] rounded-[12px] m-4 flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#e6e6e6] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#22c55e] dark:bg-[#3fb950] rounded-full" />
          <span className="text-sm font-[500] text-[#0f1419] dark:text-[#f0f6fc]">
            Generated Component
          </span>
        </div>
        <div className="flex items-center gap-2">
          {deploymentDomain && (
            <a
              href={deploymentDomain}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              View Live →
            </a>
          )}
          {onFullScreenPreview && (
            <Button
              onClick={onFullScreenPreview}
              size="sm"
              variant="outline"
              className="h-8 px-2 text-xs bg-transparent"
            >
              Full Screen
            </Button>
          )}
          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "preview" | "code")}
          >
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="preview" className="text-xs font-[450]">
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs font-[450]">
                Code
              </TabsTrigger>
              <TabsTrigger
                value="deploy"
                className="text-xs font-[450]"
                onClick={() => setDeploymentDomain("https://example.com")}
              >
                Deploy
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {onCloseComponent && (
            <Button
              onClick={onCloseComponent}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      <Tabs value={viewMode} className="flex-1 flex flex-col">
        <TabsContent value="preview" className="flex-1 overflow-auto">
          <GeneratedPreview code={generatedComponent} />
        </TabsContent>
        <TabsContent value="code" className="flex-1 overflow-auto">
          <div className="relative p-4 flex flex-col h-full">
            <pre className="flex-1 text-sm bg-[#fafafa] dark:bg-[#0d1117] text-[#0f1419] dark:text-[#f0f6fc] rounded-md p-4 overflow-auto">
              <code>{generatedComponent}</code>
            </pre>
            <Button
              onClick={handleCopyCode}
              size="sm"
              className="absolute top-4 right-4 flex items-center gap-1"
            >
              <Copy className="h-4 w-4" /> Copy
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}