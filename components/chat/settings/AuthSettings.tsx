// components/chat/settings/AuthSettings.tsx
"use client"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import "@/styles/button.css"

interface AuthSettingsProps {
  chatId: string
  authCode: string
  onAuthCodeGenerated: (code: string) => void
}

interface ChatData {
  id: string
  name: string
  description: string | null
  user_id: string
  is_public?: boolean
}

export default function AuthSettings({ chatId, authCode, onAuthCodeGenerated }: AuthSettingsProps) {
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [chatName, setChatName] = useState("")
  const [chatDescription, setChatDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  const loadChatData = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("chats").select("*").eq("id", chatId).single()

      if (error) {
        console.error("Error loading chat data:", error)
        toast.error("Failed to load chat settings")
        return
      }

      if (data) {
        setChatData(data)
        setChatName(data.name)
        setChatDescription(data.description || "A conversation about your next great app idea")
        setIsPublic(data.is_public || false)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [chatId, supabase])

  const saveChatSettings = async () => {
    if (!chatData) return

    setIsSaving(true)
    try {
      console.log("[v0] Attempting to save chat settings for chatId:", chatId)
      console.log("[v0] Data to save:", {
        name: chatName.trim(),
        description: chatDescription.trim(),
        is_public: isPublic,
      })

      const { data, error } = await supabase
        .from("chats")
        .update({
          name: chatName.trim(),
          description: chatDescription.trim() || null,
          is_public: isPublic,
          updated_at: new Date().toISOString(),
        })
        .eq("id", chatId)
        .select()

      console.log("[v0] Supabase response:", { data, error })

      if (error) {
        console.error("[v0] Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        toast.error(`Failed to save chat settings: ${error.message}`)
        return
      }

      console.log("[v0] Chat settings saved successfully")
      toast.success("Chat settings saved successfully")

      setChatData((prev) =>
        prev
          ? {
              ...prev,
              name: chatName,
              description: chatDescription,
              is_public: isPublic,
            }
          : null
      )
    } catch (error) {
      console.error("[v0] Unexpected error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleOAuthSetup = async (provider: "google" | "microsoft") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === "microsoft" ? "azure" : provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(`Failed to setup ${provider} login`)
      } else {
        toast.success(`${provider} login setup initiated`)
      }
    } catch (error) {
      console.error("OAuth setup error:", error)
      toast.error("Failed to setup OAuth")
    }
  }

  const generateNewAuthCode = () => {
    const newCode = "AUTH-" + Math.random().toString(36).substr(2, 9).toUpperCase()
    onAuthCodeGenerated(newCode)
    toast.success("New authentication code generated")
  }

  useEffect(() => {
    loadChatData()
  }, [loadChatData])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chat Information</CardTitle>
          <CardDescription>Customize your chat name and description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chat-name">Chat Name</Label>
            <Input
              id="chat-name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Enter chat name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chat-description">Description</Label>
            <Textarea
              id="chat-description"
              value={chatDescription}
              onChange={(e) => setChatDescription(e.target.value)}
              placeholder="A conversation about your next great app idea"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="public-chat" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="public-chat">Make this chat public</Label>
          </div>

          <Button onClick={saveChatSettings} disabled={isSaving || !chatName.trim()} className="w-full">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Login Methods</CardTitle>
          <CardDescription>Connect additional login methods for easier access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" onClick={() => handleOAuthSetup("google")} className="w-full justify-start">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Connect Google Account
            </Button>

            <Button variant="outline" onClick={() => handleOAuthSetup("microsoft")} className="w-full justify-start">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
                />
              </svg>
              Connect Microsoft Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Authentication Code</CardTitle>
          <CardDescription>Current authentication code for this chat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">{authCode || "No code generated"}</code>
            <Badge variant="secondary">Active</Badge>
          </div>
          <Button variant="outline" onClick={generateNewAuthCode} className="w-full bg-transparent">
            Generate New Code
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}