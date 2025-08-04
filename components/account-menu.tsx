'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/supabase/client';
import { User } from '@supabase/supabase-js'; // Import Supabase User type
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AccountMenuProps {
  user: User | null; // Use specific type instead of any
}

export default function AccountMenu({ user }: AccountMenuProps) {
  const supabase = createClient();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    async function getProfile() {
      if (!user || !user.id) {
        console.warn('No user or user ID provided.');
        return;
      }

      try {
        const { data, error, status } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .maybeSingle();

        console.log('Supabase profile fetch response:', { data, error, status });

        if (error && status !== 406) {
          console.warn('Supabase error:', error.message, 'status:', status);
          return;
        }

        if (data) {
          setUsername(data.username || null);
          setAvatarUrl(data.avatar_url || null);
        } else {
          console.warn('No profile data found for user.id:', user.id);
        }
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
      }
    }

    getProfile();
  }, [user, supabase]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-8 w-8 rounded-full bg-[#8888881A]">
          <Avatar className="h-8 w-8 text-black/70 ">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={username || 'User Avatar'} />
            ) : (
              <AvatarFallback>
                <UserIcon className="h-4 w-4" />
              </AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36 relative top-[-15px]" align="end" forceMount>
        {/* <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{username || user?.email || 'Guest'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email || ''}</p>
          </div>
        </DropdownMenuLabel> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/chat">
            <UserIcon className="mr-2 h-4 w-4 text-white" />
            <span>Chat</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4 text-white" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}