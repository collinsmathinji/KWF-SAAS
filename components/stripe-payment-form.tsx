"use client"

import type React from "react"

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface StripePaymentFormProps {
  onSuccess: () => void
  amount: number
}

export function StripePaymentForm({ onSuccess }: StripePaymentFormProps) {
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
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/signUp`,
        },
      })

      if (error) {
        setMessage(error.message || "An unexpected error occurred.")
        return
      }

      onSuccess()
    } catch (error) {
      console.log("Error confirming payment:", error)
      setMessage("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle direct button click (in case form submit doesn't trigger)
  const handleButtonClick = () => {
    if (!stripe || !elements) {
      toast({
        title: "Payment processing unavailable",
        description: "Please wait while we initialize the payment system.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="overflow-y-auto pr-1 mb-16" style={{ maxHeight: "calc(70vh - 180px)" }}>
        <form onSubmit={handleSubmit} className="w-full">
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
        </form>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 p-4 border-t border-gray-200 dark:border-gray-800 mx-auto w-full max-w-md">
        <Button onClick={handleButtonClick} disabled={!stripe || isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay`
          )}
        </Button>
      </div>
    </div>
  )
}

