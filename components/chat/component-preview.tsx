"use client"
import { Button } from "@/components/ui/button"
import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import MultiFileSandbox from "@/components/MultiFileSandbox"
import { createClient } from "@/supabase/client"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssetBrowser } from "@/components/3d/AssetBrowser"
import type { SketchfabModel } from "@/lib/sketchfab-api"
import UsersSettings from "@/components/chat/settings/UsersSettings"
import AnalyticsSettings from "@/components/chat/settings/AnalyticsSettings"
import LogsSettings from "@/components/chat/settings/LogsSettings"
import AuthSettings from "@/components/chat/settings/AuthSettings"
import GitHubSettings from "@/components/chat/settings/GitHubSettings"
import SecuritySettings from "@/components/chat/settings/SecuritySettings"
import CommunitySettings from "@/components/chat/settings/CommunitySettings"
import {
  Sparkles,
  X,
  Download,
  Users,
  FileText,
  Key,
  Github,
  Shield,
  Maximize2,
  Minimize2,
  Cable as Cube,
  Share2,
} from "lucide-react"
import "@/styles/button.css"
import { parseGeneratedCode } from "@/components/GeneratedPreview"
import { Input } from "@/components/ui"

interface ComponentPreviewProps {
  generatedComponent: string
  setGeneratedComponent: (code: string) => void
  viewMode: "preview" | "code" | "settings" | "assets" | "terminal"
  setViewMode: (mode: "preview" | "code" | "settings" | "assets" | "terminal") => void
  onCloseComponent?: () => void
  editMode: boolean
  deployButtonRef: React.RefObject<HTMLButtonElement | null>
  setIsChatHidden?: (isHidden: boolean) => void
  onAssetSelect?: (asset: SketchfabModel) => void
}

interface ProjectFile {
  name: string
  content: string
}

interface GameFile {
  name: string
  content: string
  type: "html" | "css" | "js" | "ts"
}

interface TerminalCommand {
  id: number
  command: string
  output: string
  timestamp: Date
}

