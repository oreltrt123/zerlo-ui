"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import type { User } from "@supabase/supabase-js"
// import Image from "next/image"
import "@/styles/input.css"
import "@/styles/button.css"
import PremiumModal from "@/components/stripe/premium-modal"

// Define the type for translations
interface Translations {
  title: string
  privacy: string
  terms: string
  changeLanguage: string
  logout: string
  premium: string
  premiumTitle: string
  premiumDescription: string
  monthlyPrice: string
  subscribe: string
  cancel: string
  processing: string
  error: string
  success: string
  free: string
  premiumStatus: string
}

// Translations for settings page
const translations: Record<string, Translations> = {
  en: {
    title: "Settings",
    privacy: "Privacy",
    terms: "Terms of Service",
    changeLanguage: "Change Language",
    logout: "Log Out",
    premium: "Premium",
    premiumTitle: "Upgrade to Premium",
    premiumDescription: "Get access to premium features with our monthly subscription",
    monthlyPrice: "$10/month",
    subscribe: "Subscribe Now",
    cancel: "Cancel",
    processing: "Processing...",
    error: "Payment failed. Please try again.",
    success: "Successfully subscribed to Premium!",
    free: "Free",
    premiumStatus: "Premium",
  },
  fr: {
    title: "Paramètres",
    privacy: "Confidentialité",
    terms: "Conditions d'utilisation",
    changeLanguage: "Changer de langue",
    logout: "Se déconnecter",
    premium: "Premium",
    premiumTitle: "Passer à Premium",
    premiumDescription: "Accédez aux fonctionnalités premium avec notre abonnement mensuel",
    monthlyPrice: "10$/mois",
    subscribe: "S'abonner maintenant",
    cancel: "Annuler",
    processing: "Traitement...",
    error: "Échec du paiement. Veuillez réessayer.",
    success: "Abonnement Premium réussi!",
    free: "Gratuit",
    premiumStatus: "Premium",
  },
  ru: {
    title: "Настройки",
    privacy: "Конфиденциальность",
    terms: "Условия обслуживания",
    changeLanguage: "Сменить язык",
    logout: "Выйти",
    premium: "Премиум",
    premiumTitle: "Обновить до Премиум",
    premiumDescription: "Получите доступ к премиум функциям с нашей месячной подпиской",
    monthlyPrice: "$10/месяц",
    subscribe: "Подписаться сейчас",
    cancel: "Отмена",
    processing: "Обработка...",
    error: "Ошибка платежа. Попробуйте снова.",
    success: "Успешно подписались на Премиум!",
    free: "Бесплатно",
    premiumStatus: "Премиум",
  },
  hi: {
    title: "सेटिंग्स",
    privacy: "गोपनीयता",
    terms: "सेवा की शर्तें",
    changeLanguage: "भाषा बदलें",
    logout: "लॉग आउट",
    premium: "प्रीमियम",
    premiumTitle: "प्रीमियम में अपग्रेड करें",
    premiumDescription: "हमारी मासिक सदस्यता के साथ प्रीमियम सुविधाओं का उपयोग करें",
    monthlyPrice: "$10/महीना",
    subscribe: "अभी सब्सक्राइब करें",
    cancel: "रद्द करें",
    processing: "प्रसंस्करण...",
    error: "भुगतान असफल। कृपया पुनः प्रयास करें।",
    success: "प्रीमियम की सफल सदस्यता!",
    free: "मुफ्त",
    premiumStatus: "प्रीमियम",
  },
  zh: {
    title: "设置",
    privacy: "隐私",
    terms: "服务条款",
    changeLanguage: "更改语言",
    logout: "登出",
    premium: "高级版",
    premiumTitle: "升级到高级版",
    premiumDescription: "通过我们的月度订阅获得高级功能",
    monthlyPrice: "$10/月",
    subscribe: "立即订阅",
    cancel: "取消",
    processing: "处理中...",
    error: "支付失败。请重试。",
    success: "成功订阅高级版！",
    free: "免费",
    premiumStatus: "高级版",
  },
  ar: {
    title: "الإعدادات",
    privacy: "الخصوصية",
    terms: "شروط الخدمة",
    changeLanguage: "تغيير اللغة",
    logout: "تسجيل الخروج",
    premium: "بريميوم",
    premiumTitle: "الترقية إلى بريميوم",
    premiumDescription: "احصل على الوصول إلى الميزات المميزة مع اشتراكنا الشهري",
    monthlyPrice: "$10/شهر",
    subscribe: "اشترك الآن",
    cancel: "إلغاء",
    processing: "جاري المعالجة...",
    error: "فشل الدفع. يرجى المحاولة مرة أخرى.",
    success: "تم الاشتراك في بريميوم بنجاح!",
    free: "مجاني",
    premiumStatus: "بريميوم",
  },
  he: {
    title: "הגדרות",
    privacy: "פרטיות",
    terms: "תנאי שירות",
    changeLanguage: "שנה שפה",
    logout: "התנתק",
    premium: "פרימיום",
    premiumTitle: "שדרג לפרימיום",
    premiumDescription: "קבל גישה לתכונות פרימיום עם המנוי החודשי שלנו",
    monthlyPrice: "$10/חודש",
    subscribe: "הירשם עכשיו",
    cancel: "ביטול",
    processing: "מעבד...",
    error: "התשלום נכשל. אנא נסה שוב.",
    success: "נרשמת בהצלחה לפרימיום!",
    free: "חינם",
    premiumStatus: "פרימיום",
  },
}

