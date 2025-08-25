"use client"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/supabase/client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

interface AuthSettingsProps {
  chatId: string
  authCode: string
  onAuthCodeGenerated: (code: string) => void
}

export default function AuthSettings({ chatId, authCode, onAuthCodeGenerated }: AuthSettingsProps) {
  const [siteName, setSiteName] = useState("")
  const [siteIcon, setSiteIcon] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [authMethods, setAuthMethods] = useState({
    email: true,
    google: false,
    microsoft: false,
    facebook: false,
  })
  const supabase = createClient()

  const fetchSettings = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("chats")
        .select("name, is_public, icon")
        .eq("id", chatId)
        .single()
      if (data) {
        setSiteName(data.name)
        setIsPublic(data.is_public ?? true)
        setSiteIcon(data.icon || "")
      }
      const { data: authData } = await supabase
        .from("auth_settings")
        .select("email, google, microsoft, facebook")
        .eq("chat_id", chatId)
        .single()
      if (authData) {
        setAuthMethods({
          email: authData.email ?? true,
          google: authData.google ?? false,
          microsoft: authData.microsoft ?? false,
          facebook: authData.facebook ?? false,
        })
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Error loading settings")
    }
  }, [chatId, supabase])

  const generateAuthCode = async () => {
    if (!authMethods.email) return
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Create a login and signup page with email and password authentication for a web application. Include client-side validation and Supabase auth integration.`,
          language: "html",
        }),
      })
      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")
      let generatedCode = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        generatedCode += new TextDecoder().decode(value)
      }
      await supabase.from("auth_settings").upsert({
        chat_id: chatId,
        login_code: generatedCode,
        updated_at: new Date().toISOString(),
      })
      onAuthCodeGenerated(generatedCode)
      toast.success("Authentication code generated!")
    } catch (error) {
      console.error("Error generating auth code:", error)
      toast.error("Error generating authentication code")
    }
  }

  const handleUpdateSettings = async () => {
    try {
      await supabase
        .from("chats")
        .update({
          name: siteName,
          is_public: isPublic,
          icon: siteIcon || null,
        })
        .eq("id", chatId)
      await supabase
        .from("auth_settings")
        .upsert({
          chat_id: chatId,
          email: authMethods.email,
          google: authMethods.google,
          microsoft: authMethods.microsoft,
          facebook: authMethods.facebook,
          updated_at: new Date().toISOString(),
        })
      if (authMethods.email && !authCode) {
        await generateAuthCode()
      }
      toast.success("Settings updated successfully!")
    } catch (error) {
      console.error("Error updating settings:", error)
      toast.error("Error updating settings")
    }
  }

  const handleDeleteChat = async () => {
    try {
      await supabase.from("chats").delete().eq("id", chatId)
      toast.success("Chat deleted successfully!")
    } catch (error) {
      console.error("Error deleting chat:", error)
      toast.error("Error deleting chat")
    }
  }

  const handleAuthMethodChange = async (method: keyof typeof authMethods, value: boolean) => {
    setAuthMethods((prev) => ({ ...prev, [method]: value }))
    if (method === "email" && value && !authCode) {
      await generateAuthCode()
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1a1d24] p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Site Settings</h3>
        <div className="space-y-4">
          <div>
            <Label>Site Name</Label>
            <Input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Enter site name"
              className="border-[#e6e6e6] dark:border-[#30363d]"
            />
          </div>
          <div>
            <Label>Site Icon URL</Label>
            <Input
              value={siteIcon}
              onChange={(e) => setSiteIcon(e.target.value)}
              placeholder="Enter icon URL"
              className="border-[#e6e6e6] dark:border-[#30363d]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
              id="public-switch"
            />
            <Label htmlFor="public-switch">Public Chat</Label>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-[#1a1d24] p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Authentication Methods</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              checked={authMethods.email}
              onCheckedChange={(checked) => handleAuthMethodChange("email", checked)}
              id="email-auth"
            />
            <Label htmlFor="email-auth">Email/Password</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={authMethods.google}
              onCheckedChange={(checked) => handleAuthMethodChange("google", checked)}
              id="google-auth"
            />
            <Label htmlFor="google-auth">Google</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={authMethods.microsoft}
              onCheckedChange={(checked) => handleAuthMethodChange("microsoft", checked)}
              id="microsoft-auth"
            />
            <Label htmlFor="microsoft-auth">Microsoft</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={authMethods.facebook}
              onCheckedChange={(checked) => handleAuthMethodChange("facebook", checked)}
              id="facebook-auth"
            />
            <Label htmlFor="facebook-auth">Facebook</Label>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleUpdateSettings}>Save Settings</Button>
        <Button variant="destructive" onClick={handleDeleteChat}>
          Delete Chat
        </Button>
      </div>
    </div>
  )
}