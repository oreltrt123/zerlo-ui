"use client"
import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DynamicSandboxProps {
  html: string
  height?: number
  editMode: boolean
  setGeneratedComponent: (code: string) => void
}

interface ElementProps {
  text: string
  color: string
  x: number
  y: number
  fontSize: number
}

const DynamicSandbox: React.FC<DynamicSandboxProps> = ({ html, height = 800, editMode, setGeneratedComponent }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [selectedElementProps, setSelectedElementProps] = useState<ElementProps | null>(null)
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const srcdoc = useMemo(() => {
    const trimmedHtml = html.trim()
    const isFullHtml = /^<!DOCTYPE/i.test(trimmedHtml) || /^<html/i.test(trimmedHtml) || /<head>/i.test(trimmedHtml) || /<body>/i.test(trimmedHtml)

    const wrapperMeta = `
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Professional 3D Game</title>
    `

    const additionalStyles = `
    <style>
      html, body { 
        margin: 0; 
        padding: 0; 
        height: 100%; 
        overflow: hidden; 
        background: #000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      #root { 
        position: relative; 
        width: 100%; 
        height: 100%; 
        display: flex;
        flex-direction: column;
      }
      canvas { 
        display: block; 
        width: 100%;
        height: 100%;
        cursor: ${editMode ? 'default' : 'crosshair'};
      }
      .game-ui {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: ${editMode ? 'auto' : 'none'};
        z-index: 1000;
      }
      .game-ui > * {
        pointer-events: auto;
      }
      .hud, .game-button, .game-menu p, .game-menu h1, .game-menu h2, .game-menu h3, .game-menu span {
        position: absolute;
        color: white;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      }
      .loading-screen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 24px;
        z-index: 2000;
      }
      .progress-bar {
        width: 300px;
        height: 4px;
        background: rgba(255,255,255,0.2);
        border-radius: 2px;
        margin-top: 20px;
        overflow: hidden;
      }
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00ff88, #00ccff);
        width: 0%;
        transition: width 0.3s ease;
      }
      .game-button {
        background: linear-gradient(145deg, #2196F3, #1976D2);
        border: none;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
      }
      .game-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
      }
      .game-menu {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        padding: 40px;
        border-radius: 15px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .editable-element {
        cursor: ${editMode ? 'pointer' : 'default'};
        transition: all 0.2s ease;
      }
      .editable-element:hover {
        ${editMode ? 'outline: 2px solid #2196F3; outline-offset: 2px;' : ''}
      }
    </style>
    `

    const additionalScript = `
    <script>
      window.GameUtils = {
        showLoadingScreen: function(message = "Loading Professional 3D Game...") {
          const loading = document.createElement('div')
          loading.className = 'loading-screen'
          loading.id = 'loading-screen'
          loading.innerHTML = \`
            <div style="text-align: center;">
              <h2>\${message}</h2>
              <div class="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
              </div>
              <p style="margin-top: 15px; font-size: 14px; opacity: 0.8;">Initializing advanced 3D graphics...</p>
            </div>
          \`
          document.body.appendChild(loading)
        },
        updateProgress: function(percent) {
          const fill = document.getElementById('progress-fill')
          if (fill) fill.style.width = percent + '%'
        },
        hideLoadingScreen: function() {
          const loading = document.getElementById('loading-screen')
          if (loading) {
            loading.style.opacity = '0'
            setTimeout(() => loading.remove(), 500)
          }
        },
        handleError: function(error) {
          console.error('Game Error:', error)
          const errorDiv = document.createElement('div')
          errorDiv.style.cssText = \`
            position: fixed; top: 20px; right: 20px; 
            background: #f44336; color: white; 
            padding: 15px; border-radius: 8px; 
            font-family: monospace; font-size: 12px;
            max-width: 300px; z-index: 9999;
            box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
          \`
          errorDiv.textContent = 'Game Error: ' + error.message
          document.body.appendChild(errorDiv)
          setTimeout(() => errorDiv.remove(), 5000)
        },
        setupCanvas: function(canvas) {
          const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            canvas.style.width = '100%'
            canvas.style.height = '100%'
          }
          window.addEventListener('resize', resize)
          resize()
          canvas.addEventListener('dblclick', () => {
            if (!document.fullscreenElement) {
              canvas.requestFullscreen().catch(console.error)
            } else {
              document.exitFullscreen().catch(console.error)
            }
          })
        }
      }

      window.GameUtils.showLoadingScreen()

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

      window.addEventListener('error', GameUtils.handleError)
      window.addEventListener('unhandledrejection', e => GameUtils.handleError(e.reason))
      window.addEventListener('load', () => {
        reportHeight()
        setTimeout(() => GameUtils.hideLoadingScreen(), 1500)
      })
      setInterval(reportHeight, 1000)

      ${editMode ? '' : `
      document.addEventListener('click', (e) => {
        const canvas = document.querySelector('canvas')
        if (canvas && !document.pointerLockElement && !e.target.closest('.game-ui')) {
          canvas.requestPointerLock?.()
        }
      })
      `}

      ${editMode ? `
      // Add editable element functionality
      function makeElementsEditable() {
        const editableElements = document.querySelectorAll('.game-ui .hud, .game-ui p, .game-ui h1, .game-ui h2, .game-ui h3, .game-ui span, .game-ui .game-button, .game-ui div')
        editableElements.forEach((el, index) => {
          if (!el.dataset.editableId) {
            el.dataset.editableId = 'editable-' + index
            el.classList.add('editable-element')
            el.style.position = 'absolute'
            el.addEventListener('click', (e) => {
              if (${editMode}) {
                e.stopPropagation()
                e.preventDefault()
                const rect = el.getBoundingClientRect()
                const textContent = el.textContent || el.innerText || ''
                parent.postMessage({
                  __fromSandbox: true,
                  elementSelected: {
                    elementId: el.dataset.editableId,
                    text: textContent.trim(),
                    color: el.style.color || 'white',
                    x: parseFloat(el.style.left) || rect.left,
                    y: parseFloat(el.style.top) || rect.top,
                    fontSize: parseFloat(el.style.fontSize) || 16
                  }
                }, '*')
              }
            })
          }
        })
      }
      window.addEventListener('load', makeElementsEditable)
      window.addEventListener('message', (e) => {
        if (e.data.__fromParent && e.data.elementUpdate) {
          const { elementId, newText, newColor, newX, newY, newFontSize } = e.data.elementUpdate
          const el = document.querySelector(\`[data-editable-id="\${elementId}"]\`)
          if (el) {
            if (newText && (el.tagName === 'P' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'SPAN' || el.classList.contains('hud'))) {
              el.textContent = newText
            } else if (newText && el.tagName === 'BUTTON') {
              el.innerText = newText
            }
            if (newColor) el.style.color = newColor
            if (newX !== undefined) el.style.left = \`\${newX}px\`
            if (newY !== undefined) el.style.top = \`\${newY}px\`
            if (newFontSize) el.style.fontSize = \`\${newFontSize}px\`
          }
        }
      })
      ` : ''}
    </script>
    `

    const wrapperBodyStart = `
    <div id="root">
      <div class="game-ui"></div>
    </div>
    `

    if (isFullHtml) {
      let enhanced = trimmedHtml
      enhanced = enhanced.replace(/<\/head>/i, additionalStyles + '</head>')
      enhanced = enhanced.replace(/<\/body>/i, additionalScript + '</body>')
      return enhanced
    } else {
      return `<!DOCTYPE html>
<html>
  <head>
    ${wrapperMeta}
    ${additionalStyles}
  </head>
  <body>
    ${wrapperBodyStart}
    ${additionalScript}
    ${trimmedHtml}
  </body>
</html>`
    }
  }, [html, editMode])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e?.data?.__fromSandbox && typeof e.data.height === "number" && iframeRef.current) {
        const newHeight = Math.max(600, Math.min(2048, e.data.height))
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

  const handleElementUpdate = (updates: Partial<ElementProps>) => {
    if (selectedElementId && iframeRef.current?.contentWindow) {
      const newProps = { ...selectedElementProps, ...updates } as ElementProps
      setSelectedElementProps(newProps)
      iframeRef.current.contentWindow.postMessage(
        {
          __fromParent: true,
          elementUpdate: {
            elementId: selectedElementId,
            newText: newProps.text,
            newColor: newProps.color,
            newX: newProps.x,
            newY: newProps.y,
            newFontSize: newProps.fontSize,
          },
        },
        "*"
      )
      // Update the generated component code
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")
      const element = doc.querySelector(`[data-editable-id="${selectedElementId}"]`) as HTMLElement | null
      if (element) {
        if (newProps.text && (element.tagName === 'P' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'SPAN' || element.classList.contains('hud'))) {
          element.textContent = newProps.text
        } else if (newProps.text && element.tagName === 'BUTTON') {
          element.innerText = newProps.text
        }
        if (newProps.color) element.style.color = newProps.color
        if (newProps.x !== undefined) element.style.left = `${newProps.x}px`
        if (newProps.y !== undefined) element.style.top = `${newProps.y}px`
        if (newProps.fontSize) element.style.fontSize = `${newProps.fontSize}px`
        const newHtml = doc.documentElement.outerHTML
        setGeneratedComponent(newHtml)
      }
    }
  }

  return (
    <div className="relative">
      <iframe
        ref={iframeRef}
        title="Professional 3D Game Sandbox"
        sandbox="allow-scripts allow-downloads allow-pointer-lock allow-modals allow-popups allow-same-origin allow-fullscreen"
        style={{
          width: "100%",
          border: "2px solid #2196F3",
          borderRadius: 12,
          height,
          background: "#000",
          boxShadow: "0 8px 32px rgba(33, 150, 243, 0.2)",
          cursor: editMode ? 'default' : 'auto',
        }}
        srcDoc={srcdoc}
      />
      {editMode && selectedElementId && selectedElementProps && (
        <Popover open={true}>
          <PopoverTrigger asChild>
            <div
              style={{
                position: "fixed",
                left: popoverPosition.x,
                top: popoverPosition.y,
                width: 1,
                height: 1,
              }}
            />
          </PopoverTrigger>
          <PopoverContent
            className="w-[300px] p-4 bg-white dark:bg-[#21262d] rounded-lg shadow-lg border border-[#e6e6e6] dark:border-[#30363d]"
            style={{ backdropFilter: "blur(10px)", background: "rgba(255, 255, 255, 0.9)" }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="element-content">Content</Label>
                <Input
                  id="element-content"
                  value={selectedElementProps.text}
                  onChange={(e) => handleElementUpdate({ text: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="element-color">Color</Label>
                <Input
                  id="element-color"
                  type="color"
                  value={selectedElementProps.color}
                  onChange={(e) => handleElementUpdate({ color: e.target.value })}
                  className="mt-1 w-full h-10"
                />
              </div>
              <div>
                <Label htmlFor="element-x">X Position</Label>
                <Input
                  id="element-x"
                  type="number"
                  value={selectedElementProps.x}
                  onChange={(e) => handleElementUpdate({ x: parseFloat(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="element-y">Y Position</Label>
                <Input
                  id="element-y"
                  type="number"
                  value={selectedElementProps.y}
                  onChange={(e) => handleElementUpdate({ y: parseFloat(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="element-size">Font Size</Label>
                <Input
                  id="element-size"
                  type="number"
                  value={selectedElementProps.fontSize}
                  onChange={(e) => handleElementUpdate({ fontSize: parseFloat(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export default DynamicSandbox