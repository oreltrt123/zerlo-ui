"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";

// Translations for HeroSection UI strings by language code
const translations: Record<string, {
  title: string;
  subtitle: string;
  placeholder: string;
  suggestions: string[];
}> = {
  en: {
    title: "Zerlo – Build <span style=\"color: rgb(0,153,255)\">Games</span> Smarter with AI",
    subtitle: "Create professional <span style=\"color: rgb(0,153,255)\">games in one</span> seamless format",
    placeholder: "Share your game idea — start creating, playing, and publishing!",
    suggestions: [
      "Reporting Dashboard",
      "Gaming Platform",
      "Onboarding Portal",
      "Networking App",
    ],
  },
  fr: {
    title: "Zerlo – Créez des <span style=\"color: rgb(0,153,255)\">jeux</span> plus intelligemment avec l'IA",
    subtitle: "Créez des <span style=\"color: rgb(0,153,255)\">jeux professionnels</span> dans un format fluide",
    placeholder: "Partagez votre idée de jeu — commencez à créer, jouer et publier !",
    suggestions: [
      "Tableau de bord de rapports",
      "Plateforme de jeu",
      "Portail d'intégration",
      "Application de réseautage",
    ],
  },
  he: {
    title: "זרלו – בנה <span style=\"color: rgb(0,153,255)\">משחקים</span> בצורה חכמה יותר עם AI",
    subtitle: "צור <span style=\"color: rgb(0,153,255)\">משחקים מקצועיים</span> בפורמט חלק אחד",
    placeholder: "שתף את רעיון המשחק שלך — התחל ליצור, לשחק ולפרסם!",
    suggestions: [
      "לוח דוחות",
      "פלטפורמת משחקים",
      "פורטל קליטה",
      "אפליקציית רשתות",
    ],
  },
  zh: {
    title: "Zerlo – 使用人工智能更智能地<span style=\"color: rgb(0,153,255)\">构建游戏</span>",
    subtitle: "在一个无缝的格式中创建<span style=\"color: rgb(0,153,255)\">专业游戏</span>",
    placeholder: "分享您的游戏创意 — 开始创建、玩耍和发布！",
    suggestions: [
      "报告仪表板",
      "游戏平台",
      "入职门户",
      "社交网络应用",
    ],
  },
  ar: {
    title: "زيرلو – قم ببناء <span style=\"color: rgb(0,153,255)\">الألعاب</span> بذكاء مع الذكاء الاصطناعي",
    subtitle: "قم بإنشاء <span style=\"color: rgb(0,153,255)\">ألعاب احترافية</span> في تنسيق سلس واحد",
    placeholder: "شارك فكرة لعبتك — ابدأ في الإنشاء واللعب والنشر!",
    suggestions: [
      "لوحة تقارير",
      "منصة ألعاب",
      "بوابة التأهيل",
      "تطبيق التواصل",
    ],
  },
  ru: {
    title: "Zerlo – Создавайте <span style=\"color: rgb(0,153,255)\">игры</span> умнее с помощью ИИ",
    subtitle: "Создавайте <span style=\"color: rgb(0,153,255)\">профессиональные игры</span> в одном удобном формате",
    placeholder: "Поделитесь идеей игры — начните создавать, играть и публиковать!",
    suggestions: [
      "Панель отчетов",
      "Игровая платформа",
      "Портал для новичков",
      "Сетевое приложение",
    ],
  },
  hi: {
    title: "ज़रलो – AI के साथ <span style=\"color: rgb(0,153,255)\">गेम्स</span> को और स्मार्ट बनाएं",
    subtitle: "एक सहज प्रारूप में <span style=\"color: rgb(0,153,255)\">पेशेवर गेम्स</span> बनाएं",
    placeholder: "अपना गेम आइडिया साझा करें — बनाना, खेलना और प्रकाशित करना शुरू करें!",
    suggestions: [
      "रिपोर्टिंग डैशबोर्ड",
      "गेमिंग प्लेटफॉर्म",
      "ऑनबोर्डिंग पोर्टल",
      "नेटवर्किंग ऐप",
    ],
  },
};

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(235,255,177,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
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
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        background: "linear-gradient(90deg, rgba(235, 247, 255, 1) 0%, rgba(214, 239, 255, 1) 35%, rgba(255, 255, 255, 1) 100%)",
      }}
    >
      <div className="top-[-100px] relative z-10">
        {/* Elegant Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={600}
            height={140}
            rotate={12}
            gradient="from-[#A0A5C2]/[0.15]"
            className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          />
          <ElegantShape
            delay={0.5}
            width={500}
            height={120}
            rotate={-15}
            gradient="from-[#CEDDE4]/[0.15]"
            className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl tracking-tight text-black"
              dangerouslySetInnerHTML={{ __html: currentTexts.title }}
            />
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="text-lg sm:text-xl max-w-lg mx-auto"
              style={{ fontSize: "15px", color: "#2B2B2B" }}
              dangerouslySetInnerHTML={{ __html: currentTexts.subtitle }}
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              className="bg-white rounded-xl p-6 
                hover:shadow-[inset_0_0.5em_1.5em_rgba(0,0,0,0.1),inset_0_0.125em_0.5em_rgba(0,0,0,0.15)] 
                active:shadow-[inset_0_0.3em_1em_rgba(0,0,0,0.2),inset_0_0.1em_0.4em_rgba(0,0,0,0.25)]"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentTexts.placeholder}
                    className="w-full p-3 border rounded-md text-black placeholder-gray-400 focus:outline-none h-[120px] resize-none"
                  />
                  <Link href={"/chat"}>
                    <button
                      className="absolute right-[65px] p-2 bg-[rgb(0,153,255)] text-white rounded-full hover:bg-[rgba(0,153,255,0.83)] transition-colors"
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
                  {currentTexts.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
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
        </div>
      </div>
    </div>
  );
}