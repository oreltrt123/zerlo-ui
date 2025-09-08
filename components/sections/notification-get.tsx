"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import NotificationCenter from '@/components/sections/notification-center';
import AnimatedOTP from '@/components/sections/animated-otp';

// Translations for HeroSlider UI strings by language code
const translations: Record<string, {
  heading: string;
  description: string;
  linkText: string;
  placeholder: string;
  suggestions: string[];
}> = {
en: {
  heading: "Just think you could build any game.",
  description: "Imagine having the freedom to bring any idea to life — the power to design and build any game you can dream of.",
  linkText: "Start building your game &rarr;",
  placeholder: "Start building your game. but with security",
  suggestions: [
    "Reporting Dashboard",
    "Gaming Platform",
    "Onboarding Portal",
    "Networking App",
  ],
},
fr: {
  heading: "Zerlo : Créateur de jeux IA",
  description: "Décrivez votre idée de jeu et regardez l'IA générer instantanément le code, les ressources et la logique. Lancez votre premier jeu en quelques secondes.",
  linkText: "Commencez à créer votre jeu &rarr;",
  placeholder: "Commencez à créer votre jeu →",
  suggestions: [
    "Tableau de bord",
    "Plateforme de jeu",
    "Portail d'intégration",
    "Application de réseautage",
  ],
},
he: {
  heading: "זרלו: בונה משחקי AI",
  description: "תאר את רעיון המשחק שלך וצפה ב-AI שיוצר מיד קוד, נכסים ולוגיקה. השיקו את המשחק הראשון שלכם תוך שניות.",
  linkText: "התחל ליצור את המשחק שלך &rarr;",
  placeholder: "התחל ליצור את המשחק שלך →",
  suggestions: [
    "לוח בקרה לדיווחים",
    "פלטפורמת משחקים",
    "פורטל התחברות",
    "אפליקציית רשת",
  ],
},
zh: {
  heading: "Zerlo：AI 游戏构建器",
  description: "描述你的游戏创意，观看 AI 即时生成代码、资源和逻辑。几秒钟内启动你的第一个游戏。",
  linkText: "开始构建你的游戏 &rarr;",
  placeholder: "开始构建你的游戏 →",
  suggestions: [
    "报告仪表板",
    "游戏平台",
    "入职门户",
    "社交应用",
  ],
},
ar: {
  heading: "Zerlo: منشئ ألعاب AI",
  description: "صف فكرة لعبتك، وشاهد الذكاء الاصطناعي ينشئ الكود والأصول والمنطق على الفور. أطلق لعبتك الأولى في ثوانٍ.",
  linkText: "ابدأ ببناء لعبتك &rarr;",
  placeholder: "ابدأ ببناء لعبتك →",
  suggestions: [
    "لوحة التقارير",
    "منصة الألعاب",
    "بوابة الانضمام",
    "تطبيق تواصل",
  ],
},
ru: {
  heading: "Zerlo: Создатель игр с ИИ",
  description: "Опишите идею вашей игры и наблюдайте, как ИИ мгновенно генерирует код, ресурсы и логику. Запустите свою первую игру за считанные секунды.",
  linkText: "Начать создание вашей игры &rarr;",
  placeholder: "Начать создание вашей игры →",
  suggestions: [
    "Панель отчетности",
    "Игровая платформа",
    "Портал для новичков",
    "Сетевое приложение",
  ],
},
hi: {
  heading: "Zerlo: AI गेम बिल्डर",
  description: "अपने गेम का आइडिया बताएं, और देखें कि AI तुरंत कोड, संसाधन और लॉजिक तैयार करता है। अपनी पहली गेम कुछ ही सेकंड में लॉन्च करें।",
  linkText: "अपना गेम बनाना शुरू करें &rarr;",
  placeholder: "अपना गेम बनाना शुरू करें →",
  suggestions: [
    "रिपोर्टिंग डैशबोर्ड",
    "गेमिंग प्लेटफ़ॉर्म",
    "ऑनबोर्डिंग पोर्टल",
    "नेटवर्किंग ऐप",
  ],
},

};

export default function HeroImg() {
  const [, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState("en");
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
        {/* Text Section */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10">
          <h2 className="text-4xl text-gray-900 font-sans font-light leading-relaxed max-w-3xl mx-auto">
            {currentTexts.heading}
          </h2>
          <p className="text-gray-600 mb-6">
            {currentTexts.description}
          </p>
          <Link href="/security" className="text-[rgb(0,153,255)] hover:underline font-medium">
            Start building your game. but with security
          </Link>
        </div>
                <div className="w-full md:w-1/2 lg:w-3/4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
            className="bg-white rounded-xl p-6"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2 relative">
            <NotificationCenter
              cardTitle="Real-time Notifications"
              cardDescription="Website notifications when the game gets love"
              notificationTitle="Zerlo"
              notificationDescription="Your website received 200K new users."
              notificationTime="2m ago"
            />
            <AnimatedOTP
              delay={3500} // Time interval (in ms) after which the OTP animation resets.
              cardTitle="Information security"
              cardDescription="All notifications are fully synchronized across the platform, delivered in real time without delay. 
              Each notification is tracked and recorded with precision, ensuring a seamless and reliable user experience."
            />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}