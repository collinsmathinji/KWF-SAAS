"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { stripe } from "@/app/api/stripe/stripehook"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionStatus, setSessionStatus] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const session_id = urlParams.get("session_id")
    if (session_id) {
      setSessionId(session_id)
      fetchSessionStatus(session_id)
    } else {
      router.push("/settings/subscription")
    }
  }, [router])

  const fetchSessionStatus = async (session_id: string) => {
    try {
      // In development, skip session verification
      if (process.env.NODE_ENV !== "production" && session_id === "mock_session_id") {
        setSessionStatus("complete")
        return
      }

      if (!stripe) {
        throw new Error("Stripe is not configured")
      }

      const session = await stripe.checkout.sessions.retrieve(session_id)

      if (session.status !== "complete") {
        router.push("/settings/subscription")
      } else {
        setSessionStatus("complete")
      }
    } catch (error) {
      console.error("Error retrieving session:", error)
      router.push("/settings/subscription")
    }
  }

  if (!sessionId || sessionStatus !== "complete") {
    return null
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl text-center">
      <div className="mb-8">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-blue-900">Payment Successful!</h1>
        <p className="mt-2 text-gray-600">
          Thank you for your subscription. Your payment has been processed successfully.
        </p>
      </div>
      <Button
        onClick={() => (window.location.href = "/settings/subscription")}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        Return to Subscription
      </Button>
    </div>
  )
}