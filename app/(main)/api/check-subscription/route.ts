import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/supabase/server'; // ✅ updated import

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    const supabase = await createServerClient(); // ✅ use server client

    // Check subscription status in your database
    const { data, error } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const isPremium = data && new Date(data.current_period_end) > new Date();

    return NextResponse.json({ isPremium: !!isPremium });
  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json({ isPremium: false });
  }
}
