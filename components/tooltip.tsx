import type React from "react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

export function Tip({
  children,
  content,
  ...props
}: {
  content: string | React.ReactNode // Updated type to properly accept React elements
  children: React.ReactNode
} & React.ComponentProps<typeof TooltipContent>) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent {...props}>{typeof content === "string" ? <p>{content}</p> : content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
