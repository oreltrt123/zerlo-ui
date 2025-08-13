"use client"
import { useState } from "react"
import { Sparkles, MoreHorizontal, Edit3, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import Image from "next/image"

interface Message {
  id: string
  sender: "user" | "ai"
  content: string
  component_code?: string
  isStreaming?: boolean
}

interface ChatMessagesProps {
  messages: Message[]
  onRestoreComponent?: (componentCode: string) => void
}

export const ChatMessages = ({ messages, onRestoreComponent }: ChatMessagesProps) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set())
  const [dislikedMessages, setDislikedMessages] = useState<Set<string>>(new Set())

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setEditingContent(content)
  }

  const handleSaveEdit = () => {
    // TODO: Implement save edit functionality with Supabase
    toast.success("Message edited successfully!")
    setEditingMessageId(null)
    setEditingContent("")
  }

  const handleDeleteMessage = () => {
    // TODO: Implement delete message functionality with Supabase
    toast.success("Message deleted successfully!")
  }

  const handleLikeMessage = (messageId: string) => {
    const newLiked = new Set(likedMessages)
    const newDisliked = new Set(dislikedMessages)

    if (likedMessages.has(messageId)) {
      newLiked.delete(messageId)
    } else {
      newLiked.add(messageId)
      newDisliked.delete(messageId) // Remove dislike if exists
    }

    setLikedMessages(newLiked)
    setDislikedMessages(newDisliked)
    toast.success("Feedback recorded!")
  }

  const handleDislikeMessage = (messageId: string) => {
    const newLiked = new Set(likedMessages)
    const newDisliked = new Set(dislikedMessages)

    if (dislikedMessages.has(messageId)) {
      newDisliked.delete(messageId)
    } else {
      newDisliked.add(messageId)
      newLiked.delete(messageId) // Remove like if exists
    }

    setLikedMessages(newLiked)
    setDislikedMessages(newDisliked)
    toast.success("Feedback recorded!")
  }

  const handleRegenerateMessage = () => {
    // TODO: Implement regenerate functionality
    toast.info("Regenerating response...")
  }

  const handleShareMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Message copied to clipboard!")
  }

  const handleRestoreComponent = (componentCode: string) => {
    if (onRestoreComponent) {
      onRestoreComponent(componentCode)
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <Sparkles className="h-8 w-8 mb-2" />
            <p>Start by typing a message or choosing an example below.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`group flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            style={{
              fontSize: "13px",
            }}
          >
            <div className="relative max-w-[80%]">
              {editingMessageId === msg.id ? (
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                  <Input
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveEdit()
                      } else if (e.key === "Escape") {
                        setEditingMessageId(null)
                        setEditingContent("")
                      }
                    }}
                    className="flex-1"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSaveEdit} className="bg-blue-500 text-white">
                    Save
                  </Button>
                </div>
              ) : (
                <>
                <div
                  className={`p-3 rounded-lg ${
                    msg.sender === "user" ? "bg-[#E9E9E980] text-[#0d0d0ddc]" : "bg-white text-[#0d0d0db6]"
                    }`}
                  >
                    {msg.content}
                    {msg.isStreaming && <span className="ml-2 animate-pulse">...</span>}
                  </div>

                  {/* Message Actions */}
                  <div
                    className={`${msg.sender === "user" ? "absolute top-2 left-[-40px]" : "flex justify-end mt-2 mr-2"} opacity-0 group-hover:opacity-100 transition-opacity`}
                  >
                    {msg.sender === "user" ? (
                      // User message actions
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 bg-white"
                      style={{
                        boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
                      }}
                        >
                          <DropdownMenuItem
                            onClick={() => handleEditMessage(msg.id, msg.content)}
                            className="hover:bg-gray-50 text-muted-foreground hover:text-muted-foreground"
                          >
                            <Edit3 className="h-3 w-3 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteMessage()}
                            className="hover:bg-red-50 text-red-600 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3 mr-2 text-red-600" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      // AI message actions
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLikeMessage(msg.id)}
                              className={`h-6 w-6 p-0 ${likedMessages.has(msg.id) ? "text-green-600" : "text-gray-400 hover:text-green-600"}`}
                            >
                              <Image src="/assets/images/like.png" alt="Like" width={16} height={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Like</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDislikeMessage(msg.id)}
                              className={`h-6 w-6 p-0 ${dislikedMessages.has(msg.id) ? "text-red-600" : "text-gray-400 hover:text-red-600"}`}
                            >
                              <Image src="/assets/images/dislike.png" alt="Dislike" width={16} height={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Dislike</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRegenerateMessage()}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
                            >
                              <Image
                                src="/assets/images/regenerate.png"
                                alt="Regenerate"
                                width={16}
                                height={16}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Regenerate</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShareMessage(msg.content)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-purple-600"
                            >
                              <Image src="/assets/images/share.png" alt="Share" width={16} height={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Share</TooltipContent>
                        </Tooltip>
                        {msg.component_code && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRestoreComponent(msg.component_code!)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-orange-600"
                              >
                                <Image
                                  src="/assets/images/restore.png"
                                  alt="Restore Component"
                                  width={16}
                                  height={16}
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Restore Component</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}