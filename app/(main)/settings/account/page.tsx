"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import { User } from "@supabase/supabase-js"
import { Input } from "@/components/ui/input"
import countryCodes from "@/context/country"

const styles = `
  .account-settings {
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
    position: relative;
  }
  .form-group label {
    display: block;
    margin-bottom: 5px;
  }
  .phone-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }
  .phone-input {
    padding-right: 20px;
  }
  .dropdown-button {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 0 3px;
    font-size: 10px;
  }
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 200px;
    overflow-y: auto;
    background-color: #2a2a2a;
    border: 1px solid #333;
    border-radius: 4px;
    z-index: 10;
    margin-top: 2px;
  }
  .dropdown-item {
    padding: 8px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .dropdown-item:hover {
    background-color: #3a3a3a;
  }
  .form-group input {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #333;
    background-color: #2a2a2a;
    color: #fff;
  }
  .form-group button {
    padding: 8px 16px;
    background-color: #0099ff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: default;
  }
  .form-group button:hover {
    background-color: #00ccff;
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

export default function AccountSettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const getUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone, avatar_url')
          .eq('id', user.id)
          .single()

        const defaultName = user.email ? user.email.split('@')[0] : "unknown"

        if (!profile) {
          await supabase.from('profiles').insert({
            id: user.id,
            full_name: defaultName
          })
          console.log("Initial profile created for user:", user.id)
        }

        setUsername(profile?.full_name || defaultName || "")
        setPhone(profile?.phone || "")
        if (profile?.phone) {
          const country = countryCodes.find(c => profile.phone.startsWith(c.dial_code))
          setSelectedCountryCode(country?.dial_code || "+1")
        }
      }
    } catch (error) {
      console.error("Error getting user profile:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const createBucketIfNotExists = useCallback(async () => {
    try {
      const { error } = await supabase.storage.getBucket('avatars')
      if (error && error.message.includes('Bucket not found')) {
        await supabase.storage.createBucket('avatars', { public: true })
        console.log("Bucket 'avatars' created. Waiting for initialization...")
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log("Bucket 'avatars' should be ready now.")
      } else if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error managing bucket:", error)
    }
  }, [supabase])

  useEffect(() => {
    getUser()
    createBucketIfNotExists()
  }, [getUser, createBucketIfNotExists])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCountrySelect = (dialCode: string) => {
    setSelectedCountryCode(dialCode)
    setPhone(dialCode)
    setIsDropdownOpen(false)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!value.startsWith(selectedCountryCode)) {
      setPhone(selectedCountryCode + value.replace(/^\+\d+/, ''))
    } else {
      setPhone(value)
    }
  }

  const handleSave = async () => {
    if (!user) return
    try {
      const updates = {
        full_name: username,
        phone: phone,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updates })
      if (error) throw error
      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      if (error instanceof Error && error.message.includes('row-level security policy')) {
        alert("Failed to save settings: Permission denied. Please ensure your account has the correct permissions or contact support.")
      } else if (error instanceof Error && error.message.includes('Bucket not found')) {
        alert("Failed to save settings: Storage bucket issue. Please try again or contact support.")
      } else {
        alert("Failed to save settings: " + (error as Error).message)
      }
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
    <div className="account-settings">
      <style>{styles}</style>
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <div className="form-group">
        <label>Username</label>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group" ref={dropdownRef}>
        <label>Phone Number</label>
        <div className="phone-input-container">
          <Input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
          />
          <button
            className="dropdown-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            ▼
          </button>
        </div>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            {countryCodes.map((country) => (
              <div
                key={country.code}
                className="dropdown-item"
                onClick={() => handleCountrySelect(country.dial_code)}
              >
                <span>{country.name}</span>
                <span>{country.dial_code}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="save-button" onClick={handleSave}>Save Changes</button>
      <button className="form-group button r2552esf25_252trewt3er" onClick={() => router.push("/settings/password")}>
        Change Password
      </button>
    </div>
  )
}