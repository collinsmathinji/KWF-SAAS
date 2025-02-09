"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { createCheckoutSession } from "@/app/actions/create-checkout-session"


// Make sure to add your publishable key to your environment variables
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PlanFeature {
  free: boolean
  standard: boolean
  pro: boolean
  description: string
}

const planFeatures: PlanFeature[] = [
  {
    description: "Team members",
    free: true,
    standard: true,
    pro: true,
  },
  {
    description: "Unlimited projects",
    free: false,
    standard: true,
    pro: true,
  },
  {
    description: "Advanced analytics",
    free: false,
    standard: true,
    pro: true,
  },
  {
    description: "24/7 support",
    free: false,
    standard: false,
    pro: true,
  },
  {
    description: "Custom integrations",
    free: false,
    standard: false,
    pro: true,
  },
]


export function ChangePlanDialog() {
  const [users, setUsers] = useState(50)
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [members, setMembers] = useState(50) // Added state for members

  const handlePlanChange = async () => {
    try {
      setLoading(true)

      const { url } = await createCheckoutSession(selectedPlan, users)

      if (!url) {
        throw new Error("Failed to create checkout session")
      }

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  const calculatePrice = (plan: string, users: number, members: number) => {
    switch (plan) {
      case "free":
        return 0
      case "standard":
        return (users * 1 + members * 0.005)
      case "pro":
        return (users * 1 + members * 0.01)
      default:
        return 0
    }
  }
  
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
          Change Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900">Choose your plan</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <div className="mb-8">
            <Label className="text-base">Organization size</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[users]}
                onValueChange={(value) => setUsers(value[0])}
                max={100}
                min={5}
                step={5}
                className="my-4"
              />
              <span className="font-medium text-blue-900 min-w-[4rem]">{users} users</span>
              <Slider
                value={[members]}
                onValueChange={(value) => setMembers(value[0])}
                max={10000}
                min={50}
                step={25}
                className="my-4"
              />
              <span className="font-medium text-blue-900 min-w-[4rem]">{members} Members</span>
            </div>
          </div>

          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid grid-cols-3 gap-4">
            {/* Free Plan */}
            <div className={`${users > 10 || members > 200 ? "opacity-50 pointer-events-none" : ""}`}>
              <RadioGroupItem value="free" id="free" className="peer sr-only" disabled={users > 10 || members > 200} />
              <Label
                htmlFor="free"
                className="flex flex-col h-full p-6 border-2 rounded-lg border-muted peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600"
              >
                <div className="mb-4">
                  <h3 className="font-bold text-xl text-blue-900">Free</h3>
                  <p className="text-sm text-gray-500">For small teams starting out</p>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-blue-900">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-2 text-sm flex-1">
                  {planFeatures.map((feature, i) => (
                    <li key={i} className={`flex items-center ${feature.free ? "text-gray-700" : "text-gray-400"}`}>
                      {feature.free ? (
                        <Check className="h-4 w-4 mr-2 text-blue-500" />
                      ) : (
                        <span className="h-4 w-4 mr-2" />
                      )}
                      {feature.description}
                    </li>
                  ))}
                </ul>
              </Label>
            </div>

            {/* Standard Plan */}
            <div>
              <RadioGroupItem value="standard" id="standard" className="peer sr-only" />
              <Label
                htmlFor="standard"
                className="flex flex-col h-full p-6 border-2 rounded-lg border-muted peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600"
              >
                <div className="mb-4">
                  <h3 className="font-bold text-xl text-blue-900">Standard</h3>
                  <p className="text-sm text-gray-500">For growing businesses</p>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-blue-900">${calculatePrice("standard", users, members)}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-2 text-sm flex-1">
                  {planFeatures.map((feature, i) => (
                    <li key={i} className={`flex items-center ${feature.standard ? "text-gray-700" : "text-gray-400"}`}>
                      {feature.standard ? (
                        <Check className="h-4 w-4 mr-2 text-blue-500" />
                      ) : (
                        <span className="h-4 w-4 mr-2" />
                      )}
                      {feature.description}
                    </li>
                  ))}
                </ul>
              </Label>
            </div>

            {/* Pro Plan */}
            <div>
              <RadioGroupItem value="pro" id="pro" className="peer sr-only" />
              <Label
                htmlFor="pro"
                className="flex flex-col h-full p-6 border-2 rounded-lg border-muted peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600"
              >
                <div className="mb-4">
                  <h3 className="font-bold text-xl text-blue-900">Pro</h3>
                  <p className="text-sm text-gray-500">For large organizations</p>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-blue-900">${calculatePrice("pro", users, members)}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-2 text-sm flex-1">
                  {planFeatures.map((feature, i) => (
                    <li key={i} className={`flex items-center ${feature.pro ? "text-gray-700" : "text-gray-400"}`}>
                      {feature.pro ? (
                        <Check className="h-4 w-4 mr-2 text-blue-500" />
                      ) : (
                        <span className="h-4 w-4 mr-2" />
                      )}
                      {feature.description}
                    </li>
                  ))}
                </ul>
              </Label>
            </div>
          </RadioGroup>

          <div className="mt-8">
            {/* <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Accepted Payment Methods</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Credit Card</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Image src="/paypal.svg" alt="PayPal" width={20} height={20} className="h-5 w-5" />
                  <span className="text-sm">PayPal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Bank Transfer</span>
                </div>
              </div>
            </div> */}

            <div className="flex justify-end space-x-4">
              <DialogTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogTrigger>
              <Button
                onClick={handlePlanChange}
                disabled={loading || selectedPlan === "free"}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Upgrade to ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

