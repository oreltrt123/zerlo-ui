"use client"
import { useState } from "react"
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  Check,
  Loader2,
  Copy,
  ChevronDown,
  ChevronRight,
  Search,
  Brain,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import Image from "next/image"

interface ThinkingStep {
  id: string
  content: string
  isComplete: boolean
}

interface SearchStep {
  id: string
  query: string
  results: string
  isComplete: boolean
}

interface Message {
  id: string
  sender: "user" | "ai"
  content: string
  component_code?: string
  component_title?: string
  isStreaming?: boolean
  isGeneratingComponent?: boolean
  thinkingSteps?: ThinkingStep[]
  searchSteps?: SearchStep[]
}

interface ChatMessagesProps {
  messages: Message[]
  onRestoreComponent?: (componentCode: string) => void
  showThinking?: string | null
  showSearch?: string | null
}

export const handleRestoreComponent = (componentCode: string, onRestoreComponent?: (componentCode: string) => void) => {
  if (onRestoreComponent) {
    onRestoreComponent(componentCode)
  }
}

export const ChatMessages = ({ messages, onRestoreComponent, showThinking, showSearch }: ChatMessagesProps) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set())
  const [dislikedMessages, setDislikedMessages] = useState<Set<string>>(new Set())
  const [expandedThinking, setExpandedThinking] = useState<Set<string>>(new Set())
  const [expandedSearch, setExpandedSearch] = useState<Set<string>>(new Set())

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

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Message copied!")
  }

  const toggleThinking = (messageId: string) => {
    const newExpanded = new Set(expandedThinking)
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId)
    } else {
      newExpanded.add(messageId)
    }
    setExpandedThinking(newExpanded)
  }

  const toggleSearch = (messageId: string) => {
    const newExpanded = new Set(expandedSearch)
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId)
    } else {
      newExpanded.add(messageId)
    }
    setExpandedSearch(newExpanded)
  }

  const internalHandleRestoreComponent = (componentCode: string) => {
    handleRestoreComponent(componentCode, onRestoreComponent)
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="group flex justify-start">
            <div className="relative max-w-[80%]">
              <div
                className="p-3 rounded-lg bg-background text-[#0d0d0db6] dark:text-white"
                style={{ fontSize: "13px" }}
              >
                Hello! I&apos;m your Professional 3D Game Development AI. I can create advanced 3D games with realistic
                graphics, weapon systems, character controls, and professional gameplay mechanics. What kind of game
                would you like me to build?
              </div>
            </div>
          </div>
        ) : null}

        {messages.map((msg) => (
          <div key={msg.id}>
            <div
              className={`group flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              style={{ fontSize: "13px" }}
            >
              <div className="relative max-w-[80%]">
                {editingMessageId === msg.id ? (
                  <div className="flex flex-col p-3 bg-[#E9E9E980] dark:bg-[#8888881A] text-[#0d0d0ddc] dark:text-white rounded-lg w-[150%] max-w-lg">
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSaveEdit()
                        } else if (e.key === "Escape") {
                          setEditingMessageId(null)
                          setEditingContent("")
                        }
                      }}
                      className="w-full h-14 resize-none border-none outline-none p-4 bg-transparent placeholder-gray-400 text-gray-900"
                      autoFocus
                      placeholder="Edit your message..."
                    />

                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      className="mt-4 bg-[#0099ffb2] hover:bg-[#0099ffbe] text-white w-24 self-end"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    {msg.sender === "ai" &&
                      msg.thinkingSteps &&
                      (showThinking === msg.id || expandedThinking.has(msg.id)) && (
                        <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div
                            className="flex items-center gap-2 cursor-pointer text-blue-700 dark:text-blue-300 font-medium mb-2"
                            onClick={() => toggleThinking(msg.id)}
                          >
                            <Brain className="w-4 h-4" />
                            <span>AI Thinking Process</span>
                            {expandedThinking.has(msg.id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                          {expandedThinking.has(msg.id) && (
                            <div className="space-y-2">
                              {msg.thinkingSteps.map((step) => (
                                <div key={step.id} className="flex items-center gap-2 text-sm">
                                  {step.isComplete ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                  )}
                                  <span
                                    className={
                                      step.isComplete
                                        ? "text-gray-700 dark:text-gray-300"
                                        : "text-blue-600 dark:text-blue-400"
                                    }
                                  >
                                    {step.content}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                    {msg.sender === "ai" &&
                      msg.searchSteps &&
                      (showSearch === msg.id || expandedSearch.has(msg.id)) && (
                        <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div
                            className="flex items-center gap-2 cursor-pointer text-green-700 dark:text-green-300 font-medium mb-2"
                            onClick={() => toggleSearch(msg.id)}
                          >
                            <Search className="w-4 h-4" />
                            <span>Research & Analysis</span>
                            {expandedSearch.has(msg.id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                          {expandedSearch.has(msg.id) && (
                            <div className="space-y-2">
                              {msg.searchSteps.map((step) => (
                                <div key={step.id} className="text-sm">
                                  <div className="flex items-center gap-2 mb-1">
                                    {step.isComplete ? (
                                      <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                                    )}
                                    <span className="font-medium text-green-600 dark:text-green-400">{step.query}</span>
                                  </div>
                                  {step.results && (
                                    <div className="ml-6 text-gray-600 dark:text-gray-400 text-xs">{step.results}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                    <div
                      className={`p-3 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-[#E9E9E980] dark:bg-[#8888881A] text-[#0d0d0ddc] dark:text-white"
                          : "bg-background text-[#0d0d0db6] dark:text-white"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {msg.content.split("\n").map((line, index) => {
                          if (line.includes("**")) {
                            const parts = line.split("**")
                            return (
                              <div key={index}>
                                {parts.map((part, partIndex) =>
                                  partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part,
                                )}
                              </div>
                            )
                          }
                          if (line.includes("http")) {
                            const urlRegex = /(https?:\/\/[^\s]+)/g
                            const parts = line.split(urlRegex)
                            return (
                              <div key={index}>
                                {parts.map((part, partIndex) =>
                                  urlRegex.test(part) ? (
                                    <a
                                      key={partIndex}
                                      href={part}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:underline"
                                    >
                                      {part}
                                    </a>
                                  ) : (
                                    part
                                  ),
                                )}
                              </div>
                            )
                          }
                          return <div key={index}>{line}</div>
                        })}
                      </div>
                      {msg.isStreaming && <span className="ml-2 animate-pulse text-purple-400">●</span>}
                    </div>

                    {msg.sender === "ai" && !msg.isStreaming && (msg.thinkingSteps || msg.searchSteps) && (
                      <div className="flex gap-2 mt-2">
                        {msg.thinkingSteps && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleThinking(msg.id)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            <Brain className="w-3 h-3 mr-1" />
                            {expandedThinking.has(msg.id) ? "Hide" : "Show"} Thinking
                          </Button>
                        )}
                        {msg.searchSteps && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSearch(msg.id)}
                            className="text-xs text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <Search className="w-3 h-3 mr-1" />
                            {expandedSearch.has(msg.id) ? "Hide" : "Show"} Research
                          </Button>
                        )}
                      </div>
                    )}

                    {msg.sender === "user" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 bg-white">
                          <DropdownMenuItem
                            onClick={() => handleEditMessage(msg.id, msg.content)}
                            className="hover:bg-gray-50 text-muted-foreground hover:text-muted-foreground"
                          >
                            <Edit3 className="h-3 w-3 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCopyMessage(msg.content)}
                            className="hover:bg-gray-50 text-muted-foreground hover:text-muted-foreground"
                          >
                            <Copy className="h-3 w-3 mr-2" />
                            Copy
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
                              <Image src="/assets/images/regenerate.png" alt="Regenerate" width={16} height={16} />
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
                                onClick={() => internalHandleRestoreComponent(msg.component_code!)}
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
                  </>
                )}
              </div>
            </div>

            {msg.sender === "ai" && (msg.component_code || msg.isGeneratingComponent) && (
              <div className="flex justify-start mt-3">
                <div className="max-w-[80%]">
                  <div
                    className="bg-white dark:bg-[#303030] rounded-lg p-4"
                    style={{
                      boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {msg.component_title || "Generated Component"}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {msg.isGeneratingComponent ? "Generating component..." : "Component ready"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => msg.component_code && internalHandleRestoreComponent(msg.component_code)}
                        disabled={msg.isGeneratingComponent || !msg.component_code}
                        className="h-8 w-8 p-0 ml-3"
                      >
                        {msg.isGeneratingComponent ? (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}

// "use client"
// import { useState } from "react"
// import { MoreHorizontal, Edit3, Trash2, Check, Loader2, Copy } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { toast } from "sonner"
// import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
// import Image from "next/image"
// import "@/styles/button.css"

// interface Message {
//   id: string
//   sender: "user" | "ai"
//   content: string
//   component_code?: string
//   component_title?: string
//   isStreaming?: boolean
//   isGeneratingComponent?: boolean
// }

// interface ChatMessagesProps {
//   messages: Message[]
//   onRestoreComponent?: (componentCode: string) => void
// }

// export const handleRestoreComponent = (componentCode: string, onRestoreComponent?: (componentCode: string) => void) => {
//   if (onRestoreComponent) {
//     onRestoreComponent(componentCode)
//   }
// }

// export const ChatMessages = ({ messages, onRestoreComponent }: ChatMessagesProps) => {
//   const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
//   const [editingContent, setEditingContent] = useState("")
//   const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set())
//   const [dislikedMessages, setDislikedMessages] = useState<Set<string>>(new Set())

//   const handleEditMessage = (messageId: string, content: string) => {
//     setEditingMessageId(messageId)
//     setEditingContent(content)
//   }

//   const handleSaveEdit = () => {
//     // TODO: Implement save edit functionality with Supabase
//     toast.success("Message edited successfully!")
//     setEditingMessageId(null)
//     setEditingContent("")
//   }

//   const handleDeleteMessage = () => {
//     // TODO: Implement delete message functionality with Supabase
//     toast.success("Message deleted successfully!")
//   }

//   const handleLikeMessage = (messageId: string) => {
//     const newLiked = new Set(likedMessages)
//     const newDisliked = new Set(dislikedMessages)

//     if (likedMessages.has(messageId)) {
//       newLiked.delete(messageId)
//     } else {
//       newLiked.add(messageId)
//       newDisliked.delete(messageId) // Remove dislike if exists
//     }

//     setLikedMessages(newLiked)
//     setDislikedMessages(newDisliked)
//     toast.success("Feedback recorded!")
//   }

//   const handleDislikeMessage = (messageId: string) => {
//     const newLiked = new Set(likedMessages)
//     const newDisliked = new Set(dislikedMessages)

//     if (dislikedMessages.has(messageId)) {
//       newDisliked.delete(messageId)
//     } else {
//       newDisliked.add(messageId)
//       newLiked.delete(messageId) // Remove like if exists
//     }

//     setLikedMessages(newLiked)
//     setDislikedMessages(newDisliked)
//     toast.success("Feedback recorded!")
//   }

//   const handleRegenerateMessage = () => {
//     // TODO: Implement regenerate functionality
//     toast.info("Regenerating response...")
//   }

//   const handleShareMessage = (content: string) => {
//     navigator.clipboard.writeText(content)
//     toast.success("Message copied to clipboard!")
//   }

//   const handleCopyMessage = (content: string) => {
//     navigator.clipboard.writeText(content)
//     toast.success("Message copied!")
//   }

//   const internalHandleRestoreComponent = (componentCode: string) => {
//     handleRestoreComponent(componentCode, onRestoreComponent)
//   }

//   return (
//     <TooltipProvider>
//       <div className="flex flex-col gap-4">
//         {messages.length === 0 ? (
//           <div className="group flex justify-start">
//             <div className="relative max-w-[80%]">
//               <div
//                 className="p-3 rounded-lg bg-background text-[#0d0d0db6] dark:text-white"
//                 style={{ fontSize: "13px" }}
//               >
//                 Hello, I&apos;m your AI. I can build anything you want, like games, dimensions, and things like that.
//               </div>
//               {/* No actions for the welcome message */}
//             </div>
//           </div>
//         ) : null}

//         {messages.map((msg) => (
//           <div key={msg.id}>
//             <div
//               className={`group flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//               style={{ fontSize: "13px" }}
//             >
//               <div className="relative max-w-[80%]">
//                 {editingMessageId === msg.id ? (
//                   <div className="flex flex-col p-3 bg-[#E9E9E980] dark:bg-[#8888881A] text-[#0d0d0ddc] dark:text-white rounded-lg w-[150%] max-w-lg">
//                     <textarea
//                       value={editingContent}
//                       onChange={(e) => setEditingContent(e.target.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" && !e.shiftKey) {
//                           e.preventDefault()
//                           handleSaveEdit()
//                         } else if (e.key === "Escape") {
//                           setEditingMessageId(null)
//                           setEditingContent("")
//                         }
//                       }}
//                       className="w-full h-14 resize-none border-none outline-none p-4 bg-transparent placeholder-gray-400 text-gray-900"
//                       autoFocus
//                       placeholder="Edit your message..."
//                     />

//                     <Button
//                       size="sm"
//                       onClick={handleSaveEdit}
//                       className="mt-4 bg-[#0099ffb2] hover:bg-[#0099ffbe] text-white w-24 self-end"
//                     >
//                       Save
//                     </Button>
//                   </div>
//                 ) : (
//                   <>
//                     <div
//                       className={`p-3 rounded-lg ${
//                         msg.sender === "user"
//                           ? "bg-[#E9E9E980] dark:bg-[#8888881A] text-[#0d0d0ddc] dark:text-white"
//                           : "bg-background text-[#0d0d0db6] dark:text-white"
//                       }`}
//                     >
//                       {msg.content}
//                       {msg.isStreaming && <span className="ml-2 animate-pulse">...</span>}
//                     </div>

//                     {/* Message Actions */}
//                     <div
//                       className={`${
//                         msg.sender === "user" ? "absolute top-2 left-[-40px]" : "flex justify-end mt-2 mr-2"
//                       } opacity-0 group-hover:opacity-100 transition-opacity`}
//                     >
//                       {msg.sender === "user" ? (
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
//                               <MoreHorizontal className="h-3 w-3" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end" className="w-32 bg-white">
//                             <DropdownMenuItem
//                               onClick={() => handleEditMessage(msg.id, msg.content)}
//                               className="hover:bg-gray-50 text-muted-foreground hover:text-muted-foreground"
//                             >
//                               <Edit3 className="h-3 w-3 mr-2" />
//                               Edit
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                               onClick={() => handleCopyMessage(msg.content)}
//                               className="hover:bg-gray-50 text-muted-foreground hover:text-muted-foreground"
//                             >
//                               <Copy className="h-3 w-3 mr-2" />
//                               Copy
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                               onClick={() => handleDeleteMessage()}
//                               className="hover:bg-red-50 text-red-600 hover:text-red-600"
//                             >
//                               <Trash2 className="h-3 w-3 mr-2 text-red-600" />
//                               Delete
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       ) : (
//                         // AI message actions
//                         <div className="flex items-center gap-1">
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => handleLikeMessage(msg.id)}
//                                 className={`h-6 w-6 p-0 ${likedMessages.has(msg.id) ? "text-green-600" : "text-gray-400 hover:text-green-600"}`}
//                               >
//                                 <Image src="/assets/images/like.png" alt="Like" width={16} height={16} />
//                               </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>Like</TooltipContent>
//                           </Tooltip>
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => handleDislikeMessage(msg.id)}
//                                 className={`h-6 w-6 p-0 ${dislikedMessages.has(msg.id) ? "text-red-600" : "text-gray-400 hover:text-red-600"}`}
//                               >
//                                 <Image src="/assets/images/dislike.png" alt="Dislike" width={16} height={16} />
//                               </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>Dislike</TooltipContent>
//                           </Tooltip>
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => handleRegenerateMessage()}
//                                 className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
//                               >
//                                 <Image src="/assets/images/regenerate.png" alt="Regenerate" width={16} height={16} />
//                               </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>Regenerate</TooltipContent>
//                           </Tooltip>
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => handleShareMessage(msg.content)}
//                                 className="h-6 w-6 p-0 text-gray-400 hover:text-purple-600"
//                               >
//                                 <Image src="/assets/images/share.png" alt="Share" width={16} height={16} />
//                               </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>Share</TooltipContent>
//                           </Tooltip>
//                           {msg.component_code && (
//                             <Tooltip>
//                               <TooltipTrigger asChild>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() => internalHandleRestoreComponent(msg.component_code!)}
//                                   className="h-6 w-6 p-0 text-gray-400 hover:text-orange-600"
//                                 >
//                                   <Image
//                                     src="/assets/images/restore.png"
//                                     alt="Restore Component"
//                                     width={16}
//                                     height={16}
//                                   />
//                                 </Button>
//                               </TooltipTrigger>
//                               <TooltipContent>Restore Component</TooltipContent>
//                             </Tooltip>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             {msg.sender === "ai" && (msg.component_code || msg.isGeneratingComponent) && (
//               <div className="flex justify-start mt-3">
//                 <div className="max-w-[80%]">
//                   <div
//                     className="bg-white dark:bg-[#303030] rounded-lg p-4"
//                     style={{
//                       boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
//                     }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
//                           {msg.component_title || "Generated Component"}
//                         </h4>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">
//                           {msg.isGeneratingComponent ? "Generating component..." : "Component ready"}
//                         </p>
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => msg.component_code && internalHandleRestoreComponent(msg.component_code)}
//                         disabled={msg.isGeneratingComponent || !msg.component_code}
//                         className="h-8 w-8 p-0 ml-3"
//                       >
//                         {msg.isGeneratingComponent ? (
//                           <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
//                         ) : (
//                           <Check className="h-4 w-4 text-green-500" />
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </TooltipProvider>
//   )
// }
