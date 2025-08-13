import { createClient } from '@/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AccountMenu from '@/components/account-menu';
import LanguageDropdown from '@/components/language-dropdown';

// Translations for Navbar UI strings by language code
const translations: Record<string, { 
  logo: string; 
  blog: string; 
  about: string; 
  features: string; 
  login: string;
}> = { 
  en: { 
    logo: "Zerlo", 
    blog: "Blog", 
    about: "About", 
    features: "Features", 
    login: "Log In", 
  }, 
  fr: { 
    logo: "Zerlo", 
    blog: "Blog", 
    about: "About", 
    features: "Functionality", 
    login: "Se connecter", 
  }, 
  he: {
    logo: "Zarlo", 
    blog: "blog", 
    about: "About", 
    features: "features", 
    login: "log in", 
  }, 
  zh: { 
    logo: "Zerlo", 
    blog: "blog", 
    about: "about", 
    features: "funcción", 
    login: "login", 
  }, 
  ar: { 
    logo: "Zirlo", 
    blog: "Blog", 
    about: "about", 
    features: "Al-Mizat", 
    login: "login", 
  }, 
  ru: { 
    logo: "Zerlo", 
    blog: "Блог", 
    about: "О нас", 
    features: "Functions", 
    login: "Login", 
  }, 
  hi: { 
    logo: "Zarlo", 
    blog: "blog", 
    about: "about it", 
    features: "features",
    login: "Log in", 
  },
};

export default async function Navbar() { 
  const supabase = await createClient(); 
  const { data: { user } } = await supabase.auth.getUser(); 
  const language = user?.user_metadata?.language || "en"; // Fallback to English if no user or language 
  const currentTexts = translations[language] || translations.en; 

  return ( 
    <nav className="fixed top-0 left-0 right-0 z-50"> 
      <div className="bg-[#ffffff] backdrop-blur-md px-6 py-3 flex items-center justify-between  mx-auto"> 
        {/* Logo Section */} 
        <div className="flex items-center"> 
          <Link href="/"> 
            <h1 className="text-2xl font-bold relative top-[-2px] text-black/70 cursor-default"> 
              {currentTexts.logo} 
            </h1> 
          </Link> 
        </div> 

        {/* Centered Navigation Links */} 
        <div className="flex-1 flex justify-center gap-6"> 
          <Link 
            href="/" 
            className="text-black/70 hover:text-black/60 font-medium transition-colors duration-200 cursor-default" 
          > 
            {currentTexts.blog} 
          </Link> 
          <Link 
            href="/about" 
            className="text-black/70 hover:text-black/60 font-medium transition-colors duration-200 cursor-default" 
          > 
            {currentTexts.about} 
          </Link> 
          <Link 
            href="/features" 
            className="text-black/70 hover:text-black/60 font-medium transition-colors duration-200 cursor-default" 
          > 
            {currentTexts.features} 
          </Link> 
        </div> 

        {/* Right Side Actions */} 
        <div className="flex items-center gap-4"> 
          <LanguageDropdown user={user} currentLanguage={language} /> 
          {user ? ( 
            <AccountMenu user={user} /> 
          ) : ( 
            <Button 
              asChild 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 transition-all duration-200 hover:shadow-md"
            >
              <Link href="/login">{currentTexts.login}</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}