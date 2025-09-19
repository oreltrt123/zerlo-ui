"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import "@/styles/dropdown.css";

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
      <button
        onClick={toggleDropdown}
        className="cursor-pointer hover:underline flex flex-wrap justify-start gap-x-6 gap-y-2 text-sm text-gray-700 font-medium"
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
      </button>
      {openDropdown === "language" && (
        <div
          className="absolute right-0 w-48 bg-white rounded-lg z-50"
          style={{
            boxShadow:
              "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
            top: "-200px", // Adjust this value to move the dropdown upward (e.g., negative offset)
          }}
        >
          <div className="menu_container_select_ui">
            {languages.map(({ code, label, flag }) => (
              <div
                key={code}
                onClick={() => saveLanguage(code)}
                className={`menu_item_select_ui ${
                  selectedLanguage === code
                    ? "text-white font-semibold"
                    : ""
                }`}
              >
                <Image
                  src={flag}
                  alt={`${label} flag`}
                  width={24}
                  height={24}
                  className="object-cover"
                />
                <span
                  className={`${
                    selectedLanguage === code
                      ? "text-white font-semibold"
                      : ""
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;