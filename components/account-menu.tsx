"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Translations for AccountMenu UI strings by language code
const translations: Record<string, {
  chat: string;
  logout: string;
}> = {
  en: {
    chat: "Chat",
    logout: "Log out",
  },
  fr: {
    chat: "Chat",
    logout: "Se déconnecter",
  },
  he: {
    chat: "צ'אט",
    logout: "התנתק",
  },
  zh: {
    chat: "聊天",
    logout: "登出",
  },
  ar: {
    chat: "الدردشة",
    logout: "تسجيل الخروج",
  },
  ru: {
    chat: "Чат",
    logout: "Выйти",
  },
  hi: {
    chat: "चैट",
    logout: "लॉग आउट",
  },
};

interface AccountMenuProps {
  user: User | null;
}

export default function AccountMenu({ user }: AccountMenuProps) {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-8 w-8">
          <Avatar className="h-8 w-8 text-black/70">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={username || "User Avatar"} />
            ) : (
              <AvatarFallback>
                <Image
                  src="/assets/images/user.png"
                  alt="Default User Avatar"
                  width={23}
                  height={23}
                  className="w-[23px]"
                />
              </AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36 relative top-[-15px]" align="end" forceMount>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/chat">
            <UserIcon className="mr-2 h-4 w-4 text-white" />
            <span>{currentTexts.chat}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4 text-white" />
          <span>{currentTexts.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}