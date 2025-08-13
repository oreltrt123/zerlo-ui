"use client"
import React, { useState, useEffect, useMemo } from "react"
import * as Babel from "@babel/standalone"
import * as shadcnUI from "@/components/ui"
import * as lucide from "lucide-react"
import * as Recharts from "recharts"

interface DynamicComponentProps {
  componentCode: string
}

const DynamicComponent: React.FC<DynamicComponentProps> = ({ componentCode }) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const scope = useMemo(
    () => ({
      React,
      useState,
      useEffect,
      useMemo,
      useCallback: React.useCallback,
      useRef: React.useRef,
      ...shadcnUI,
      ...Recharts,
      ChevronDown: lucide.ChevronDown,
      ChevronUp: lucide.ChevronUp,
      ChevronLeft: lucide.ChevronLeft,
      ChevronRight: lucide.ChevronRight,
      Check: lucide.Check,
      X: lucide.X,
      Plus: lucide.Plus,
      Minus: lucide.Minus,
      Search: lucide.Search,
      Settings: lucide.Settings,
      User: lucide.User,
      Calendar: lucide.Calendar,
      Clock: lucide.Clock,
      Heart: lucide.Heart,
      Star: lucide.Star,
      Home: lucide.Home,
      Mail: lucide.Mail,
      Phone: lucide.Phone,
      MapPin: lucide.MapPin,
      Camera: lucide.Camera,
      Download: lucide.Download,
      Upload: lucide.Upload,
      Edit: lucide.Edit,
      Trash: lucide.Trash,
      Save: lucide.Save,
      Copy: lucide.Copy,
      Share: lucide.Share,
      Bell: lucide.Bell,
      Lock: lucide.Lock,
      Unlock: lucide.Unlock,
      Eye: lucide.Eye,
      EyeOff: lucide.EyeOff,
      ArrowUp: lucide.ArrowUp,
      ArrowDown: lucide.ArrowDown,
      ArrowLeft: lucide.ArrowLeft,
      ArrowRight: lucide.ArrowRight,
      ExternalLink: lucide.ExternalLink,
      Info: lucide.Info,
      AlertCircle: lucide.AlertCircle,
      CheckCircle: lucide.CheckCircle,
      XCircle: lucide.XCircle,
      HelpCircle: lucide.HelpCircle,
      Loader: lucide.Loader,
      Spinner: lucide.Loader2,
      RefreshCw: lucide.RefreshCw,
      MoreHorizontal: lucide.MoreHorizontal,
      MoreVertical: lucide.MoreVertical,
      Menu: lucide.Menu,
      Grid: lucide.Grid3X3,
      List: lucide.List,
      Filter: lucide.Filter,
      Sort: lucide.ArrowUpDown,
      Folder: lucide.Folder,
      File: lucide.File,
      Image: lucide.Image,
      Video: lucide.Video,
      Music: lucide.Music,
      PlusIcon: lucide.Plus,
      MinusIcon: lucide.Minus,
      ThumbsUp: lucide.ThumbsUp,
    }),
    [],
  )

  useEffect(() => {
    if (!componentCode) return
    console.log("Received component code:", componentCode.substring(0, 100) + "...")

    try {
      // Strip markdown code blocks and explanation text
      let cleanedCode = componentCode
        .replace(/^```(jsx|tsx|javascript|typescript)?\n?/m, "")
        .replace(/\n?```$/m, "")
        .trim()

      // Remove any explanation text after export default or component code
      const explanationMatch = cleanedCode.match(/(\n\s*export\s+default\s+\w+;?\s*$)/m)
      if (explanationMatch && explanationMatch.index !== undefined) {
        cleanedCode = cleanedCode.substring(0, explanationMatch.index + explanationMatch[0].length).trim()
      } else {
        // If no export, try to find the end of the component
        const componentEndMatch = cleanedCode.match(/}\s*;\s*$/m)
        if (componentEndMatch && componentEndMatch.index !== undefined) {
          cleanedCode = cleanedCode.substring(0, componentEndMatch.index + componentEndMatch[0].length).trim()
        }
      }
      console.log("Cleaned code:", cleanedCode.substring(0, 100) + "...")

      // Check for non-JSX code (e.g., Python, HTML)
      if (cleanedCode.match(/\.py$/i) || !cleanedCode.includes("return (")) {
        console.log("Non-JSX code detected:", cleanedCode)
        setErrorMessage(`Non-JSX code detected. Code saved but not rendered:\n${cleanedCode}`)
        setComponent(null)
        return
      }

      // Remove all import statements and fix shadcn component names
      const componentWithoutImports = cleanedCode
        .replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, "")
        .replace(/^import\s*\{[\s\S]*?\}\s*from\s+['"].*?['"];?\s*$/gm, "")
        .replace(/^import.*$/gm, "")
        .replace(/DialogDialogDescription/g, "DialogDescription")
        .replace(/DialogDialogHeader/g, "DialogHeader")
        .replace(/DialogDialogFooter/g, "DialogFooter")
        .replace(/DialogDialogTitle/g, "DialogTitle")
        .replace(/DialogDialogTrigger/g, "DialogTrigger")
        .replace(/DialogDialogContent/g, "DialogContent")
        .replace(/<\/ChartContainer>\s*[\s\S]*?<ChartLegend[\s\S]*?<\/ChartLegend>/g, "</ChartContainer>")
        .replace(/(<div[^>]*>)\s*<ChartLegend/g, "$1 ChartLegend moved inside ChartContainer ")
        .replace(/\n\s*\n\s*\n/g, "\n\n")
        .trim()

      console.log("Component without imports:", componentWithoutImports.substring(0, 100) + "...")

      // Extract component name and remove export
      let finalCode = componentWithoutImports
      let componentName = "Component"
      const exportMatch = finalCode.match(/export\s+default\s+(\w+);?\s*$/m)
      if (exportMatch) {
        componentName = exportMatch[1]
        finalCode = finalCode.replace(/export\s+default\s+\w+;?\s*$/m, "").trim()
      } else {
        const functionMatch = finalCode.match(/^(?:function|const)\s+(\w+)/)
        if (functionMatch) {
          componentName = functionMatch[1]
        }
      }

      if (!finalCode.match(/^(function|const)\s+\w+/)) {
        finalCode = `function ${componentName}() { return (${finalCode}) }`
      }

      console.log("Final code to transform:", finalCode.substring(0, 100) + "...")
      console.log("Component name:", componentName)

      const transformedCode = Babel.transform(finalCode, {
        presets: ["react", "typescript"],
        filename: "component.tsx",
      }).code

      console.log("Transformed code:", transformedCode?.substring(0, 100) + "...")

      if (transformedCode) {
        const factory = new Function(...Object.keys(scope), `${transformedCode}; return ${componentName};`)
        const WrappedComponent = () => {
          try {
            const GeneratedComponent = factory(...Object.values(scope))
            return React.createElement(GeneratedComponent)
          } catch (error) {
            console.error("Chart component error:", error)
            if (error instanceof Error && error.message.includes("useChart must be used within")) {
              return React.createElement(
                "div",
                { className: "p-4 text-amber-600 bg-amber-50 border border-amber-200 rounded-md" },
                "Chart component structure issue detected. The component has been partially rendered.",
              )
            }
            throw error
          }
        }
        setComponent(() => WrappedComponent)
        setErrorMessage(null)
      }
    } catch (error: unknown) {
      console.error("Failed to render component:", error)
      console.error("Component code that failed:", componentCode)
      const errorMsg = error instanceof Error ? error.message : String(error)
      setErrorMessage(`Failed to render component: ${errorMsg}`)
      setComponent(null)
    }
  }, [componentCode, scope])

  if (errorMessage) {
    return <div className="p-4 text-red-500">{errorMessage}</div>
  }

  if (!Component) {
    return <div className="p-4 text-red-500">Error rendering component or no component generated yet.</div>
  }

  return (
    <div className="p-4 border-t mt-4">
      <Component />
    </div>
  )
}

export default DynamicComponent
