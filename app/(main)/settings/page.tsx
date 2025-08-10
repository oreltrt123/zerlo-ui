"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import { User } from "@supabase/supabase-js"
import Image from "next/image"
import "@/styles/input.css"

// Define custom CSS for settings page
const styles = `
  .settings-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #1a1a1a;
    color: #fff;
    padding: 20px;
  }
  .settings-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .settings-item {
    display: flex;
    align-items: center;
    width: 300px;
    background-color: #2a2a2a;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  .settings-item:hover {
    background-color: #333;
  }
  .settings-item .icon {
    margin-right: 10px;
  }
  .profile-pic {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #fff;
  }
  .toggle {
    margin-left: auto;
  }
`

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
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

  const handleAccountSettings = () => {
    router.push("/settings/account")
  }

  const handlePrivacy = () => {
    router.push("/legal/privacy")
  }

  const handleTerms = () => {
    router.push("/legal/terms")
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
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
    <div className="settings-container">
      <style>{styles}</style>
      <h1 className="settings-title">Settings</h1>
      <div className="settings-item r2552esf25_252trewt3er" onClick={handleAccountSettings}>
        <div className="icon">
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="profile-pic"
              width={24}
              height={24}
            />
          ) : (
            <div className="profile-pic"></div>
          )}
        </div>
        <span>{user.user_metadata?.full_name || user.email}</span>
      </div>
      <div className="settings-item r2552esf25_252trewt3er" onClick={handlePrivacy}>
        <span>Privacy</span>
      </div>
      <div className="settings-item r2552esf25_252trewt3er" onClick={handleTerms}>
        <span>Terms of Service</span>
      </div>
      <div className="settings-item r2552esf25_252trewt3er" onClick={handleLogout}>
        <span>Log Out</span>
      </div>
    </div>
  )
}