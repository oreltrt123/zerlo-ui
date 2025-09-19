"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { DeployModal } from "./deploy-modal"
import { ShareModal } from "./share-modal"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Link, LogOut, Settings } from "lucide-react"
import { GitHubLogoIcon, DiscordLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"
import "@/styles/button.css"
import { CreditsDisplay } from "@/components/credits/credits-display"

interface ChatNavbarProps {
  chatName: string
  messages: Array<{
    id: string
    sender: "user" | "ai"
    content: string
    component_code?: string
  }>
  user: { id: string; email?: string; user_metadata?: { avatar_url?: string } } | null
  showLogin: () => void
  signOut: () => void
  onSocialClick: (target: "github" | "x" | "discord") => void
  onSettingsClick: () => void
  onUpgradeClick: () => void
}

export function ChatNavbar({
  chatName,
  messages,
  user,
  showLogin,
  signOut,
  onSocialClick,
  onSettingsClick,
  onUpgradeClick,
}: ChatNavbarProps) {
  const [showDeployModal, setShowDeployModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const deployButtonRef = useRef<HTMLButtonElement>(null)
  const shareButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const deployableMessages = messages.filter((msg) => msg.component_code && msg.sender === "ai")
    const hasDeployableMessages = deployableMessages.length > 0

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
    console.log("User:", user)
    console.log("======================")
  }, [messages, user])

  const handleDeployClick = () => {
    const deployableMessages = messages.filter((msg) => msg.component_code && msg.sender === "ai")
    console.log("Deploy button clicked")
    console.log("Available deployable messages:", deployableMessages)
    setShowShareModal(false) // Close ShareModal if open
    setShowDeployModal((prev) => !prev) // Toggle DeployModal
  }

  const handleShareClick = () => {
    setShowDeployModal(false) // Close DeployModal if open
    setShowShareModal((prev) => !prev) // Toggle ShareModal
  }

  const hasDeployableMessages = messages.filter((msg) => msg.component_code && msg.sender === "ai").length > 0

  return (
    <>
      <div className="bg-background py-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[#0f1419] dark:text-[#f0f6fc] font-[600] text-base">{chatName}</h2>
            {user && <CreditsDisplay onUpgradeClick={onUpgradeClick} />}
          </div>
          <div className="flex items-center gap-1 md:gap-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {hasDeployableMessages
                ? `${messages.filter((msg) => msg.component_code && msg.sender === "ai").length} component(s) ready`
                : "No components to deploy"}
            </span>

            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    ref={deployButtonRef}
                    onClick={handleDeployClick}
                    variant="ghost"
                    size="icon"
                    disabled={!hasDeployableMessages}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-[#8888881A] disabled:text-[#8c9196]"
                  >
                    <svg
                      className="h-4 w-4 md:h-5 md:w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Deploy component</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    ref={shareButtonRef}
                    onClick={handleShareClick}
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-[#8888881A]"
                  >
                    <Link className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share chat</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onSettingsClick}
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-[#8888881A]"
                  >
                    <Settings className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Chat settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <ThemeToggle />
                </TooltipTrigger>
                <TooltipContent>Toggle theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {user ? (
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={
                              user.user_metadata?.avatar_url || `https://avatar.vercel.sh/${user.email || "default"}`
                            }
                            style={{ borderRadius: "100%" }}
                            alt={user.email || "User"}
                          />
                          <AvatarFallback className="bg-gray-700 dark:bg-gray-600 text-white">
                            {user.email?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>My Account</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="text-sm">My Account</span>
                    <span className="text-xs text-muted-foreground">{user.email || "No email provided"}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => window.open("https://www.zerlo.online/about", "_blank")}
                    className="text-muted-foreground hover:text-muted-foreground hover:bg-[#8888881A]"
                  >
                    <svg
                      className="mr-2 h-4 w-4 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                    About Zerlo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onSocialClick("github")}
                    className="text-muted-foreground hover:text-muted-foreground hover:bg-[#8888881A]"
                  >
                    <GitHubLogoIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    Star on GitHub
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onSocialClick("discord")}
                    className="text-muted-foreground hover:text-muted-foreground hover:bg-[#8888881A]"
                  >
                    <DiscordLogoIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    Join us on Discord
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onSocialClick("x")}
                    className="text-muted-foreground hover:text-muted-foreground hover:bg-[#8888881A]"
                  >
                    <TwitterLogoIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    Follow us on X
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-muted-foreground hover:text-muted-foreground hover:bg-[#8888881A]"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={showLogin}
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-[#8888881A]"
                    >
                      <svg
                        className="h-4 w-4 md:h-5 md:w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sign in</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
      <DeployModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        onOtherClose={() => setShowShareModal(false)}
        messages={messages}
        buttonRef={deployButtonRef}
      />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onOtherClose={() => setShowDeployModal(false)}
        buttonRef={shareButtonRef}
      />
    </>
  )
}
