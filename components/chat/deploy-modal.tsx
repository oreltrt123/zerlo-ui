"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { createClient } from "@/supabase/client"

interface DeployModalProps {
  isOpen: boolean
  onClose: () => void
  messages: Array<{
    id: string
    sender: "user" | "ai"
    content: string
    component_code?: string
  }>
}

export function DeployModal({ isOpen, onClose, messages }: DeployModalProps) {
  const [selectedMessageId, setSelectedMessageId] = useState("")
  const [siteName, setSiteName] = useState("")
  const [isDeploying, setIsDeploying] = useState(false)
  const supabase = createClient()

  // Filter messages that have component code
  const deployableMessages = messages.filter((msg) => msg.component_code && msg.sender === "ai")

  const handleDeploy = async () => {
    if (!selectedMessageId || !siteName.trim()) {
      toast.error("Please select a message and enter a site name")
      return
    }

    // Validate site name (only alphanumeric and hyphens)
    const siteNameRegex = /^[a-zA-Z0-9-]+$/
    if (!siteNameRegex.test(siteName)) {
      toast.error("Site name can only contain letters, numbers, and hyphens")
      return
    }

    setIsDeploying(true)

    try {
      const selectedMessage = messages.find((msg) => msg.id === selectedMessageId)
      if (!selectedMessage?.component_code) {
        throw new Error("Selected message has no component code")
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("User not authenticated")
      }

      // Check if site name already exists
      const { data: existingSite } = await supabase
        .from("deployed_sites")
        .select("id")
        .eq("site_name", siteName)
        .single()

      if (existingSite) {
        toast.error("Site name already exists. Please choose a different name.")
        setIsDeploying(false)
        return
      }

      // Save deployment to database
      const { data: deployment, error } = await supabase
        .from("deployed_sites")
        .insert([
          {
            user_id: user.id,
            site_name: siteName,
            component_code: selectedMessage.component_code,
            message_content: selectedMessage.content,
            message_id: selectedMessage.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Create the actual site file
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteName,
          componentCode: selectedMessage.component_code,
          deploymentId: deployment.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to deploy site")
      }

      await response.json()

      toast.success(`Site deployed successfully! Visit: zerlo.online.${siteName}`)
      onClose()
      setSiteName("")
      setSelectedMessageId("")
    } catch (error) {
      console.error("Deployment error:", error)
      toast.error("Failed to deploy site. Please try again.")
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Deploy Your Component</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value.toLowerCase())}
              placeholder="my-awesome-site"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Your site will be available at: zerlo.online.{siteName || "your-site-name"}
            </p>
          </div>

          <div>
            <Label>Select Component to Deploy</Label>
            <RadioGroup value={selectedMessageId} onValueChange={setSelectedMessageId} className="mt-2">
              {deployableMessages.length === 0 ? (
                <p className="text-gray-500">No deployable components found in this chat.</p>
              ) : (
                deployableMessages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={message.id} id={message.id} />
                      <Label htmlFor={message.id} className="flex-1 cursor-pointer">
                        <div className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                          <p className="text-sm font-medium mb-1">AI Response:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{message.content}</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                ))
              )}
            </RadioGroup>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isDeploying}>
              Cancel
            </Button>
            <Button
              onClick={handleDeploy}
              disabled={!selectedMessageId || !siteName.trim() || isDeploying}
              className="bg-green-600 hover:bg-green-700"
            >
              {isDeploying ? "Deploying..." : "Deploy Site"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}