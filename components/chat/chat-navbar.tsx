"use client"

import { Button } from "@/components/ui/button"
import { DeployModal } from "./deploy-modal"
import { ShareModal } from "./share-modal"
import { useState, useEffect } from "react"
import { Link } from "lucide-react"
import "@/styles/button.css"

interface ChatNavbarProps {
  chatName: string
  messages: Array<{
    id: string
    sender: "user" | "ai"
    content: string
    component_code?: string
  }>
}

export function ChatNavbar({ chatName, messages }: ChatNavbarProps) {
  const [showDeployModal, setShowDeployModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  // Check if there are deployable messages
  const deployableMessages = messages.filter((msg) => msg.component_code && msg.sender === "ai")
  const hasDeployableMessages = deployableMessages.length > 0

  // Debug logging
  useEffect(() => {
    console.log("=== ChatNavbar Debug ===")
    console.log("Total messages:", messages.length)
    console.log("All messages:", messages)
    console.log(
      "Messages with component_code:",
      messages.filter((msg) => msg.component_code),
    )
    console.log(
      "AI messages:",
      messages.filter((msg) => msg.sender === "ai"),
    )
    console.log("Deployable messages:", deployableMessages)
    console.log("Has deployable messages:", hasDeployableMessages)
    console.log("======================")
  }, [messages, deployableMessages, hasDeployableMessages])

  const handleDeployClick = () => {
    console.log("Deploy button clicked")
    console.log("Available deployable messages:", deployableMessages)
    setShowDeployModal(true)
  }

  const handleShareClick = () => {
    setShowShareModal(true)
  }

  return (
    <>
      <div className="bg-white py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-[#0f1419] dark:text-[#f0f6fc] font-[600] text-base">{chatName}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleShareClick}
              variant="outline"
              className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400 bg-transparent"
            >
              <Link className="h-4 w-4 mr-2" />
              Share
            </Button>

            <span className="text-xs text-gray-500">
              {hasDeployableMessages ? `${deployableMessages.length} component(s) ready` : "No components to deploy"}
            </span>
            <Button
              onClick={handleDeployClick}
              variant={"default"}
              disabled={!hasDeployableMessages}
              className="bg-[#0969da] hover:bg-[#0860ca] text-white r2552esf25_252trewt3erblueFontDocs"
            >
              Deploy
            </Button>
          </div>
        </div>
      </div>
      <DeployModal isOpen={showDeployModal} onClose={() => setShowDeployModal(false)} messages={messages} />
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
    </>
  )
}
