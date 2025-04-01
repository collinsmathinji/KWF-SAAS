"use client"

import { Check, HelpCircle, X } from "lucide-react"
import { useState, useMemo } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useRouter } from "next/navigation"

import { AnimatedSection } from "./ui/animated-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { StripePaymentForm } from "@/components/stripe-payment-form"

// Type definitions
interface PlanFeatures {
  memberPortal: number | false
  stripePayments: boolean
  prioritySupport: boolean
}

interface Plan {
  id: PlanId
  name: string
  description: string
  basePrice: number | "Contact Us"
  maxContacts: number | "Custom"
  maxGroups: number | "Custom"
  maxStaff: number | "Custom"
  maxEventStaff: number | "Custom"
  features: PlanFeatures
}

type PlanId = "starter" | "basic" | "pro" | "business" | "enterprise" | "scale" | "ultra" | "custom"

// Constants
const PLANS: Plan[] = [
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
      memberPortal: 100,
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
      memberPortal: 500,
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
      memberPortal: 2000,
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
      memberPortal: 3000,
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
      memberPortal: false,
      stripePayments: true,
      prioritySupport: true,
    },
  },
]

const CONTACT_OPTIONS = [
  { value: "50", label: "Up to 50" },
  { value: "200", label: "Up to 200" },
  { value: "1000", label: "Up to 1,000" },
  { value: "5000", label: "Up to 5,000" },
  { value: "10000", label: "Up to 10,000" },
  { value: "20000", label: "Up to 20,000" },
  { value: "30000", label: "Up to 30,000" },
  { value: "more", label: "More than 30,000" },
]

const MEMBER_PORTAL_OPTIONS = [
  { value: "0", label: "None" },
  { value: "100", label: "Up to 100" },
  { value: "500", label: "Up to 500" },
  { value: "1000", label: "Up to 1,000" },
  { value: "2000", label: "Up to 2,000" },
  { value: "3000", label: "Up to 3,000" },
  { value: "more", label: "More than 3,000" },
]

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function Pricing() {
  const [selectedContacts, setSelectedContacts] = useState("200")
  const [memberOptions, setMemberOptions] = useState("0")
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>("")
  const router = useRouter()
  const { toast } = useToast()

  // Filter and sort plans based on selected contacts and member portal requirements
  const filteredPlans = useMemo(() => {
    if (selectedContacts === "more" || memberOptions === "more") {
      return [PLANS.find((plan) => plan.id === "custom")!]
    }

    const contactsNum = Number.parseInt(selectedContacts)
    const membersNum = Number.parseInt(memberOptions)

    return PLANS.filter((plan) => {
      if (typeof plan.maxContacts === "string") return false

      const hasEnoughContacts = plan.maxContacts >= contactsNum
      const hasEnoughPortalAccess =
        membersNum === 0
          ? true
          : typeof plan.features.memberPortal === "number" && plan.features.memberPortal >= membersNum

      return hasEnoughContacts && hasEnoughPortalAccess
    }).slice(0, 4)
  }, [selectedContacts, memberOptions])

  // Find recommended plan (first matching plan)
  const recommendedPlan = useMemo(() => {
    if (selectedContacts === "more" || memberOptions === "more") return null
    return filteredPlans[0] || null
  }, [filteredPlans])

  const handlePlanSelection = async (plan: Plan) => {
    if (plan.basePrice === "Contact Us") {
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
          contacts: Number.parseInt(selectedContacts),
          memberPortalUsers: Number.parseInt(memberOptions),
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to initialize payment. Please try again.",
        variant: "destructive",
      })
      setIsPaymentModalOpen(false)
    }
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Contacts</label>
              <Select value={selectedContacts} onValueChange={setSelectedContacts}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contacts" />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Members with Portal Access</label>
              <Select value={memberOptions} onValueChange={setMemberOptions}>
                <SelectTrigger>
                  <SelectValue placeholder="Select portal access" />
                </SelectTrigger>
                <SelectContent>
                  {MEMBER_PORTAL_OPTIONS.map((option) => (
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {filteredPlans.map((plan, index) => (
          <AnimatedSection key={plan.id} delay={index * 0.1}>
            <Card
              className={`relative flex h-full flex-col transition-all hover:shadow-lg ${
                plan === recommendedPlan ? "border-primary" : ""
              }`}
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
                <PlanFeatures plan={plan} />
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handlePlanSelection(plan)}
                  className="w-full"
                  variant={plan === recommendedPlan ? "default" : "outline"}
                >
                  {plan.basePrice === "Contact Us" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>
        ))}
      </div>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
            <DialogDescription>
              {selectedPlan && typeof selectedPlan.basePrice === "number" && (
                <span>
                  You selected the {selectedPlan.name} plan at ${selectedPlan.basePrice}/month
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {clientSecret && selectedPlan && typeof selectedPlan.basePrice === "number" && (
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
                amount={selectedPlan.basePrice * 100}
              />
            </Elements>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

function PlanFeatures({ plan }: { plan: Plan }) {
  return (
    <>
      <div className="space-y-2">
        <FeatureItem label="Max Contacts" value={plan.maxContacts} tooltip="Maximum number of contacts allowed" />
        <FeatureItem label="Max Groups" value={plan.maxGroups} />
        <FeatureItem label="Max Staff" value={plan.maxStaff} />
        <FeatureItem label="Max Event Staff" value={plan.maxEventStaff} />
        <FeatureItem
          label="Members With Portal Access"
          value={plan.features.memberPortal === false ? "None" : plan.features.memberPortal}
        />
      </div>
      <div className="space-y-2">
        <BooleanFeature
          value={plan.features.memberPortal !== false}
          label="Member Portal"
          suffix={plan.features.memberPortal ? `(Up to ${plan.features.memberPortal})` : undefined}
        />
        <BooleanFeature value={plan.features.stripePayments} label="Stripe Payments" />
        <BooleanFeature value={plan.features.prioritySupport} label="Priority Support" />
      </div>
    </>
  )
}

function FeatureItem({
  label,
  value,
  tooltip,
}: {
  label: string
  value: number | string
  tooltip?: string
}) {
  const content = (
    <div className="flex items-center gap-2">
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <span>
        {label}: {value}
      </span>
    </div>
  )

  return tooltip ? content : <div className="flex items-center gap-2">{content}</div>
}

function BooleanFeature({
  value,
  label,
  suffix,
}: {
  value: boolean
  label: string
  suffix?: string
}) {
  return (
    <div className="flex items-center gap-2">
      {value ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
      <span>
        {label} {suffix && `${suffix}`}
      </span>
    </div>
  )
}

