import { NextResponse } from "next/server"
import { createServerClient } from "@/supabase/server"
import { deductCredit } from "@/lib/credits"

export async function POST() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const remainingCredits = await deductCredit(user.id, supabase)

    return NextResponse.json({ credits: remainingCredits })
  } catch (error) {
    console.error("[Credits] Deduction error:", error)
    if (error instanceof Error && error.message === "Insufficient credits") {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to deduct credit" }, { status: 500 })
  }
}
