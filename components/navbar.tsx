"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import AccountMenu from "@/components/account-menu";
// import LanguageDropdown from "@/components/language-dropdown";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";

// Translations for Navbar UI strings by language code
const translations: Record<
  string,
  {
    logo: string;
    resources: string;
    blog: string;
    academy: string;
    about: string;
    features: string;
    login: string;
    community: string;
  }
> = {
  en: {
    logo: "Zerlo",
    resources: "Resources",
    blog: "Blog",
    academy: "Academy",
    about: "About",
    features: "Features",
    login: "Log In",
    community: "Community",
  },
  fr: {
    logo: "Zerlo",
    resources: "Ressources",
    blog: "Blog",
    academy: "Académie",
    about: "À propos",
    features: "Fonctionnalités",
    login: "Se connecter",
    community: "communauté",
  },
  he: {
    logo: "זרלו",
    resources: "משאבים",
    blog: "בלוג",
    academy: "אקדמיה",
    about: "אודות",
    features: "תכונות",
    login: "התחבר",
    community: "קהילה",
  },
  zh: {
    logo: "Zerlo",
    resources: "资源",
    blog: "博客",
    academy: "学院",
    about: "关于",
    features: "功能",
    login: "登录",
    community: "社区",
  },
  ar: {
    logo: "زيرلو",
    resources: "موارد",
    blog: "مدونة",
    academy: "أكاديمية",
    about: "حول",
    features: "الميزات",
    login: "تسجيل الدخول",
    community: "مجتمع",
  },
  ru: {
    logo: "Zerlo",
    resources: "Ресурсы",
    blog: "Блог",
    academy: "Академия",
    about: "О нас",
    features: "Функции",
    login: "Войти",
    community: "сообщество",
  },
  hi: {
    logo: "ज़रलो",
    resources: "संसाधन",
    blog: "ब्लॉग",
    academy: "अकादमी",
    about: "के बारे में",
    features: "विशेषताएँ",
    login: "लॉग इन",
    community: "समुदाय",
  },
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const getNavColor = (item: string) => {
    if (hoveredNavItem === null) return "text-black/70";
    if (hoveredNavItem === item) return "text-black";
    return "text-black/30";
  };

  if (loading) {
    return null; // Prevent rendering until user data is fetched
  }

  return (
    <nav className="fixed left-1/2 transform -translate-x-1/2 w-full z-50">
      <div className="backdrop-blur-md bg-[#cec2c20c] px-6 py-3 flex items-center justify-between relative">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/">
            <h1 className="flex items-center gap-2 text-2xl text-black font-sans font-light leading-relaxed">
              <Image
                src="/logo.png"
                alt="Zerlo Logo"
                width={50} // Normal size (adjust if needed)
                height={50}
                className="object-contain absolute"
              />
              <span className="relative left-[50px]">{currentTexts.logo}</span>
            </h1>
          </Link>
        </div>


        {/* Centered Navigation Links */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-6 items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem
                onMouseEnter={() => setHoveredNavItem("resources")}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                <NavigationMenuTrigger
                  className={`${getNavColor("resources")} font-sans font-light transition-colors duration-200 cursor-pointer`}
                >
                  {currentTexts.resources}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3">
                    <li>
                      <Link
                        href="/blog"
                        className="flex items-center gap-[10px] font-sans font-light select-none rounded-md px-3 py-2 text-lg text-black/70 hover:bg-gray-100 hover:text-black/60"
                      >
                        <Image
                          className="w-[24px] h-[24px]"
                          src="/assets/images/blog.png"
                          alt="test"
                          width={48}
                          height={48}
                        />
                        {currentTexts.blog}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/academy"
                        className="flex items-center gap-[10px] font-sans font-light select-none rounded-md px-3 py-2 text-lg text-black/70 hover:bg-gray-100 hover:text-black/60"
                      >
                        <Image
                          className="w-[24px] h-[24px]"
                          src="/assets/images/academy.png"
                          alt="test"
                          width={48}
                          height={48}
                        />
                        {currentTexts.academy}
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Link
            href="/about"
            onMouseEnter={() => setHoveredNavItem("about")}
            onMouseLeave={() => setHoveredNavItem(null)}
            className={`${getNavColor("about")} font-sans font-light transition-colors duration-200 cursor-pointer`}
          >
            {currentTexts.about}
          </Link>
          <Link
            href="/community"
            onMouseEnter={() => setHoveredNavItem("community")}
            onMouseLeave={() => setHoveredNavItem(null)}
            className={`${getNavColor("community")} font-sans font-light transition-colors duration-200 cursor-pointer`}
          >
            {currentTexts.community}
          </Link>
          <Link
            href="/features"
            onMouseEnter={() => setHoveredNavItem("features")}
            onMouseLeave={() => setHoveredNavItem(null)}
            className={`${getNavColor("features")} font-sans font-light transition-colors duration-200 cursor-pointer`}
          >
            {currentTexts.features}
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Social Media Buttons */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-black/70 hover:text-black/60 transition-colors duration-200 w-8 h-8"
              aria-label="Join our Discord"
            >
              <Link href="https://discord.gg/DD85kUZj" target="_blank" rel="noopener noreferrer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.385-.3934-.8748-.6063-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.032.0277C.5336 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.0991.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6061 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-black/70 hover:text-black/60 transition-colors duration-200 w-8 h-8"
              aria-label="View on GitHub"
            >
              <Link href="https://github.com/oreltrt123/zerlo-ui" target="_blank" rel="noopener noreferrer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 5.609-2.798 5.926-5.465 5.931.429.369.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-black/70 hover:text-black/60 transition-colors duration-200 w-8 h-8"
              aria-label="Follow us on LinkedIn"
            >
              <Link href="https://www.linkedin.com/in/zerlo-startup-38483b37a/" target="_blank" rel="noopener noreferrer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.02-3.06-1.867-3.06-1.867 0-2.153 1.459-2.153 2.966v5.698h-3v-11h2.879v1.504h.04c.401-.757 1.379-1.557 2.837-1.557 3.036 0 3.604 2 3.604 4.604v6.449z" />
                </svg>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-black/70 hover:text-black/60 transition-colors duration-200 w-8 h-8"
              aria-label="Follow us on X"
            >
              <Link href="https://x.com/zerlo_online" target="_blank" rel="noopener noreferrer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </Button>
          </div>
          {/* <LanguageDropdown
            user={user}
            currentLanguage={language}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          /> */}
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