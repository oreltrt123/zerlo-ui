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
  heading: "Watch AI Live Chat",
  description: "See an AI live in action as it responds to messages in real time. Experience AI intelligence and interaction like never before.",
  linkText: "Start watching &rarr;",
  placeholder: "Type your message — see AI respond instantly!",
  suggestions: [
    "Ask a question",
    "Test AI responses",
    "Explore conversation",
    "Chat with AI",
  ],
},
fr: {
  heading: "Regardez le chat IA en direct",
  description: "Voyez l'IA en action alors qu'elle répond aux messages en temps réel. Découvrez l'intelligence et l'interaction de l'IA comme jamais auparavant.",
  linkText: "Commencez à regarder &rarr;",
  placeholder: "Tapez votre message — regardez l'IA répondre instantanément !",
  suggestions: [
    "Posez une question",
    "Testez les réponses de l'IA",
    "Explorez la conversation",
    "Discutez avec l'IA",
  ],
},
he: {
  heading: "צפה בצ'אט AI חי",
  description: "צפו בבינה מלאכותית פועלת בזמן אמת כאשר היא מגיבה להודעות. חוו את האינטליגנציה והאינטראקציה של ה-AI כמו מעולם לא היה.",
  linkText: "התחל לצפות &rarr;",
  placeholder: "הקלד את ההודעה שלך — צפה ב-AI מגיב מיידית!",
  suggestions: [
    "שאל שאלה",
    "בדוק תגובות AI",
    "חקור שיחה",
    "צ'אט עם AI",
  ],
},
zh: {
  heading: "观看 AI 实时聊天",
  description: "实时观看 AI 如何回应消息，体验前所未有的 AI 智能与互动。",
  linkText: "开始观看 &rarr;",
  placeholder: "输入你的消息 — 立即查看 AI 的回应！",
  suggestions: [
    "提问",
    "测试 AI 回复",
    "探索对话",
    "与 AI 聊天",
  ],
},
ar: {
  heading: "شاهد الدردشة الحية للذكاء الاصطناعي",
  description: "شاهد الذكاء الاصطناعي أثناء الرد على الرسائل في الوقت الفعلي. تجربة تفاعلية وذكاء اصطناعي كما لم تره من قبل.",
  linkText: "ابدأ بالمشاهدة &rarr;",
  placeholder: "اكتب رسالتك — شاهد AI يرد فورًا!",
  suggestions: [
    "اطرح سؤالاً",
    "اختبر ردود AI",
    "استكشف المحادثة",
    "تحدث مع AI",
  ],
},
ru: {
  heading: "Смотрите чат AI в реальном времени",
  description: "Смотрите, как ИИ отвечает на сообщения в режиме реального времени. Испытайте интеллект и взаимодействие ИИ как никогда ранее.",
  linkText: "Начать просмотр &rarr;",
  placeholder: "Введите сообщение — смотрите, как ИИ отвечает мгновенно!",
  suggestions: [
    "Задать вопрос",
    "Проверить ответы ИИ",
    "Изучить беседу",
    "Поболтать с ИИ",
  ],
},
hi: {
  heading: "AI लाइव चैट देखें",
  description: "रियल टाइम में संदेशों का उत्तर देते हुए AI को देखें। AI की बुद्धिमत्ता और इंटरैक्शन का अनुभव पहले कभी नहीं हुआ।",
  linkText: "देखना शुरू करें &rarr;",
  placeholder: "अपना संदेश टाइप करें — तुरंत AI का जवाब देखें!",
  suggestions: [
    "सवाल पूछें",
    "AI प्रतिक्रियाओं का परीक्षण करें",
    "संवाद का अन्वेषण करें",
    "AI से चैट करें",
  ],
},
};

export default function HeroVideo() {
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
        <div className="w-full md:w-1/2 lg:w-3/4">
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
    className="bg-white rounded-xl p-6"
  >
    <div className="space-y-4">
      <div className="flex items-center space-x-2 relative">
        <video
          src="/assets/video/textAImesgese.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="rounded-[40px] w-[470px] h-[400px] object-cover"
          style={{
            boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
          }}
        >
          Your browser does not support the video tag.
        </video>
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