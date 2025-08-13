import { createClient } from '@/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AccountMenu from '@/components/account-menu';
import LanguageDropdown from '@/components/language-dropdown';

// Translations for Navbar UI strings by language code
const translations: Record<string, {
  logo: string;
  blog: string;
  about: string;
  features: string;
  login: string;
}> = {
  en: {
    logo: "Zerlo",
    blog: "Blog",
    about: "About",
    features: "Features",
    login: "Log In",
  },
  fr: {
    logo: "Zerlo",
    blog: "Blog",
    about: "À propos",
    features: "Fonctionnalités",
    login: "Se connecter",
  },
  he: {
    logo: "זרלו",
    blog: "בלוג",
    about: "אודות",
    features: "תכונות",
    login: "התחבר",
  },
  zh: {
    logo: "Zerlo",
    blog: "博客",
    about: "关于",
    features: "功能",
    login: "登录",
  },
  ar: {
    logo: "زيرلو",
    blog: "مدونة",
    about: "حول",
    features: "الميزات",
    login: "تسجيل الدخول",
  },
  ru: {
    logo: "Zerlo",
    blog: "Блог",
    about: "О нас",
    features: "Функции",
    login: "Войти",
  },
  hi: {
    logo: "ज़रलो",
    blog: "ब्लॉग",
    about: "के बारे में",
    features: "विशेषताएँ",
    login: "लॉग इन",
  },
};

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const language = user?.user_metadata?.language || "en"; // Fallback to English if no user or language
  const currentTexts = translations[language] || translations.en;

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <div className="bg-[#ffffff] backdrop-blur-md rounded-full px-6 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold relative top-[-2px] text-black/70 cursor-default">
              {currentTexts.logo}
            </h1>
          </Link>
        </div>

        {/* Centered Navigation Links */}
        <div className="flex-1 flex justify-center gap-6">
          <Link
            href="/"
            className="text-black/70 hover:text-black/60 font-medium transition-colors duration-200 cursor-default"
          >
            {currentTexts.blog}
          </Link>
          <Link
            href="/about"
            className="text-black/70 hover:text-black/60 font-medium transition-colors duration-200 cursor-default"
          >
            {currentTexts.about}
          </Link>
          <Link
            href="/features"
            className="text-black/70 hover:text-black/60 font-medium transition-colors duration-200 cursor-default"
          >
            {currentTexts.features}
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <LanguageDropdown user={user} currentLanguage={language} />
          {user ? (
            <AccountMenu user={user} />
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