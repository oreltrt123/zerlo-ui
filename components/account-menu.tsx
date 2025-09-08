"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Translations for AccountMenu UI strings by language code
const translations: Record<string, {
  chat: string;
  logout: string;
  settings: string;
}> = {
  en: {
    chat: "Chat",
    logout: "Log out",
    settings: "Settings",
  },
  fr: {
    chat: "Chat",
    logout: "Se déconnecter",
    settings: "Paramètres",
  },
  he: {
    chat: "צ'אט",
    logout: "התנתק",
    settings: "הגדרות",
  },
  zh: {
    chat: "聊天",
    logout: "登出",
    settings: "设置",
  },
  ar: {
    chat: "الدردشة",
    logout: "تسجيل الخروج",
    settings: "الإعدادات",
  },
  ru: {
    chat: "Чат",
    logout: "Выйти",
    settings: "Настройки",
  },
  hi: {
    chat: "चैट",
    logout: "लॉग आउट",
    settings: "सेटिंग्स",
  },
};

interface AccountMenuProps {
  user: User | null;
  openDropdown: string | null;
  setOpenDropdown: (dropdown: string | null) => void;
}

export default function AccountMenu({ user, openDropdown, setOpenDropdown }: AccountMenuProps) {
  const supabase = createClient();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    async function getProfile() {
      if (!user || !user.id) {
        console.warn("No user or user ID provided.");
        setLanguage("en"); // Fallback to English
        return;
      }

      try {
        const { data, error, status } = await supabase
          .from("profiles")
          .select("username, avatar_url, language")
          .eq("id", user.id)
          .maybeSingle();

        console.log("Supabase profile fetch response:", { data, error, status });

        if (error && status !== 406) {
          console.warn("Supabase error:", error.message, "status:", status);
          setLanguage("en"); // Fallback to English on error
          return;
        }

        if (data) {
          setUsername(data.username || null);
          setAvatarUrl(data.avatar_url || null);
          setLanguage(data.language || user.user_metadata?.language || "en");
        } else {
          console.warn("No profile data found for user.id:", user.id);
          setLanguage(user.user_metadata?.language || "en");
        }
      } catch (error) {
        console.error("Unexpected error fetching profile:", error);
        setAvatarUrl(user.user_metadata?.avatar_url || null); // Fallback to metadata avatar
        setLanguage("en"); // Fallback to English on error
      }
    }

    getProfile();
  }, [user, supabase]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      router.push("/login");
      router.refresh();
    }
  };

  const currentTexts = translations[language] || translations.en;

  const toggleDropdown = () => {
    if (typeof setOpenDropdown === "function") {
      setOpenDropdown(openDropdown === "account" ? null : "account");
    } else {
      console.error("setOpenDropdown is not a function");
    }
  };

  return (
    <div className="relative">
      <Avatar
        className="h-8 w-8 text-black/70 border-none cursor-pointer"
        onClick={toggleDropdown}
      >
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={username || "User Avatar"} />
        ) : (
          <AvatarImage
            src={user?.user_metadata?.avatar_url || `https://avatar.vercel.sh/${user?.email || 'default'}`}
            style={{ borderRadius: "100%" }}
            alt={user?.email || "User"}
          />
        )}
      </Avatar>
      {openDropdown === "account" && (
        <div
          className="absolute right-0 w-48 bg-white rounded-lg z-50"
          style={{
            boxShadow:
              "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
          }}
        >
          <div className="py-2">
            <Link
              href="/chat"
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={() => setOpenDropdown(null)}
            >
              <UserIcon className="h-4 w-4 text-gray-700" />
              {currentTexts.chat}
            </Link>
            <Link href="/settings">
              <div
                onClick={() => setOpenDropdown(null)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              >
                <Settings className="h-4 w-4 text-gray-700" />
                {currentTexts.settings}
              </div>
            </Link>
            <div
              onClick={() => {
                setOpenDropdown(null);
                handleSignOut();
              }}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              <LogOut className="h-4 w-4 text-gray-700" />
              {currentTexts.logout}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}