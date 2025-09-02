"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import "@/styles/privacy.css";

// All translations
const translations: Record<
  string,
  {
    title: string;
    section1Title: string;
    section1Text: string;
    section2Title: string;
    section2Text1: string;
    section2Text2Title: string;
    section2Text2: string;
    section3Title: string;
    section3Text: string;
    section4Title: string;
    section4Text: string;
    section5Title: string;
    section5Text1: string;
    section5Text2: string;
  }
> = {
  en: {
    title: "PRIVACY STATEMENT",
    section1Title: "What information do we collect?",
    section1Text:
      "We collect personal data that you provide to us, such as your name, email address, and other contact information, when you contact us through our website or by email. We also automatically collect certain information about your visit to our website, including your IP address, the date and time of your visit, the pages you visit, and the website you visited before our website.",
    section2Title: "How do we use your information?",
    section2Text1:
      "We use your personal data to respond to your inquiries, provide you with information about our services, and improve our website. We also use the information we automatically collect about your visit to our website to analyze trends, administer the site, track user movements, and gather demographic information.",
    section2Text2Title: "How do we share your information?",
    section2Text2:
      "We do not sell, trade, or rent your personal data to third parties. We may share your personal data with our service providers who help us operate our website and provide our services, but only to the extent necessary for them to perform their services for us. We may also disclose your personal data if we are required to do so by law, or if we believe in good faith that such disclosure is necessary to comply with legal obligations, respond to a legal claim, protect our rights or property, or protect the safety of others.",
    section3Title: "Your rights",
    section3Text:
      "You have the right to access, correct, or delete your personal data.",
    section4Title: "Updates to this policy",
    section4Text:
      "We may update our privacy statement from time to time. We will notify you of any changes by posting the new privacy statement on our website.",
    section5Title: "Contact us",
    section5Text1:
      "If you have any questions or concerns about our privacy statement or our processing of your personal data, please contact us at",
    section5Text2: "zerlocontactus@gmail.com",
  },
  fr: {
    title: "DÉCLARATION DE CONFIDENTIALITÉ",
    section1Title: "Quelles informations collectons-nous ?",
    section1Text:
      "Nous collectons les données personnelles que vous nous fournissez, telles que votre nom, adresse e-mail et autres informations de contact, lorsque vous nous contactez via notre site Web ou par e-mail. Nous collectons également automatiquement certaines informations concernant votre visite sur notre site Web, y compris votre adresse IP, la date et l'heure de votre visite, les pages que vous consultez et le site Web que vous avez visité avant le nôtre.",
    section2Title: "Comment utilisons-nous vos informations ?",
    section2Text1:
      "Nous utilisons vos données personnelles pour répondre à vos demandes, vous fournir des informations sur nos services et améliorer notre site Web. Nous utilisons également les informations que nous collectons automatiquement à propos de votre visite pour analyser les tendances, administrer le site, suivre les mouvements des utilisateurs et recueillir des informations démographiques.",
    section2Text2Title: "Comment partageons-nous vos informations ?",
    section2Text2:
      "Nous ne vendons pas, n'échangeons pas et ne louons pas vos données personnelles à des tiers. Nous pouvons partager vos données personnelles avec nos prestataires de services qui nous aident à exploiter notre site Web et à fournir nos services, mais uniquement dans la mesure nécessaire pour qu'ils puissent exécuter leurs services pour nous. Nous pouvons également divulguer vos données personnelles si nous y sommes contraints par la loi ou si nous croyons de bonne foi qu'une telle divulgation est nécessaire pour respecter des obligations légales, répondre à une demande légale, protéger nos droits ou nos biens, ou protéger la sécurité d'autrui.",
    section3Title: "Vos droits",
    section3Text:
      "Vous avez le droit d'accéder, de corriger ou de supprimer vos données personnelles.",
    section4Title: "Mises à jour de cette politique",
    section4Text:
      "Nous pouvons mettre à jour notre déclaration de confidentialité de temps à autre. Nous vous informerons de toute modification en publiant la nouvelle déclaration sur notre site Web.",
    section5Title: "Nous contacter",
    section5Text1:
      "Si vous avez des questions ou des préoccupations concernant notre déclaration de confidentialité ou notre traitement de vos données personnelles, veuillez nous contacter à",
    section5Text2: "zerlocontactus@gmail.com",
  },
  ru: {
    title: "ЗАЯВЛЕНИЕ О КОНФИДЕНЦИАЛЬНОСТИ",
    section1Title: "Какие данные мы собираем?",
    section1Text:
      "Мы собираем персональные данные, которые вы предоставляете нам, такие как ваше имя, адрес электронной почты и другая контактная информация, когда вы связываетесь с нами через наш веб-сайт или по электронной почте. Мы также автоматически собираем определенную информацию о вашем посещении нашего веб-сайта, включая ваш IP-адрес, дату и время посещения, страницы, которые вы просматриваете, и веб-сайт, который вы посетили перед нашим сайтом.",
    section2Title: "Как мы используем вашу информацию?",
    section2Text1:
      "Мы используем ваши персональные данные для ответа на ваши запросы, предоставления информации о наших услугах и улучшения нашего веб-сайта. Мы также используем автоматически собираемую информацию о вашем посещении нашего веб-сайта для анализа тенденций, управления сайтом, отслеживания перемещений пользователей и сбора демографической информации.",
    section2Text2Title: "Как мы делимся вашей информацией?",
    section2Text2:
      "Мы не продаем, не обмениваем и не сдаем в аренду ваши персональные данные третьим лицам. Мы можем передавать ваши персональные данные нашим поставщикам услуг, которые помогают нам управлять нашим веб-сайтом и предоставлять наши услуги, но только в той мере, в которой это необходимо для выполнения их услуг для нас. Мы также можем раскрывать ваши персональные данные, если это требуется по закону, или если мы добросовестно полагаем, что такое раскрытие необходимо для соблюдения юридических обязательств, ответа на юридические претензии, защиты наших прав или собственности, или защиты безопасности других лиц.",
    section3Title: "Ваши права",
    section3Text:
      "Вы имеете право на доступ, исправление или удаление ваших персональных данных.",
    section4Title: "Обновления этой политики",
    section4Text:
      "Мы можем время от времени обновлять наше заявление о конфиденциальности. Мы уведомим вас о любых изменениях, разместив новое заявление о конфиденциальности на нашем веб-сайте.",
    section5Title: "Свяжитесь с нами",
    section5Text1:
      "Если у вас есть вопросы или опасения по поводу нашего заявления о конфиденциальности или обработки ваших персональных данных, пожалуйста, свяжитесь с нами по адресу",
    section5Text2: "zerlocontactus@gmail.com",
  },
  hi: {
    title: "गोपनीयता कथन",
    section1Title: "हम कौन सी जानकारी एकत्र करते हैं?",
    section1Text:
      "हम आपके द्वारा प्रदान की गई व्यक्तिगत जानकारी एकत्र करते हैं, जैसे कि आपका नाम, ईमेल पता और अन्य संपर्क जानकारी, जब आप हमारी वेबसाइट या ईमेल के माध्यम से हमसे संपर्क करते हैं। हम आपकी वेबसाइट पर आपकी यात्रा के बारे में कुछ जानकारी भी स्वचालित रूप से एकत्र करते हैं, जिसमें आपका आईपी पता, आपकी यात्रा की तारीख और समय, आपके द्वारा देखे गए पृष्ठ, और हमारी वेबसाइट से पहले आपके द्वारा देखी गई वेबसाइट शामिल है।",
    section2Title: "हम आपकी जानकारी का उपयोग कैसे करते हैं?",
    section2Text1:
      "हम आपकी व्यक्तिगत जानकारी का उपयोग आपके पूछताछ का जवाब देने, आपको हमारी सेवाओं के बारे में जानकारी प्रदान करने, और हमारी वेबसाइट को बेहतर बनाने के लिए करते हैं। हम आपकी वेबसाइट पर आपकी यात्रा के बारे में स्वचालित रूप से एकत्र की गई जानकारी का उपयोग रुझानों का विश्लेषण करने, साइट का प्रबंधन करने, उपयोगकर्ता की गतिविधियों को ट्रैक करने, और जनसांख्यिकीय जानकारी एकत्र करने के लिए करते हैं।",
    section2Text2Title: "हम आपकी जानकारी कैसे साझा करते हैं?",
    section2Text2:
      "हम आपकी व्यक्तिगत जानकारी को तीसरे पक्षों को नहीं बेचते, व्यापार नहीं करते, या किराए पर नहीं देते। हम आपकी व्यक्तिगत जानकारी को हमारे सेवा प्रदाताओं के साथ साझा कर सकते हैं जो हमारी वेबसाइट को संचालित करने और हमारी सेवाएं प्रदान करने में हमारी मदद करते हैं, लेकिन केवल उतनी ही हद तक जितनी उनके लिए हमारी सेवाएं प्रदान करने के लिए आवश्यक है। हम आपकी व्यक्तिगत जानकारी को तब भी प्रकट कर सकते हैं यदि हमें कानून द्वारा ऐसा करने की आवश्यकता हो, या यदि हमें सद्भावना में विश्वास हो कि ऐसा प्रकटीकरण कानूनी दायित्वों का पालन करने, कानूनी दावे का जवाब देने, हमारे अधिकारों या संपत्ति की रक्षा करने, या दूसरों की सुरक्षा की रक्षा करने के लिए आवश्यक है।",
    section3Title: "आपके अधिकार",
    section3Text:
      "आपको अपनी व्यक्तिगत जानकारी तक पहुंचने, उसे सुधारने या हटाने का अधिकार है।",
    section4Title: "इस नीति में अपडेट",
    section4Text:
      "हम समय-समय पर अपने गोपनीयता कथन को अपडेट कर सकते हैं। हम आपको हमारी वेबसाइट पर नया गोपनीयता कथन पोस्ट करके किसी भी बदलाव के बारे में सूचित करेंगे।",
    section5Title: "हमसे संपर्क करें",
    section5Text1:
      "यदि आपके पास हमारे गोपनीयता कथन या आपकी व्यक्तिगत जानकारी के हमारे प्रसंस्करण के बारे में कोई प्रश्न या चिंता है, तो कृपया हमसे संपर्क करें",
    section5Text2: "zerlocontactus@gmail.com",
  },
  zh: {
    title: "隐私声明",
    section1Title: "我们收集哪些信息？",
    section1Text:
      "我们收集您提供给我们的个人信息，例如您的姓名、电子邮件地址和其他联系信息，当您通过我们的网站或电子邮件与我们联系时。我们还会自动收集有关您访问我们网站的某些信息，包括您的IP地址、访问日期和时间、您访问的页面以及您在访问我们网站之前访问的网站。",
    section2Title: "我们如何使用您的信息？",
    section2Text1:
      "我们使用您的个人信息来回应您的询问，提供有关我们服务的信息，并改进我们的网站。我们还使用我们自动收集的有关您访问我们网站的信息来分析趋势、管理网站、跟踪用户活动并收集人口统计信息。",
    section2Text2Title: "我们如何分享您的信息？",
    section2Text2:
      "我们不会将您的个人信息出售、交易或出租给第三方。我们可能会与帮助我们运营网站和提供服务的服务提供商分享您的个人信息，但仅限于他们为我们执行服务所需的程度。我们还可能在法律要求的情况下披露您的个人信息，或者如果我们真诚地认为此类披露是遵守法律义务、回应法律索赔、保护我们的权利或财产或保护他人安全所必需的。",
    section3Title: "您的权利",
    section3Text:
      "您有权访问、更正或删除您的个人信息。",
    section4Title: "本政策的更新",
    section4Text:
      "我们可能会不时更新我们的隐私声明。我们将通过在我们的网站上发布新的隐私声明来通知您任何更改。",
    section5Title: "联系我们",
    section5Text1:
      "如果您对我们的隐私声明或我们对您个人信息的处理有任何疑问或担忧，请通过以下方式联系我们",
    section5Text2: "zerlocontactus@gmail.com",
  },
  ar: {
    title: "بيان الخصوصية",
    section1Title: "ما هي المعلومات التي نجمعها؟",
    section1Text:
      "نقوم بجمع البيانات الشخصية التي تقدمها لنا، مثل اسمك، عنوان بريدك الإلكتروني، ومعلومات الاتصال الأخرى، عندما تتواصل معنا عبر موقعنا الإلكتروني أو عبر البريد الإلكتروني. كما نقوم تلقائيًا بجمع معلومات معينة حول زيارتك لموقعنا الإلكتروني، بما في ذلك عنوان IP الخاص بك، تاريخ ووقت زيارتك، الصفحات التي تزورها، والموقع الإلكتروني الذي زرته قبل موقعنا.",
    section2Title: "كيف نستخدم معلوماتك؟",
    section2Text1:
      "نستخدم بياناتك الشخصية للرد على استفساراتك، وتزويدك بمعلومات حول خدماتنا، وتحسين موقعنا الإلكتروني. كما نستخدم المعلومات التي نجمعها تلقائيًا حول زيارتك لموقعنا الإلكتروني لتحليل الاتجاهات، وإدارة الموقع، وتتبع حركات المستخدمين، وجمع المعلومات الديموغرافية.",
    section2Text2Title: "كيف نشارك معلوماتك؟",
    section2Text2:
      "لا نبيع أو نتاجر أو نؤجر بياناتك الشخصية لأطراف ثالثة. قد نشارك بياناتك الشخصية مع مقدمي الخدمات لدينا الذين يساعدوننا في تشغيل موقعنا الإلكتروني وتقديم خدماتنا، ولكن فقط بالقدر اللازم لهم لأداء خدماتهم لنا. قد نكشف أيضًا عن بياناتك الشخصية إذا كنا ملزمين بذلك بموجب القانون، أو إذا كنا نعتقد بحسن نية أن هذا الكشف ضروري للامتثال للالتزامات القانونية، أو الرد على مطالبة قانونية، أو حماية حقوقنا أو ممتلكاتنا، أو حماية سلامة الآخرين.",
    section3Title: "حقوقك",
    section3Text:
      "لديك الحق في الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها.",
    section4Title: "تحديثات لهذه السياسة",
    section4Text:
      "قد نقوم بتحديث بيان الخصوصية الخاص بنا من وقت لآخر. سنخطرك بأي تغييرات عن طريق نشر بيان الخصوصية الجديد على موقعنا الإلكتروني.",
    section5Title: "اتصل بنا",
    section5Text1:
      "إذا كانت لديك أي أسئلة أو مخاوف بشأن بيان الخصوصية الخاص بنا أو معالجتنا لبياناتك الشخصية، يرجى التواصل معنا على",
    section5Text2: "zerlocontactus@gmail.com",
  },
  he: {
    title: "הצהרת פרטיות",
    section1Title: "אילו מידע אנו אוספים?",
    section1Text:
      "אנו אוספים נתונים אישיים שאתה מספק לנו, כגון שמך, כתובת הדוא\"ל שלך ומידע קשר אחר, כאשר אתה יוצר איתנו קשר דרך האתר שלנו או בדוא\"ל. אנו גם אוספים באופן אוטומטי מידע מסוים על הביקור שלך באתר שלנו, כולל כתובת ה-IP שלך, תאריך ושעת הביקור, הדפים שבהם אתה מבקר, והאתר שביקרת בו לפני האתר שלנו.",
    section2Title: "כיצד אנו משתמשים במידע שלך?",
    section2Text1:
      "אנו משתמשים בנתונים האישיים שלך כדי להשיב לפניותיך, לספק לך מידע על השירותים שלנו ולשפר את האתר שלנו. אנו גם משתמשים במידע שאנו אוספים באופן אוטומטי על הביקור שלך באתר שלנו כדי לנתח מגמות, לנהל את האתר, לעקוב אחר תנועות המשתמשים ולאסוף מידע דמוגרפי.",
    section2Text2Title: "כיצד אנו משתפים את המידע שלך?",
    section2Text2:
      "אנו לא מוכרים, סוחרים או משכירים את הנתונים האישיים שלך לצדדים שלישיים. אנו עשויים לשתף את הנתונים האישיים שלך עם ספקי השירותים שלנו שמסייעים לנו להפעיל את האתר שלנו ולספק את השירותים שלנו, אך רק במידה הדרושה להם כדי לבצע את השירותים עבורנו. אנו עשויים גם לחשוף את הנתונים האישיים שלך אם אנו נדרשים לעשות זו על פי חוק, או אם אנו מאמינים בתום לב שחשיפה כזו הכרחית כדי לעמוד בהתחייבויות משפטיות, להגיב לטענה משפטית, להגן על זכויותינו או רכושנו, או להגן על בטיחותם של אחרים.",
    section3Title: "זכויותיך",
    section3Text:
      "יש לך את הזכות לגשת, לתקן או למחוק את הנתונים האישיים שלך.",
    section4Title: "עדכונים למדיניות זו",
    section4Text:
      "אנו עשויים לעדכן את הצהרת הפרטיות שלנו מעת לעת. אנו נודיע לך על כל שינוי על ידי פרסום הצהרת הפרטיות החדשה באתר שלנו.",
    section5Title: "צור קשר",
    section5Text1:
      "אם יש לך שאלות או חששות בנוגע להצהרת הפרטיות שלנו או לעיבוד הנתונים האישיים שלך, אנא צור איתנו קשר ב",
    section5Text2: "zerlocontactus@gmail.com",
  },
};

