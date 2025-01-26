"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  UserPlus, 
  UserX, 
  Shield, 
  Mail, 
  Lock, 
  Star, 
  Filter, 
  MoreHorizontal 
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UserManagement() {
  const userInfo = {
    totalUsers: 5423,
    activeUsers: 4210,
    newUsers: 87,
    userTypes: [
      { name: "Administrators", count: 12, color: "bg-blue-500" },
      { name: "Managers", count: 45, color: "bg-green-500" },
      { name: "Regular Users", count: 5366, color: "bg-gray-500" }
    ],
    recentUsers: [
      { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
      { name: "Jane Smith", email: "jane@example.com", role: "Manager", status: "Pending" },
      { name: "Mike Johnson", email: "mike@example.com", role: "User", status: "Active" },
    ],
    invitations: [
      { email: "newuser1@example.com", status: "Pending", sentDate: "Nov 22, 2023" },
      { email: "newuser2@example.com", status: "Expired", sentDate: "Nov 15, 2023" }
    ]
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900">User Management</h1>
        <p className="text-gray-600">Manage users, roles, and access</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Overview Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">User Statistics</CardTitle>
            <CardDescription>Overview of your platforms user base</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Total Users", value: userInfo.totalUsers, icon: Users },
                { label: "Active Users", value: userInfo.activeUsers, icon: Shield },
                { label: "New Users", value: userInfo.newUsers, icon: UserPlus }
              ].map((stat, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <stat.icon className="text-blue-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <p className="text-xl font-bold text-blue-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <Alert className="bg-blue-50">
              <Star className="h-4 w-4 text-blue-600" />
              <AlertTitle>User Types Breakdown</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-2">
                  {userInfo.userTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-2 ${type.color}`}></span>
                        {type.name}
                      </div>
                      <span>{type.count}</span>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-4">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Users
            </Button>
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
              <Filter className="mr-2 h-4 w-4" />
              Manage Roles
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Users Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Recent Users</CardTitle>
            <CardDescription>Latest user additions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userInfo.recentUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {user.status}
                    </span>
                    <MoreHorizontal className="text-gray-400 w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 w-full">
              View All Users
            </Button>
          </CardFooter>
        </Card>

        {/* Pending Invitations Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Pending Invitations</CardTitle>
            <CardDescription>User invitations status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userInfo.invitations.map((invite, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-sm text-gray-500">Sent {invite.sentDate}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    invite.status === 'Pending' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {invite.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 w-full">
              Manage Invitations
            </Button>
          </CardFooter>
        </Card>

        {/* User Access Control Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Access Control</CardTitle>
            <CardDescription>Manage user permissions and security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Role-Based Access</h3>
                <p className="text-sm text-gray-600 mb-4">Configure granular permissions for different user roles</p>
                <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  <Lock className="mr-2 h-4 w-4" />
                  Manage Roles
                </Button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Inactive Users</h3>
                <p className="text-sm text-gray-600 mb-4">32 users inactive for more than 90 days</p>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <UserX className="mr-2 h-4 w-4" />
                  Deactivate Users
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}