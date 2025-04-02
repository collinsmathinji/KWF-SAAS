"use client"

import { Check, HelpCircle, X } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
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

interface ApiPlan {
  _id: string
  planName: string
  description: string
  billingCycle: string
  currency: string
  price: number
  maxMembers: number
  maxGroups: number
  maxStaff: number
  maxEventStaff: number
}

type PlanId = "starter" | "basic" | "pro" | "business" | "enterprise" | "scale" | "ultra" | "custom"

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
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const handlePlansFetch = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/admin/subscriptionPlan/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            billingCycle: "Monthly",
          },
          options: {
            select: [
              "planName",
              "description",
              "billingCycle",
              "currency",
              "price",
              "maxMembers",
              "maxGroups",
              "maxStaff",
              "maxEventStaff",
            ],
          },
          isCountOnly: false,
        }),
      })

      const data = await response.json()

      if (data.status === 'SUCCESS' && data.data?.data && Array.isArray(data.data.data)) {
        
        const transformedPlans = data.data.data.map((apiPlan: ApiPlan) => ({
          id: apiPlan._id as PlanId,
          name: apiPlan.planName,
          description: apiPlan.description,
          basePrice: apiPlan.price,
          maxContacts: apiPlan.maxMembers,
          maxGroups: apiPlan.maxGroups,
          maxStaff: apiPlan.maxStaff,
          maxEventStaff: apiPlan.maxEventStaff,
          features: {
            memberPortal: apiPlan.maxMembers > 0 ? Math.min(apiPlan.maxMembers, 100) : false,
            stripePayments: true,
            prioritySupport: apiPlan.price > 50,
          },
        }))

        setPlans(transformedPlans)
        console.log("Fetched plans:", data.data.data)
      } else {
        console.error("Invalid data format:", data)
        toast({
          title: "Error loading plans",
          description: "Could not load subscription plans. Please try again later.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching plans:", error)
      toast({
        title: "Error loading plans",
        description: "Could not load subscription plans. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handlePlansFetch()
  }, []) // Empty dependency array means this runs once on mount

  // Filter and sort plans based on selected contacts and member portal requirements
  const filteredPlans = useMemo(() => {
    const contactsNum = Number.parseInt(selectedContacts)
    const membersNum = Number.parseInt(memberOptions)

    return plans
      .filter((plan) => {
        // Filter by contacts
        if (typeof plan.maxContacts === "number" && plan.maxContacts < contactsNum) {
          return false
        }

        // Filter by member portal
        if (membersNum > 0 && plan.features.memberPortal === false) {
          return false
        }

        if (typeof plan.features.memberPortal === "number" && plan.features.memberPortal < membersNum) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        // Sort by price
        if (typeof a.basePrice === "number" && typeof b.basePrice === "number") {
          return a.basePrice - b.basePrice
        }

        // "Contact Us" plans go last
        if (a.basePrice === "Contact Us") return 1
        if (b.basePrice === "Contact Us") return -1

        return 0
      })
  }, [plans, selectedContacts, memberOptions])

  // Find the recommended plan
  const recommendedPlan = useMemo(() => {
    if (filteredPlans.length === 0) return null

    // Find the first plan that has at least 20% more capacity than requested
    const contactsNum = Number.parseInt(selectedContacts)
    const membersNum = Number.parseInt(memberOptions)

    for (const plan of filteredPlans) {
      if (typeof plan.maxContacts === "number" && plan.maxContacts >= contactsNum * 1.2) {
        if (
          membersNum === 0 ||
          (typeof plan.features.memberPortal === "number" && plan.features.memberPortal >= membersNum * 1.2)
        ) {
          return plan
        }
      }
    }

    // If no plan meets the 20% criteria, return the first filtered plan
    return filteredPlans[0]
  }, [filteredPlans, selectedContacts, memberOptions])

  // Handle plan selection
  const handlePlanSelection = async (plan: Plan) => {
    if (plan.basePrice === "Contact Us") {
      // Redirect to contact page or open contact form
      router.push("/contact")
      return
    }

    setSelectedPlan(plan)

    try {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: typeof plan.basePrice === "number" ? plan.basePrice * 100 : 0,
          planId: plan.id,
        }),
      })

      const data = await response.json()

      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        setIsPaymentModalOpen(true)
      } else {
        toast({
          title: "Error",
          description: "Could not initialize payment. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating payment intent:", error)
      toast({
        title: "Error",
        description: "Could not initialize payment. Please try again.",
        variant: "destructive",
      })
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

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredPlans.length === 0 ? (
        <AnimatedSection>
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">No plans match your criteria</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your requirements or contact us for a custom plan
            </p>
            <Button className="mt-4" onClick={() => router.push("/contact")}>
              Contact Sales
            </Button>
          </div>
        </AnimatedSection>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      )}

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
  return (
    <div className="flex items-center gap-2">
      {tooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
      <span>
        {label}: {value}
      </span>
    </div>
  )
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

