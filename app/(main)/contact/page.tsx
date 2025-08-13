"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";

// Translations for the contact form UI strings by language code
const translations: Record<string, {
  title: string;
  description: string;
  emailPrompt: string;
  email: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  subjectLabel: string;
  messageLabel: string;
  sendButton: string;
  statusSending: string;
  statusSuccess: string;
  statusError: string;
  statusCatchError: string;
}> = {
  en: {
    title: "Contact Us",
    description: "We'd love to hear from you! Fill out the form and we'll reply as soon as possible.",
    emailPrompt: "Email us directly at",
    email: "zerlocontactus@gmail.com",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    phoneLabel: "Phone Number (Optional)",
    subjectLabel: "Subject",
    messageLabel: "Message",
    sendButton: "Send Message",
    statusSending: "Sending...",
    statusSuccess: "Message sent successfully!",
    statusError: "Something went wrong. Please try again.",
    statusCatchError: "Error sending message.",
  },
  fr: {
    title: "Contactez-nous",
    description: "Nous serions ravis d'avoir de vos nouvelles ! Remplissez le formulaire et nous répondrons dès que possible.",
    emailPrompt: "Envoyez-nous un email directement à",
    email: "zerlocontactus@gmail.com",
    nameLabel: "Nom complet",
    emailLabel: "Adresse e-mail",
    phoneLabel: "Numéro de téléphone (facultatif)",
    subjectLabel: "Objet",
    messageLabel: "Message",
    sendButton: "Envoyer le message",
    statusSending: "Envoi en cours...",
    statusSuccess: "Message envoyé avec succès !",
    statusError: "Quelque chose s'est mal passé. Veuillez réessayer.",
    statusCatchError: "Erreur lors de l'envoi du message.",
  },
  he: {
    title: "צור קשר",
    description: "נשמח לשמוע ממך! מלא את הטופס ונחזור אליך בהקדם האפשרי.",
    emailPrompt: "שלח לנו דוא\"ל ישירות לכתובת",
    email: "zerlocontactus@gmail.com",
    nameLabel: "שם מלא",
    emailLabel: "כתובת דוא\"ל",
    phoneLabel: "מספר טלפון (לא חובה)",
    subjectLabel: "נושא",
    messageLabel: "הודעה",
    sendButton: "שלח הודעה",
    statusSending: "שולח...",
    statusSuccess: "הודעה נשלחה בהצלחה!",
    statusError: "משהו השתבש. נסה שוב.",
    statusCatchError: "שגיאה בשליחת ההודעה.",
  },
  zh: {
    title: "联系我们",
    description: "我们很高兴收到您的消息！请填写表格，我们会尽快回复。",
    emailPrompt: "直接通过电子邮件联系我们：",
    email: "zerlocontactus@gmail.com",
    nameLabel: "全名",
    emailLabel: "电子邮件地址",
    phoneLabel: "电话号码（可选）",
    subjectLabel: "主题",
    messageLabel: "消息",
    sendButton: "发送消息",
    statusSending: "发送中...",
    statusSuccess: "消息发送成功！",
    statusError: "出了点问题。请再试一次。",
    statusCatchError: "发送消息时出错。",
  },
  ar: {
    title: "اتصل بنا",
    description: "نود أن نسمع منك! املأ النموذج وسنرد عليك في أقرب وقت ممكن.",
    emailPrompt: "راسلنا مباشرة على",
    email: "zerlocontactus@gmail.com",
    nameLabel: "الاسم الكامل",
    emailLabel: "عنوان البريد الإلكتروني",
    phoneLabel: "رقم الهاتف (اختياري)",
    subjectLabel: "الموضوع",
    messageLabel: "الرسالة",
    sendButton: "إرسال الرسالة",
    statusSending: "جاري الإرسال...",
    statusSuccess: "تم إرسال الرسالة بنجاح!",
    statusError: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    statusCatchError: "خطأ في إرسال الرسالة.",
  },
  ru: {
    title: "Свяжитесь с нами",
    description: "Мы будем рады услышать вас! Заполните форму, и мы ответим как можно скорее.",
    emailPrompt: "Напишите нам напрямую по адресу",
    email: "zerlocontactus@gmail.com",
    nameLabel: "Полное имя",
    emailLabel: "Адрес электронной почты",
    phoneLabel: "Номер телефона (необязательно)",
    subjectLabel: "Тема",
    messageLabel: "Сообщение",
    sendButton: "Отправить сообщение",
    statusSending: "Отправка...",
    statusSuccess: "Сообщение успешно отправлено!",
    statusError: "Что-то пошло не так. Пожалуйста, попробуйте снова.",
    statusCatchError: "Ошибка при отправке сообщения.",
  },
  hi: {
    title: "संपर्क करें",
    description: "हमें आपसे सुनना अच्छा लगेगा! फॉर्म भरें और हम जल्द से जल्द जवाब देंगे।",
    emailPrompt: "हमें सीधे ईमेल करें",
    email: "zerlocontactus@gmail.com",
    nameLabel: "पूरा नाम",
    emailLabel: "ईमेल पता",
    phoneLabel: "फोन नंबर (वैकल्पिक)",
    subjectLabel: "विषय",
    messageLabel: "संदेश",
    sendButton: "संदेश भेजें",
    statusSending: "भेजा जा रहा है...",
    statusSuccess: "संदेश सफलतापूर्वक भेजा गया!",
    statusError: "कुछ गलत हो गया। कृपया पुन: प्रयास करें।",
    statusCatchError: "संदेश भेजने में त्रुटि।",
  },
};

export default function ContactForm() {
  const [, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const supabase = createClient();

  const getUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLanguage(user?.user_metadata?.language || "en");
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
          phone: user.user_metadata?.phone || "",
        }));
      }
    } catch (error) {
      console.error("Error getting user:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(translations[language].statusSending || "Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus(translations[language].statusSuccess || "Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setStatus(translations[language].statusError || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus(translations[language].statusCatchError || "Error sending message.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Get current translations for UI text
  const currentTexts = translations[language] || translations.en;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 py-20 px-4">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl border border-[#8888881A] rounded-xl bg-white overflow-hidden">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 p-10 bg-[#8888881A]">
          <h1 className="text-4xl font-bold mb-4">{currentTexts.title}</h1>
          <p className="text-gray-600 mb-6">
            {currentTexts.description}
          </p>
          <p className="text-gray-500">
            {currentTexts.emailPrompt}{" "}
            <span className="text-[rgb(0,153,255)] font-semibold">
              {currentTexts.email}
            </span>
          </p>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 p-10 bg-white">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">{currentTexts.nameLabel}</label>
              <Input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{currentTexts.emailLabel}</label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {currentTexts.phoneLabel}
              </label>
              <Input
                type="tel"
                name="phone"
                placeholder="+972 58 000 0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{currentTexts.subjectLabel}</label>
              <Input
                type="text"
                name="subject"
                placeholder="What's this about?"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{currentTexts.messageLabel}</label>
              <Textarea
                name="message"
                rows={5}
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" variant="blue" className="w-full">
              {currentTexts.sendButton}
            </Button>

            {status && (
              <p className="text-sm text-center text-gray-600">{status}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}