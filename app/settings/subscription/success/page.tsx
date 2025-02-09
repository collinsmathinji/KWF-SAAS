import { redirect } from "next/navigation"
import { stripe } from "@/app/api/stripe/config"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string }
}) {
  const sessionId = searchParams.session_id

  if (!sessionId) {
    redirect("/settings/subscription")
  }

  try {
    // In development, skip session verification
    if (process.env.NODE_ENV !== "production" && sessionId === "mock_session_id") {
      return (
        <div className="container mx-auto p-6 max-w-3xl text-center">
          <div className="mb-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h1 className="mt-4 text-2xl font-bold text-blue-900">Payment Successful! (Development Mode)</h1>
            <p className="mt-2 text-gray-600">
              This is a mock success page for development. In production, this would verify the payment with Stripe.
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

    if (!stripe) {
      throw new Error("Stripe is not configured")
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.status !== "complete") {
      return redirect("/settings/subscription")
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
  } catch (error) {
    console.error("Error retrieving session:", error)
    return redirect("/settings/subscription")
  }
}

