"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  UserPlus, 
  UserX, 
  Shield, 
  Activity, 
  Lock, 
  Filter, 
  Trash2 
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UserAnalysis() {
  const userManagementData = {
    userStats: {
      total: 5420,
      active: 4180,
      newThisMonth: 342,
      inactive: 1240
    },
    userRoles: [
      { name: "Admin", count: 12, permissions: "Full Access" },
      { name: "Manager", count: 45, permissions: "Moderate Access" },
      { name: "Editor", count: 128, permissions: "Limited Access" },
      { name: "User", count: 5235, permissions: "Basic Access" }
    ],
    recentActivity: [
      { type: "New User", date: "Jan 22, 2025", details: "342 users registered" },
      { type: "Role Change", date: "Jan 21, 2025", details: "5 users promoted" },
      { type: "Access Revoked", date: "Jan 20, 2025", details: "3 accounts disabled" }
    ],
    securityAlerts: [
      { type: "Suspicious Login", count: 12, severity: "Medium" },
      { type: "Potential Breach", count: 3, severity: "High" }
    ]
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900">User Management</h1>
        <p className="text-gray-600">Manage user accounts and access</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Overview Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">User Statistics</CardTitle>
            <CardDescription>Comprehensive user account overview</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-blue-600" />
                <span className="text-xl font-bold text-blue-900">{userManagementData.userStats.total}</span>
              </div>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <UserPlus className="text-green-600" />
                <span className="text-xl font-bold text-green-900">{userManagementData.userStats.newThisMonth}</span>
              </div>
              <p className="text-sm text-gray-600">New This Month</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Activity className="text-blue-600" />
                <span className="text-xl font-bold text-blue-900">{userManagementData.userStats.active}</span>
              </div>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <UserX className="text-red-600" />
                <span className="text-xl font-bold text-red-900">{userManagementData.userStats.inactive}</span>
              </div>
              <p className="text-sm text-gray-600">Inactive Users</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
              <Filter className="mr-2 h-4 w-4" />
              Filter Users
            </Button>
          </CardFooter>
        </Card>

        {/* User Roles Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">User Roles</CardTitle>
            <CardDescription>Access levels and user distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userManagementData.userRoles.map((role, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="text-sm text-gray-500">{role.permissions}</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-blue-600">{role.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 w-full">
              <Lock className="mr-2 h-4 w-4" />
              Manage Roles
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Recent Activity</CardTitle>
            <CardDescription>Latest user operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userManagementData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-blue-500" />
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
        </Card>

        {/* Security Alerts Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Security Alerts</CardTitle>
            <CardDescription>Potential security risks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {userManagementData.securityAlerts.map((alert, index) => (
                <div key={index} className="p-4 bg-red-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-red-700">{alert.type}</h3>
                    <span className="text-sm font-bold text-red-900">{alert.count}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${
                      alert.severity === 'High' ? 'bg-red-600' : 
                      alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <p className="text-sm text-gray-600">{alert.severity} Risk</p>
                  </div>
                  <Button variant="outline" className="mt-3 w-full text-red-600 border-red-200 hover:bg-red-50">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Investigate
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