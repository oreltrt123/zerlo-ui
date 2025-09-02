"use client";

import { motion } from "framer-motion";
import "@/styles/button.css"
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

// Translations for HeroSection UI strings by language code
const translations: Record<string, {
  title: string;
  subtitle: string;
  placeholder: string;
  suggestions: string[];
  watchDemo: string;
}> = {
  en: {
    title: "Zerlo – Build <span style=\"color: rgb(0,153,255)\">Games</span> Smarter with AI",
    subtitle: "Create professional <span style=\"color: rgb(0,153,255)\">games in one</span> seamless format",
    placeholder: "Share your game idea — start creating, playing, and publishing!",
    suggestions: [
      "Reporting Dashboard",
      "Gaming Platform",
      "Onboarding Portal",
    ],
    watchDemo: "Watch Demo",
  },
  fr: {
    title: "Zerlo – Créez des <span style=\"color: rgb(0,153,255)\">jeux</span> plus intelligemment avec l'IA",
    subtitle: "Créez des <span style=\"color: rgb(0,153,255)\">jeux professionnels</span> dans un format fluide",
    placeholder: "Partagez votre idée de jeu — commencez à créer, jouer et publier !",
    suggestions: [
      "Tableau de bord de rapports",
      "Plateforme de jeu",
      "Portail d'intégration",
    ],
    watchDemo: "Regarder la démo",
  },
  he: {
    title: "זרלו – בנה <span style=\"color: rgb(0,153,255)\">משחקים</span> בצורה חכמה יותר עם AI",
    subtitle: "צור <span style=\"color: rgb(0,153,255)\">משחקים מקצועיים</span> בפורמט חלק אחד",
    placeholder: "שתף את רעיון המשחק שלך — התחל ליצור, לשחק ולפרסם!",
    suggestions: [
      "לוח דוחות",
      "פלטפורמת משחקים",
      "פורטל קליטה",
    ],
    watchDemo: "צפה בדמו",
  },
  zh: {
    title: "Zerlo – 使用人工智能更智能地<span style=\"color: rgb(0,153,255)\">构建游戏</span>",
    subtitle: "在一个无缝的格式中创建<span style=\"color: rgb(0,153,255)\">专业游戏</span>",
    placeholder: "分享您的游戏创意 — 开始创建、玩耍和发布！",
    suggestions: [
      "报告仪表板",
      "游戏平台",
      "入职门户",
    ],
    watchDemo: "观看演示",
  },
  ar: {
    title: "زيرلو – قم ببناء <span style=\"color: rgb(0,153,255)\">الألعاب</span> بذكاء مع الذكاء الاصطناعي",
    subtitle: "قم بإنشاء <span style=\"color: rgb(0,153,255)\">ألعاب احترافية</span> في تنسيق سلس واحد",
    placeholder: "شارك فكرة لعبتك — ابدأ في الإنشاء واللعب والنشر!",
    suggestions: [
      "لوحة تقارير",
      "منصة ألعاب",
      "بوابة التأهيل",
    ],
    watchDemo: "شاهد العرض التوضيحي",
  },
  ru: {
    title: "Zerlo – Создавайте <span style=\"color: rgb(0,153,255)\">игры</span> умнее с помощью ИИ",
    subtitle: "Создавайте <span style=\"color: rgb(0,153,255)\">профессиональные игры</span> в одном удобном формате",
    placeholder: "Поделитесь идеей игры — начните создавать, играть и публиковать!",
    suggestions: [
      "Панель отчетов",
      "Игровая платформа",
      "Портал для новичков",
    ],
    watchDemo: "Смотреть демо",
  },
  hi: {
    title: "ज़रलो – AI के साथ <span style=\"color: rgb(0,153,255)\">गेम्स</span> को और स्मार्ट बनाएं",
    subtitle: "एक सहज प्रारूप में <span style=\"color: rgb(0,153,255)\">पेशेवर गेम्स</span> बनाएं",
    placeholder: "अपना गेम आइडिया साझा करें — बनाना, खेलना और प्रकाशित करना शुरू करें!",
    suggestions: [
      "रिपोर्टिंग डैशबोर्ड",
      "गेमिंग प्लेटफॉर्म",
      "ऑनबोर्डिंग पोर्टल",
    ],
    watchDemo: "डेमो देखें",
  },
};


export default function HeroSection() {
  const [, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState("en");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

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
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
style={{
  backgroundSize: "100% auto", // full width, auto height
  backgroundPosition: "center -130px", // move image down
  backgroundRepeat: "no-repeat",
  backgroundImage: 'url("/bg__.png")'
}}
    >
      <div className="z-10">

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-20 text-center top-[-90px]">
          <div className="max-w-2xl mx-auto space-y-6">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl tracking-tight text-black"
              dangerouslySetInnerHTML={{ __html: currentTexts.title }}
            />
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
  className="bg-[#ffffffea] rounded-lg p-4 border border-[#0099ff21]
    w-[500px] max-w-full mx-auto"
>
  <div className="space-y-3">
    {/* Textarea + Submit */}
    <div className="relative">
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={currentTexts.placeholder}
        className="w-full p-2 rounded-md text-sm text-gray-800 
          placeholder-gray-400 focus:outline-none h-[80px] resize-none"
      />
      <Link href={"/chat"}>
        <button
          className="absolute right-0 bottom-0 p-2 bg-[#0099ffb2] hover:bg-[#0099ffbe] text-white 
            rounded-full transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
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
              <button
          className="absolute right-10 bottom-0 p-2 bg-[#88888817] hover:bg-[#8888880a] text-white 
            rounded-full transition-colors"
          onClick={() => setIsDemoOpen(true)}>
                <Image
                  className="w-[14px] h-[14px]"
                  src="/assets/images/play.png"
                  alt={'test'}
                  width={48}
                  height={48}
                />
        </button>
    </div>
  </div>
</motion.div>
          </div>
        </div>
      </div>

      {isDemoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setIsDemoOpen(false)}
        >
          <div
            className="relative w-full max-w-6xl h-[65vh] bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src="/assets/video/heroSectionVideodemo.mp4"
              autoPlay
              muted
              loop
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={() => setIsDemoOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}