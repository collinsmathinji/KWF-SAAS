"use client"

import type React from "react"

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface StripePaymentFormProps {
  onSuccess: (paymentIntent: any) => void
  amount: number
}

export function StripePaymentForm({ onSuccess, amount }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      toast({
        title: "Payment processing unavailable",
        description: "Please wait while we initialize the payment system.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      // Use confirmPayment to handle the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (error) {
        setMessage(error.message || "An unexpected error occurred.")
        return
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Pass the payment intent to the onSuccess callback
        onSuccess(paymentIntent)
      }
    } catch (error) {
      console.log("Error confirming payment:", error)
      setMessage("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
          wallets: {
            applePay: "auto",
            googlePay: "auto",
          },
        }}
      />
      {message && <div className="text-sm text-red-500 mt-2">{message}</div>}
      <Button type="submit" disabled={!stripe || isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay`
        )}
      </Button>
    </form>
  )
}