const styles = `
  .settings-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
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
    border-radius: 8px;
    margin-bottom: 10px;
    cursor: pointer;
    padding: 10px;
    transition: background-color 0.2s ease;
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

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    padding: 24px;
    width: 50%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .modal-header {
    text-align: center;
    margin-bottom: 20px;
  }

  .modal-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .modal-description {
    color: #666;
    margin-bottom: 20px;
  }

  .price-display {
    font-size: 32px;
    font-weight: bold;
    color: #007bff;
    text-align: center;
    margin: 20px 0;
  }

  .modal-buttons {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .modal-button {
    flex: 1;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .primary-button {
    background-color: #007bff;
    color: white;
  }

  .primary-button:hover:not(:disabled) {
    background-color: #0056b3;
  }

  .primary-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .secondary-button {
    background-color: #f8f9fa;
    color: #333;
    border: 1px solid #dee2e6;
  }

  .secondary-button:hover {
    background-color: #e9ecef;
  }

  .error-message {
    color: #dc3545;
    text-align: center;
    margin-top: 12px;
    font-size: 14px;
  }

  .success-message {
    color: #28a745;
    text-align: center;
    margin-top: 12px;
    font-size: 14px;
  }

  .user-status {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 12px;
    margin-left: 8px;
    font-weight: 600;
  }

  .status-premium {
    background-color: #ffd700;
    color: #b8860b;
  }

  .status-free {
    background-color: #e9ecef;
    color: #6c757d;
  }
`

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState("en")
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const getUser = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)
      setLanguage(user.user_metadata?.language || "en")
      // Check premium status
      await checkPremiumStatus(user.id)
    } catch (error) {
      console.error("Error getting user:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, router])

  const checkPremiumStatus = async (userId: string) => {
    try {
      const response = await fetch("/api/check-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })
      if (response.ok) {
        const data = await response.json()
        setIsPremium(data.isPremium)
        console.log("Premium status checked:", data.isPremium)
      }
    } catch (error) {
      console.error("Error checking premium status:", error)
    }
  }

  useEffect(() => {
    getUser()
  }, [getUser])

  const handleAccountSettings = () => router.push("/settings/account")
  const handlePrivacy = () => router.push("/legal/privacy")
  const handleTerms = () => router.push("/legal/terms")
  const handleChangeLanguage = () => router.push("/settings/languages")

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const handlePremiumClick = () => {
    console.log("Opening Premium Modal, isPremium:", isPremium)
    setShowPremiumModal(true)
  }

  const closeModal = () => {
    console.log("Closing Premium Modal")
    setShowPremiumModal(false)
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
    <div className="settings-container">
      <style>{styles}</style>
      <h1 className="settings-title">{t.title}</h1>

      <div
        className="settings-item r2552esf25_252trewt3erblueFont bg-[#8888881A] hover:bg-[#88888813]"
        onClick={handleAccountSettings}
      >
        {/* <div className="icon">
          {user?.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url || "/placeholder.svg"}
              alt="Profile"
              className="profile-pic"
              width={24}
              height={24}
            />
          ) : (
            <div className="profile-pic"></div>
          )}
        </div> */}
        <span>{user?.user_metadata?.full_name || user?.email}</span>
        <span className={`user-status ${isPremium ? "status-premium" : "status-free"}`}>
          {isPremium ? t.premiumStatus : t.free}
        </span>
      </div>

      <div
        className="settings-item r2552esf25_252trewt3erblueFont bg-[#8888881A] hover:bg-[#88888813]"
        onClick={handlePremiumClick}
      >
        <span>{t.premium}</span>
      </div>

      <div
        className="settings-item r2552esf25_252trewt3erblueFont bg-[#8888881A] hover:bg-[#88888813]"
        onClick={handlePrivacy}
      >
        <span>{t.privacy}</span>
      </div>

      <div
        className="settings-item r2552esf25_252trewt3erblueFont bg-[#8888881A] hover:bg-[#88888813]"
        onClick={handleTerms}
      >
        <span>{t.terms}</span>
      </div>

      <div
        className="settings-item r2552esf25_252trewt3erblueFont bg-[#8888881A] hover:bg-[#88888813]"
        onClick={handleChangeLanguage}
      >
        <span>{t.changeLanguage}</span>
      </div>

      <div
        className="settings-item r2552esf25_252trewt3erblueFont bg-[#8888881A] hover:bg-[#88888813]"
        onClick={handleLogout}
      >
        <span>{t.logout}</span>
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closeModal}
        user={user}
        translations={t}
        subscriptionStatus={isPremium ? "premium" : "free"}
      />
    </div>
  )
}