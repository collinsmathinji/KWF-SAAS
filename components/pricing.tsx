"use client"

import { Check, HelpCircle, X } from "lucide-react"
import { useState, useMemo } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { AnimatedSection } from "./ui/animated-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { StripePaymentForm } from "@/components/stripe-payment-form"
import { useToast } from "@/components/ui/use-toast"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Plan {
  id: string
  name: string
  description: string
  basePrice: number | string
  maxContacts: number | string
  maxGroups: number | string
  maxStaff: number | string
  maxEventStaff: number | string
  features: {
    memberPortal: number | string | boolean
    stripePayments: boolean
    prioritySupport: boolean
  }
}

const basePlans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small organizations starting their journey",
    basePrice: 19.99,
    maxContacts: 50,
    maxGroups: 2,
    maxStaff: 1,
    maxEventStaff: 3,
    features: {
      memberPortal: false,
      stripePayments: true,
      prioritySupport: false,
    },
  },
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for growing organizations",
    basePrice: 39.99,
    maxContacts: 200,
    maxGroups: 5,
    maxStaff: 3,
    maxEventStaff: 10,
    features: {
      memberPortal: false,
      stripePayments: true,
      prioritySupport: false,
    },
  },
  {
    id: "pro",
    name: "Pro",
    description: "Ideal for established organizations",
    basePrice: 79.99,
    maxContacts: 1000,
    maxGroups: 10,
    maxStaff: 10,
    maxEventStaff: 20,
    features: {
      memberPortal: 100 ,
      stripePayments: true,
      prioritySupport: false,
    },
  },
  {
    id: "business",
    name: "Business",
    description: "For larger organizations",
    basePrice: 149.99,
    maxContacts: 5000,
    maxGroups: 20,
    maxStaff: 25,
    maxEventStaff: 50,
    features: {
      memberPortal: 500 ,
      stripePayments: true,
      prioritySupport: true,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Enterprise-grade features and support",
    basePrice: 299.99,
    maxContacts: 10000,
    maxGroups: 40,
    maxStaff: 50,
    maxEventStaff: 100,
    features: {
      memberPortal: 1000,
      stripePayments: true,
      prioritySupport: true,
    },
  },
  {
    id: "scale",
    name: "Scale",
    description: "For rapidly growing organizations",
    basePrice: 499.99,
    maxContacts: 20000,
    maxGroups: 80,
    maxStaff: 100,
    maxEventStaff: 200,
    features: {
      memberPortal: 2000 ,
      stripePayments: true,
      prioritySupport: true,
    },
  },
  {
    id: "ultra",
    name: "Ultra",
    description: "Maximum capabilities and support",
    basePrice: 799.99,
    maxContacts: 30000,
    maxGroups: 150,
    maxStaff: 200,
    maxEventStaff: 500,
    features: {
      memberPortal: 3000 ,
      stripePayments: true,
      prioritySupport: true,
    },
  },
  {
    id: "custom",
    name: "Custom",
    description: "Tailored solutions for your organization",
    basePrice: "Contact Us",
    maxContacts: "Custom",
    maxGroups: "Custom",
    maxStaff: "Custom",
    maxEventStaff: "Custom",
    features: {
      memberPortal: "Custom",
      stripePayments: true,
      prioritySupport: true,
    },
  },
]

const contactOptions = [
  { value: "50", label: "Up to 50" },
  { value: "200", label: "Up to 200" },
  { value: "1000", label: "Up to 1,000" },
  { value: "5000", label: "Up to 5,000" },
  { value: "10000", label: "Up to 10,000" },
  { value: "20000", label: "Up to 20,000" },
  { value: "30000", label: "Up to 30,000" },
  { value: "more", label: "More than 30,000" },
]

const membersPortalOptions = [
  { value: "0", label: "None" },
  { value: "100", label: "Up to 100" },
  { value: "500", label: "Up to 500" },
  { value: "1000", label: "Up to 1000" },
  { value: "2000", label: "Up to 2000" },
  { value: "3000", label: "Up to 3000" },
  { value: "more", label: "More than 3000" },
]

const addOns = [
  { name: "+500 Members", price: 40.0, description: "Adds 500 members to your plan" },
  { name: "+1,000 Members", price: 75.0, description: "Adds 1,000 members to your plan" },
  { name: "+5,000 Members", price: 299.0, description: "Adds 5,000 members to your plan" },
  { name: "+10,000 Members", price: 599.0, description: "Adds 10,000 members to your plan" },
  { name: "+5 Groups", price: 20.0, description: "Adds 5 groups to your plan" },
  { name: "+10 Groups", price: 35.0, description: "Adds 10 groups to your plan" },
  { name: "+5 Staff Members", price: 30.0, description: "Adds 5 staff members to your plan" },
  { name: "+10 Staff Members", price: 50.0, description: "Adds 10 staff members to your plan" },
  { name: "+10 Event Staff", price: 25.0, description: "Adds 10 event staff to your plan" },
  {
    name: "Enable Member Portal",
    price: 14.99,
    description: "Unlocks portal access for all members (Basic plan only)",
  },
]

