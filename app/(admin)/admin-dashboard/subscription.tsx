"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, CreditCard, Download } from "lucide-react"
import { ChangePlanDialog } from "../../../components/change-plan-dialog"

export default function SubscriptionManagement() {
  // This would typically come from your backend
  const subscription = {
    plan: "Pro Plan",
    status: "Active",
    nextBilling: "December 1, 2023",
    usedUsers: 42,
    totalUsers: 50,
    cardLast4: "4242",
    price: "$50.00",
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Subscription Management</h1>
        <p className="text-gray-600">Manage your subscription and billing details</p>
      </div>

      <div className="space-y-6">
        {/* Current Plan Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl font-bold text-blue-900">Current Plan</CardTitle>
              <CardDescription>You are currently on the {subscription.plan}</CardDescription>
            </div>
            <div className="px-2.5 py-0.5 text-sm font-semibold text-blue-900 bg-blue-50 rounded-full">
              {subscription.status}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CalendarDays className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Next billing date</p>
                  <p className="text-sm font-semibold">{subscription.nextBilling}</p>
                </div>
              </div>
              <div className="text-xl font-bold text-blue-900">
                {subscription.price}
                <span className="text-sm text-gray-500">/month</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Users used</span>
                <span className="font-medium">
                  {subscription.usedUsers} of {subscription.totalUsers}
                </span>
              </div>
              <Progress value={(subscription.usedUsers / subscription.totalUsers) * 100} className="h-2 bg-blue-100" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <ChangePlanDialog />
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
                <p className="font-medium">Visa ending in {subscription.cardLast4}</p>
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

        {/* Billing History Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Billing History</CardTitle>
            <CardDescription>View and download your billing history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "Nov 1, 2023", amount: "$50.00" },
                { date: "Oct 1, 2023", amount: "$50.00" },
                { date: "Sep 1, 2023", amount: "$50.00" },
              ].map((invoice, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{invoice.date}</p>
                    <p className="text-sm text-gray-500">{invoice.amount}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

