import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe-server"
import { STRIPE_PLANS, type StripePlan } from "@/lib/stripe-config"
import { createServerClient } from "@/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[Payments] Payment intent creation started")

    const { plan } = await request.json()
    console.log("[Payments] Selected plan:", plan)

    if (!plan || !STRIPE_PLANS[plan as StripePlan]) {
      console.error("[Payments] Invalid plan selected:", plan)
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }

    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[Payments] Auth error in payment intent:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const selectedPlan = STRIPE_PLANS[plan as StripePlan]
    console.log("[Payments] Creating payment intent for:", selectedPlan)

    // Create payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: selectedPlan.price,
      currency: "usd",
      metadata: {
        userId: user.id,
        plan,
        credits: selectedPlan.credits.toString(),
      },
    })

    console.log("[Payments] Payment intent created:", paymentIntent.id)

    // Store pending payment in DB
    const { error: dbError } = await supabase.from("payments").insert({
      user_id: user.id,
      stripe_payment_intent_id: paymentIntent.id,
      amount: selectedPlan.price,
      credits: selectedPlan.credits,
      status: "pending",
    })

    if (dbError) {
      console.error("[Payments] Database error while inserting payment:", dbError)
      return NextResponse.json({ error: "Failed to create payment record" }, { status: 500 })
    }

    console.log("[Payments] Payment intent successfully stored")
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("[Payments] Payment intent creation error:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
