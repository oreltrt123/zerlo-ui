"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { loadStripe } from "@stripe/stripe-js"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51QUBQBG2lPfNB7xgVwluaOhNAZqn7gzgYWNIuqcLG5YFBQ7PEKQ22XWpcinoJUWmA9hhCTAauQZvVwhGfEe0xDZW00ZkQk0dhq",
)

interface Translations {
  premiumTitle: string
  premiumDescription: string
  monthlyPrice: string
  subscribe: string
  cancel: string
  processing: string
  error: string
  success: string
}

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  translations: Translations
  subscriptionStatus: "free" | "premium"
}

export default function PremiumModal({ isOpen, onClose, user, translations: t, subscriptionStatus }: PremiumModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState("")
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  const handleSubscribe = async () => {
    if (!user) return

    if (subscriptionStatus === "premium") {
      setAlertMessage("You are currently in a Pro subscription. You do not have the option to buy it again until the end of the month.")
      return
    }

    setIsProcessing(true)
    setPaymentError("")
    setPaymentSuccess("")
    setAlertMessage(null)

    try {
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to load")
      }

      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_1S0SIoG2lPfNB7xgevflHbFm",
          userId: user.id,
          userEmail: user.email,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error creating subscription:", error)
      setPaymentError(t.error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFreePlanClick = () => {
    if (subscriptionStatus === "free") {
      setAlertMessage("You are already in the Free subscription. You cannot upgrade or lock this plan.")
    } else {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
      <section className="py-16 md:py-32 modal-content">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <h1 className="text-center text-4xl font-semibold lg:text-5xl text-accent-foreground">
              Subscription & Tokens
            </h1>
            <p className="mt-[-16px] text-accent-foreground" style={{ fontSize: "14.5px" }}>
              Access the island with subscribe for $10/month for unlimited messages.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-2 justify-center">
            <Card className="flex flex-col rounded-lg p-4 border border-[#88888817]">
              <CardHeader>
                <CardTitle className="font-medium">Free</CardTitle>
                <span className="my-3 block text-2xl font-semibold">$0 / mo</span>
                <CardDescription className="text-sm">Per editor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {["Basic Analytics Dashboard", "5GB Cloud Storage", "Email and Chat Support"].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  onClick={handleFreePlanClick}
                  asChild
                  className="r2552esf25_252trewt3erblueFontDocs w-full bg-[#88888817] hover:bg-[#8888880a] cursor-default shadow-none"
                  variant="outline"
                >
                  <Link href={""}>Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col rounded-lg p-4 border border-[#0099ff21]">
              <CardHeader>
                <CardTitle className="font-medium">Startup</CardTitle>
                <span className="my-3 block text-2xl font-semibold">$29 / mo</span>
                <CardDescription className="text-sm">Per editor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {["Everything in Pro Plan", "5GB Cloud Storage", "Email and Chat Support"].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  onClick={handleSubscribe}
                  asChild
                  variant="outline"
                  className="r2552esf25_252trewt3erblueFontDocs w-full bg-[#0099FF] hover:bg-[#0099ffbe] hover:text-white cursor-default shadow-none text-white"
                >
                  <Link href={""}>{isProcessing ? t.processing : subscriptionStatus === "premium" ? "Already Subscribed" : t.subscribe}</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          {alertMessage && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>Subscription Status</AlertTitle>
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}
          {paymentError && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{paymentError}</AlertDescription>
            </Alert>
          )}
          {paymentSuccess && (
            <Alert variant="default" className="mt-6">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{paymentSuccess}</AlertDescription>
            </Alert>
          )}
        </div>
      </section>
    </div>
  )
}