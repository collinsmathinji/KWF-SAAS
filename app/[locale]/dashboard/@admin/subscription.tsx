"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, CreditCard, LayoutDashboard,FileText, Plus, X } from "lucide-react"
import { ChangePlanDialog } from "@/components/plan-changing"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { PLANS } from "@/app/api/stripe/config"
import SubscriptionReportsPage from "./subscription-reports/page"
interface Addon {
  id: string
  name: string
  price: number
  description: string
  active?: boolean
}

interface Subscription {
  plan: keyof typeof PLANS
  status: "Active" | "Canceled" | "Past Due"
  nextBilling: string
  usedUsers: number
  totalUsers: number
  cardLast4: string
  addons: Addon[]
}

// This would typically come from your backend
const subscription: Subscription = {
  plan: "pro",
  status: "Active",
  nextBilling: "December 1, 2023",
  usedUsers: 42,
  totalUsers: 50,
  cardLast4: "4242",
  addons: [
    {
      id: "addon_1",
      name: "+500 Members",
      price: 40.0,
      description: "Adds 500 members to your plan",
      active: true,
    },
    {
      id: "addon_2",
      name: "+5 Groups",
      price: 20.0,
      description: "Adds 5 groups to your plan",
      active: true,
    },
  ],
}

const availableAddons: Addon[] = [
  { id: "addon_3", name: "+1,000 Members", price: 75.0, description: "Adds 1,000 members to your plan" },
  { id: "addon_4", name: "+10 Groups", price: 35.0, description: "Adds 10 groups to your plan" },
  { id: "addon_5", name: "+5 Staff Members", price: 30.0, description: "Adds 5 staff members to your plan" },
  { id: "addon_6", name: "+10 Event Staff", price: 25.0, description: "Adds 10 event staff to your plan" },
]

export default function SubscriptionManagement({organisationDetails}: any) {
  const [activeSubscription, setActiveSubscription] = useState<Subscription>(subscription)
  const [showAddonsDialog, setShowAddonsDialog] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const currentPlan = PLANS[activeSubscription.plan]
  const monthlyTotal =
    currentPlan.basePrice + activeSubscription.addons.reduce((total, addon) => total + addon.price, 0)

  const handleRemoveAddon = async (addonId: string) => {
    try {
      // This would typically be an API call
      // await fetch('/api/subscription/remove-addon', { ... })

      setActiveSubscription((prev) => ({
        ...prev,
        addons: prev.addons.filter((addon) => addon.id !== addonId),
      }))

      toast({
        title: "Add-on removed",
        description: "Your subscription has been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to remove add-on. Please try again${error}`,
        variant: "destructive",
      })
    }
  }

  const handleAddAddon = async (addon: Addon) => {
    try {
      // This would typically be an API call
      // await fetch('/api/subscription/add-addon', { ... })

      setActiveSubscription((prev) => ({
        ...prev,
        addons: [...prev.addons, { ...addon, active: true }],
      }))

      toast({
        title: "Add-on added",
        description: "Your subscription has been updated.",
      })
      setShowAddonsDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to remove add-on. Please try again${error}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Subscription Management</h1>
        <p className="text-gray-600">Manage your subscription and billing details</p>
      </div>
      <div>
      <Button 
          variant="outline"
          onClick={() => setActiveSection(activeSection === 'billings' ? '' : 'billings')}
          className="flex items-center gap-2 transition-all hover:gap-3"
        >
          {activeSection === 'billings' ? (
        <>
          <LayoutDashboard className="h-4 w-4" />
          Back to Subscription
        </>
          ) : (
        <>
          <FileText className="h-4 w-4" />
           Billing reports
        </>
          )}
        </Button>
        </div>
        </div>
        {activeSection === "billings" ?(<SubscriptionReportsPage />):(
            <>
      <div className="space-y-3">
        {/* Current Plan Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl font-bold text-blue-900">Current Plan</CardTitle>
              <CardDescription>You are currently on the {currentPlan.name}</CardDescription>
            </div>
            <div className="px-2.5 py-0.5 text-sm font-semibold text-blue-900 bg-blue-50 rounded-full">
              {activeSubscription.status}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CalendarDays className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Next billing date</p>
                  <p className="text-sm font-semibold">{activeSubscription.nextBilling}</p>
                </div>
              </div>
              <div className="text-xl font-bold text-blue-900">
                ${monthlyTotal.toFixed(2)}
                <span className="text-sm text-gray-500">/month</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Users used</span>
                <span className="font-medium">
                  {activeSubscription.usedUsers} of {activeSubscription.totalUsers}
                </span>
              </div>
              <Progress
                value={(activeSubscription.usedUsers / activeSubscription.totalUsers) * 100}
                className="h-2 bg-blue-100"
              />
            </div>

            {/* Active Add-ons */}
            {activeSubscription.addons.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Active Add-ons</h3>
                <div className="space-y-2">
                  {activeSubscription.addons.map((addon) => (
                    <div key={addon.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <div>
                        <p className="text-sm font-medium">{addon.name}</p>
                        <p className="text-sm text-gray-500">${addon.price.toFixed(2)}/month</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveAddon(addon.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <ChangePlanDialog currentPlan={currentPlan} />
              <Dialog open={showAddonsDialog} onOpenChange={setShowAddonsDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Features
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Features to Your Plan</DialogTitle>
                    <DialogDescription>Customize your plan with additional features and capacity</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 md:grid-cols-2">
                    {availableAddons.map((addon) => (
                      <Card key={addon.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{addon.name}</CardTitle>
                          <CardDescription>${addon.price.toFixed(2)}/month</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500">{addon.description}</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full" onClick={() => handleAddAddon(addon)}>
                            Add to Subscription
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700">
              Cancel Subscription
            </Button>
          </CardFooter>
        </Card>

        {/* Payment Method Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Payment Method</CardTitle>
            <CardDescription>Manage your payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Visa ending in {activeSubscription.cardLast4}</p>
                <p className="text-sm text-gray-500">Expires 12/24</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
              Update Payment Method
            </Button>
          </CardFooter>
        </Card>
      </div>
      </>)}
    </div>
  )
}