export function ComponentPreview({
  generatedComponent,
  setGeneratedComponent,
  viewMode,
  setViewMode,
  onCloseComponent,
  editMode,
  setIsChatHidden,
  onAssetSelect,
}: ComponentPreviewProps) {
  const [deploymentDomain, setDeploymentDomain] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [activeSection, setActiveSection] = useState<
    "users" | "analytics" | "logs" | "auth" | "github" | "security" | "community"
  >("users")
  const [authCode, setAuthCode] = useState<string>("")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [modelViewerUrl, setModelViewerUrl] = useState<string | null>(null)
  const params = useParams()
  const chatId = (params?.id as string) || "demo-chat"
  const supabase = createClient()
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [originalPosition, setOriginalPosition] = useState<{
    top: number
    left: number
    width: string
    height: string
    borderRadius: string
  } | null>(null)

  // New state for terminal
  const [terminalCommands, setTerminalCommands] = useState<TerminalCommand[]>([])
  const [currentCommand, setCurrentCommand] = useState("")

  const showSettings = viewMode === "settings"
  const showAssets = viewMode === "assets"

  const projectFiles = parseGeneratedCode(generatedComponent || authCode) as ProjectFile[]

  // Transform ProjectFile[] to GameFile[] by inferring type from file name
  const gameFiles: GameFile[] = useMemo(() => {
    return projectFiles.map(file => {
      let type: "html" | "css" | "js" | "ts" = "html" // Default to html
      if (file.name.endsWith(".css")) {
        type = "css"
      } else if (file.name.endsWith(".js")) {
        type = "js"
      } else if (file.name.endsWith(".ts") || file.name.endsWith(".tsx")) {
        type = "ts"
      }
      return {
        name: file.name,
        content: file.content,
        type,
      }
    })
  }, [projectFiles])

  const projectType = useMemo(() => {
    const hasAppDir = gameFiles.some(f => f.name.startsWith("app/"))
    return hasAppDir ? "nextjs" : "html"
  }, [gameFiles])

  // Enhanced combineFilesToHTML to support link navigation
  const combineFilesToHTML = (gameFiles: GameFile[]): string => {
    const htmlFile = gameFiles.find((f) => f.type === "html" || f.name === "app/page.tsx")
    const cssFile = gameFiles.find((f) => f.type === "css")
    const jsFile = gameFiles.find((f) => f.type === "js" || f.type === "ts")

    if (!htmlFile) return ""

    let html = htmlFile.content

    if (cssFile) {
      const styleTag = `<style>\n${cssFile.content}\n</style>`
      if (html.includes('<link rel="stylesheet" href="styles.css">')) {
        html = html.replace('<link rel="stylesheet" href="styles.css">', styleTag)
      } else if (html.includes("</head>")) {
        html = html.replace("</head>", `${styleTag}\n</head>`)
      }
    }

    if (jsFile) {
      const scriptTag = `<script>\n${jsFile.content}\n</script>`
      if (html.includes('<script src="game.js"></script>')) {
        html = html.replace('<script src="game.js"></script>', scriptTag)
      } else if (html.includes("</body>")) {
        html = html.replace("</body>", `${scriptTag}\n</body>`)
      }
    }

    // Ensure links work within iframe
    html = html.replace(/href="\//g, 'href="#/"') // Prefix with # for iframe navigation

    return html
  }

  const srcdoc = useMemo(() => {
    if (projectType === "nextjs" && !isRunning) {
      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Preview</title>
  </head>
  <body style="margin: 0; padding: 0; height: 100%; background: black; color: white; display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif;">
    Server not started. Run 'npm start' in the terminal to preview the site.
  </body>
</html>`
    }

    const combinedHTML = combineFilesToHTML(gameFiles)

    const trimmedHtml = combinedHTML.trim()
    const isFullHtml = /^<!DOCTYPE/i.test(trimmedHtml) || /^<html/i.test(trimmedHtml)

    const wrapperMeta = `
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Preview</title>
    `

    const additionalStyles = `
      <style>
        html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        a { cursor: pointer; } /* Make links clickable in iframe */
      </style>
    `

    const additionalScript = `
      <script>
        window.addEventListener('click', (e) => {
          if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#/')) {
            e.preventDefault();
            parent.postMessage({ __fromSandbox: true, navigate: e.target.getAttribute('href')?.replace('#/', '/') }, '*');
          }
        });
      </script>
    `

    if (isFullHtml) {
      let enhanced = trimmedHtml
      enhanced = enhanced.replace(/<\/head>/i, `${additionalStyles}</head>`)
      enhanced = enhanced.replace(/<\/body>/i, `${additionalScript}</body>`)
      return `<!DOCTYPE html><html><head>${wrapperMeta}</head><body>${enhanced}</body></html>`
    } else {
      return `<!DOCTYPE html>
<html>
  <head>
    ${wrapperMeta}
    ${additionalStyles}
  </head>
  <body>
    ${trimmedHtml}
    ${additionalScript}
  </body>
</html>`
    }
  }, [gameFiles, projectType, isRunning])

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
      const rect = containerRef.current.getBoundingClientRect()
      setOriginalPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width + "px",
        height: rect.height + "px",
        borderRadius: "12px",
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

  const handleModelPreview = (viewerUrl: string) => {
    setModelViewerUrl(viewerUrl)
  }

  const handleCloseModelPreview = () => {
    setModelViewerUrl(null)
  }

  const handleAssetSelectInternal = (asset: SketchfabModel) => {
    if (onAssetSelect) {
      onAssetSelect(asset)
    }
    setViewMode("preview")
  }

  const handleFixError = () => {
    if (onAssetSelect) {
      const fixMessage = {
        name: "Fix Component Error",
        description: `There's an error in the generated component: ${errorMessage}. Please analyze and fix the issue.`,
        uid: "fix-error",
        thumbnails: { images: [] },
        user: { displayName: "System", username: "system" },
        tags: [],
        categories: [],
        viewerUrl: "",
        isDownloadable: false,
      }
      onAssetSelect(fixMessage as SketchfabModel)
    }
    setHasError(false)
    setErrorMessage("")
  }

  // Handle navigation from iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.__fromSandbox && e.data.navigate) {
        const path = e.data.navigate
        const targetFile = gameFiles.find(f => f.name === `app${path.endsWith("/") ? path : path + "/page.tsx"}`)
        if (targetFile) {
          setGeneratedComponent(gameFiles.map(f => `--- ${f.name} ---\n${f.content}\n---`).join("\n"))
          // Simulate navigation (client-side only for preview)
          console.log(`Navigating to ${path}`)
        }
      }
      if (e.data.__fromSandbox && e.data.error) {
        setHasError(true)
        setErrorMessage(e.data.error.message || "Component error occurred")
      }
      if (e?.data?.__fromSandbox && typeof e.data.height === "number" && iframeRef.current) {
        const newHeight = Math.max(600, Math.min(2048, e.data.height))
        iframeRef.current.style.height = newHeight + "px"
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [gameFiles, setGeneratedComponent])

  // Terminal command handling
  const handleTerminalCommand = async () => {
    if (!currentCommand.trim()) return
    const newCommand: TerminalCommand = {
      id: Date.now(),
      command: currentCommand,
      output: "",
      timestamp: new Date(),
    }
    setTerminalCommands(prev => [newCommand, ...prev])

    try {
      let output = ""
      if (currentCommand === "npm start" || currentCommand === "next dev") {
        output = "Starting development server...\n[Ready] http://localhost:3000"
        setDeploymentDomain("http://localhost:3000")
        setIsRunning(true)
      } else if (currentCommand === "npm build") {
        output = "Building project...\n[Success] Build completed."
      } else if (currentCommand.startsWith("cd ") || currentCommand.startsWith("ls")) {
        output = "Command executed in virtual terminal.\nNo real filesystem access."
      } else {
        output = "Unknown command. Try 'npm start', 'npm build', 'cd', or 'ls'."
      }
      setTerminalCommands(prev =>
        prev.map(cmd =>
          cmd.id === newCommand.id ? { ...cmd, output } : cmd
        )
      )
    } catch (error) {
      setTerminalCommands(prev =>
        prev.map(cmd =>
          cmd.id === newCommand.id ? { ...cmd, output: `Error: ${(error as Error).message}` } : cmd
        )
      )
    }
    setCurrentCommand("")
  }

  useEffect(() => {
    const fetchAuthCode = async () => {
      try {
        const { data } = await supabase.from("auth_settings").select("login_code").eq("chat_id", chatId).single()
        if (data?.login_code) {
          setAuthCode(data.login_code)
        }
      } catch {
        console.log("Supabase not configured, continuing without auth features")
      }
    }
    fetchAuthCode()
  }, [chatId, supabase])

  if (!generatedComponent && !showSettings && !showAssets && !authCode) {
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
        isFullScreen ? "fixed inset-0 z-50 bg-background rounded-none w-full h-full" : "rounded-[12px] m-4"
      }`}
      style={
        isFullScreen
          ? { borderRadius: "0px" }
          : originalPosition
            ? {
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "12px",
              }
            : {}
      }
    >
      <div className="p-4 border-b border-[#e6e6e6] bg-[#f6f8fa] dark:bg-[#303030] dark:border-[#444444] flex items-center justify-between rounded-t-[12px]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#22c55e] dark:bg-[#3fb950] rounded-full" />
          <span className="text-sm font-[500] text-[#0f1419] dark:text-[#f0f6fc]">
            {showSettings
              ? "Chat Settings"
              : showAssets
                ? "3D Asset Library"
                : "Component Preview"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {deploymentDomain && !showSettings && !showAssets && (
            <a
              href={deploymentDomain}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              View Live →
            </a>
          )}
          {!showSettings && !showAssets && (
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
            onValueChange={(value) => !showSettings && setViewMode(value as "preview" | "code" | "settings" | "assets" | "terminal")}
          >
            <TabsList className="grid w-full grid-cols-5 h-8">
              <TabsTrigger value="preview" className="text-xs font-[450]" disabled={showSettings}>
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs font-[450]" disabled={showSettings}>
                Code
              </TabsTrigger>
              <TabsTrigger value="assets" className="text-xs font-[450]" disabled={showSettings}>
                <Cube className="h-3 w-3 mr-1" />
                Assets
              </TabsTrigger>
              <TabsTrigger value="terminal" className="text-xs font-[450]" disabled={showSettings}>
                Terminal
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

      {hasError && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <span className="text-sm font-medium">Component Error:</span>
            <span className="text-sm">{errorMessage}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleFixError} className="bg-red-600 hover:bg-red-700 text-white text-xs">
              Ask AI to Fix
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setHasError(false)}
              className="text-red-600 hover:text-red-700 text-xs"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

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
                onClick={() => setActiveSection("security")}
                className={`r2552esf25_252trewt3erblueFontDocs w-full flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "security"
                    ? "bg-[#e6e6e6] dark:bg-[#8888881A] text-[#0f1419] dark:text-[#f0f6fc]"
                    : "text-[#666666] dark:text-[#8b949e] hover:bg-[#e6e6e6] dark:hover:bg-[#8888881A]"
                }`}
              >
                <Shield className="h-5 w-5" /> Security{" "}
                <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Beta</span>
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
              <button
                onClick={() => setActiveSection("community")}
                className={`r2552esf25_252trewt3erblueFontDocs w-full flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "community"
                    ? "bg-[#e6e6e6] dark:bg-[#8888881A] text-[#0f1419] dark:text-[#f0f6fc]"
                    : "text-[#666666] dark:text-[#8b949e] hover:bg-[#e6e6e6] dark:hover:bg-[#8888881A]"
                }`}
              >
                <Share2 className="h-5 w-5" /> Community
              </button>
            </nav>
          </div>
          <div className="w-[70%] p-6 overflow-auto bg-[#8888881A] rounded-br-[12px]">
            {activeSection === "users" && <UsersSettings chatId={chatId} />}
            {activeSection === "analytics" && <AnalyticsSettings chatId={chatId} />}
            {activeSection === "logs" && <LogsSettings chatId={chatId} />}
            {activeSection === "auth" && (
              <AuthSettings chatId={chatId} onAuthCodeGenerated={(code) => setAuthCode(code)} authCode={authCode} />
            )}
            {activeSection === "security" && <SecuritySettings chatId={chatId} />}
            {activeSection === "github" && <GitHubSettings chatId={chatId} />}
            {activeSection === "community" && <CommunitySettings chatId={chatId} />}
          </div>
        </div>
      ) : showAssets ? (
        <AssetBrowser
          key="asset-browser"
          onAssetSelect={handleAssetSelectInternal}
          onClose={() => setViewMode("preview")}
          onModelPreview={handleModelPreview}
        />
      ) : viewMode === "terminal" ? (
        <div className="p-4 bg-[#1e1e1e] text-white flex-1 flex flex-col">
          <div className="flex-1 mb-2">
            {terminalCommands.map(cmd => (
              <div key={cmd.id} className="mb-2">
                <div className="text-green-400">{`> ${cmd.command}`}</div>
                <div className="text-gray-300 ml-4">{cmd.output}</div>
                <div className="text-xs text-gray-500 ml-4">{cmd.timestamp.toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTerminalCommand()}
              placeholder="Type a command (e.g., 'npm start', 'npm build')"
              className="flex-1 bg-gray-800 border-gray-700 text-white"
            />
            <Button
              onClick={handleTerminalCommand}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Send
            </Button>
          </div>
        </div>
      ) : (
        <Tabs value={viewMode} className="flex-1 flex flex-col">
          <TabsContent value="preview" className="flex-1 overflow-auto">
            <div className="w-full h-full relative">
              <iframe
                ref={iframeRef}
                title="Component Preview"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  background: "#000",
                }}
                srcDoc={srcdoc}
              />
            </div>
          </TabsContent>
          <TabsContent value="code" className="flex-1 overflow-auto">
            <MultiFileSandbox
              files={gameFiles}
              editMode={editMode}
              setGeneratedComponent={setGeneratedComponent}
              height={800}
              showPreview={false}
            />
          </TabsContent>
          <TabsContent value="assets" className="flex-1 overflow-hidden">
            {/* Assets tab handled separately */}
          </TabsContent>
        </Tabs>
      )}

      {modelViewerUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg w-[80vw] h-[80vh] max-w-4xl max-h-4xl relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseModelPreview}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
            <iframe
              src={modelViewerUrl}
              className="w-full h-full rounded-lg"
              allowFullScreen
              title="3D Model Viewer"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  )
}