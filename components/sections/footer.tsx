import { createClient } from "@/supabase/server";

// Translations for Footer UI strings by language code
const translations: Record<string, {
  topMessage: string;
  copyright: string;
  footerLinks: { label: string; href: string }[];
}> = {
  en: {
    topMessage: "Zerlo — the smartest way to <span class=\"text-[rgb(0,153,255)]\">build</span><br /> your next <span class=\"text-[rgb(0,153,255)]\">winning game</span>",
    copyright: "© 2025 Zerlo Inc. All rights reserved.",
    footerLinks: [
      { label: "Docs", href: "/docs" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Use", href: "/legal/terms" },
      { label: "Contact Us", href: "/contact" },
      { label: "Feature Request", href: "https://zerlo.featurebase.app/" },
    ],
  },
  fr: {
    topMessage: "Zerlo — la manière la plus intelligente de <span class=\"text-[rgb(0,153,255)]\">créer</span><br /> votre prochain <span class=\"text-[rgb(0,153,255)]\">jeu gagnant</span>",
    copyright: "© 2025 Zerlo Inc. Tous droits réservés.",
    footerLinks: [
      { label: "Documents", href: "/docs" },
      { label: "Politique de confidentialité", href: "/legal/privacy" },
      { label: "Conditions d'utilisation", href: "/legal/terms" },
      { label: "Contactez-nous", href: "/contact" },
      { label: "Demande de fonctionnalité", href: "https://zerlo.featurebase.app/" },
    ],
  },
  he: {
    topMessage: "זרלו — הדרך החכמה ביותר <span class=\"text-[rgb(0,153,255)]\">לבנות</span><br /> את <span class=\"text-[rgb(0,153,255)]\">המשחק המנצח</span> הבא שלך",
    copyright: "© 2025 זרלו בע\"מ. כל הזכויות שמורות.",
    footerLinks: [
      { label: "מסמכים", href: "/docs" },
      { label: "מדיניות פרטיות", href: "/legal/privacy" },
      { label: "תנאי שימוש", href: "/legal/terms" },
      { label: "צור קשר", href: "/contact" },
      { label: "בקשת תכונה", href: "https://zerlo.featurebase.app/" },
    ],
  },
  zh: {
    topMessage: "Zerlo — 最智能的方式<span class=\"text-[rgb(0,153,255)]\">构建</span><br />您的下一个<span class=\"text-[rgb(0,153,255)]\">胜利游戏</span>",
    copyright: "© 2025 Zerlo 公司。保留所有权利。",
    footerLinks: [
      { label: "文档", href: "/docs" },
      { label: "隐私政策", href: "/legal/privacy" },
      { label: "使用条款", href: "/legal/terms" },
      { label: "联系我们", href: "/contact" },
      { label: "功能请求", href: "https://zerlo.featurebase.app/" },
    ],
  },
  ar: {
    topMessage: "زيرلو — الطريقة الأذكى <span class=\"text-[rgb(0,153,255)]\">لبناء</span><br /> <span class=\"text-[rgb(0,153,255)]\">لعبتك الرابحة</span> التالية",
    copyright: "© 2025 زيرلو إنك. جميع الحقوق محفوظة.",
    footerLinks: [
      { label: "المستندات", href: "/docs" },
      { label: "سياسة الخصوصية", href: "/legal/privacy" },
      { label: "شروط الاستخدام", href: "/legal/terms" },
      { label: "اتصل بنا", href: "/contact" },
      { label: "طلب ميزة", href: "https://zerlo.featurebase.app/" },
    ],
  },
  ru: {
    topMessage: "Zerlo — самый умный способ <span class=\"text-[rgb(0,153,255)]\">создать</span><br /> вашу следующую <span class=\"text-[rgb(0,153,255)]\">победную игру</span>",
    copyright: "© 2025 Zerlo Inc. Все права защищены.",
    footerLinks: [
      { label: "Документы", href: "/docs" },
      { label: "Политика конфиденциальности", href: "/legal/privacy" },
      { label: "Условия использования", href: "/legal/terms" },
      { label: "Свяжитесь с нами", href: "/contact" },
      { label: "Запрос функции", href: "https://zerlo.featurebase.app/" },
    ],
  },
  hi: {
    topMessage: "ज़रलो — आपका अगला <span class=\"text-[rgb(0,153,255)]\">विजयी गेम</span><br /> <span class=\"text-[rgb(0,153,255)]\">बनाने</span> का सबसे स्मार्ट तरीका",
    copyright: "© 2025 ज़रलो इंक। सर्वाधिकार सुरक्षित।",
    footerLinks: [
      { label: "डॉक्स", href: "/docs" },
      { label: "गोपनीयता नीति", href: "/legal/privacy" },
      { label: "उपयोग की शर्तें", href: "/legal/terms" },
      { label: "संपर्क करें", href: "/contact" },
      { label: "सुविधा का अनुरोध", href: "https://zerlo.featurebase.app/" },
    ],
  },
};

export default async function Footer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const language = user?.user_metadata?.language || "en"; // Fallback to English if no user or language
  const currentTexts = translations[language] || translations.en;

  return (
    <footer className="w-full bg-[rgba(0,0,0,0.05)] py-8 px-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Top message */}
        <div className="flex flex-col gap-1 text-left">
          <p
            className="text-[40px] font-semibold text-[#2B2B2B] leading-snug"
            dangerouslySetInnerHTML={{ __html: currentTexts.topMessage }}
          />
        </div>

        <div className="bg-[#8888881A] h-px w-full" />

        {/* Bottom row with left + right */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Left side text */}
          <div className="text-sm text-gray-700 font-medium">
            <p>{currentTexts.copyright}</p>
          </div>

          {/* Right side: two rows of links */}
          <div className="flex flex-wrap justify-start gap-x-6 gap-y-2 text-sm text-gray-700 font-medium">
            {currentTexts.footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="cursor-pointer hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}