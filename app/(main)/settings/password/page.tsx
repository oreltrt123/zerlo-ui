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
  .save-button {
    padding: 10px 20px;
    background-color: #0099ff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: default;
    margin-bottom: 15px;
    width: 300px;
    font-size: 12px;
    height: 28px;
  }
  .save-button:hover {
    background-color: #00ccff;
  }
`

// Translations for Password Settings page
const translations: Record<string, {
  title: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  save: string;
}> = {
  en: {
    title: "Change Password",
    oldPassword: "Old Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    save: "Save Changes"
  },
  fr: {
    title: "Changer le mot de passe",
    oldPassword: "Ancien mot de passe",
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirmer le nouveau mot de passe",
    save: "Enregistrer les modifications"
  },
  ru: {
    title: "Изменить пароль",
    oldPassword: "Старый пароль",
    newPassword: "Новый пароль",
    confirmPassword: "Подтвердите новый пароль",
    save: "Сохранить изменения"
  },
  hi: {
    title: "पासवर्ड बदलें",
    oldPassword: "पुराना पासवर्ड",
    newPassword: "नया पासवर्ड",
    confirmPassword: "नया पासवर्ड पुष्टि करें",
    save: "परिवर्तन सहेजें"
  },
  zh: {
    title: "更改密码",
    oldPassword: "旧密码",
    newPassword: "新密码",
    confirmPassword: "确认新密码",
    save: "保存更改"
  },
  ar: {
    title: "تغيير كلمة المرور",
    oldPassword: "كلمة المرور القديمة",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور الجديدة",
    save: "حفظ التغييرات"
  },
  he: {
    title: "שנה סיסמה",
    oldPassword: "סיסמה ישנה",
    newPassword: "סיסמה חדשה",
    confirmPassword: "אשר סיסמה חדשה",
    save: "שמור שינויים"
  }
}

export default function PasswordSettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [language, setLanguage] = useState("en")

  const router = useRouter()
  const supabase = createClient()

  const getUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)
      setLanguage(user.user_metadata?.language || "en")
    } catch (error) {
      console.error("Error getting user:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, router])

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

  const t = translations[language] || translations.en

  return (
    <div className="password-settings">
      <style>{styles}</style>
      <h1 className="text-2xl font-bold mb-4">{t.title}</h1>
      <div className="form-group">
        <label>{t.oldPassword}</label>
        <Input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>{t.newPassword}</label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>{t.confirmPassword}</label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button className="save-button" onClick={handleSave}>
        <span className="relative top-[-5px]">{t.save}</span>
      </button>
    </div>
  )
}