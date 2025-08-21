"use client"
import React, { useEffect, useMemo, useRef } from "react"

interface DynamicSandboxProps {
  html: string
  height?: number
}

/**
 * Renders untrusted HTML in an isolated iframe using srcdoc.
 * Also auto-resizes if the content posts its height.
 */
const DynamicSandbox: React.FC<DynamicSandboxProps> = ({ html, height = 720 }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const srcdoc = useMemo(() => {
    // Wrap user HTML to provide a minimal reset and a height postMessage helper
    // so canvases/games can request full-window size without clipping.
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset=\"utf-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
      #root { position: relative; width: 100%; height: 100%; }
      canvas { display: block; }
    </style>
  </head>
  <body>
    <div id=\"root\"></div>
    <script>
      // Allow the game to request a resize by posting its content height
      function reportHeight() {
        try {
          var h = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
          parent.postMessage({ __fromSandbox: true, height: h }, '*');
        } catch (e) {}
      }
      window.addEventListener('load', reportHeight);
      setInterval(reportHeight, 500);
    </script>
    ${html}
  </body>
</html>`
  }, [html])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e?.data?.__fromSandbox && typeof e.data.height === "number" && iframeRef.current) {
        iframeRef.current.style.height = Math.max(360, Math.min(2048, e.data.height)) + "px"
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return (
    <iframe
      ref={iframeRef}
      title="Dynamic Sandbox"
      sandbox="allow-scripts allow-downloads allow-pointer-lock allow-modals allow-popups allow-same-origin"
      style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 12, height }}
      srcDoc={srcdoc}
    />
  )
}

export default DynamicSandbox