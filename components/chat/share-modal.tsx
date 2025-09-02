"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Copy } from "lucide-react"
import { createClient } from "@/supabase/client"
import { useParams } from "next/navigation"
import "@/styles/button.css"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  onOtherClose: () => void
  buttonRef: React.RefObject<HTMLButtonElement | null>
}

export function ShareModal({ isOpen, onClose, buttonRef }: ShareModalProps) {
  const params = useParams()
  const chatId = params?.id as string
  const supabase = createClient()

  const [shareSettings, setShareSettings] = useState({
    visibility: "public" as "public" | "private",
    allowMessages: true,
    allowDeploy: false,
    allowCopy: true,
  })
  const [generatedLink, setGeneratedLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateLink = async () => {
    if (!chatId) {
      toast.error("No chat selected")
      return
    }

    setIsGenerating(true)

    try {
      const shareId = Math.random().toString(36).substring(2, 15)

      const { error } = await supabase
        .from("chats")
        .update({
          share_id: shareId,
          is_public: shareSettings.visibility === "public",
          allow_messages: shareSettings.allowMessages,
          allow_deploy: shareSettings.allowDeploy,
          allow_copy: shareSettings.allowCopy,
        })
        .eq("id", chatId)

      if (error) throw error

      const shareLink =
        typeof window !== "undefined"
          ? `${window.location.origin}/shared/${shareId}`
          : `/shared/${shareId}`
      setGeneratedLink(shareLink)
      toast.success("Share link generated successfully!")
    } catch (error) {
      console.error("Error generating share link:", error)
      toast.error("Failed to generate share link")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyLink = () => {
    if (generatedLink && typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(generatedLink)
      toast.success("Link copied to clipboard!")
    }
  }

  const handleClose = () => {
    setGeneratedLink("")
    onClose()
  }

  if (!isOpen || !buttonRef.current) return null

  const buttonRect = buttonRef.current.getBoundingClientRect()
  const top = buttonRect.bottom + window.scrollY + 5
  const left = buttonRect.left + window.scrollX

  return (
    <div
      className="fixed bg-white dark:bg-[#1a1a1a] rounded-lg p-4 w-64 z-50 text-gray-700 dark:text-gray-200"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        boxShadow:
          "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
      }}
    >
      <div className="space-y-2">
        {!generatedLink ? (
          <>
            <Label className="dark:text-gray-200">Visibility</Label>
            <RadioGroup
              value={shareSettings.visibility}
              onValueChange={(value: "public" | "private") =>
                setShareSettings((prev) => ({ ...prev, visibility: value }))
              }
              className="space-y-1"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="text-xs dark:text-gray-300">
                  Public
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="text-xs dark:text-gray-300">
                  Private
                </Label>
              </div>
            </RadioGroup>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="allow-messages"
                  className="text-xs dark:text-gray-300"
                >
                  Messages
                </Label>
                <Switch
                  id="allow-messages"
                  checked={shareSettings.allowMessages}
                  onCheckedChange={(checked) =>
                    setShareSettings((prev) => ({ ...prev, allowMessages: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="allow-deploy"
                  className="text-xs dark:text-gray-300"
                >
                  Deploy
                </Label>
                <Switch
                  id="allow-deploy"
                  checked={shareSettings.allowDeploy}
                  onCheckedChange={(checked) =>
                    setShareSettings((prev) => ({ ...prev, allowDeploy: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="allow-copy"
                  className="text-xs dark:text-gray-300"
                >
                  Copy
                </Label>
                <Switch
                  id="allow-copy"
                  checked={shareSettings.allowCopy}
                  onCheckedChange={(checked) =>
                    setShareSettings((prev) => ({ ...prev, allowCopy: checked }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-1">
              <Button
                onClick={handleGenerateLink}
                disabled={isGenerating}
                size="sm"
                className="bg-[#0099FF] hover:bg-[#0099ffde] text-white r2552esf25_252trewt3erblueFontDocs"
              >
                {isGenerating ? "Generating..." : "Create"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Label className="dark:text-gray-200">Share Link</Label>
            <div className="flex items-center gap-1">
              <Input
                value={generatedLink}
                readOnly
                className="flex-1 text-xs bg-gray-50 dark:bg-[#2a2a2a] dark:text-gray-200"
              />
              <Button
                onClick={handleCopyLink}
                size="sm"
                variant="outline"
                className="p-1 bg-transparent dark:border-gray-600"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              • Vis: {shareSettings.visibility === "public" ? "Public" : "Private"} • Msg:{" "}
              {shareSettings.allowMessages ? "Yes" : "No"} • Dep:{" "}
              {shareSettings.allowDeploy ? "Yes" : "No"} • Copy:{" "}
              {shareSettings.allowCopy ? "Yes" : "No"}
            </p>
            <div className="flex justify-end">
              <Button onClick={handleClose} size="sm">
                Done
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
