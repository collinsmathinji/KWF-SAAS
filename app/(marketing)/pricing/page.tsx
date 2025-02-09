"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { StripePaymentForm } from "@/components/stripe-payment-form"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Plan {
  id: string
  name: string
  price: number
  description: string
  popular?: boolean
  features: string[]
}

const PricingAndBillingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>("")
  const router = useRouter()
  const { toast } = useToast()
  const isDevelopment =true

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 29,
      description: "Perfect for small organizations",
      features: [
        "Up to 1,000 contacts",
        "Basic contact fields",
        "Email support",
        "CSV import/export",
        "Basic analytics",
      ],
    },
    {
      id: "professional",
      name: "Professional",
      price: 99,
      description: "Ideal for growing businesses",
      popular: true,
      features: [
        "Up to 10,000 contacts",
        "Custom fields",
        "Priority support",
        "Advanced analytics",
        "API access",
        "Team collaboration",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 299,
      description: "For large organizations",
      features: [
        "Unlimited contacts",
        "Custom integrations",
        "24/7 support",
        "Advanced security",
        "Dedicated account manager",
        "Custom training",
      ],
    },
  ]

  const handlePlanSelection = async (plan: Plan) => {
    setSelectedPlan(plan)
    setIsPaymentModalOpen(true)

    if (isDevelopment) {
      try {
        const response = await fetch("/api/create-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: plan.id,
          }),
        })

        if (!response.ok) {
          console.error("Failed to create subscription", response)
          throw new Error("Failed to create subscription")
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        })
        setIsPaymentModalOpen(false)
      }
    }
  }

  const handleDevelopmentPayment = () => {
    // Simulate loading
    toast({
      title: "Development Mode",
      description: "Payment simulated successfully!",
    })
    setTimeout(() => {
      router.push("/signup")
    }, 1500)
  }

  // const appearance = {
  //   theme: "stripe",
  //   variables: {
  //     colorPrimary: "#2563eb",
  //     colorBackground: "#ffffff",
  //     colorText: "#1e3a8a",
  //     colorDanger: "#df1b41",
  //     fontFamily: "system-ui, sans-serif",
  //     spacingUnit: "4px",
  //     borderRadius: "8px",
  //   },
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="container mx-auto px-6">
        {/* Pricing Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4 text-blue-900">Simple, Transparent Pricing</h1>
          <p className="text-gray-600">Choose the perfect plan for your organizations needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handlePlanSelection(plan)}
              className={`bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer ${
                selectedPlan?.id === plan.id ? "ring-4 ring-blue-500" : "hover:shadow-xl"
              } ${plan.popular ? "border-2 border-blue-500" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">Most Popular</span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2 text-blue-900">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-blue-800">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-blue-600 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Dialog */}
        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-blue-900 mb-2">Complete Your Purchase</DialogTitle>
              <DialogDescription className="text-gray-600">
                {isDevelopment
                  ? "Development Mode: Click subscribe to simulate payment"
                  : `Enter your payment details to subscribe to the ${selectedPlan?.name} plan`}
              </DialogDescription>
            </DialogHeader>

            {/* Plan Summary */}
            <div className="bg-blue-50 rounded-lg p-4 flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-blue-900">{selectedPlan?.name} Plan</h3>
                <p className="text-gray-600">{selectedPlan?.description}</p>
              </div>
              <div className="text-2xl font-bold text-blue-800">${selectedPlan?.price}/month</div>
            </div>

            {!isDevelopment ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">
                    Development Mode: Payment processing is simulated. In production, you will see the actual Stripe
                    payment form.
                  </p>
                </div>
                <Button onClick={handleDevelopmentPayment} className="w-full">
                  Simulate Payment
                </Button>
              </div>
            ) : (
              clientSecret &&
              selectedPlan && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#2563eb",
                        colorBackground: "#ffffff",
                        colorText: "#1e3a8a",
                        colorDanger: "#df1b41",
                        fontFamily: "system-ui, sans-serif",
                        spacingUnit: "4px",
                        borderRadius: "8px",
                      },
                    },
                  }}
                >
                  <StripePaymentForm onSuccess={() => router.push("/signup")} amount={selectedPlan.price} />
                </Elements>
              )
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default PricingAndBillingPage

