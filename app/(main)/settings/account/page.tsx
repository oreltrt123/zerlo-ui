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
    background-color: #e9e6e6bd;
    border: 1px solid #8888881A;
    border-radius: 4px;
    z-index: 10;
    margin-top: 2px;
  }
  .dropdown-item {
    padding: 8px;
    cursor: default;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .dropdown-item:hover {
    background-color: #8888881A;
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

const translations: Record<string, Record<string, string>> = {
  en: {
    title: "Account Settings",
    usernameLabel: "Username",
    phoneLabel: "Phone Number",
    saveButton: "Save Changes",
    changePassword: "Change Password",
    settingsSaved: "Settings saved successfully!",
    settingsSaveFailed: "Failed to save settings: ",
    permissionDenied: "Permission denied. Please ensure your account has the correct permissions or contact support.",
    bucketIssue: "Storage bucket issue. Please try again or contact support.",
  },
  fr: {
    title: "Paramètres du compte",
    usernameLabel: "Nom d'utilisateur",
    phoneLabel: "Numéro de téléphone",
    saveButton: "Enregistrer les modifications",
    changePassword: "Changer le mot de passe",
    settingsSaved: "Paramètres enregistrés avec succès !",
    settingsSaveFailed: "Échec de l'enregistrement des paramètres : ",
    permissionDenied: "Permission refusée. Veuillez vérifier les permissions de votre compte ou contacter le support.",
    bucketIssue: "Problème de stockage. Veuillez réessayer ou contacter le support.",
  },
  ru: {
    title: "Настройки аккаунта",
    usernameLabel: "Имя пользователя",
    phoneLabel: "Номер телефона",
    saveButton: "Сохранить изменения",
    changePassword: "Сменить пароль",
    settingsSaved: "Настройки успешно сохранены!",
    settingsSaveFailed: "Ошибка сохранения настроек: ",
    permissionDenied: "Доступ запрещен. Проверьте права или свяжитесь с поддержкой.",
    bucketIssue: "Проблема с хранилищем. Попробуйте позже или обратитесь в поддержку.",
  },
  hi: {
    title: "खाता सेटिंग्स",
    usernameLabel: "उपयोगकर्ता नाम",
    phoneLabel: "फोन नंबर",
    saveButton: "परिवर्तन सहेजें",
    changePassword: "पासवर्ड बदलें",
    settingsSaved: "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
    settingsSaveFailed: "सेटिंग्स सहेजने में विफल: ",
    permissionDenied: "अनुमति अस्वीकृत। कृपया अपने खाते की अनुमतियां जांचें या समर्थन से संपर्क करें।",
    bucketIssue: "भंडारण समस्या। कृपया पुनः प्रयास करें या सहायता से संपर्क करें।",
  },
  zh: {
    title: "账户设置",
    usernameLabel: "用户名",
    phoneLabel: "电话号码",
    saveButton: "保存更改",
    changePassword: "更改密码",
    settingsSaved: "设置保存成功！",
    settingsSaveFailed: "保存设置失败：",
    permissionDenied: "权限被拒绝。请检查账户权限或联系支持。",
    bucketIssue: "存储问题。请重试或联系支持。",
  },
  ar: {
    title: "إعدادات الحساب",
    usernameLabel: "اسم المستخدم",
    phoneLabel: "رقم الهاتف",
    saveButton: "حفظ التغييرات",
    changePassword: "تغيير كلمة المرور",
    settingsSaved: "تم حفظ الإعدادات بنجاح!",
    settingsSaveFailed: "فشل حفظ الإعدادات: ",
    permissionDenied: "تم رفض الإذن. يرجى التحقق من أذونات حسابك أو الاتصال بالدعم.",
    bucketIssue: "مشكلة في التخزين. الرجاء المحاولة مرة أخرى أو الاتصال بالدعم.",
  },
  he: {
    title: "הגדרות חשבון",
    usernameLabel: "שם משתמש",
    phoneLabel: "מספר טלפון",
    saveButton: "שמור שינויים",
    changePassword: "שנה סיסמה",
    settingsSaved: "ההגדרות נשמרו בהצלחה!",
    settingsSaveFailed: "שמירת ההגדרות נכשלה: ",
    permissionDenied: "ההרשאה נדחתה. אנא בדוק את ההרשאות שלך או פנה לתמיכה.",
    bucketIssue: "בעיה באחסון. נסה שוב או פנה לתמיכה.",
  },
}

export default function AccountSettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [language, setLanguage] = useState("en")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const getUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const lang = user.user_metadata?.language || "en"
        setLanguage(lang)

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

      alert(translations[language].settingsSaved)
    } catch (error) {
      console.error("Error saving settings:", error)
      if (error instanceof Error && error.message.includes('row-level security policy')) {
        alert(translations[language].settingsSaveFailed + translations[language].permissionDenied)
      } else if (error instanceof Error && error.message.includes('Bucket not found')) {
        alert(translations[language].settingsSaveFailed + translations[language].bucketIssue)
      } else {
        alert(translations[language].settingsSaveFailed + (error as Error).message)
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

  const t = translations[language] || translations.en

  return (
    <div className="account-settings">
      <style>{styles}</style>
      <h1 className="text-2xl font-bold mb-4">{t.title}</h1>
      <div className="form-group">
        <label>{t.usernameLabel}</label>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group" ref={dropdownRef}>
        <label>{t.phoneLabel}</label>
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
      <button className="save-button" onClick={handleSave}>{t.saveButton}</button>
      <button className="form-group button r2552esf25_252trewt3er" onClick={() => router.push("/settings/password")}>
        {t.changePassword}
      </button>
    </div>
  )
}
