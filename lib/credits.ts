import { createClient } from "@/supabase/client"
import { SupabaseClient } from "@supabase/supabase-js"

// Get user credits, create entry if not found
export async function getUserCredits(userId: string, supabase: SupabaseClient) {
  console.log("[Credits] Fetching for user:", userId)

  const { data, error } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single()

  if (error || !data) {
    console.log("[Credits] User not found → creating with 5 credits")
    const { data: newUser, error: insertError } = await supabase
      .from("user_credits")
      .insert({ user_id: userId, credits: 5 })
      .select("credits")
      .single()

    if (insertError) {
      console.error("[Credits] Error creating user credits:", insertError)
      return 0
    }

    console.log("[Credits] Created new user with credits:", newUser.credits)
    return newUser.credits
  }

  console.log("[Credits] Found existing credits:", data.credits)
  return data.credits
}

// Deduct 1 credit from user
export async function deductCredit(userId: string, supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single()

  if (error || !data) throw new Error("Failed to fetch user credits")
  if (data.credits <= 0) throw new Error("Insufficient credits")

  const newCredits = data.credits - 1
  const { error: updateError } = await supabase
    .from("user_credits")
    .update({ credits: newCredits, updated_at: new Date().toISOString() })
    .eq("user_id", userId)

  if (updateError) throw new Error("Failed to deduct credit")
  return newCredits
}

// Add credits (used in webhook after successful payment)
export async function addCredits(userId: string, creditsToAdd: number, supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single()

  if (error || !data) {
    console.log("[Credits] User not found → creating with credits:", creditsToAdd)
    const { error: insertError } = await supabase
      .from("user_credits")
      .insert({ user_id: userId, credits: creditsToAdd })

    if (insertError) throw new Error("Failed to create user credits")
    return creditsToAdd
  }

  const newCredits = data.credits + creditsToAdd
  const { error: updateError } = await supabase
    .from("user_credits")
    .update({ credits: newCredits, updated_at: new Date().toISOString() })
    .eq("user_id", userId)

  if (updateError) throw new Error("Failed to add credits")
  return newCredits
}

// Fetch credits client-side
export async function getClientCredits() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { data, error } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("[Credits] Error fetching client credits:", error)
    return 0
  }

  return data?.credits || 0
}
