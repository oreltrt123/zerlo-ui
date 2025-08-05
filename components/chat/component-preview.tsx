"use client"

import { Sparkles, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DynamicComponent from "@/components/dynamic-component"

interface ComponentPreviewProps {
  generatedComponent: string
  viewMode: "preview" | "code"
  setViewMode: (mode: "preview" | "code") => void
  onCopyCode: () => void
}

export function ComponentPreview({ generatedComponent, viewMode, setViewMode, onCopyCode }: ComponentPreviewProps) {
  if (!generatedComponent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-[#666666] dark:text-[#8b949e]">
        <Sparkles className="h-8 w-8 mb-2" />
        <p>Your generated component will appear here.</p>
      </div>
    )
  }

  return (
    <div className="border border-[#e6e6e6] dark:border-[#30363d] rounded-[12px] m-4 flex-1 flex flex-col">
      <div className="p-4 border-b border-[#e6e6e6] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#22c55e] dark:bg-[#3fb950] rounded-full" />
          <span className="text-sm font-[500] text-[#0f1419] dark:text-[#f0f6fc]">Generated Component</span>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "preview" | "code")}>
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="preview" className="text-xs font-[450]">
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs font-[450]">
                Code
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={onCopyCode} className="h-8 px-2 bg-transparent">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Tabs value={viewMode} className="flex-1 flex flex-col">
        <TabsContent value="preview" className="flex-1 overflow-auto">
          <DynamicComponent componentCode={generatedComponent} />
        </TabsContent>
        <TabsContent value="code" className="flex-1 overflow-auto">
          <div className="relative p-4">
            <pre className="text-sm bg-[#fafafa] dark:bg-[#0d1117] text-[#0f1419] dark:text-[#f0f6fc] rounded-md p-4 overflow-auto">
              <code>{generatedComponent}</code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
