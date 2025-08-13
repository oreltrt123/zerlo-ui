"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/supabase/client"
import { useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"
import "@/styles/button.css"

const styles = `
  .languages-settings {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }
  `

// Language codes and labels for selection
const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "ru", label: "Russian" },
  { code: "hi", label: "Hindi" },
  { code: "zh", label: "Chinese" },
  { code: "ar", label: "Arabic" },
  { code: "he", label: "Hebrew" },
]

// Translations for the page UI strings by language code
const translations: Record<string, { title: string; backButton: string }> = {
  en: { title: "Choose Language", backButton: "Back to Settings" },
  fr: { title: "Choisir la langue", backButton: "Retour aux paramètres" },
  ru: { title: "Выберите язык", backButton: "Вернуться к настройкам" },
  hi: { title: "भाषा चुनें", backButton: "सेटिंग्स पर वापस जाएं" },
  zh: { title: "选择语言", backButton: "返回设置" },
  ar: { title: "اختر اللغة", backButton: "العودة إلى الإعدادات" },
  he: { title: "בחר שפה", backButton: "חזור להגדרות" },
}

export default function LanguagesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Load user & saved language
  const getUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)
      if (user.user_metadata?.language) {
        setSelectedLanguage(user.user_metadata.language)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, router])

  useEffect(() => {
    getUser()
  }, [getUser])

  // Save new language both locally and on server
  const saveLanguage = async (languageCode: string) => {
    if (!user) return
    setSelectedLanguage(languageCode)

    const updatedMetadata = {
      ...user.user_metadata,
      language: languageCode,
    }

    const { data, error } = await supabase.auth.updateUser({
      data: updatedMetadata,
    })

    if (error) {
      console.error("Error updating language:", error)
    } else {
      setUser(data.user)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    )
  }

  // Get current translations for UI text
  const currentTexts = translations[selectedLanguage] || translations.en

  return (
    <div className="languages-settings">
    <style>{styles}</style>
      <h1 className="text-3xl font-bold mb-8 tracking-tight">{currentTexts.title}</h1>
      <div className="w-full max-w-md space-y-3">
        {languages.map(({ code, label }) => (
          <div
            key={code}
            className={`r2552esf25_252trewt3erblueFont p-4 rounded-lg cursor-default transition-all duration-200 text-center text-lg font-medium
              ${selectedLanguage === code 
                ? "bg-[#0099FF] text-white" 
                : "bg-[#8888881A] hover:bg-[#88888813]"}`}
            onClick={() => saveLanguage(code)}
          >
            {label}
          </div>
        ))}
        <button
        className="r2552esf25_252trewt3erblueFont px-6 py-3 bg-[#0099FF] rounded-lg text-white font-semibold transition-all duration-200"
        onClick={() => router.push("/settings")}
      >
        {currentTexts.backButton}
      </button>
      </div>
    </div>
  )
}
// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { createClient } from "@/supabase/client"
// import { useRouter } from "next/navigation"
// import { User } from "@supabase/supabase-js"

// const styles = `
//   .container {
//     min-height: 100vh;
//     background-color: #1a1a1a;
//     color: white;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     padding: 20px;
//   }
//   h1 {
//     margin-bottom: 20px;
//   }
//   .language-list {
//     width: 300px;
//     display: flex;
//     flex-direction: column;
//     gap: 10px;
//   }
//   .language-item {
//     background-color: #2a2a2a;
//     padding: 12px;
//     border-radius: 8px;
//     cursor: pointer;
//     text-align: center;
//     transition: background-color 0.2s ease;
//   }
//   .language-item:hover {
//     background-color: #333;
//   }
//   .language-item.selected {
//     background-color: #0066ff;
//     font-weight: bold;
//   }
//   button.back-button {
//     margin-top: 20px;
//     padding: 8px 16px;
//     background-color: #0066ff;
//     color: white;
//     border: none;
//     border-radius: 6px;
//     cursor: pointer;
//   }
// `

// // Language codes and labels for selection
// const languages = [
//   { code: "en", label: "English" },
//   { code: "fr", label: "French" },
//   { code: "ru", label: "Russian" },
//   { code: "hi", label: "Hindi" },
//   { code: "zh", label: "Chinese" },
//   { code: "ar", label: "Arabic" },
//   { code: "he", label: "Hebrew" },
// ]

// // Translations for the page UI strings by language code
// const translations: Record<string, { title: string; backButton: string }> = {
//   en: { title: "Choose Language", backButton: "Back to Settings" },
//   fr: { title: "Choisir la langue", backButton: "Retour aux paramètres" },
//   ru: { title: "Выберите язык", backButton: "Вернуться к настройкам" },
//   hi: { title: "भाषा चुनें", backButton: "सेटिंग्स पर वापस जाएं" },
//   zh: { title: "选择语言", backButton: "返回设置" },
//   ar: { title: "اختر اللغة", backButton: "العودة إلى الإعدادات" },
//   he: { title: "בחר שפה", backButton: "חזור להגדרות" },
// }

// export default function LanguagesPage() {
//   const [user, setUser] = useState<User | null>(null)
//   const [selectedLanguage, setSelectedLanguage] = useState<string>("en")
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()
//   const supabase = createClient()

//   // Load user & saved language
//   const getUser = useCallback(async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser()
//       if (!user) {
//         router.push("/login")
//         return
//       }
//       setUser(user)
//       if (user.user_metadata?.language) {
//         setSelectedLanguage(user.user_metadata.language)
//       }
//     } catch (error) {
//       console.error("Error fetching user:", error)
//     } finally {
//       setLoading(false)
//     }
//   }, [supabase, router])

//   useEffect(() => {
//     getUser()
//   }, [getUser])

//   // Save new language both locally and on server
//   const saveLanguage = async (languageCode: string) => {
//     if (!user) return
//     setSelectedLanguage(languageCode)

//     const updatedMetadata = {
//       ...user.user_metadata,
//       language: languageCode,
//     }

//     const { data, error } = await supabase.auth.updateUser({
//       data: updatedMetadata,
//     })

//     if (error) {
//       console.error("Error updating language:", error)
//     } else {
//       setUser(data.user)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="container">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//       </div>
//     )
//   }

//   // Get current translations for UI text
//   const currentTexts = translations[selectedLanguage] || translations.en

//   return (
//     <div className="container">
//       <style>{styles}</style>
//       <h1>{currentTexts.title}</h1>
//       <div className="language-list">
//         {languages.map(({ code, label }) => (
//           <div
//             key={code}
//             className={`language-item ${selectedLanguage === code ? "selected" : ""}`}
//             onClick={() => saveLanguage(code)}
//           >
//             {label}
//           </div>
//         ))}
//       </div>
//       <button className="back-button" onClick={() => router.push("/settings")}>
//         {currentTexts.backButton}
//       </button>
//     </div>
//   )
// }