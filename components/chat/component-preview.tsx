"use client"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import GeneratedPreview from "@/components/GeneratedPreview"
import { createClient } from "@/supabase/client"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UsersSettings from "@/components/chat/settings/UsersSettings"
import AnalyticsSettings from "@/components/chat/settings/AnalyticsSettings"
import LogsSettings from "@/components/chat/settings/LogsSettings"
import AuthSettings from "@/components/chat/settings/AuthSettings"
import GitHubSettings from "@/components/chat/settings/GitHubSettings"
import {
  Sparkles,
  X,
  Copy,
  Download,
  Users,
  BarChart,
  FileText,
  Key,
  Github,
  Maximize2,
  Minimize2,
} from "lucide-react"
import "@/styles/button.css"

interface ComponentPreviewProps {
  generatedComponent: string
  setGeneratedComponent: (code: string) => void
  viewMode: "preview" | "code" | "settings"
  setViewMode: (mode: "preview" | "code" | "settings") => void
  onCloseComponent?: () => void
  editMode: boolean
  deployButtonRef: React.RefObject<HTMLButtonElement | null>
  setIsChatHidden?: (isHidden: boolean) => void
}

export function ComponentPreview({
  generatedComponent,
  setGeneratedComponent,
  viewMode,
  setViewMode,
  onCloseComponent,
  editMode,
  setIsChatHidden,
}: ComponentPreviewProps) {
  const [deploymentDomain, setDeploymentDomain] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<
    "users" | "analytics" | "logs" | "auth" | "github"
  >("users")
  const [authCode, setAuthCode] = useState<string>("")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const params = useParams()
  const chatId = params.id as string
  const supabase = createClient()
  const containerRef = useRef<HTMLDivElement>(null)
  const [originalPosition, setOriginalPosition] = useState<{
    top: number
    left: number
    width: string
    height: string
    borderRadius: string
  } | null>(null)

  const showSettings = viewMode === "settings"

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

  const handleFullScreenToggle = () => {
    if (!containerRef.current) return

    if (!isFullScreen) {
      // Save original position and dimensions before going full screen
      const rect = containerRef.current.getBoundingClientRect()
      setOriginalPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width + 'px',
        height: rect.height + 'px',
        borderRadius: '12px',
      })
      setIsFullScreen(true)
      setIsChatHidden?.(true)
    } else {
      setIsFullScreen(false)
      setIsChatHidden?.(false)
    }
  }

  const handleClose = () => {
    setIsFullScreen(false)
    setIsChatHidden?.(false)
    onCloseComponent?.()
  }

  useEffect(() => {
    const fetchAuthCode = async () => {
      const { data } = await supabase
        .from("auth_settings")
        .select("login_code")
        .eq("chat_id", chatId)
        .single()
      if (data?.login_code) {
        setAuthCode(data.login_code)
      }
    }
    fetchAuthCode()
  }, [chatId, supabase])

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.__fromSandbox && e.data.textUpdate) {
        const { elementId, newText, newColor, newX, newY, newFontSize } =
          e.data.textUpdate
        const parser = new DOMParser()
        const doc = parser.parseFromString(generatedComponent, "text/html")
        const element = doc.querySelector(
          `[data-text-id="${elementId}"]`
        ) as HTMLElement | null
        if (element) {
          if (newText) element.textContent = newText
          if (newColor) element.style.color = newColor
          if (newX !== undefined) element.style.left = `${newX}px`
          if (newY !== undefined) element.style.top = `${newY}px`
          if (newFontSize) element.style.fontSize = `${newFontSize}px`
          const newHtml = doc.documentElement.outerHTML
          setGeneratedComponent(newHtml)
        }
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [generatedComponent, setGeneratedComponent])

  if (!generatedComponent && !showSettings && !authCode) {
    return (
      <div className="border border-[#e6e6e6] dark:border-[#30363d] rounded-[12px] m-4 flex-1 flex flex-col items-center justify-center h-full text-center text-[#666666] dark:text-[#8b949e]">
        <Sparkles className="h-8 w-8 mb-2" />
        <p>Your generated component will appear here.</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        isFullScreen
          ? "fixed inset-0 z-50 bg-background rounded-none w-full h-full"
          : "border border-[#e6e6e6] dark:border-[#30363d] rounded-[12px] m-4"
      }`}
      style={
        isFullScreen
          ? { borderRadius: '0px' }
          : originalPosition
          ? {
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '12px',
            }
          : {}
      }
    >
      <div className="p-4 border-b border-[#e6e6e6] bg-[#f6f8fa] dark:bg-[#303030] dark:border-[#444444] flex items-center justify-between rounded-t-[12px]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#22c55e] dark:bg-[#3fb950] rounded-full" />
          <span className="text-sm font-[500] text-[#0f1419] dark:text-[#f0f6fc]">
            {showSettings ? "Chat Settings" : "Generated Game 3D"}
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
            <Button
              onClick={handleDownloadCode}
              size="sm"
              variant="outline"
              className="r2552esf25_252trewt3erblueFontDocs h-8 px-2 text-xs bg-[#0099FF] hover:bg-[#0099FF] hover:text-white text-white shadow-none"
            >
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          )}
          {showSettings && (
            <Button
              onClick={handleFullScreenToggle}
              size="sm"
              variant="outline"
              className="r2552esf25_252trewt3erblueFontDocs h-8 px-2 text-xs bg-[#0099FF] hover:bg-[#0099FF] hover:text-white text-white shadow-none"
            >
              {isFullScreen ? (
                <>
                  <Minimize2 className="h-4 w-4 mr-1" /> Exit Full Screen
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4 mr-1" /> Full Screen
                </>
              )}
            </Button>
          )}
          <Tabs
            value={showSettings ? "settings" : viewMode}
            onValueChange={(value) =>
              !showSettings &&
              setViewMode(value as "preview" | "code" | "settings")
            }
          >
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger
                value="preview"
                className="text-xs font-[450]"
                disabled={showSettings}
              >
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="text-xs font-[450]"
                disabled={showSettings}
              >
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
              onClick={handleClose}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {showSettings ? (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-[30%] bg-[#f6f8fa] dark:bg-[#303030] dark:border-[#444444] border-r border-[#e6e6e6] p-4 rounded-bl-[12px]">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSection("users")}
                className={`r2552esf25_252trewt3erblueFontDocs w-full flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "users"
                    ? "bg-[#e6e6e6] dark:bg-[#8888881A] text-[#0f1419] dark:text-[#f0f6fc]"
                    : "text-[#666666] dark:text-[#8b949e] hover:bg-[#e6e6e6] dark:hover:bg-[#8888881A]"
                }`}
              >
                <Users className="h-5 w-5" /> Users
              </button>
              <button
                onClick={() => setActiveSection("analytics")}
                className={`r2552esf25_252trewt3erblueFontDocs w-full flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "analytics"
                    ? "bg-[#e6e6e6] dark:bg-[#8888881A] text-[#0f1419] dark:text-[#f0f6fc]"
                    : "text-[#666666] dark:text-[#8b949e] hover:bg-[#e6e6e6] dark:hover:bg-[#8888881A]"
                }`}
              >
                <BarChart className="h-5 w-5" /> Analytics
              </button>
              <button
                onClick={() => setActiveSection("logs")}
                className={`r2552esf25_252trewt3erblueFontDocs w-full flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "logs"
                    ? "bg-[#e6e6e6] dark:bg-[#8888881A] text-[#0f1419] dark:text-[#f0f6fc]"
                    : "text-[#666666] dark:text-[#8b949e] hover:bg-[#e6e6e6] dark:hover:bg-[#8888881A]"
                }`}
              >
                <FileText className="h-5 w-5" /> Logs
              </button>
              <button
                onClick={() => setActiveSection("auth")}
                className={`r2552esf25_252trewt3erblueFontDocs w-full flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "auth"
                    ? "bg-[#e6e6e6] dark:bg-[#8888881A] text-[#0f1419] dark:text-[#f0f6fc]"
                    : "text-[#666666] dark:text-[#8b949e] hover:bg-[#e6e6e6] dark:hover:bg-[#8888881A]"
                }`}
              >
                <Key className="h-5 w-5" /> Authentication
              </button>
              <button
                onClick={() => setActiveSection("github")}
                className={`r2552esf25_252trewt3erblueFontDocs w-full flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "github"
                    ? "bg-[#e6e6e6] dark:bg-[#8888881A] text-[#0f1419] dark:text-[#f0f6fc]"
                    : "text-[#666666] dark:text-[#8b949e] hover:bg-[#e6e6e6] dark:hover:bg-[#8888881A]"
                }`}
              >
                <Github className="h-5 w-5" /> GitHub
              </button>
            </nav>
          </div>
          <div className="w-[70%] p-6 overflow-auto bg-[#8888881A] rounded-br-[12px]">
            {activeSection === "users" && <UsersSettings chatId={chatId} />}
            {activeSection === "analytics" && (
              <AnalyticsSettings chatId={chatId} />
            )}
            {activeSection === "logs" && <LogsSettings chatId={chatId} />}
            {activeSection === "auth" && (
              <AuthSettings
                chatId={chatId}
                onAuthCodeGenerated={(code) => setAuthCode(code)}
                authCode={authCode}
              />
            )}
            {activeSection === "github" && <GitHubSettings chatId={chatId} />}
          </div>
        </div>
      ) : (
        <Tabs value={viewMode} className="flex-1 flex flex-col">
          <TabsContent value="preview" className="flex-1 overflow-auto">
            <GeneratedPreview
              code={authCode || generatedComponent}
              editMode={editMode}
              setGeneratedComponent={setGeneratedComponent}
            />
          </TabsContent>
          <TabsContent value="code" className="flex-1 overflow-auto">
            <div className="relative p-4 flex flex-col h-full">
              <pre className="flex-1 text-sm bg-[#fafafa] dark:bg-[#0d1117] text-[#0f1419] dark:text-[#f0f6fc] rounded-md p-4 overflow-auto">
                <code>{authCode || generatedComponent}</code>
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
      )}
    </div>
  )
}