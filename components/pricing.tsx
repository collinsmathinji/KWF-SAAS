import { Check } from "lucide-react"

import { AnimatedSection } from "./ui/animated-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Basic",
    description: "Perfect for small organizations",
    price: "Free",
    features: ["Up to 100 members", "3 member types", "5 groups", "Basic event management", "Email support"],
  },
  {
    name: "Pro",
    description: "Best for growing organizations",
    price: "$49",
    features: [
      "Up to 1,000 members",
      "Unlimited member types",
      "Unlimited groups",
      "Advanced event management",
      "Priority support",
      "Custom branding",
      "Analytics dashboard",
    ],
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: "Custom",
    features: [
      "Unlimited members",
      "Unlimited everything",
      "Custom features",
      "Dedicated support",
      "SLA",
      "Custom integrations",
      "Advanced security",
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="container space-y-8 py-24">
      <AnimatedSection className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, transparent pricing</h2>
        <p className="mx-auto mt-4 max-w-[600px] text-gray-500 md:text-xl">
          Choose the perfect plan for your organization&apos;s needs
        </p>
      </AnimatedSection>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan, index) => (
          <AnimatedSection key={plan.name} delay={index * 0.2}>
            <Card className="flex h-full flex-col transition-transform duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-gray-500">/month</span>}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.name === "Pro" ? "default" : "outline"}>
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}

