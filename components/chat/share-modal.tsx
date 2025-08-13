"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Copy, Link } from "lucide-react"
import { createClient } from "@/supabase/client"
import { useParams } from "next/navigation"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
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
      // Generate a unique share ID
      const shareId = Math.random().toString(36).substring(2, 15)

      // Update the chat with sharing settings
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
        typeof window !== "undefined" ? `${window.location.origin}/shared/${shareId}` : `/shared/${shareId}`
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Share Chat
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!generatedLink ? (
            <>
              {/* Privacy Settings */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Visibility</Label>
                  <RadioGroup
                    value={shareSettings.visibility}
                    onValueChange={(value: "public" | "private") =>
                      setShareSettings((prev) => ({ ...prev, visibility: value }))
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public" className="text-sm">
                        Public - Anyone with the link can view
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private" className="text-sm">
                        Private - Only you can view
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Permissions */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Permissions</Label>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-messages" className="text-sm">
                      Allow others to send messages
                    </Label>
                    <Switch
                      id="allow-messages"
                      checked={shareSettings.allowMessages}
                      onCheckedChange={(checked) => setShareSettings((prev) => ({ ...prev, allowMessages: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-deploy" className="text-sm">
                      Allow others to deploy components
                    </Label>
                    <Switch
                      id="allow-deploy"
                      checked={shareSettings.allowDeploy}
                      onCheckedChange={(checked) => setShareSettings((prev) => ({ ...prev, allowDeploy: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-copy" className="text-sm">
                      Allow others to copy code
                    </Label>
                    <Switch
                      id="allow-copy"
                      checked={shareSettings.allowCopy}
                      onCheckedChange={(checked) => setShareSettings((prev) => ({ ...prev, allowCopy: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateLink}
                  disabled={isGenerating}
                  className="bg-[#0099FF] hover:bg-[#0088EE] text-white"
                >
                  {isGenerating ? "Generating..." : "Create Link"}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Generated Link Display */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Share Link</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input value={generatedLink} readOnly className="flex-1 bg-gray-50" />
                    <Button onClick={handleCopyLink} size="sm" variant="outline" className="px-3 bg-transparent">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Settings Summary */}
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="font-medium mb-2">Link Settings:</div>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Visibility: {shareSettings.visibility === "public" ? "Public" : "Private"}</li>
                    <li>• Messages: {shareSettings.allowMessages ? "Allowed" : "Blocked"}</li>
                    <li>• Deploy: {shareSettings.allowDeploy ? "Allowed" : "Blocked"}</li>
                    <li>• Copy Code: {shareSettings.allowCopy ? "Allowed" : "Blocked"}</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleClose}>Done</Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
