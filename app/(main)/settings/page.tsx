"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import "@/styles/input.css";
import "@/styles/button.css"

// Define the type for translations
interface Translations {
  title: string;
  privacy: string;
  terms: string;
  changeLanguage: string;
  logout: string;
}

// Translations for settings page
const translations: Record<string, Translations> = {
  en: {
    title: "Settings",
    privacy: "Privacy",
    terms: "Terms of Service",
    changeLanguage: "Change Language",
    logout: "Log Out",
  },
  fr: {
    title: "Paramètres",
    privacy: "Confidentialité",
    terms: "Conditions d'utilisation",
    changeLanguage: "Changer de langue",
    logout: "Se déconnecter",
  },
  ru: {
    title: "Настройки",
    privacy: "Конфиденциальность",
    terms: "Условия обслуживания",
    changeLanguage: "Сменить язык",
    logout: "Выйти",
  },
  hi: {
    title: "सेटिंग्स",
    privacy: "गोपनीयता",
    terms: "सेवा की शर्तें",
    changeLanguage: "भाषा बदलें",
    logout: "लॉग आउट",
  },
  zh: {
    title: "设置",
    privacy: "隐私",
    terms: "服务条款",
    changeLanguage: "更改语言",
    logout: "登出",
  },
  ar: {
    title: "الإعدادات",
    privacy: "الخصوصية",
    terms: "شروط الخدمة",
    changeLanguage: "تغيير اللغة",
    logout: "تسجيل الخروج",
  },
  he: {
    title: "הגדרות",
    privacy: "פרטיות",
    terms: "תנאי שירות",
    changeLanguage: "שנה שפה",
    logout: "התנתק",
  },
};

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
    cursor: default;
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
`;

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");
  const router = useRouter();
  const supabase = createClient();

  const getUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setLanguage(user.user_metadata?.language || "en");
    } catch (error) {
      console.error("Error getting user:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleAccountSettings = () => router.push("/settings/account");
  const handlePrivacy = () => router.push("/legal/privacy");
  const handleTerms = () => router.push("/legal/terms");
  const handleChangeLanguage = () => router.push("/settings/languages");
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const t = translations[language] || translations.en;

  return (
    <div className="settings-container">
      <style>{styles}</style>
      <h1 className="settings-title">{t.title}</h1>

      <div className="settings-item r2552esf25_252trewt3erblueFont bg-[#8888881A] hover:bg-[#88888813]" onClick={handleAccountSettings}>
        <div className="icon">
          {user?.user_metadata?.avatar_url ? (
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
        <span>{user?.user_metadata?.full_name || user?.email}</span>
      </div>

      <div className="settings-item r2552esf25_252trewt3erblueFont bg-[#8888881A] hover:bg-[#88888813]" onClick={handlePrivacy}>
        <span>{t.privacy}</span>
      </div>

      <div className="settings-item r2552esf25_252trewt3erblueFont bg-[#8888881A] hover:bg-[#88888813]" onClick={handleTerms}>
        <span>{t.terms}</span>
      </div>

      <div className="settings-item r2552esf25_252trewt3erblueFont bg-[#8888881A] hover:bg-[#88888813]" onClick={handleChangeLanguage}>
        <span>{t.changeLanguage}</span>
      </div>

      <div className="settings-item r2552esf25_252trewt3erblueFont bg-[#8888881A] hover:bg-[#88888813]" onClick={handleLogout}>
        <span>{t.logout}</span>
      </div>
    </div>
  );
}