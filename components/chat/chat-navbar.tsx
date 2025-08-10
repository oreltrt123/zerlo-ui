"use client"
import { Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DeployModal } from "./deploy-modal"
import { useState, useEffect } from "react"

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

  return (
    <>
      {/* Adjusted padding to make it smaller */}
      <div className="border-b border-[#e6e6e6] dark:border-[#30363d] bg-white dark:bg-[#161b22] py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-[#f6f6f6] dark:bg-[#21262d] rounded-lg">
              <Sparkles className="h-4 w-4 text-[#666666] dark:text-[#8b949e]" />
            </div>
            <div>
              <h2 className="text-[#0f1419] dark:text-[#f0f6fc] font-[600] text-base">{chatName}</h2>
              <p className="text-[#666666] dark:text-[#8b949e] text-sm font-[450]">
                Describe the component you want to build or paste data.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {hasDeployableMessages ? `${deployableMessages.length} component(s) ready` : "No components to deploy"}
            </span>
            <Button
              onClick={handleDeployClick}
              variant={'blueFont'}
              disabled={!hasDeployableMessages}
            >
              Deploy
            </Button>
          </div>
        </div>
      </div>
      <DeployModal isOpen={showDeployModal} onClose={() => setShowDeployModal(false)} messages={messages} />
    </>
  )
}
