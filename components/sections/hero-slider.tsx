"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";

// Translations for HeroSlider UI strings by language code
const translations: Record<string, {
  heading: string;
  description: string;
  linkText: string;
  placeholder: string;
  suggestions: string[];
}> = {
  en: {
    heading: "AI chat that creates magic",
    description: "Describe the game you want to build and the elements and start publishing.",
    linkText: "Start building your game &rarr;",
    placeholder: "Share your game idea — start creating, playing, and publishing!",
    suggestions: [
      "Reporting Dashboard",
      "Gaming Platform",
      "Onboarding Portal",
      "Networking App",
    ],
  },
  fr: {
    heading: "Le chat IA construit un jeu",
    description: "Décrivez votre idée de jeu dans le chat, et regardez l'IA la transformer en une expérience jouable. Concevez, codez et testez — tout en un seul endroit.",
    linkText: "Commencez à créer votre jeu &rarr;",
    placeholder: "Partagez votre idée de jeu — commencez à créer, jouer et publier !",
    suggestions: [
      "Tableau de bord de rapports",
      "Plateforme de jeu",
      "Portail d'intégration",
      "Application de réseautage",
    ],
  },
  he: {
    heading: "צ'אט AI בונה משחק",
    description: "תאר את רעיון המשחק שלך בצ'אט, וצפה כיצד AI הופך אותו לחוויה שניתן לשחק בה. עצב, קוד ובדוק — הכל במקום אחד.",
    linkText: "התחל לבנות את המשחק שלך &larr;",
    placeholder: "שתף את רעיון המשחק שלך — התחל ליצור, לשחק ולפרסם!",
    suggestions: [
      "לוח דוחות",
      "פלטפורמת משחקים",
      "פורטל קליטה",
      "אפליקציית רשתות",
    ],
  },
  zh: {
    heading: "AI聊天构建游戏",
    description: "在聊天中描述您的游戏创意，观看AI将其转变为可玩的体验。设计、编码和测试 — 一切都在一个地方。",
    linkText: "开始构建您的游戏 &rarr;",
    placeholder: "分享您的游戏创意 — 开始创建、玩耍和发布！",
    suggestions: [
      "报告仪表板",
      "游戏平台",
      "入职门户",
      "社交网络应用",
    ],
  },
  ar: {
    heading: "الدردشة بالذكاء الاصطناعي تبني لعبة",
    description: "صف فكرة لعبتك في الدردشة، وشاهد الذكاء الاصطناعي يحولها إلى تجربة قابلة للعب. صمم، برمج، واختبر — كل ذلك في مكان واحد.",
    linkText: "ابدأ ببناء لعبتك &larr;",
    placeholder: "شارك فكرة لعبتك — ابدأ في الإنشاء واللعب والنشر!",
    suggestions: [
      "لوحة تقارير",
      "منصة ألعاب",
      "بوابة التأهيل",
      "تطبيق التواصل",
    ],
  },
  ru: {
    heading: "Чат с ИИ создает игру",
    description: "Опишите идею игры в чате и наблюдайте, как ИИ превращает ее в игровой опыт. Проектируйте, программируйте и тестируйте — все в одном месте.",
    linkText: "Начните создавать свою игру &rarr;",
    placeholder: "Поделитесь идеей игры — начните создавать, играть и публиковать!",
    suggestions: [
      "Панель отчетов",
      "Игровая платформа",
      "Портал для новичков",
      "Сетевое приложение",
    ],
  },
  hi: {
    heading: "AI चैट गेम बनाता है",
    description: "चैट में अपनी गेम आइडिया का वर्णन करें, और देखें कि AI इसे एक खेलने योग्य अनुभव में कैसे बदलता है। डिज़ाइन करें, कोड करें और टेस्ट करें — सब कुछ एक ही जगह पर।",
    linkText: "अपना गेम बनाना शुरू करें &rarr;",
    placeholder: "अपना गेम आइडिया साझा करें — बनाना, खेलना और प्रकाशित करना शुरू करें!",
    suggestions: [
      "रिपोर्टिंग डैशबोर्ड",
      "गेमिंग प्लेटफॉर्म",
      "ऑनबोर्डिंग पोर्टल",
      "नेटवर्किंग ऐप",
    ],
  },
};

export default function HeroSlider() {
  const [, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState("en");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const getUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLanguage("en"); // Fallback to English if no user
      } else {
        setUser(user);
        setLanguage(user.user_metadata?.language || "en");
      }
    } catch (error) {
      console.error("Error getting user:", error);
      setLanguage("en"); // Fallback to English on error
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const currentTexts = translations[language] || translations.en;

  return (
    <div className="max-w-[1380px] mx-auto p-4 lg:p-8">
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg overflow-hidden">
        {/* Image & Input Section */}
        <div className="w-full md:w-1/2 lg:w-3/4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
            className="bg-white rounded-xl p-6"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={currentTexts.placeholder}
                  className="w-full p-3 border rounded-md text-black placeholder-gray-400 focus:outline-none h-[120px] resize-none"
                />
                <Link href="/chat">
                  <button
                    className="absolute right-[17px] p-2 bg-[rgb(0,153,255)] text-white rounded-full hover:bg-[rgba(0,153,255,0.83)] transition-colors"
                    style={{ marginTop: "20px" }}
                  >
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
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </Link>
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                {currentTexts.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputValue(suggestion)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10">
          <h2 className="text-4xl text-gray-900 font-sans font-light leading-relaxed max-w-3xl mx-auto">
            {currentTexts.heading}
          </h2>
          <p className="text-gray-600 mb-6">
            {currentTexts.description}
          </p>
          <Link href="/chat" className="text-[rgb(0,153,255)] hover:underline font-medium">
            {currentTexts.linkText}
          </Link>
        </div>
      </div>
    </div>
  );
}