"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Language codes, labels, and flag URLs for selection
const languages = [
  { code: "en", label: "English", flag: "/assets/images/language/usa.png" },
  { code: "fr", label: "French", flag: "/assets/images/language/france.png" },
  { code: "ru", label: "Russian", flag: "/assets/images/language/russia.png" },
  { code: "hi", label: "Hindi", flag: "/assets/images/language/india.png" },
  { code: "zh", label: "Chinese", flag: "/assets/images/language/china.png" },
  { code: "ar", label: "Arabic", flag: "/assets/images/language/arabic.png" },
  { code: "he", label: "Hebrew", flag: "/assets/images/language/israel.png" },
];

interface LanguageDropdownProps {
  user: User | null;
  currentLanguage: string;
  openDropdown: string | null;
  setOpenDropdown: (dropdown: string | null) => void;
}

const LanguageDropdown = ({ user, currentLanguage, openDropdown, setOpenDropdown }: LanguageDropdownProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const supabase = createClient();

  // Sync selected language with currentLanguage prop
  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  // Save new language to Supabase
  const saveLanguage = useCallback(
    async (languageCode: string) => {
      if (!user) return;
      setSelectedLanguage(languageCode);
      setOpenDropdown(null);

      const updatedMetadata = {
        ...user.user_metadata,
        language: languageCode,
      };

      const { error } = await supabase.auth.updateUser({
        data: updatedMetadata,
      });

      if (error) {
        console.error("Error updating language:", error);
      } else {
        // Trigger page reload to apply language change
        window.location.reload();
      }
    },
    [user, supabase, setOpenDropdown]
  );

  const toggleDropdown = () => {
    if (typeof setOpenDropdown === "function") {
      setOpenDropdown(openDropdown === "language" ? null : "language");
    } else {
      console.error("setOpenDropdown is not a function");
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={toggleDropdown}
        variant={'blueFont'}
      >
        <span>{languages.find(lang => lang.code === selectedLanguage)?.label || "Language"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </Button>
      {openDropdown === "language" && (
        <div
          className="absolute right-0 w-48 bg-white rounded-lg z-50"
          style={{
            boxShadow:
              "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
          }}
        >
          <div className="py-2">
            {languages.map(({ code, label, flag }) => (
              <div
                key={code}
                onClick={() => saveLanguage(code)}
                className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2 ${
                  selectedLanguage === code ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                <Image
                  src={flag}
                  alt={`${label} flag`}
                  width={24} // Matches w-6 (6 * 4 = 24px)
                  height={24} // Matches h-6 (6 * 4 = 24px)
                  className="object-cover" // Ensure the image fits nicely
                />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;