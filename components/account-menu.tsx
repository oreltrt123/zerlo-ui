"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/dropdown.css";

const translations: Record<
  string,
  { chat: string; logout: string; settings: string }
> = {
  en: { chat: "Chat", logout: "Log out", settings: "Settings" },
  fr: { chat: "Chat", logout: "Se déconnecter", settings: "Paramètres" },
  he: { chat: "צ'אט", logout: "התנתק", settings: "הגדרות" },
  zh: { chat: "聊天", logout: "登出", settings: "设置" },
  ar: { chat: "الدردشة", logout: "تسجيل الخروج", settings: "الإعدادات" },
  ru: { chat: "Чат", logout: "Выйти", settings: "Настройки" },
  hi: { chat: "चैट", logout: "लॉग आउट", settings: "सेटिंग्स" },
};

interface AccountMenuProps {
  user: User | null;
  openDropdown: string | null;
  setOpenDropdown: (dropdown: string | null) => void;
}

export default function AccountMenu({
  user,
  openDropdown,
  setOpenDropdown,
}: AccountMenuProps) {
  const supabase = createClient();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    async function getProfile() {
      if (!user?.id) return;

      const { data } = await supabase
        .from("profiles")
        .select("username, avatar_url, language")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setUsername(data.username || null);
        setAvatarUrl(data.avatar_url || null);
        setLanguage(data.language || user.user_metadata?.language || "en");
      } else {
        setLanguage(user?.user_metadata?.language || "en");
      }
    }

    getProfile();
  }, [user, supabase]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/login");
      router.refresh();
    }
  };

  const currentTexts = translations[language] || translations.en;

  const toggleDropdown = () => {
    setOpenDropdown(openDropdown === "account" ? null : "account");
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
            src={
              user?.user_metadata?.avatar_url ||
              `https://avatar.vercel.sh/${user?.email || "default"}`
            }
            alt={user?.email || "User"}
            style={{ borderRadius: "100%" }}
          />
        )}
      </Avatar>

      {openDropdown === "account" && (
        <div className="menu_container_Account">
          <div className="">
            <Link
              href="/chat"
              className="menu_item_Account hover:bg-[#0099FF] hover:text-white"
              onClick={() => setOpenDropdown(null)}
            >
              <UserIcon className="h-4 w-4" />
              <span>{currentTexts.chat}</span>
            </Link>

            <Link
              href="/settings"
              className="menu_item_Account hover:bg-[#0099FF] hover:text-white"
              onClick={() => setOpenDropdown(null)}
            >
              <Settings className="h-4 w-4" />
              <span>{currentTexts.settings}</span>
            </Link>

            <div
              onClick={() => {
                setOpenDropdown(null);
                handleSignOut();
              }}
              className="menu_item_Account hover:bg-[#0099FF] hover:text-white cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>{currentTexts.logout}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
