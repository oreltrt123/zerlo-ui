"use client"
import type React from "react"
import { useEffect, useMemo, useRef } from "react"

interface DynamicSandboxProps {
  html: string
  height?: number
}

/**
 * Enhanced sandbox for professional 3D games with advanced features
 * Supports Three.js, physics engines, and professional game libraries
 */
const DynamicSandbox: React.FC<DynamicSandboxProps> = ({ html, height = 800 }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const srcdoc = useMemo(() => {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Professional 3D Game</title>
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
        cursor: crosshair;
      }
      
      /* Professional game UI styles */
      .game-ui {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
      }
      
      .game-ui > * {
        pointer-events: auto;
      }
      
      .hud {
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
      
      /* Professional button styles */
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
    </style>
  </head>
  <body>
    <div id="root">
      <div class="game-ui"></div>
    </div>
    
    <script>
      // Enhanced game utilities and helpers
      window.GameUtils = {
        // Professional loading system
        showLoadingScreen: function(message = "Loading Professional 3D Game...") {
          const loading = document.createElement('div');
          loading.className = 'loading-screen';
          loading.id = 'loading-screen';
          loading.innerHTML = \`
            <div style="text-align: center;">
              <h2>\${message}</h2>
              <div class="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
              </div>
              <p style="margin-top: 15px; font-size: 14px; opacity: 0.8;">Initializing advanced 3D graphics...</p>
            </div>
          \`;
          document.body.appendChild(loading);
        },
        
        updateProgress: function(percent) {
          const fill = document.getElementById('progress-fill');
          if (fill) fill.style.width = percent + '%';
        },
        
        hideLoadingScreen: function() {
          const loading = document.getElementById('loading-screen');
          if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => loading.remove(), 500);
          }
        },
        
        // Professional error handling
        handleError: function(error) {
          console.error('Game Error:', error);
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = \`
            position: fixed; top: 20px; right: 20px; 
            background: #f44336; color: white; 
            padding: 15px; border-radius: 8px; 
            font-family: monospace; font-size: 12px;
            max-width: 300px; z-index: 9999;
            box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
          \`;
          errorDiv.textContent = 'Game Error: ' + error.message;
          document.body.appendChild(errorDiv);
          setTimeout(() => errorDiv.remove(), 5000);
        },
        
        // Auto-resize and fullscreen support
        setupCanvas: function(canvas) {
          const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
          };
          window.addEventListener('resize', resize);
          resize();
          
          // Fullscreen support
          canvas.addEventListener('dblclick', () => {
            if (!document.fullscreenElement) {
              canvas.requestFullscreen().catch(console.error);
            } else {
              document.exitFullscreen().catch(console.error);
            }
          });
        }
      };
      
      // Initialize loading screen
      GameUtils.showLoadingScreen();
      
      // Enhanced height reporting for professional games
      function reportHeight() {
        try {
          const h = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
            window.innerHeight,
            800 // Minimum height for professional games
          );
          parent.postMessage({ __fromSandbox: true, height: h }, '*');
        } catch (e) {}
      }
      
      // Professional error handling
      window.addEventListener('error', GameUtils.handleError);
      window.addEventListener('unhandledrejection', e => GameUtils.handleError(e.reason));
      
      // Enhanced reporting
      window.addEventListener('load', () => {
        reportHeight();
        // Hide loading screen after a short delay to show professional loading
        setTimeout(() => GameUtils.hideLoadingScreen(), 1500);
      });
      
      setInterval(reportHeight, 1000);
      
      // Pointer lock support for FPS games
      document.addEventListener('click', () => {
        const canvas = document.querySelector('canvas');
        if (canvas && !document.pointerLockElement) {
          canvas.requestPointerLock?.();
        }
      });
    </script>
    
    ${html}
  </body>
</html>`
  }, [html])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e?.data?.__fromSandbox && typeof e.data.height === "number" && iframeRef.current) {
        const newHeight = Math.max(600, Math.min(2048, e.data.height))
        iframeRef.current.style.height = newHeight + "px"
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return (
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
      }}
      srcDoc={srcdoc}
    />
  )
}

export default DynamicSandbox
