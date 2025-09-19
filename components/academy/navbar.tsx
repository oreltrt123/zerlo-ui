"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AccountMenu from "@/components/account-menu";
import LanguageDropdown from "@/components/language-dropdown";
import type { User } from "@supabase/supabase-js";

// Translations for Navbar UI strings by language code
const translations: Record<string, {
  logo: string;
  academy: string;
  blog: string;
  about: string;
  features: string;
  login: string;
}> = {
  en: {
    logo: "Zerlo",
    academy: "Academy",
    blog: "Blog",
    about: "About",
    features: "Features",
    login: "Log In",
  },
  fr: {
    logo: "Zerlo",
    academy: "académie",
    blog: "Blog",
    about: "À propos",
    features: "Fonctionnalités",
    login: "Se connecter",
  },
  he: {
    logo: "זרלו",
    academy: "אקדמיה",
    blog: "בלוג",
    about: "אודות",
    features: "תכונות",
    login: "התחבר",
  },
  zh: {
    logo: "Zerlo",
    academy: "学院",
    blog: "博客",
    about: "关于",
    features: "功能",
    login: "登录",
  },
  ar: {
    logo: "زيرلو",
    academy: "أكاديمية",
    blog: "مدونة",
    about: "حول",
    features: "الميزات",
    login: "تسجيل الدخول",
  },
  ru: {
    logo: "Zerlo",
    academy: "академия",
    blog: "Блог",
    about: "О нас",
    features: "Функции",
    login: "Войти",
  },
  hi: {
    logo: "ज़रलो",
    academy: "अकादमी",
    blog: "ब्लॉग",
    about: "के बारे में",
    features: "विशेषताएँ",
    login: "लॉग इन",
  },
};

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function fetchUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setLanguage(user?.user_metadata?.language || "en");
      } catch (error) {
        console.error("Error fetching user:", error);
        setLanguage("en"); // Fallback to English
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const currentTexts = translations[language] || translations.en;

  if (loading) {
    return null; // Prevent rendering until user data is fetched
  }

  return (
    <nav className="fixed left-1/2 transform -translate-x-1/2 w-full z-50">
      <div className="backdrop-blur-md bg-none px-6 py-3 flex items-center justify-between relative">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl text-black font-sans font-light leading-relaxed max-w-3xl mx-auto text-center">
              {currentTexts.logo} <span className="text-[17px]">{currentTexts.academy}</span>
            </h1>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <LanguageDropdown
            user={user}
            currentLanguage={language}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          />
          {user ? (
            <AccountMenu
              user={user}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />
          ) : (
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 transition-all duration-200 hover:shadow-md"
            >
              <Link href="/login">{currentTexts.login}</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}