"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import { User } from "@supabase/supabase-js"
import { Input } from "@/components/ui/input"

const styles = `
  .password-settings {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #1a1a1a;
    color: #fff;
    padding: 20px;
  }
  .form-group {
    margin-bottom: 15px;
    width: 300px;
  }
  .form-group label {
    display: block;
    margin-bottom: 5px;
  }
  .form-group input {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #333;
    background-color: #2a2a2a;
    color: #fff;
  }
  .save-button {
    padding: 10px 20px;
    background-color: #0099ff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: default;
    outline: none;
    padding: 4px 8px;
    margin-bottom: 15px;
    width: 300px;
    font-size: 12px;
    border: 1px solid #88888800;
    border-radius: 6px;
    height: 28px;
  }
  .save-button:hover {
    background-color: #00ccff;
  }
`

export default function PasswordSettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const getUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error("Error getting user:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    getUser()
  }, [getUser])

const handleSave = async () => {
  if (!user || newPassword !== confirmPassword) {
    alert("Passwords do not match or user not authenticated.")
    return
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error

    alert("Password updated successfully!")
    router.push("/chat")
  } catch (error) {
    console.error("Error updating password:", error)
    alert("Failed to update password. Please try again.")
  }
}


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="password-settings">
      <style>{styles}</style>
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>
      <div className="form-group">
        <label>Old Password</label>
        <Input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>New Password</label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Confirm New Password</label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button className="save-button" onClick={handleSave}>Save Changes</button>
    </div>
  )
}