export default function PrivacyPolicyPage() {
  const [,setUser] = useState<User | null>(null);
  const [lang, setLang] = useState("en");
  const supabase = createClient();

  const fetchUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setUser(data.user);
      setLang(data.user.user_metadata?.language || "en");
    }
  }, [supabase]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const t = translations[lang] || translations.en;

  return (
    <div>
            <div className="bg-white absolute w-[100%] h-[5%]"></div>
    <main
      className="min-h-screen py-12 px-6"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        background:
          "linear-gradient(90deg, rgba(235, 247, 255, 1) 0%, rgba(214, 239, 255, 1) 35%, rgba(255, 255, 255, 1) 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto rounded-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        </div>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            {t.section1Title}
          </h2>
          <p>{t.section1Text}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            {t.section2Title}
          </h2>
          <p>{t.section2Text1}</p>
          <p className="mt-4">
            <strong className="text-gray-900">{t.section2Text2Title}</strong>
            <br />
            {t.section2Text2}
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            {t.section3Title}
          </h2>
          <p>{t.section3Text}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            {t.section4Title}
          </h2>
          <p>{t.section4Text}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            {t.section5Title}
          </h2>
          <p>
            {t.section5Text1}{" "}
            <Link
              href={`mailto:${t.section5Text2}`}
              className="text-[#0099FF]"
            >
              {t.section5Text2}
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
    </div>
  );
}