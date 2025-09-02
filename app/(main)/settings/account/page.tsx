"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import { User } from "@supabase/supabase-js"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import countryCodes from "@/context/country"
import "@/styles/button.css"

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
    background-color: white;
    border: 1px solid #8888881A;
    border-radius: 4px;
    z-index: 10;
    margin-top: 2px;
  }
  .dropdown-item {
    padding: 8px;
    cursor: defult;
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
    cursor: pointer;
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
    cursor: pointer;
    outline: none;
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
  .api-key-section {
    margin-top: 20px;
    width: 300px;
  }
  .api-key-input {
    background: #f0f0f0;
    color: #333;
    font-family: monospace;
  }
  .copy-button, .regenerate-button {
    margin-top: 10px;
    margin-right: 10px;
    background-color: #0099ff;
    color: #fff;
  }
  .regenerate-button {
    background-color: #ff4444;
  }
  .regenerate-button:hover {
    background-color: #ff6666;
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
    apiKeyLabel: "Your API Key (copy and store securely)",
    apiKeyExists: "API key already generated (masked for security). Regenerate to get a new key.",
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
    apiKeyLabel: "Votre clé API (copiez et stockez en toute sécurité)",
    apiKeyExists: "Clé API déjà générée (masquée pour la sécurité). Régénérez pour obtenir une nouvelle clé.",
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
    apiKeyLabel: "Ваш API ключ (скопируйте и храните безопасно)",
    apiKeyExists: "API ключ уже создан (скрыт для безопасности). Сгенерируйте новый ключ.",
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
    apiKeyLabel: "आपकी API कुंजी (कॉपी करें और सुरक्षित रखें)",
    apiKeyExists: "API कुंजी पहले से उत्पन्न हो चुकी है (सुरक्षा के लिए छिपाई गई)। नई कुंजी के लिए पुनर्जनन करें।",
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
    apiKeyLabel: "您的API密钥（复制并安全存储）",
    apiKeyExists: "API密钥已生成（为安全起见已隐藏）。请重新生成以获取新密钥。",
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
    apiKeyLabel: "مفتاح API الخاص بك (انسخه واحفظه بأمان)",
    apiKeyExists: "تم إنشاء مفتاح API بالفعل (مخفي للأمان). أعد الإنشاء للحصول على مفتاح جديد.",
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
    apiKeyLabel: "מפתח ה-API שלך (העתק ושמור במקום בטוח)",
    apiKeyExists: "מפתח API כבר נוצר (מוסתר מטעמי אבטחה). צור מחדש לקבלת מפתח חדש.",
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
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [isKeyMasked, setIsKeyMasked] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const getUser = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        console.error('Auth error:', error?.message || 'No user found')
        router.push("/login")
        return
      }
      setUser(user)
      console.log('User identities:', user.identities) // Debug

      const lang = user.user_metadata?.language || "en"
      setLanguage(lang)

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, phone, avatar_url')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError.message)
        return
      }

      const defaultName = user.email ? user.email.split('@')[0] : "unknown"

      if (!profile) {
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          full_name: defaultName
        })
        if (insertError) {
          console.error('Profile insert error:', {
            message: insertError.message,
            code: insertError.code,
            details: insertError.details,
            hint: insertError.hint
          })
        } else {
          console.log("Initial profile created for user:", user.id)
        }
      }

      setUsername(profile?.full_name || defaultName || "")
      setPhone(profile?.phone || "")
      if (profile?.phone) {
        const country = countryCodes.find(c => profile.phone?.startsWith(c.dial_code))
        setSelectedCountryCode(country?.dial_code || "+1")
      }

      // API key logic - always fetch or generate
      const { data: apiKeyData, error: keyError } = await supabase
        .from('api_keys')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (keyError && keyError.code !== 'PGRST116') {
        console.error('API key fetch error:', keyError.message)
        return
      }

      if (apiKeyData) {
        setApiKey('sk_******************************')
        setIsKeyMasked(true)
      } else {
        const response = await fetch('/api/generate-apikey', { method: 'POST' })
        if (response.ok) {
          const { apiKey: newKey, error } = await response.json()
          if (error) {
            console.error('API key generation error:', error)
          } else {
            setApiKey(newKey)
          }
        } else {
          const error = await response.json()
          console.error('API key fetch failed:', error)
        }
      }
    } catch (error) {
      console.error("Error getting user profile:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, router])

  const createBucketIfNotExists = useCallback(async () => {
    try {
      const { error } = await supabase.storage.getBucket('avatars')
      if (error && error.message.includes('Bucket not found')) {
        await supabase.storage.createBucket('avatars', { public: true })
        console.log("Bucket 'avatars' created. Waiting for initialization...")
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log("Bucket 'avatars' should be ready now.")
      } else if (error) {
        console.error('Bucket error:', error.message)
      }
    } catch (error) {
      console.error("Error managing bucket:", error)
    }
  }, [supabase])

  const handleRegenerateApiKey = async () => {
    try {
      const response = await fetch('/api/regenerate-apikey', { method: 'POST' })
      if (response.ok) {
        const { apiKey: newKey, error } = await response.json()
        if (error) {
          console.error('API key regeneration error:', error)
          alert('Failed to regenerate API key: ' + error)
        } else {
          setApiKey(newKey)
          setIsKeyMasked(false)
          alert('New API key generated and copied to clipboard!')
          navigator.clipboard.writeText(newKey)
        }
      } else {
        const error = await response.json()
        console.error('API key regeneration failed:', error)
        alert('Failed to regenerate API key: ' + error.error)
      }
    } catch (error) {
      console.error('Regeneration request failed:', error)
      alert('Error regenerating API key: ' + (error as Error).message)
    }
  }

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

  const handleCopyApiKey = () => {
    if (apiKey && !isKeyMasked) {
      navigator.clipboard.writeText(apiKey)
      alert('API key copied to clipboard!')
    } else {
      alert('Cannot copy masked key. Use Regenerate to get a new key.')
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
    return null // Router redirect handled in getUser
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
            className="dropdown-button r2552esf25_252trewt3erblueFontDocs"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            ▼
          </button>
        </div>
        {isDropdownOpen && (
          <div
          className="dropdown-menu"
          style={{
            boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
          }}
          >
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
      {apiKey && (
        <div className="api-key-section form-group">
          <label>{isKeyMasked ? t.apiKeyExists : t.apiKeyLabel}</label>
          <Input
            type="text"
            value={apiKey}
            readOnly
          />
          <Button className="copy-button r2552esf25_252trewt3erblueFontDocs" onClick={handleCopyApiKey}>
            Copy API Key
          </Button>
          <Button className="regenerate-button r2552esf25_252trewt3erblueFontDocs" onClick={handleRegenerateApiKey}>
            Regenerate
          </Button>
        </div>
      )}
      <button className="save-button" onClick={handleSave}>{t.saveButton}</button>
      <button className="form-group button r2552esf25_252trewt3er" onClick={() => router.push("/settings/password")}>
        {t.changePassword}
      </button>
    </div>
  )
}