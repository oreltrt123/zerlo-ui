"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Check, Loader2, Coins, Zap } from "lucide-react"
import { STRIPE_PLANS } from "@/lib/stripe-config"
import { toast } from "sonner"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

function CheckoutForm({
  plan,
  onSuccess,
  onClose,
}: {
  plan: "basic" | "premium"
  onSuccess: () => void
  onClose: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      // Create payment intent
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      })

      const { clientSecret, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })

      if (confirmError) {
        throw new Error(confirmError.message)
      }

      toast.success("Payment successful! Credits added to your account.")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Payment error:", error)
      toast.error(error instanceof Error ? error.message : "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  const selectedPlan = STRIPE_PLANS[plan]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">{selectedPlan.name}</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">{selectedPlan.credits} Credits</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                ${(selectedPlan.price / 100).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex-1 bg-transparent">
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Pay ${(selectedPlan.price / 100).toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export function UpgradeModal({ isOpen, onClose, onSuccess }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">("basic")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Upgrade Your Credits</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4 mb-6">
            {/* Basic Plan */}
            <Card
              className={`cursor-pointer transition-all ${
                selectedPlan === "basic"
                  ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onClick={() => setSelectedPlan("basic")}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Basic Plan</CardTitle>
                  </div>
                  <Badge variant="secondary">Popular</Badge>
                </div>
                <CardDescription>Perfect for regular users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold">$10</span>
                  <span className="text-gray-500">one-time</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">10 AI Chat Credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">No expiration</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card
              className={`cursor-pointer transition-all ${
                selectedPlan === "premium"
                  ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onClick={() => setSelectedPlan("premium")}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">Premium Plan</CardTitle>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Best Value
                  </Badge>
                </div>
                <CardDescription>For power users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold">$20</span>
                  <span className="text-gray-500">one-time</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    Save $10
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">30 AI Chat Credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">No expiration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Priority support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm plan={selectedPlan} onSuccess={onSuccess} onClose={onClose} />
          </Elements>
        </div>
      </div>
    </div>
  )
}
