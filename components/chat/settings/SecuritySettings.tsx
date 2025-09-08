// components/chat/settings/SecuritySettings.tsx
"use client"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Shield, Lock, Key, Eye, EyeOff } from "lucide-react"

interface SecuritySettingsProps {
  chatId: string
}

interface SecurityData {
  id?: string
  chat_id: string
  password_protected: boolean
  password_hash?: string | null
  recovery_email?: string | null
  two_factor_enabled: boolean
  created_at?: string
  updated_at?: string
}

export default function SecuritySettings({ chatId }: SecuritySettingsProps) {
  const [securityData, setSecurityData] = useState<SecurityData | null>(null)
  const [passwordProtected, setPasswordProtected] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  const loadSecurityData = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("chat_security_beta").select("*").eq("chat_id", chatId).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error loading security data:", error)
        toast.error("Failed to load security settings")
        return
      }

      if (data) {
        setSecurityData(data)
        setPasswordProtected(data.password_protected)
        setRecoveryEmail(data.recovery_email || "")
        setTwoFactorEnabled(data.two_factor_enabled)
      } else {
        const defaultSecurity: SecurityData = {
          chat_id: chatId,
          password_protected: false,
          two_factor_enabled: false,
        }
        setSecurityData(defaultSecurity)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [chatId, supabase])

  const saveSecuritySettings = async () => {
    if (!securityData) return

    setIsSaving(true)
    try {
      let passwordHash = securityData.password_hash

      if (passwordProtected) {
        if (!securityData.password_hash) {
          if (!newPassword) {
            toast.error("Please enter a new password to enable protection")
            return
          }
          if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
          }
          if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
          }
          passwordHash = btoa(newPassword)
        } else {
          if (newPassword) {
            if (!currentPassword) {
              toast.error("Enter current password to change it")
              return
            }
            if (btoa(currentPassword) !== securityData.password_hash) {
              toast.error("Incorrect current password")
              return
            }
            if (newPassword !== confirmPassword) {
              toast.error("New passwords do not match")
              return
            }
            if (newPassword.length < 6) {
              toast.error("New password must be at least 6 characters")
              return
            }
            passwordHash = btoa(newPassword)
          }
        }
      } else {
        passwordHash = null
      }

      const updateData = {
        chat_id: chatId,
        password_protected: passwordProtected,
        password_hash: passwordHash,
        recovery_email: recoveryEmail.trim() || null,
        two_factor_enabled: twoFactorEnabled,
        updated_at: new Date().toISOString(),
      }

      let data, error
      if (securityData.id) {
        ({ data, error } = await supabase.from("chat_security_beta").update(updateData).eq("id", securityData.id).select())
      } else {
        ({ data, error } = await supabase
          .from("chat_security_beta")
          .insert([{ ...updateData, created_at: new Date().toISOString() }])
          .select())
      }

      if (error) {
        console.error("Error saving security settings:", error.message, error.details, error.hint)
        toast.error("Failed to save security settings")
        return
      }

      toast.success("Security settings saved successfully")

      if (data && data[0]) {
        setSecurityData(data[0])
      }

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const generateRecoveryCode = () => {
    const recoveryCode = "REC-" + Math.random().toString(36).substr(2, 12).toUpperCase()
    toast.success(`Recovery code generated: ${recoveryCode}`)
  }

  useEffect(() => {
    loadSecurityData()
  }, [loadSecurityData])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Security Settings</h2>
        <Badge variant="secondary">Beta</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password Protection
          </CardTitle>
          <CardDescription>Protect your chat with a password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="password-protection" checked={passwordProtected} onCheckedChange={setPasswordProtected} />
            <Label htmlFor="password-protection">Enable password protection</Label>
          </div>

          {passwordProtected && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              {securityData?.password_hash && (
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="new-password">{securityData?.password_hash ? "New Password (optional)" : "Password"}</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={securityData?.password_hash ? "Enter new password to change" : "Enter password"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Recovery Options
          </CardTitle>
          <CardDescription>Set up recovery methods in case you forget your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recovery-email">Recovery Email</Label>
            <Input
              id="recovery-email"
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="Enter recovery email"
            />
          </div>

          <Button variant="outline" onClick={generateRecoveryCode} className="w-full bg-transparent">
            Generate Recovery Code
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your chat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="two-factor" checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
            <Label htmlFor="two-factor">Enable two-factor authentication</Label>
          </div>

          {twoFactorEnabled && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Two-factor authentication will be required when accessing this chat from new devices.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button onClick={saveSecuritySettings} disabled={isSaving} className="w-full">
        {isSaving ? "Saving..." : "Save Security Settings"}
      </Button>
    </div>
  )
}