import { createServerClient as createSupabaseClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createServerClient() {
  const cookieStore = await cookies()

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,         // ✅ matches .env.local
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,    // ✅ fixed env var name
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // Safe to ignore if middleware refreshes sessions.
          }
        },
      },
    }
  )
}

export const getSupabaseClient = createServerClient