export function Pricing() {
  const [showAddOns, setShowAddOns] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState("200")
  const [memberOptions, setMemberOptions] = useState("3")
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>("")
  const router = useRouter()
  const { toast } = useToast()

  const handlePlanSelection = async (plan: Plan) => {
    if (plan.id === "custom") {
      // Handle custom plan differently
      router.push("/contact-sales")
      return
    }

    setSelectedPlan(plan)
    setIsPaymentModalOpen(true)

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

  // Filter and sort plans based on selected contacts and staff
  const filteredPlans = useMemo(() => {
    if (selectedContacts === "more" || memberOptions === "more") {
      return [basePlans[basePlans.length - 1]] // Show only Custom plan
    }

    const contactsNum = Number.parseInt(selectedContacts)
    const staffNum = Number.parseInt(memberOptions)

    return basePlans
      .filter((plan) => {
        if (typeof plan.maxContacts === "string") return false
        if (typeof plan.features.memberPortal === "string") return false
        return plan.maxContacts >= contactsNum && typeof plan.features.memberPortal === "number" && plan.features.memberPortal >= staffNum
      })
      .slice(0, 4) // Show only the first 4 matching plans
  }, [selectedContacts, memberOptions])

  // Find recommended plan
  const recommendedPlan = useMemo(() => {
    if (selectedContacts === "more" || memberOptions === "more") return null
    return filteredPlans[0]
  }, [filteredPlans])

  return (
    <section className="container py-24 space-y-8">
      <AnimatedSection className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Find Your Perfect Plan</h2>
        <p className="mx-auto mt-4 max-w-[800px] text-gray-500 md:text-xl">
          Select your requirements to see recommended plans
        </p>
      </AnimatedSection>

      <AnimatedSection>
        <div className="max-w-xl mx-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Contacts</label>
              <Select value={selectedContacts} onValueChange={setSelectedContacts}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contacts" />
                </SelectTrigger>
                <SelectContent>
                  {contactOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Members with Portal Access</label>
                <Select value={memberOptions} onValueChange={setMemberOptions}>
                <SelectTrigger>
                  <SelectValue placeholder="Select members with portal access" />
                </SelectTrigger>
                <SelectContent>
                  {membersPortalOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                  ))}
                </SelectContent>
                </Select>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
        {filteredPlans.map((plan, index) => (
          <AnimatedSection key={plan.id} delay={index * 0.1}>
            <Card
              className={`flex h-full flex-col transition-all hover:shadow-lg ${plan === recommendedPlan ? "border-primary" : ""}`}
            >
              {plan === recommendedPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                  Recommended
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {typeof plan.basePrice === "number" ? `$${plan.basePrice}` : plan.basePrice}
                  </span>
                  {typeof plan.basePrice === "number" && <span className="text-gray-500">/month</span>}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>Maximum number of contacts allowed</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span>Max Contacts: {plan.maxContacts}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Max Groups: {plan.maxGroups}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Max Staff: {plan.maxStaff}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Max Event Staff: {plan.maxEventStaff}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Members With Portal Access: {plan.name==='custom' ? (
                      <span>Custom</span>
                    ) : plan.name==='Basic' ? (
                      <span>None</span>
                    ) : (
                      <span>{plan.features.memberPortal}</span>
                    )}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {typeof plan.features.memberPortal === "string" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>
                      Member Portal{" "}
                      {typeof plan.features.memberPortal === "string" && `(${plan.features.memberPortal})`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.features.stripePayments ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>Stripe Payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.features.prioritySupport ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>Priority Support</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handlePlanSelection(plan)}
                  className="w-full"
                  variant={plan === recommendedPlan ? "default" : "outline"}
                >
                  {plan.name === "Custom" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>
        ))}
      </div>

      {filteredPlans.length > 0 && filteredPlans[0].name !== "Custom" && (
        <AnimatedSection className="mt-12">
          <Dialog open={showAddOns} onOpenChange={setShowAddOns}>
            <DialogTrigger asChild>
              {/* <Button variant="outline" className="mx-auto block">
                View Available Add-ons
              </Button> */}
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add-ons & Extensions</DialogTitle>
                <DialogDescription>
                  Customize your plan with these additional features and capacity increases
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {addOns.map((addon) => (
                  <Card key={addon.name}>
                    <CardHeader>
                      <CardTitle className="text-lg">{addon.name}</CardTitle>
                      <div className="mt-2">
                        <span className="text-2xl font-bold">${addon.price}</span>
                        <span className="text-gray-500">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">{addon.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Add to Plan
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </AnimatedSection>
      )}

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <span>
                  You selected the {selectedPlan.id} plan at $
                  {typeof selectedPlan.basePrice === "number" ? selectedPlan.basePrice : 0}/month
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {clientSecret && selectedPlan && (
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
              <StripePaymentForm
                onSuccess={() => {
                  setIsPaymentModalOpen(false)
                  router.push("/signup")
                }}
                amount={typeof selectedPlan.basePrice === "number" ? selectedPlan.basePrice * 100 : 0}
              />
            </Elements>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

