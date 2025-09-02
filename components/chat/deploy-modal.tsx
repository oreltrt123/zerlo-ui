"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { createClient } from "@/supabase/client"
import "@/styles/button.css"

interface DeployModalProps {
  isOpen: boolean
  onClose: () => void
  onOtherClose: () => void
  messages: Array<{
    id: string
    sender: "user" | "ai"
    content: string
    component_code?: string
  }>
  buttonRef: React.RefObject<HTMLButtonElement | null>
}

export function DeployModal({ isOpen, onClose, messages, buttonRef }: DeployModalProps) {
  const [selectedMessageId, setSelectedMessageId] = useState("")
  const [siteName, setSiteName] = useState("")
  const [isDeploying, setIsDeploying] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const deployableMessages = messages.filter((msg) => msg.component_code && msg.sender === "ai")

  const handleDeploy = async () => {
    if (!selectedMessageId || !siteName.trim()) {
      toast.error("Please select a message and enter a site name")
      return
    }

    const siteNameRegex = /^[a-zA-Z0-9-]+$/
    if (!siteNameRegex.test(siteName)) {
      toast.error("Site name can only contain letters, numbers, and hyphens")
      return
    }

    setIsDeploying(true)

    try {
      const selectedMessage = messages.find((msg) => msg.id === selectedMessageId)
      if (!selectedMessage?.component_code) throw new Error("Selected message has no component code")

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

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

      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName,
          componentCode: selectedMessage.component_code,
          deploymentId: deployment.id,
        }),
      })

      if (!response.ok) throw new Error("Failed to deploy site")

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

  if (!isOpen || !buttonRef.current) return null

  const buttonRect = buttonRef.current.getBoundingClientRect()
  const top = buttonRect.bottom + window.scrollY + 5
  const left = buttonRect.left + window.scrollX

  return (
    <div
      ref={modalRef}
      className="fixed bg-white dark:bg-[#1a1a1a] rounded-lg p-4 w-64 z-50 text-gray-700 dark:text-gray-200"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        boxShadow:
          "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
      }}
    >
      <div className="space-y-2">
        <Label className="dark:text-gray-200">Site Name</Label>
        <Input
          value={siteName}
          onChange={(e) => setSiteName(e.target.value.toLowerCase())}
          placeholder="my-site"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {siteName || "NameSite"}.zerlo.online
        </p>

        <Label className="dark:text-gray-200">Select Component</Label>
        <RadioGroup
          value={selectedMessageId}
          onValueChange={setSelectedMessageId}
          className="space-y-1"
        >
          {deployableMessages.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No deployable components.
            </p>
          ) : (
            deployableMessages.map((message) => (
              <div key={message.id} className="flex items-center space-x-1">
                <RadioGroupItem value={message.id} id={message.id} />
                <Label
                  htmlFor={message.id}
                  className="text-xs line-clamp-1 dark:text-gray-300"
                >
                  {message.content}
                </Label>
              </div>
            ))
          )}
        </RadioGroup>

        <div className="flex justify-end space-x-1">
          <Button
            onClick={handleDeploy}
            disabled={!selectedMessageId || !siteName.trim() || isDeploying}
            size="sm"
            className="bg-[#0099FF] hover:bg-[#0099ffde] text-white r2552esf25_252trewt3erblueFontDocs"
          >
            {isDeploying ? "Deploying..." : "Deploy"}
          </Button>
        </div>
      </div>
    </div>
  )
}
