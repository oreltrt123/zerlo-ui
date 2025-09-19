import { createServerClient } from '@/supabase/server';
import Link from 'next/link';

// Translations for Navbar UI strings by language code
const translations: Record<string, { 
  logo: string; 
  blog: string; 
  about: string; 
  features: string; 
  login: string;
}> = { 
  en: { logo: "Zerlo", blog: "Blog", about: "About", features: "Features", login: "Log In" }, 
  fr: { logo: "Zerlo", blog: "Blog", about: "About", features: "Functionality", login: "Se connecter" },
  he: { logo: "Zarlo", blog: "blog", about: "About", features: "features", login: "log in" },
  zh: { logo: "Zerlo", blog: "blog", about: "about", features: "funcción", login: "login" },
  ar: { logo: "Zirlo", blog: "Blog", about: "about", features: "Al-Mizat", login: "login" },
  ru: { logo: "Zerlo", blog: "Блог", about: "О нас", features: "Functions", login: "Login" },
  hi: { logo: "Zarlo", blog: "blog", about: "about it", features: "features", login: "Log in" },
};

export default async function Navbar() { 
  const supabase = await createServerClient(); // ✅ use server client
  const { data: { user } } = await supabase.auth.getUser(); 
  const language = user?.user_metadata?.language || "en"; // fallback to English
  const currentTexts = translations[language] || translations.en; 

  return ( 
    <nav className="fixed top-0 left-0 right-0 z-50"> 
      <div className="bg-[#ffffff] border-b backdrop-blur-md px-6 py-3 flex items-center justify-between mx-auto"> 
        {/* Logo Section */} 
        <div className="flex items-center"> 
          <Link href="/docs"> 
            <h1 className="text-2xl font-bold relative top-[-2px] text-black/70 cursor-default"> 
              {currentTexts.logo} <span style={{fontSize: "16px"}}>Docs</span>
            </h1> 
          </Link> 
        </div> 
      </div>
    </nav>
  );
}
