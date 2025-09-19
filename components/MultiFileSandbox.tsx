"use client"
import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, ChevronDown, Copy, Download } from "lucide-react"
import "@/styles/button.css"

interface ProjectFile {
  name: string
  content: string
}

interface FileNode {
  name: string
  content?: string
  children?: FileNode[]
  type?: "file" | "folder"
}

interface MultiFileSandboxProps {
  files: ProjectFile[]
  height?: number
  editMode: boolean
  setGeneratedComponent: (code: string) => void
  showPreview?: boolean
}

interface ElementProps {
  text: string
  color: string
  x: number
  y: number
  fontSize: number
}

const MultiFileSandbox: React.FC<MultiFileSandboxProps> = ({ files, editMode, showPreview = true }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<string>(files[0]?.name || "")
  const [editedFiles, setEditedFiles] = useState<Record<string, string>>({})
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [selectedElementProps, setSelectedElementProps] = useState<ElementProps | null>(null)
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [projectType, setProjectType] = useState<"nextjs" | "html" | "other">("other")

  const buildFileTree = (files: ProjectFile[]): FileNode => {
    const root: FileNode = { name: "root", type: "folder", children: [] }
    files.forEach((file) => {
      const parts = file.name.split("/")
      let current = root
      parts.forEach((part, index) => {
        if (!current.children) current.children = []
        let child = current.children.find((c) => c.name === part)
        if (!child) {
          child = { name: part, type: index === parts.length - 1 ? "file" : "folder" }
          if (index === parts.length - 1) {
            child.content = file.content
          } else {
            child.children = []
          }
          current.children.push(child)
        }
        current = child
      })
    })
    return root
  }

  const fileTree = useMemo(() => buildFileTree(files), [files])

  useEffect(() => {
    // Detect project type
    const hasAppDir = files.some(f => f.name.startsWith("app/"))
    const hasNextConfig = files.some(f => f.name === "next.config.js")
    if (hasAppDir || hasNextConfig) {
      setProjectType("nextjs")
    } else {
      const hasHtml = files.some(f => f.name.endsWith(".html"))
      setProjectType(hasHtml ? "html" : "other")
    }
  }, [files])

  const getFileExtension = (name: string) => {
    return name.split(".").pop()?.toLowerCase() || "text"
  }

  const getFileIcon = (ext: string, type?: "file" | "folder") => {
    if (type === "folder") {
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    }
    switch (ext) {
      case "html":
        return (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
            <path d="M9,7l3,34l14,4l14-4c1-11.33,2-22.67,3-34H9z M33.76,35l-7.77,2l-7.76-2l-0.39-5h3.86l0.18,2L26,32.62L30.17,32l0.41-5 H17.59l0.96-12H34l0.7,6H31l-0.23-2h-8.36l-0.32,4h12.66L33.76,35z"></path>
          </svg>
        )
      case "css":
        return (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#0277BD" d="M41,5H7l3,34l14,4l14-4L41,5L41,5z"></path>
            <path fill="#039BE5" d="M24 8L24 39.9 35.2 36.7 37.7 8z"></path>
            <path fill="#FFF" d="M33.1 13L24 13 24 17 28.9 17 28.6 21 24 21 24 25 28.4 25 28.1 29.5 24 30.9 24 35.1 31.9 32.5 32.6 21 32.6 21z"></path>
            <path fill="#EEE" d="M24,13v4h-8.9l-0.3-4H24z M19.4,21l0.2,4H24v-4H19.4z M19.8,27h-4l0.3,5.5l7.9,2.6v-4.2l-4.1-1.4L19.8,27z"></path>
          </svg>
        )
      case "js":
      case "jsx":
        return (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#ffd600" d="M6,42V6h36v36H6z"></path>
            <path fill="#000001" d="M29.538 32.947c.692 1.124 1.444 2.201 3.037 2.201 1.338 0 2.04-.665 2.04-1.585 0-1.101-.726-1.492-2.198-2.133l-.807-.344c-2.329-.988-3.878-2.226-3.878-4.841 0-2.41 1.845-4.244 4.728-4.244 2.053 0 3.528.711 4.592 2.573l-2.514 1.607c-.553-.988-1.151-1.377-2.078-1.377-.946 0-1.545.597-1.545 1.377 0 .964.6 1.354 1.985 1.951l.807.344C36.452 29.645 38 30.839 38 33.523 38 36.415 35.716 38 32.65 38c-2.999 0-4.702-1.505-5.65-3.368L29.538 32.947zM17.952 33.029c.506 .906 1.275 1.603 2.381 1.603 1.058 0 1.667-.418 1.667-2.043V22h3.333v11.101c0 3.367-1.953 4.899-4.805 4.899-2.577 0-4.437-1.746-5.195-3.368L17.952 33.029z"></path>
          </svg>
        )
      case "ts":
      case "tsx":
        return (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <linearGradient id="O2zipXlwzZyOse8_3L2yya_wpZmKzk11AzJ_gr1" x1="15.189" x2="32.276" y1="-.208" y2="46.737" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#2aa4f4"></stop>
              <stop offset="1" stopColor="#007ad9"></stop>
            </linearGradient>
            <rect width="36" height="36" x="6" y="6" fill="url(#O2zipXlwzZyOse8_3L2yya_wpZmKzk11AzJ_gr1)"></rect>
            <polygon fill="#fff" points="27.49,22 14.227,22 14.227,25.264 18.984,25.264 18.984,40 22.753,40 22.753,25.264 27.49,25.264"></polygon>
            <path fill="#fff" d="M39.194,26.084c0,0-1.787-1.192-3.807-1.192s-2.747,0.96-2.747,1.986 c0,2.648,7.381,2.383,7.381,7.712c0,8.209-11.254,4.568-11.254,4.568V35.22c0,0,2.152,1.622,4.733,1.622s2.483-1.688,2.483-1.92 c0-2.449-7.315-2.449-7.315-7.878c0-7.381,10.658-4.469,10.658-4.469L39.194,26.084z"></path>
          </svg>
        )
      case "json":
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h8v4h4v12zm-6-3h-2v-2h-2v-2h2v-2h2v2h2v2h-2z" fill="currentColor"/>
          </svg>
        )
      case "config":
      case "md":
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6c-1.1 0-1.9.9-1.9 2v16c0 1.1.9 2 1.9 2h11.1c1.1 0 1.9-.9 1.9-2V7.4L14 2zM20 8l-6-6H6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      default:
        return (
          <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" fill="currentColor" fillOpacity="0.1" />
            <path d="M7 6h10v12H7z" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )
    }
  }

  const getLanguage = (ext: string) => {
    switch (ext) {
      case "html": return "html"
      case "css": return "css"
      case "js": return "javascript"
      case "jsx": return "jsx"
      case "ts": return "typescript"
      case "tsx": return "tsx"
      case "json": return "json"
      case "md": return "markdown"
      default: return "text"
    }
  }

  const getCurrentFileContent = (filePath: string) => {
    return editedFiles[filePath] || files.find((f) => f.name === filePath)?.content || ""
  }

  const updateFileContent = (filePath: string, newContent: string) => {
    setEditedFiles(prev => ({ ...prev, [filePath]: newContent }))
  }

  const combineFilesToHTML = useMemo(() => (projectFiles: ProjectFile[]): string => {
    if (projectType !== "html") return ""
    const htmlFile = projectFiles.find((f) => f.name.endsWith(".html"))
    if (!htmlFile) return ""

    let html = editedFiles[htmlFile.name] || htmlFile.content

    // Inline CSS
    html = html.replace(
      /<link\s+rel="stylesheet"\s+href="([^"]+)"\s*\/?(>|\s*\/>)/g,
      (match, href) => {
        const cleanHref = href.replace(/^\.\//, "")
        const cssFile = projectFiles.find((f) => f.name === cleanHref && f.name.endsWith(".css"))
        if (cssFile) {
          const content = editedFiles[cssFile.name] || cssFile.content
          return `<style>\n${content}\n</style>`
        }
        return match
      }
    )

    // Inline JS/TS
    html = html.replace(
      /<script\s+(type="([^"]+)")?\s*src="([^"]+)"\s*><\/script>/g,
      (match, typeAttr, type, src) => {
        const cleanSrc = src.replace(/^\.\//, "")
        const jsFile = projectFiles.find((f) => f.name === cleanSrc && (f.name.endsWith(".js") || f.name.endsWith(".ts")))
        if (jsFile) {
          const content = editedFiles[jsFile.name] || jsFile.content
          const scriptType = type ? ` type="${type}"` : ""
          return `<script${scriptType}>\n${content}\n</script>`
        }
        return match
      }
    )

    return html
  }, [projectType, editedFiles])

  const srcdoc = useMemo(() => {
    const projectFiles = files.map((file) => ({
      ...file,
      content: editedFiles[file.name] || file.content,
    }))

    if (projectType === "nextjs") {
      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Next.js Project Preview</title>
    <style>
      body { 
        margin: 0; 
        padding: 20px; 
        font-family: system-ui, sans-serif;
        background: #f5f5f5;
        text-align: center;
      }
      .preview-message {
        background: white;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        max-width: 600px;
        margin: 0 auto;
      }
    </style>
  </head>
  <body>
    <div class="preview-message">
      <h2>Next.js TypeScript Project</h2>
      <p>This is a full Next.js project with TypeScript. To preview:</p>
      <ol style="text-align: left; display: inline-block;">
        <li>Download all files</li>
        <li>Run <code>npm install</code> (requires Node.js)</li>
        <li>Run <code>npm run dev</code></li>
        <li>Open <a href="http://localhost:3000" target="_blank">localhost:3000</a></li>
      </ol>
      <p><Button variant="outline" size="sm"><Play className="h-4 w-4 mr-2" /> Start Dev Server</Button> (Download first!)</p>
    </div>
    <script>
      function reportHeight() {
        const h = 600
        parent.postMessage({ __fromSandbox: true, height: h }, '*')
      }
      reportHeight()
    </script>
  </body>
</html>`
    }

    if (projectType === "html") {
      const combinedHTML = combineFilesToHTML(projectFiles)
      const trimmedHtml = combinedHTML.trim()
      const isFullHtml = /^<!DOCTYPE/i.test(trimmedHtml) || /^<html/i.test(trimmedHtml)

      const wrapperMeta = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Website Preview</title>
      `

      const additionalStyles = `
        <style>
          html, body { 
            margin: 0; 
            padding: 0; 
            height: 100%; 
            overflow: hidden; 
            background: #fff;
            font-family: system-ui, sans-serif;
          }
          #root { 
            width: 100%; 
            height: 100%; 
          }
        </style>
      `

      const additionalScript = `
        <script>
          function reportHeight() {
            try {
              const h = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
                window.innerHeight,
                800
              )
              parent.postMessage({ __fromSandbox: true, height: h }, '*')
            } catch (e) {}
          }
          window.addEventListener('load', reportHeight)
          setInterval(reportHeight, 1000)
          ${editMode ? `
            function makeElementsEditable() {
              const editableElements = document.querySelectorAll('p, h1, h2, h3, span, button, div')
              editableElements.forEach((el, index) => {
                if (!el.dataset.editableId) {
                  el.dataset.editableId = 'editable-' + index
                  el.classList.add('editable-element')
                  el.style.cursor = 'pointer'
                  el.addEventListener('click', (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    const rect = el.getBoundingClientRect()
                    const textContent = el.textContent || el.innerText || ''
                    parent.postMessage({
                      __fromSandbox: true,
                      elementSelected: {
                        elementId: el.dataset.editableId,
                        text: textContent.trim(),
                        color: window.getComputedStyle(el).color,
                        x: rect.left,
                        y: rect.top,
                        fontSize: parseFloat(window.getComputedStyle(el).fontSize) || 16
                      }
                    }, '*')
                  })
                }
              })
            }
            window.addEventListener('load', makeElementsEditable)
          ` : ''}
        </script>
      `

      if (isFullHtml) {
        let enhanced = trimmedHtml
        enhanced = enhanced.replace(/<\/head>/i, `${wrapperMeta}${additionalStyles}</head>`)
        enhanced = enhanced.replace(/<\/body>/i, `${additionalScript}</body>`)
        return enhanced
      } else {
        return `<!DOCTYPE html>
<html>
  <head>
    ${wrapperMeta}
    ${additionalStyles}
  </head>
  <body>
    <div id="root">
      ${trimmedHtml}
    </div>
    ${additionalScript}
  </body>
</html>`
      }
    }

    // For other types
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Project Preview</title>
    <style>
      body { 
        margin: 0; 
        padding: 20px; 
        font-family: system-ui, sans-serif;
        background: #f5f5f5;
        text-align: center;
      }
      .preview-message {
        background: white;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        max-width: 600px;
        margin: 0 auto;
      }
    </style>
  </head>
  <body>
    <div class="preview-message">
      <h2>Project Files</h2>
      <p>Preview not available for this project type. Download files to run locally.</p>
      <script>
        parent.postMessage({ __fromSandbox: true, height: 300 }, '*')
      </script>
    </div>
  </body>
</html>`
  }, [files, editedFiles, editMode, projectType, combineFilesToHTML])

  const copyFileContent = () => {
    const content = getCurrentFileContent(selectedFile)
    navigator.clipboard.writeText(content).then(() => {
      // Optional: show toast
    })
  }

  const downloadFile = () => {
    const content = getCurrentFileContent(selectedFile)
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = selectedFile.split("/").pop() || "file"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    // Create a zip or individual downloads, but for simplicity, prompt download folder
    files.forEach(file => {
      const content = getCurrentFileContent(file.name)
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e?.data?.__fromSandbox && typeof e.data.height === "number" && iframeRef.current) {
        const newHeight = Math.max(400, Math.min(2048, e.data.height))
        iframeRef.current.style.height = newHeight + "px"
      }
      if (e?.data?.__fromSandbox && e.data.elementSelected && iframeRef.current) {
        const { elementId, text, color, x, y, fontSize } = e.data.elementSelected
        setSelectedElementId(elementId)
        setSelectedElementProps({ text, color, x, y, fontSize })
        const rect = iframeRef.current.getBoundingClientRect()
        setPopoverPosition({ x: x + rect.left + 10, y: y + rect.top + 10 })
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  const FileTreeNode: React.FC<{
    node: FileNode
    path: string
    depth: number
    onSelect: (path: string) => void
    selected: string
    onUpdate: (path: string, content: string) => void
  }> = ({ node, path, depth, onSelect, selected, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(node.children && node.children.length > 0)
    const isFolder = node.type === "folder" || (node.children && node.children.length > 0)
    const ext = isFolder ? "" : getFileExtension(node.name)

    if (isFolder) {
      return (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 p-2 w-full text-left text-sm transition-colors hover:bg-sidebar-accent/50"
            style={{ paddingLeft: `${depth * 12}px` }}
          >
            {node.children && <>{isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</>}
            {getFileIcon(ext, "folder")}
            <span className="truncate font-medium">{node.name || "root"}</span>
          </button>
          {isOpen && node.children && (
            <div className="ml-4">
              {node.children.map((child) => (
                <FileTreeNode
                  key={child.name}
                  node={child}
                  path={path ? `${path}/${child.name}` : child.name}
                  depth={depth + 1}
                  onSelect={onSelect}
                  selected={selected}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          )}
        </div>
      )
    } else {
      return (
        <button
          onClick={() => onSelect(path)}
          className={`flex items-center gap-2 p-2 w-full text-sm transition-colors ${
            selected === path
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          }`}
          style={{ paddingLeft: `${depth * 12}px` }}
        >
          {getFileIcon(ext)}
          <span className="truncate flex-1">{node.name}</span>
          {editedFiles[path] && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
        </button>
      )
    }
  }

  return (
    <div className="flex h-full bg-background">
      {/* File Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-12" : "w-64"} transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col`}
      >
        <div className="p-2 flex justify-between items-center border-b">
          {!sidebarCollapsed && <span className="text-sm font-medium">Project Files ({projectType})</span>}
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={downloadAll} title="Download All">
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8 p-0"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {fileTree.children?.map((node) => (
            <FileTreeNode
              key={node.name}
              node={node}
              path={node.name}
              depth={0}
              onSelect={setSelectedFile}
              selected={selectedFile}
              onUpdate={updateFileContent}
            />
          ))}
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* File Header */}
        {selectedFile && (
          <div className="h-12 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              {getFileIcon(getFileExtension(selectedFile))}
              <span className="font-medium text-sidebar-foreground truncate max-w-[300px]">{selectedFile}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={copyFileContent}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadFile}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className={`${showPreview ? "w-1/2" : "w-full"} border-r border-border flex flex-col`}>
            {selectedFile ? (
              <>
                <div className="border-b p-2 text-xs text-muted-foreground">
                  Edit: {getLanguage(getFileExtension(selectedFile))}
                </div>
                <div className="flex-1 overflow-auto">
                  <textarea
                    value={getCurrentFileContent(selectedFile)}
                    onChange={(e) => updateFileContent(selectedFile, e.target.value)}
                    className="w-full h-full resize-none bg-editor text-editor-foreground p-4 font-mono text-sm leading-relaxed"
                    spellCheck={false}
                    style={{
                      outline: "none",
                      border: "none",
                      backgroundColor: "#1e1e1e",
                      color: "#d4d4d4",
                      fontFamily: "Monaco, Menlo, 'Ubuntu Mono', monospace",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a file to edit
              </div>
            )}
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="w-1/2 relative flex flex-col">
              <div className="h-12 border-b flex items-center px-4 text-sm font-medium bg-muted/50">
                Preview ({projectType})
              </div>
              <div className="flex-1">
                <iframe
                  ref={iframeRef}
                  title="Project Sandbox Preview"
                  sandbox="allow-scripts allow-downloads allow-pointer-lock allow-modals allow-popups allow-same-origin allow-fullscreen allow-forms allow-popups-to-escape-sandbox"
                  style={{
                    width: "100%",
                    border: "none",
                    height: "100%",
                    background: projectType === "nextjs" ? "#f5f5f5" : "#fff",
                  }}
                  srcDoc={srcdoc}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Element Editor Popover */}
      {editMode && selectedElementId && selectedElementProps && showPreview && projectType === "html" && (
        <Popover open={true}>
          <PopoverTrigger asChild>
            <div
              style={{
                position: "fixed",
                left: popoverPosition.x,
                top: popoverPosition.y,
                width: 1,
                height: 1,
                zIndex: 50,
              }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="element-content">Content</Label>
                <Input
                  id="element-content"
                  value={selectedElementProps.text}
                  onChange={(e) => setSelectedElementProps((prev) => prev ? { ...prev, text: e.target.value } : null)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="element-color">Color</Label>
                <Input
                  id="element-color"
                  type="color"
                  value={selectedElementProps.color}
                  onChange={(e) =>
                    setSelectedElementProps((prev) => (prev ? { ...prev, color: e.target.value } : null))
                  }
                  className="mt-1 w-full h-10"
                />
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => {
                  // Apply changes to iframe content
                  if (iframeRef.current && iframeRef.current.contentDocument) {
                    const doc = iframeRef.current.contentDocument
                    const el = doc.querySelector(`[data-editable-id="${selectedElementId}"]`) as HTMLElement
                    if (el && selectedElementProps) {
                      el.textContent = selectedElementProps.text
                      el.style.color = selectedElementProps.color
                      el.style.fontSize = `${selectedElementProps.fontSize}px`
                    }
                  }
                  setSelectedElementProps(null)
                  setSelectedElementId(null)
                }}>
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export default MultiFileSandbox

// "use client"
// import type React from "react"
// import { useEffect, useMemo, useRef, useState } from "react"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { ChevronRight, ChevronDown, Copy, Download } from "lucide-react"
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
// import "@/styles/button.css"

// interface GameFile {
//   name: string
//   content: string
//   type: "html" | "css" | "js" | "ts"
// }

// interface MultiFileSandboxProps {
//   files: GameFile[]
//   height?: number
//   editMode: boolean
//   setGeneratedComponent: (code: string) => void
//   showPreview?: boolean
// }

// interface ElementProps {
//   text: string
//   color: string
//   x: number
//   y: number
//   fontSize: number
// }

// const MultiFileSandbox: React.FC<MultiFileSandboxProps> = ({ files, height = 800, editMode, showPreview = true }) => {
//   const iframeRef = useRef<HTMLIFrameElement | null>(null)
//   const [selectedFile, setSelectedFile] = useState<string>(files[0]?.name || "")
//   const [editedFiles] = useState<Record<string, string>>({})
//   const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
//   const [selectedElementProps, setSelectedElementProps] = useState<ElementProps | null>(null)
//   const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

//   const getFileIcon = (type: string) => {
//     switch (type) {
//       case "html":
//         return (
//           <svg
//             className="h-5 w-5"
//             xmlns="http://www.w3.org/2000/svg"
//             x="0px"
//             y="0px"
//             width="100"
//             height="100"
//             viewBox="0 0 50 50"
//           >
//             <path d="M9,7l3,34l14,4l14-4c1-11.33,2-22.67,3-34H9z M33.76,35l-7.77,2l-7.76-2l-0.39-5h3.86l0.18,2L26,32.62L30.17,32l0.41-5	H17.59l0.96-12H34l0.7,6H31l-0.23-2h-8.36l-0.32,4h12.66L33.76,35z"></path>
//           </svg>
//         )
//       case "css":
//         return (
//           <svg
//             className="h-5 w-5"
//             xmlns="http://www.w3.org/2000/svg"
//             x="0px"
//             y="0px"
//             width="100"
//             height="100"
//             viewBox="0 0 48 48"
//           >
//             <path fill="#0277BD" d="M41,5H7l3,34l14,4l14-4L41,5L41,5z"></path>
//             <path fill="#039BE5" d="M24 8L24 39.9 35.2 36.7 37.7 8z"></path>
//             <path
//               fill="#FFF"
//               d="M33.1 13L24 13 24 17 28.9 17 28.6 21 24 21 24 25 28.4 25 28.1 29.5 24 30.9 24 35.1 31.9 32.5 32.6 21 32.6 21z"
//             ></path>
//             <path
//               fill="#EEE"
//               d="M24,13v4h-8.9l-0.3-4H24z M19.4,21l0.2,4H24v-4H19.4z M19.8,27h-4l0.3,5.5l7.9,2.6v-4.2l-4.1-1.4L19.8,27z"
//             ></path>
//           </svg>
//         )
//       case "js":
//         return (
//           <svg
//             className="h-5 w-5"
//             xmlns="http://www.w3.org/2000/svg"
//             x="0px"
//             y="0px"
//             width="100"
//             height="100"
//             viewBox="0 0 48 48"
//           >
//             <path fill="#ffd600" d="M6,42V6h36v36H6z"></path>
//             <path
//               fill="#000001"
//               d="M29.538 32.947c.692 1.124 1.444 2.201 3.037 2.201 1.338 0 2.04-.665 2.04-1.585 0-1.101-.726-1.492-2.198-2.133l-.807-.344c-2.329-.988-3.878-2.226-3.878-4.841 0-2.41 1.845-4.244 4.728-4.244 2.053 0 3.528.711 4.592 2.573l-2.514 1.607c-.553-.988-1.151-1.377-2.078-1.377-.946 0-1.545.597-1.545 1.377 0 .964.6 1.354 1.985 1.951l.807.344C36.452 29.645 38 30.839 38 33.523 38 36.415 35.716 38 32.65 38c-2.999 0-4.702-1.505-5.65-3.368L29.538 32.947zM17.952 33.029c.506 .906 1.275 1.603 2.381 1.603 1.058 0 1.667-.418 1.667-2.043V22h3.333v11.101c0 3.367-1.953 4.899-4.805 4.899-2.577 0-4.437-1.746-5.195-3.368L17.952 33.029z"
//             ></path>
//           </svg>
//         )
//       case "ts":
//         return (
//           <svg
//             className="h-5 w-5"
//             xmlns="http://www.w3.org/2000/svg"
//             x="0px"
//             y="0px"
//             width="100"
//             height="100"
//             viewBox="0 0 48 48"
//           >
//             <linearGradient
//               id="O2zipXlwzZyOse8_3L2yya_wpZmKzk11AzJ_gr1"
//               x1="15.189"
//               x2="32.276"
//               y1="-.208"
//               y2="46.737"
//               gradientUnits="userSpaceOnUse"
//             >
//               <stop offset="0" stop-color="#2aa4f4"></stop>
//               <stop offset="1" stop-color="#007ad9"></stop>
//             </linearGradient>
//             <rect width="36" height="36" x="6" y="6" fill="url(#O2zipXlwzZyOse8_3L2yya_wpZmKzk11AzJ_gr1)"></rect>
//             <polygon
//               fill="#fff"
//               points="27.49,22 14.227,22 14.227,25.264 18.984,25.264 18.984,40 22.753,40 22.753,25.264 27.49,25.264"
//             ></polygon>
//             <path
//               fill="#fff"
//               d="M39.194,26.084c0,0-1.787-1.192-3.807-1.192s-2.747,0.96-2.747,1.986	c0,2.648,7.381,2.383,7.381,7.712c0,8.209-11.254,4.568-11.254,4.568V35.22c0,0,2.152,1.622,4.733,1.622s2.483-1.688,2.483-1.92	c0-2.449-7.315-2.449-7.315-7.878c0-7.381,10.658-4.469,10.658-4.469L39.194,26.084z"
//             ></path>
//           </svg>
//         )
//       default:
//         return (
//           <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path
//               d="M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z"
//               fill="currentColor"
//               fillOpacity="0.1"
//             />
//             <path d="M7 6h10v12H7z" stroke="currentColor" strokeWidth="1.5" />
//           </svg>
//         )
//     }
//   }

//   const getLanguage = (type: string) => {
//     switch (type) {
//       case "html":
//         return "html"
//       case "css":
//         return "css"
//       case "js":
//         return "javascript"
//       case "ts":
//         return "typescript"
//       default:
//         return "text"
//     }
//   }

//   const getCurrentFileContent = (fileName: string) => {
//     return editedFiles[fileName] || files.find((f) => f.name === fileName)?.content || ""
//   }

//   const combineFilesToHTML = (gameFiles: GameFile[]): string => {
//     const htmlFile = gameFiles.find((f) => f.name.endsWith(".html") || f.type === "html")
//     if (!htmlFile) return ""

//     let html = editedFiles[htmlFile.name] || htmlFile.content

//     // Create updated contents for all js/ts files with resolved imports
//     const updatedContentMap: Map<string, string> = new Map()

//     const getImports = (code: string): string[] => {
//       const imports: string[] = []
//       const regex = /from\s+['"]\.\/([^'"]+)['"]/g
//       let match
//       while ((match = regex.exec(code))) {
//         imports.push(match[1])
//       }
//       return imports
//     }

//     const getUpdatedContent = (fileName: string): string => {
//       if (updatedContentMap.has(fileName)) return updatedContentMap.get(fileName)!

//       const file = gameFiles.find((f) => f.name === fileName)
//       if (!file) return ""

//       let content = editedFiles[fileName] || file.content

//       const deps = getImports(content)
//       deps.forEach((dep) => {
//         const depDataURL = getDataURL(dep + (dep.endsWith(".js") ? "" : ".js")) // Assume .js extension if not specified
//         content = content.replace(
//           new RegExp(`['"]\\.\\/${dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, "g"),
//           `"${depDataURL}"`
//         )
//       })

//       updatedContentMap.set(fileName, content)
//       return content
//     }

//     const getDataURL = (fileName: string): string => {
//       const content = getUpdatedContent(fileName)
//       return `data:application/javascript,${encodeURIComponent(content)}`
//     }

//     // Inline CSS files referenced in HTML
//     html = html.replace(
//       /<link\s+rel="stylesheet"\s+href="([^"]+)"\s*\/?(>|\s*\/>)/g,
//       (match, href) => {
//         const cleanHref = href.replace(/^\.\//, "")
//         const cssFile = gameFiles.find((f) => f.name === cleanHref && f.type === "css")
//         if (cssFile) {
//           const content = editedFiles[cssFile.name] || cssFile.content
//           return `<style>\n${content}\n</style>`
//         }
//         return match
//       }
//     )

//     // Inline JS scripts referenced in HTML (both module and regular)
//     html = html.replace(
//       /<script\s+(type="([^"]+)")?\s*src="([^"]+)"\s*><\/script>/g,
//       (match, typeAttr, type, src) => {
//         const cleanSrc = src.replace(/^\.\//, "")
//         const jsFile = gameFiles.find((f) => f.name === cleanSrc && (f.type === "js" || f.type === "ts"))
//         if (jsFile) {
//           const content = getUpdatedContent(jsFile.name)
//           const scriptType = type ? ` type="${type}"` : ""
//           return `<script${scriptType}>\n${content}\n</script>`
//         }
//         return match
//       }
//     )

//     // Ensure external scripts for character integration are preserved
//     if (!html.includes('ChatManager.js')) {
//       html = html.replace('</body>', '<script src="https://storage.googleapis.com/rosebud_staticfiles/ChatManager.js"></script>\n</body>')
//     }
//     if (!html.includes('ImageGenerator.js')) {
//       html = html.replace('</body>', '<script src="https://storage.googleapis.com/rosebud_staticfiles/ImageGenerator.js"></script>\n</body>')
//     }
//     if (!html.includes('ProgressLogger.js')) {
//       html = html.replace('</body>', '<script src="https://storage.googleapis.com/rosebud_staticfiles/ProgressLogger.js"></script>\n</body>')
//     }
//     if (!html.includes('OGP.js')) {
//       html = html.replace('</body>', '<script src="https://storage.googleapis.com/rosebud_staticfiles/OGP.js"></script>\n</body>')
//     }

//     return html
//   }

//   const srcdoc = useMemo(() => {
//     const combinedHTML = combineFilesToHTML(
//       files.map((file) => ({
//         ...file,
//         content: editedFiles[file.name] || file.content,
//       })),
//     )

//     const trimmedHtml = combinedHTML.trim()
//     const isFullHtml = /^<!DOCTYPE/i.test(trimmedHtml) || /^<html/i.test(trimmedHtml)

//     const wrapperMeta = `
//     <meta charset="utf-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <title>Professional 3D Game with Character Animation</title>
//     `

//     const additionalStyles = `
//     <style>
//       html, body { 
//         margin: 0; 
//         padding: 0; 
//         height: 100%; 
//         overflow: hidden; 
//         background: #000;
//         font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//       }
//       #root { 
//         position: relative; 
//         width: 100%; 
//         height: 100%; 
//         display: flex;
//         flex-direction: column;
//       }
//       canvas { 
//         display: block; 
//         width: 100%;
//         height: 100%;
//         cursor: ${editMode ? "default" : "crosshair"};
//       }
//       .game-ui {
//         position: absolute;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         pointer-events: ${editMode ? "auto" : "none"};
//         z-index: 1000;
//       }
//       .game-ui > * {
//         pointer-events: auto;
//       }
//       .editable-element {
//         cursor: ${editMode ? "pointer" : "default"};
//         transition: all 0.2s ease;
//       }
//       .editable-element:hover {
//         ${editMode ? "outline: 2px solid #2196F3; outline-offset: 2px;" : ""}
//       }
//       /* Additional styles for character animation preview */
//       .character-preview {
//         position: absolute;
//         bottom: 10px;
//         right: 10px;
//         background: rgba(0,0,0,0.5);
//         color: white;
//         padding: 10px;
//         border-radius: 5px;
//       }
//     </style>
//     `

//     const additionalScript = `
//     <script>
//       window.GameUtils = {
//         showLoadingScreen: function(message = "Loading Professional 3D Game with Darji Ace Character...") {
//           const loading = document.createElement('div')
//           loading.className = 'loading-screen'
//           loading.id = 'loading-screen'
//           loading.innerHTML = \`
//             <div style="text-align: center;">
//               <h2>\${message}</h2>
//               <div class="progress-bar">
//                 <div class="progress-fill" id="progress-fill"></div>
//               </div>
//               <p style="margin-top: 15px; font-size: 14px; opacity: 0.8;">Initializing advanced 3D graphics and character animations...</p>
//             </div>
//           \`
//           document.body.appendChild(loading)
//         },
//         updateProgress: function(percent) {
//           const fill = document.getElementById('progress-fill')
//           if (fill) fill.style.width = percent + '%'
//         },
//         hideLoadingScreen: function() {
//           const loading = document.getElementById('loading-screen')
//           if (loading) {
//             loading.style.opacity = '0'
//             setTimeout(() => loading.remove(), 500)
//           }
//         },
//         handleError: function(error) {
//           console.error('Game Error:', error)
//           parent.postMessage({ __fromSandbox: true, error: { message: error.message } }, '*')
//         }
//       }

//       function reportHeight() {
//         try {
//           const h = Math.max(
//             document.documentElement.scrollHeight,
//             document.body.scrollHeight,
//             window.innerHeight,
//             800
//           )
//           parent.postMessage({ __fromSandbox: true, height: h }, '*')
//         } catch (e) {}
//       }

//       window.addEventListener('error', GameUtils.handleError)
//       window.addEventListener('unhandledrejection', e => GameUtils.handleError(e.reason))
//       window.addEventListener('load', () => {
//         reportHeight()
//         setTimeout(() => GameUtils.hideLoadingScreen(), 1500)
//       })
//       setInterval(reportHeight, 1000)

//       ${
//         editMode
//           ? `
//       // Add editable element functionality for game UI including character info
//       function makeElementsEditable() {
//         const editableElements = document.querySelectorAll('.game-ui .hud, .game-ui p, .game-ui h1, .game-ui h2, .game-ui h3, .game-ui span, .game-ui .game-button, .game-ui div, .character-preview')
//         editableElements.forEach((el, index) => {
//           if (!el.dataset.editableId) {
//             el.dataset.editableId = 'editable-' + index
//             el.classList.add('editable-element')
//             el.style.position = 'absolute'
//             el.addEventListener('click', (e) => {
//               e.stopPropagation()
//               e.preventDefault()
//               const rect = el.getBoundingClientRect()
//               const textContent = el.textContent || el.innerText || ''
//               parent.postMessage({
//                 __fromSandbox: true,
//                 elementSelected: {
//                   elementId: el.dataset.editableId,
//                   text: textContent.trim(),
//                   color: el.style.color || 'white',
//                   x: parseFloat(el.style.left) || rect.left,
//                   y: parseFloat(el.style.top) || rect.top,
//                   fontSize: parseFloat(el.style.fontSize) || 16
//                 }
//               }, '*')
//             })
//           }
//         })
//       }
//       window.addEventListener('load', makeElementsEditable)
//       `
//           : ""
//       }
//     </script>
//     `

//     if (isFullHtml) {
//       let enhanced = trimmedHtml
//       enhanced = enhanced.replace(/<\/head>/i, additionalStyles + "</head>")
//       enhanced = enhanced.replace(/<\/body>/i, additionalScript + "</body>")
//       return enhanced
//     } else {
//       return `<!DOCTYPE html>
// <html>
//   <head>
//     ${wrapperMeta}
//     ${additionalStyles}
//   </head>
//   <body>
//     <div id="root">
//       <div class="game-ui"></div>
//       <div class="character-preview">Darji Ace Character Loaded</div>
//     </div>
//     ${additionalScript}
//     ${trimmedHtml}
//   </body>
// </html>`
//     }
//   }, [files, editedFiles, editMode])

//   const copyFileContent = () => {
//     const content = getCurrentFileContent(selectedFile)
//     navigator.clipboard.writeText(content)
//   }

//   const downloadFile = () => {
//     const content = getCurrentFileContent(selectedFile)
//     const blob = new Blob([content], { type: "text/plain" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = selectedFile
//     a.click()
//     URL.revokeObjectURL(url)
//   }

//   useEffect(() => {
//     const onMessage = (e: MessageEvent) => {
//       if (e?.data?.__fromSandbox && typeof e.data.height === "number" && iframeRef.current) {
//         const newHeight = Math.max(600, Math.min(2048, e.data.height))
//         iframeRef.current.style.height = newHeight + "px"
//       }
//       if (e?.data?.__fromSandbox && e.data.elementSelected && iframeRef.current) {
//         const { elementId, text, color, x, y, fontSize } = e.data.elementSelected
//         setSelectedElementId(elementId)
//         setSelectedElementProps({ text, color, x, y, fontSize })
//         const rect = iframeRef.current.getBoundingClientRect()
//         setPopoverPosition({ x: x + rect.left + 10, y: y + rect.top + 10 })
//       }
//     }
//     window.addEventListener("message", onMessage)
//     return () => window.removeEventListener("message", onMessage)
//   }, [setSelectedElementId, setSelectedElementProps, setPopoverPosition])

//   return (
//     <div className="flex h-full bg-background">
//       {/* File Sidebar */}
//       <div
//         className={`${sidebarCollapsed ? "w-[50px]" : "w-[400px]"} transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col`}
//       >
//         <div className="p-2">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//             className="h-8 w-8 p-0"
//           >
//             {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//           </Button>
//         </div>

//         {!sidebarCollapsed && (
//           <ScrollArea className="flex-1 p-2">
//             <div className="space-y-1">
//               {files.map((file) => (
//                 <button
//                   key={file.name}
//                   onClick={() => setSelectedFile(file.name)}
//                   className={`w-full flex items-center gap-2 p-2 rounded-md text-sm transition-colors ${
//                     selectedFile === file.name
//                       ? "bg-sidebar-accent text-sidebar-accent-foreground"
//                       : "text-sidebar-foreground hover:bg-sidebar-accent/50"
//                   }`}
//                 >
//                   {getFileIcon(file.type)}
//                   <span className="truncate">{file.name}</span>
//                   {editedFiles[file.name] && <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto" />}
//                 </button>
//               ))}
//             </div>
//           </ScrollArea>
//         )}
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* File Header */}
//         <div className="h-12 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
//           <div className="flex items-center gap-2">
//             {getFileIcon(files.find((f) => f.name === selectedFile)?.type || "html")}
//             <span className="font-medium text-sidebar-foreground">{selectedFile}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button variant="ghost" size="sm" onClick={copyFileContent}>
//               <Copy className="h-4 w-4" />
//             </Button>
//             <Button variant="ghost" size="sm" onClick={downloadFile}>
//               <Download className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>

//         {/* Content Area */}
//         <div className="flex-1 flex">
//           {/* Code Editor */}
//           <div className={`${showPreview ? "w-1/2" : "w-full"} border-r border-border`}>
//             <div className="h-full">
//               <SyntaxHighlighter
//                 language={getLanguage(files.find((f) => f.name === selectedFile)?.type || "html")}
//                 style={vscDarkPlus}
//                 customStyle={{
//                   margin: 0,
//                   height: "100%",
//                   fontSize: "14px",
//                   lineHeight: "1.5",
//                 }}
//                 showLineNumbers={true}
//                 wrapLines={true}
//               >
//                 {getCurrentFileContent(selectedFile)}
//               </SyntaxHighlighter>
//             </div>
//           </div>

//           {/* Game Preview */}
//           {showPreview && (
//             <div className="w-1/2 relative">
//               <iframe
//                 ref={iframeRef}
//                 title="Professional 3D Game Sandbox with Character"
//                 sandbox="allow-scripts allow-downloads allow-pointer-lock allow-modals allow-popups allow-same-origin allow-fullscreen allow-forms allow-popups-to-escape-sandbox"
//                 style={{
//                   width: "100%",
//                   border: "none",
//                   height,
//                   background: "#000",
//                 }}
//                 srcDoc={srcdoc}
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Element Editor Popover */}
//       {editMode && selectedElementId && selectedElementProps && showPreview && (
//         <Popover open={true}>
//           <PopoverTrigger asChild>
//             <div
//               style={{
//                 position: "fixed",
//                 left: popoverPosition.x,
//                 top: popoverPosition.y,
//                 width: 1,
//                 height: 1,
//               }}
//             />
//           </PopoverTrigger>
//           <PopoverContent className="w-[300px] p-4">
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="element-content">Content</Label>
//                 <Input
//                   id="element-content"
//                   value={selectedElementProps.text}
//                   onChange={(e) => setSelectedElementProps((prev) => (prev ? { ...prev, text: e.target.value } : null))}
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="element-color">Color</Label>
//                 <Input
//                   id="element-color"
//                   type="color"
//                   value={selectedElementProps.color}
//                   onChange={(e) =>
//                     setSelectedElementProps((prev) => (prev ? { ...prev, color: e.target.value } : null))
//                   }
//                   className="mt-1 w-full h-10"
//                 />
//               </div>
//             </div>
//           </PopoverContent>
//         </Popover>
//       )}
//     </div>
//   )
// }

// export default MultiFileSandbox