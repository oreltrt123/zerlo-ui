"use client"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import GeneratedPreview from "@/components/GeneratedPreview"
import { createClient } from "@/supabase/client"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UsersSettings from "@/components/chat/settings/UsersSettings"
import AnalyticsSettings from "@/components/chat/settings/AnalyticsSettings"
import LogsSettings from "@/components/chat/settings/LogsSettings"
import AuthSettings from "@/components/chat/settings/AuthSettings"
import { Sparkles, X, Copy, Download, Settings, Users, BarChart, FileText, Key } from "lucide-react"
import "@/styles/button.css"

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
  const [showSettings, setShowSettings] = useState(false)
  const [activeSection, setActiveSection] = useState<"users" | "analytics" | "logs" | "auth">("users")
  const [authCode, setAuthCode] = useState<string>("")
  const params = useParams()
  const chatId = params.id as string
  const supabase = createClient()

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedComponent || authCode)
    toast.success("Code copied to clipboard!")
  }

  const handleDownloadCode = () => {
    const codeToDownload = authCode || generatedComponent
    const blob = new Blob([codeToDownload], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `generated-component-${chatId}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Code downloaded successfully!")
  }

  useEffect(() => {
    const fetchAuthCode = async () => {
      const { data } = await supabase.from("auth_settings").select("login_code").eq("chat_id", chatId).single()
      if (data?.login_code) {
        setAuthCode(data.login_code)
      }
    }
    fetchAuthCode()
  }, [chatId, supabase])

  if (!generatedComponent && !showSettings && !authCode) {
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
            {showSettings ? "Settings" : "Generated Component"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {deploymentDomain && !showSettings && (
            <a
              href={deploymentDomain}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              View Live →
            </a>
          )}
          {!showSettings && (
            <>
              <Button
                onClick={handleDownloadCode}
                size="sm"
                variant="outline"
                className="h-8 px-2 text-xs bg-transparent"
              >
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
              <Button
                onClick={() => setShowSettings(true)}
                size="sm"
                variant="outline"
                className="h-8 px-2 text-xs bg-transparent"
              >
                <Settings className="h-4 w-4 mr-1" /> Settings
              </Button>
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
            </>
          )}
          {showSettings && (
            <Button
              onClick={() => setShowSettings(false)}
              size="sm"
              variant="outline"
              className="h-8 px-2 text-xs bg-transparent"
            >
              Back to Component
            </Button>
          )}
          <Tabs
            value={showSettings ? "settings" : viewMode}
            onValueChange={(value) => !showSettings && setViewMode(value as "preview" | "code")}
          >
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="preview" className="text-xs font-[450]" disabled={showSettings}>
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs font-[450]" disabled={showSettings}>
                Code
              </TabsTrigger>
              <TabsTrigger
                value="deploy"
                className="text-xs font-[450]"
                onClick={() => setDeploymentDomain("https://example.com")}
                disabled={showSettings}
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
      {showSettings ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-[30%] bg-[#f6f8fa] dark:bg-[#21262d] border-r border-[#e6e6e6] dark:border-[#30363d] p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSection("users")}
                className={`r2552esf25_252trewt3erblueFontDocs w-full flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "users"
                    ? "bg-[#e6e6e6] dark:bg-[#30363d] text-[#0f1419] dark:text-[#f0f6fc]"
                    : "text-[#666666] dark:text-[#8b949e] hover:bg-[#e6e6e6] dark:hover:bg-[#30363d]"
                }`}
              >
                <Users className="h-5 w-5" /> Users
              </button>
              <button
                onClick={() => setActiveSection("analytics")}
                className={`r2552esf25_252trewt3erblueFontDocs w-full flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "analytics"
                    ? "bg-[#e6e6e6] dark:bg-[#30363d] text-[#0f1419] dark:text-[#f0f6fc]"
                    : "text-[#666666] dark:text-[#8b949e] hover:bg-[#e6e6e6] dark:hover:bg-[#30363d]"
                }`}
              >
                <BarChart className="h-5 w-5" /> Analytics
              </button>
              <button
                onClick={() => setActiveSection("logs")}
                className={`r2552esf25_252trewt3erblueFontDocs w-full flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "logs"
                    ? "bg-[#e6e6e6] dark:bg-[#30363d] text-[#0f1419] dark:text-[#f0f6fc]"
                    : "text-[#666666] dark:text-[#8b949e] hover:bg-[#e6e6e6] dark:hover:bg-[#30363d]"
                }`}
              >
                <FileText className="h-5 w-5" /> Logs
              </button>
              <button
                onClick={() => setActiveSection("auth")}
                className={`r2552esf25_252trewt3erblueFontDocs w-full flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "auth"
                    ? "bg-[#e6e6e6] dark:bg-[#30363d] text-[#0f1419] dark:text-[#f0f6fc]"
                    : "text-[#666666] dark:text-[#8b949e] hover:bg-[#e6e6e6] dark:hover:bg-[#30363d]"
                }`}
              >
                <Key className="h-5 w-5" /> Authentication
              </button>
            </nav>
          </div>
          {/* Content */}
          <div className="w-[70%] p-6 overflow-auto">
            {activeSection === "users" && <UsersSettings chatId={chatId} />}
            {activeSection === "analytics" && <AnalyticsSettings chatId={chatId} />}
            {activeSection === "logs" && <LogsSettings chatId={chatId} />}
            {activeSection === "auth" && (
              <AuthSettings chatId={chatId} onAuthCodeGenerated={(code) => setAuthCode(code)} authCode={authCode} />
            )}
          </div>
        </div>
      ) : (
        <Tabs value={viewMode} className="flex-1 flex flex-col">
          <TabsContent value="preview" className="flex-1 overflow-auto">
            <GeneratedPreview code={authCode || generatedComponent} />
          </TabsContent>
          <TabsContent value="code" className="flex-1 overflow-auto">
            <div className="relative p-4 flex flex-col h-full">
              <pre className="flex-1 text-sm bg-[#fafafa] dark:bg-[#0d1117] text-[#0f1419] dark:text-[#f0f6fc] rounded-md p-4 overflow-auto">
                <code>{authCode || generatedComponent}</code>
              </pre>
              <Button onClick={handleCopyCode} size="sm" className="absolute top-4 right-4 flex items-center gap-1">
                <Copy className="h-4 w-4" /> Copy
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
