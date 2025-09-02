import { createClient } from '@/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError?.message || 'No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Revoke existing key
    const { error: revokeError } = await supabase
      .from('api_keys')
      .update({ revoked_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .is('revoked_at', null);

    if (revokeError) {
      console.error('Revoke error:', revokeError.message);
      return NextResponse.json({ error: 'Failed to revoke existing key' }, { status: 500 });
    }

    // Generate new key
    const plainKey = `sk_${crypto.randomBytes(32).toString('base64url')}`;
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedKey = crypto.scryptSync(plainKey, salt, 64).toString('hex') + '.' + salt;

    // Store new key
    const { error: insertError } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        key_hash: hashedKey,
        scopes: ['generate:3d-game'],
      });

    if (insertError) {
      console.error('Insert error:', insertError.message);
      return NextResponse.json({ error: 'Failed to generate new API key' }, { status: 500 });
    }

    console.log('New API key generated for user:', user.id);
    return NextResponse.json({ apiKey: plainKey });
  } catch (error) {
    console.error('Unexpected error in regenerate-apikey:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}