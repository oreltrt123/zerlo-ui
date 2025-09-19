import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe-server"
import { addCredits } from "@/lib/credits"
import { createServerClient } from "@/supabase/server"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("[Webhook] Signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = await createServerClient()

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("[Webhook] PaymentIntent succeeded:", paymentIntent.id)
        console.log("[Webhook] Metadata:", paymentIntent.metadata)

        const userId = paymentIntent.metadata.userId
        const credits = paymentIntent.metadata.credits

        if (!userId || !credits) {
          console.error("[Webhook] Missing metadata in payment intent")
          return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
        }

        // Update payment status in DB
        const { error: updateError } = await supabase
          .from("payments")
          .update({ status: "completed" })
          .eq("stripe_payment_intent_id", paymentIntent.id)

        if (updateError) {
          console.error("[Webhook] Failed to update payment status:", updateError)
        }

        try {
          const creditAmount = parseInt(credits, 10)
          await addCredits(userId, creditAmount, supabase)
          console.log(`[Webhook] ✅ Added ${creditAmount} credits to user ${userId}`)
        } catch (error) {
          console.error("[Webhook] Failed to add credits:", error)
          return NextResponse.json({ error: "Failed to add credits" }, { status: 500 })
        }

        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("[Webhook] Payment failed:", paymentIntent.id)

        const { error: updateError } = await supabase
          .from("payments")
          .update({ status: "failed" })
          .eq("stripe_payment_intent_id", paymentIntent.id)

        if (updateError) {
          console.error("[Webhook] Failed to update failed payment:", updateError)
        }

        break
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[Webhook] Handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
