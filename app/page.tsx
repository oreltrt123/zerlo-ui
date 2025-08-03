import { Toaster } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { Zap } from 'lucide-react';
import { createClient } from '@/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AccountMenu from '@/components/account-menu';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-[#0d1117]">
      <Toaster richColors position="top-center" />
      {/* Header */}
      <div className="border-b border-[#e6e6e6] dark:border-[#30363d] bg-white dark:bg-[#161b22]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div /> {/* Spacer */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {user ? (
                <AccountMenu user={user} />
              ) : (
                <Button asChild>
                  <Link href="/login">Log In</Link>
                </Button>
              )}
            </div>
          </div>
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f6f6f6] dark:bg-[#21262d] border border-[#e6e6e6] dark:border-[#30363d] rounded-full text-sm text-[#666666] dark:text-[#8b949e] font-medium">
              <Zap className="h-3 w-3" />
              <span>Powered by Google Gemini</span>
            </div>
            <h1 className="text-5xl font-[650] text-[#0f1419] dark:text-[#f0f6fc] tracking-[-0.02em] leading-[1.1]">
              Generative UI
            </h1>
            <p className="text-[#666666] dark:text-[#8b949e] text-lg font-[450] max-w-2xl mx-auto leading-relaxed">
              Transform your data into beautiful, interactive React components instantly.
              No coding required.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}