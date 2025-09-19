"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/supabase/client"
import type { User } from "@supabase/supabase-js"
import { toast } from "sonner"
import { Upload, X, Plus, Trash2, Code2, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface CommunityPostFormProps {
  chatId: string
}

interface ChatData {
  messages: Array<{
    id: string
    chat_id: string
    sender: "user" | "ai"
    content: string
    component_code?: string
    component_title?: string
    created_at: string
  }>
  total_messages: number
  created_at?: string
  updated_at?: string
}

const categories = [
  { id: "games", name: "Games" },
  { id: "apps", name: "Apps" },
  { id: "components", name: "Components" },
  { id: "templates", name: "Templates" },
  { id: "tools", name: "Tools" },
  { id: "other", name: "Other" },
]

export default function CommunityPostForm({ chatId }: CommunityPostFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "games",
    tags: [""],
    creator_name: "",
    creator_email: "",
    creator_phone: "",
    cover_image: "",
    hover_image: "",
    profile_picture: "",
    post_type: "component" as "component" | "full_chat",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [componentCode, setComponentCode] = useState("")
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setFormData((prev) => ({
          ...prev,
          creator_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
          creator_email: user.email || "",
          profile_picture: user.user_metadata?.avatar_url || "",
        }))
      }
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    const loadChatData = async () => {
      try {
        // Load latest component
        const { data: componentData } = await supabase
          .from("messages")
          .select("component_code, component_title, content")
          .eq("chat_id", chatId)
          .not("component_code", "is", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (componentData) {
          setComponentCode(componentData.component_code)
          setFormData((prev) => ({
            ...prev,
            title: componentData.component_title || "My Project",
            description: componentData.content?.substring(0, 200) || "An amazing project created with AI",
          }))
        }

        // Load full chat data
        const { data: chatMessages } = await supabase
          .from("messages")
          .select("*")
          .eq("chat_id", chatId)
          .order("created_at", { ascending: true })

        if (chatMessages) {
          setChatData({
            messages: chatMessages,
            total_messages: chatMessages.length,
            created_at: chatMessages[0]?.created_at,
            updated_at: chatMessages[chatMessages.length - 1]?.created_at,
          })
        }
      } catch (error) {
        console.error("Error loading chat data:", error)
      }
    }
    loadChatData()
  }, [chatId, supabase])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags]
    newTags[index] = value
    setFormData((prev) => ({ ...prev, tags: newTags }))
  }

  const addTag = () => {
    if (formData.tags.length < 5) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, ""] }))
    }
  }

  const removeTag = (index: number) => {
    if (formData.tags.length > 1) {
      const newTags = formData.tags.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, tags: newTags }))
    }
  }

  const handleImageUpload = async (field: string, file: File) => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user?.id}/${chatId}/${field}-${Date.now()}.${fileExt}`

      const { error } = await supabase.storage.from("community-images").upload(fileName!, file)

      if (error) throw error

      const {
        data: { publicUrl },
      } = supabase.storage.from("community-images").getPublicUrl(fileName!)

      setFormData((prev) => ({ ...prev, [field]: publicUrl }))
      toast.success("Image uploaded successfully!")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image")
    }
  }

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in title and description")
      return
    }

    if (formData.post_type === "component" && !componentCode) {
      toast.error("No component found in this chat. Please create a component first or choose 'Full Chat' option.")
      return
    }

    if (formData.post_type === "full_chat" && !chatData) {
      toast.error("No chat data found")
      return
    }

    setIsSubmitting(true)
    try {
      const filteredTags = formData.tags.filter((tag) => tag.trim() !== "")

      // Create the community post
      const { data: postData, error: postError } = await supabase
        .from("community_posts")
        .insert([
          {
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            tags: filteredTags,
            creator_name: formData.creator_name.trim(),
            creator_email: formData.creator_email.trim() || null,
            creator_phone: formData.creator_phone.trim() || null,
            cover_image: formData.cover_image || null,
            hover_image: formData.hover_image || null,
            profile_picture: formData.profile_picture || null,
            chat_id: chatId,
            component_code: formData.post_type === "component" ? componentCode : null,
            user_id: user!.id,
            post_type: formData.post_type,
          },
        ])
        .select()
        .single()

      if (postError) throw postError

      // If it's a full chat post, create a snapshot
      if (formData.post_type === "full_chat" && chatData) {
        const { error: snapshotError } = await supabase.from("community_chat_snapshots").insert([
          {
            community_post_id: postData.id,
            original_chat_id: chatId,
            snapshot_data: chatData,
          },
        ])

        if (snapshotError) throw snapshotError
      }

      toast.success("Project published to community!")
      router.push(`/community/${postData.id}`)
    } catch (error) {
      console.error("Error publishing post:", error)
      toast.error("Failed to publish project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canPublishComponent = componentCode && componentCode.trim() !== ""
  const canPublishChat = chatData && chatData.messages && chatData.messages.length > 0

  if (!canPublishComponent && !canPublishChat) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-black mb-2">Share to Community</h2>
          <p className="text-gray-600">
            No content found in this chat. Create a project or have a conversation first to share it with the community.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-black mb-2">Share to Community</h2>
        <p className="text-gray-600">Share your amazing project or entire chat conversation with the community.</p>
      </div>

      <div className="space-y-4">
        {/* Post Type Selection */}
        <div>
          <Label className="text-base font-medium">What would you like to share?</Label>
          <RadioGroup
            value={formData.post_type}
            onValueChange={(value: "component" | "full_chat") => handleInputChange("post_type", value)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="component" id="component" disabled={!canPublishComponent} />
              <div className="flex items-center gap-2 flex-1">
                <Code2 className="h-4 w-4 text-blue-600" />
                <div>
                  <Label htmlFor="component" className={`font-medium ${!canPublishComponent ? "text-gray-400" : ""}`}>
                    Latest Component
                  </Label>
                  <p className={`text-sm ${!canPublishComponent ? "text-gray-400" : "text-gray-600"}`}>
                    Share the most recent component/project you created
                    {!canPublishComponent && " (No component found)"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="full_chat" id="full_chat" disabled={!canPublishChat} />
              <div className="flex items-center gap-2 flex-1">
                <MessageSquare className="h-4 w-4 text-green-600" />
                <div>
                  <Label htmlFor="full_chat" className={`font-medium ${!canPublishChat ? "text-gray-400" : ""}`}>
                    Full Chat Conversation
                  </Label>
                  <p className={`text-sm ${!canPublishChat ? "text-gray-400" : "text-gray-600"}`}>
                    Share the entire chat conversation ({chatData?.total_messages || 0} messages)
                    {!canPublishChat && " (No messages found)"}
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder={formData.post_type === "full_chat" ? "My Chat Conversation" : "My Amazing Project"}
            className="mt-1"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder={
              formData.post_type === "full_chat"
                ? "Describe what this conversation covers and what others can learn from it..."
                : "Describe what your project does and what makes it special..."
            }
            className="mt-1 min-h-[100px]"
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div>
          <Label>Tags (up to 5)</Label>
          <div className="space-y-2 mt-1">
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  placeholder="Enter a tag"
                  className="flex-1"
                />
                {formData.tags.length > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeTag(index)} className="px-3">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {formData.tags.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                className="flex items-center gap-2 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Add Tag
              </Button>
            )}
          </div>
        </div>

        {/* Creator Info */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-black mb-3">Creator Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="creator_name">Your Name *</Label>
              <Input
                id="creator_name"
                value={formData.creator_name}
                onChange={(e) => handleInputChange("creator_name", e.target.value)}
                placeholder="Your display name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="creator_email">Email (optional)</Label>
              <Input
                id="creator_email"
                type="email"
                value={formData.creator_email}
                onChange={(e) => handleInputChange("creator_email", e.target.value)}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="creator_phone">Phone (optional)</Label>
              <Input
                id="creator_phone"
                type="tel"
                value={formData.creator_phone}
                onChange={(e) => handleInputChange("creator_phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-black mb-3">Project Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cover Image */}
            <div>
              <Label>Cover Image</Label>
              <div className="mt-1 space-y-2">
                {formData.cover_image ? (
                  <div className="relative">
                    <Image
                      src={formData.cover_image}
                      alt="Cover"
                      width={300}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleInputChange("cover_image", "")}
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload("cover_image", file)
                      }}
                      className="hidden"
                      id="cover-upload"
                    />
                    <Label htmlFor="cover-upload" className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                      Upload Cover Image
                    </Label>
                  </div>
                )}
              </div>
            </div>

            {/* Hover Image */}
            <div>
              <Label>Hover Image (optional)</Label>
              <div className="mt-1 space-y-2">
                {formData.hover_image ? (
                  <div className="relative">
                    <Image
                      src={formData.hover_image}
                      alt="Hover"
                      width={300}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleInputChange("hover_image", "")}
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload("hover_image", file)
                      }}
                      className="hidden"
                      id="hover-upload"
                    />
                    <Label htmlFor="hover-upload" className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                      Upload Hover Image
                    </Label>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Picture */}
            <div>
              <Label>Profile Picture</Label>
              <div className="mt-1 space-y-2">
                {formData.profile_picture ? (
                  <div className="relative">
                    <Avatar className="w-32 h-32 mx-auto">
                      <AvatarImage src={formData.profile_picture} />
                      <AvatarFallback>{formData.creator_name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleInputChange("profile_picture", "")}
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload("profile_picture", file)
                      }}
                      className="hidden"
                      id="profile-upload"
                    />
                    <Label
                      htmlFor="profile-upload"
                      className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                    >
                      Upload Profile Picture
                    </Label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="border-t pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            {isSubmitting
              ? "Publishing..."
              : `Publish ${formData.post_type === "full_chat" ? "Chat" : "Component"} to Community`}
          </Button>
        </div>
      </div>
    </div>
  )
}