import { NextResponse } from "next/server"
import { createServerClient } from "@/supabase/server"
import { getUserCredits } from "@/lib/credits"

export async function GET() {
  try {
    console.log("[Credits] API called")
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[Credits] Unauthorized:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[Credits] Authenticated user:", user.id)
    const credits = await getUserCredits(user.id, supabase)
    console.log("[Credits] Returning credits:", credits)

    return NextResponse.json({ credits })
  } catch (error) {
    console.error("[Credits] Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch credits" }, { status: 500 })
  }
}
