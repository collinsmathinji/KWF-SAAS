"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Check } from "lucide-react"
import { PLANS, type Plan } from "../app/api/stripe/config"
import { toast } from "@/components/ui/use-toast"

interface ChangePlanDialogProps {
  currentPlan: Plan
}

export function ChangePlanDialog({ currentPlan }: ChangePlanDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePlanChange = async (newPlan: Plan) => {
    if (newPlan.id === currentPlan.id) {
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      // This would typically be an API call
      // await fetch('/api/subscription/change-plan', { ... })

      toast({
        title: "Plan updated",
        description: `Your subscription has been updated to ${newPlan.name}.`,
      })
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Change Plan</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Change Subscription Plan</DialogTitle>
          <DialogDescription>
            Choose the plan that best fits your needs. Changes will be prorated to your next billing date.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-3">
          {Object.values(PLANS)
            .filter((plan) => plan.id !== "scale")
            .map((plan) => (
              <Card key={plan.id} className={plan.id === currentPlan.id ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      ${typeof plan.basePrice === "number" ? plan.basePrice : 0}
                    </span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Up to {plan.maxContacts} contacts
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {plan.maxGroups} groups
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {plan.maxStaff} staff members
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.id === currentPlan.id ? "outline" : "default"}
                    disabled={isLoading || plan.id === currentPlan.id}
                    onClick={() => handlePlanChange(plan)}
                  >
                    {plan.id === currentPlan.id ? (
                      "Current Plan"
                    ) : (
                      <>
                        Switch to {plan.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

