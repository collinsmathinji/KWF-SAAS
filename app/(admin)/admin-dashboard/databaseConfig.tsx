"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowDownToLine, ArrowUpFromLine, Users, Database, History, AlertCircle, HardDrive } from "lucide-react"
import { PLANS } from "@/app/api/stripe/config"

// Sample data - in production this would come from your backend
const currentPlanData = {
  currentPlan: "pro" as const,
  totalContacts: 850,
  activeGroups: 8,
  staffMembers: 7,
  eventStaff: 15,
  lastBackup: "February 19, 2024",
  recentActivity: [
    { type: "Import", date: "Feb 18, 2024", details: "Imported 150 new members" },
    { type: "Export", date: "Feb 15, 2024", details: "Monthly member report" },
    { type: "Update", date: "Feb 14, 2024", details: "Updated member data" },
  ],
}

export default function DataManagement() {
  const plan = PLANS[currentPlanData.currentPlan]

  // Calculate usage percentages
  const contactsPercentage = (currentPlanData.totalContacts / plan.maxContacts) * 100
  const groupsPercentage = (currentPlanData.activeGroups / plan.maxGroups) * 100
  const staffPercentage = (currentPlanData.staffMembers / plan.maxStaff) * 100
  const eventStaffPercentage = (currentPlanData.eventStaff / plan.maxEventStaff) * 100

  // Check if approaching limits (80% or more)
  const isApproachingLimit =
    contactsPercentage >= 80 || groupsPercentage >= 80 || staffPercentage >= 80 || eventStaffPercentage >= 80

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Data Management</h1>
        <p className="text-gray-600">Monitor your {plan.name} plan usage and manage data</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Usage Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Current Plan Usage</CardTitle>
            <CardDescription>
              {plan.name} Plan - {plan.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isApproachingLimit && (
              <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Approaching Plan Limits</AlertTitle>
                <AlertDescription>
                  You are nearing your plan limits. Consider upgrading to the next tier for more capacity.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Contacts Used</span>
                  <span className="font-medium">
                    {currentPlanData.totalContacts.toLocaleString()} of {plan.maxContacts.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={contactsPercentage}
                  className={`h-2 ${contactsPercentage >= 80 ? "bg-yellow-100" : "bg-blue-100"}`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Active Groups</span>
                  <span className="font-medium">
                    {currentPlanData.activeGroups} of {plan.maxGroups}
                  </span>
                </div>
                <Progress
                  value={groupsPercentage}
                  className={`h-2 ${groupsPercentage >= 80 ? "bg-yellow-100" : "bg-blue-100"}`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Staff Members</span>
                  <span className="font-medium">
                    {currentPlanData.staffMembers} of {plan.maxStaff}
                  </span>
                </div>
                <Progress
                  value={staffPercentage}
                  className={`h-2 ${staffPercentage >= 80 ? "bg-yellow-100" : "bg-blue-100"}`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Event Staff</span>
                  <span className="font-medium">
                    {currentPlanData.eventStaff} of {plan.maxEventStaff}
                  </span>
                </div>
                <Progress
                  value={eventStaffPercentage}
                  className={`h-2 ${eventStaffPercentage >= 80 ? "bg-yellow-100" : "bg-blue-100"}`}
                />
              </div>
            </div>

            <Alert>
              <HardDrive className="h-4 w-4" />
              <AlertTitle>Last Data Backup</AlertTitle>
              <AlertDescription>Your data was last backed up on {currentPlanData.lastBackup}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-4">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Import Data
            </Button>
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </CardFooter>
        </Card>

       
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Plan Features</CardTitle>
            <CardDescription>Your current plan benefits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Member Portal</p>
                  <p className="text-sm text-gray-500">
                    {plan.features.memberPortal ? `Up to ${plan.features.memberPortal}` : "Not included"}
                  </p>
                </div>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Stripe Payments</p>
                  <p className="text-sm text-gray-500">{plan.features.stripePayments ? "Included" : "Not included"}</p>
                </div>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Priority Support</p>
                  <p className="text-sm text-gray-500">{plan.features.prioritySupport ? "Included" : "Not included"}</p>
                </div>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Recent Activity Card */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Recent Activity</CardTitle>
            <CardDescription>Latest data operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentPlanData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center space-x-3">
                    <History className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{activity.type}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="text-gray-600 hover:bg-gray-100 w-full">
              View All Activity
            </Button>
          </CardFooter>
        </Card> */}

        {/* Data Management Tools Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Data Management Tools</CardTitle>
            <CardDescription>Tools for managing your organization's data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Data Import</h3>
                <p className="text-sm text-gray-600 mb-4">Import contacts and group data</p>
                <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  <ArrowUpFromLine className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Data Export</h3>
                <p className="text-sm text-gray-600 mb-4">Export your organization's data</p>
                <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Backup</h3>
                <p className="text-sm text-gray-600 mb-4">Create a full data backup</p>
                <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  <Database className="mr-2 h-4 w-4" />
                  Backup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

