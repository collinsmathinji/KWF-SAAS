"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Elements } from "@stripe/react-stripe-js"
import { PaymentElement } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { AlertCircle, CheckCircle2 } from "lucide-react"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  intentId: string
}

export function CheckoutForm({ intentId }: CheckoutFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Handle the payment submission
      // In a real app, you would process the payment here
      setSuccess(true)

      // Redirect to success page after a brief delay
      setTimeout(() => {
        router.push("/donation-success")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed")
      setLoading(false)
    }
  }

  return (
    <Elements stripe={stripePromise}>
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Donation</CardTitle>
          <CardDescription>Enter your payment details to complete your donation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <Alert className="bg-primary/10 border-primary text-primary">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Thank you for your donation!</AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <PaymentElement />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Processing..." : "Complete Donation"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">Your donation is secure and encrypted</CardFooter>
      </Card>
    </Elements>
  )
}

