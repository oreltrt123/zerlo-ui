// import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from '@/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AccountMenu from '@/components/account-menu';

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-full px-6 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
        <h1 className="text-2xl font-bold relative top-[-2px] text-[#353532]">Zerlo</h1>
        </div>

        {/* Centered Navigation Links */}
        <div className="flex-1 flex justify-center gap-6">
          <Link 
            href="/" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            About
          </Link>
          <Link 
            href="/features" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Features
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* <ThemeToggle /> */}
          {user ? (
            <AccountMenu user={user} />
          ) : (
            <Button 
              asChild 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 transition-all duration-200 hover:shadow-md"
            >
              <Link href="/login">Log In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}