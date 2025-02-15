"use client"

import type React from "react"
import { Users, UserCircle, Building2, ArrowUpRight, ArrowDownRight, CircleDollarSign, UserPlus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data
const memberTypes = [
  { type: "Executives", count: 5, growth: 12 },
  { type: "Designers", count: 6, growth: 8 },
  { type: "Programmers", count: 8, growth: 15 },
]

const groupsData = [
  { name: "Technology", members: 450, active: 380 },
  { name: "Business", members: 320, active: 290 },
  { name: "Design", members: 280, active: 230 },
  { name: "Marketing", members: 190, active: 150 },
]

const recentDonations = [
  { id: 1, donor: "John Doe", amount: 500, date: "2024-02-14" },
  { id: 2, donor: "Jane Smith", amount: 1000, date: "2024-02-13" },
  { id: 3, donor: "Bob Wilson", amount: 250, date: "2024-02-12" },
  { id: 4, donor: "Alice Brown", amount: 750, date: "2024-02-11" },
]

interface MetricCardProps {
  icon: React.ReactNode
  title: string
  value: string | number
  change?: number
  description?: string
}

const MetricCard = ({ icon, title, value, change, description }: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="bg-primary/10 p-2 rounded-full text-primary">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <div className="flex items-center text-xs text-muted-foreground">
          {change > 0 ? (
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
          )}
          <span className={change > 0 ? "text-green-500" : "text-red-500"}>{Math.abs(change)}% from last month</span>
        </div>
      )}
      {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
    </CardContent>
  </Card>
)

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={<Users className="h-4 w-4" />} title="Total Users" value="5,335" change={12.5} />
        <MetricCard icon={<Building2 className="h-4 w-4" />} title="Active Groups" value="24" change={8.2} />
        <MetricCard
          icon={<CircleDollarSign className="h-4 w-4" />}
          title="Total Donations"
          value="$42,500"
          change={15.7}
        />
        <MetricCard icon={<UserPlus className="h-4 w-4" />} title="New Members" value="126" change={-2.3} />
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Member Types</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="donations">Recent Donations</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {memberTypes.map((type) => (
              <Card key={type.type}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">{type.type} Members</CardTitle>
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{type.count}</div>
                  <p className="text-xs text-muted-foreground">+{type.growth}% from last month</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Groups Overview</CardTitle>
              <CardDescription>Active groups and their member counts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group Name</TableHead>
                    <TableHead>Total Members</TableHead>
                    <TableHead>Active Members</TableHead>
                    <TableHead>Activity Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupsData.map((group) => (
                    <TableRow key={group.name}>
                      <TableCell className="font-medium">{group.name}</TableCell>
                      <TableCell>{group.members}</TableCell>
                      <TableCell>{group.active}</TableCell>
                      <TableCell>{Math.round((group.active / group.members) * 100)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Latest donations received through Stripe</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">{donation.donor}</TableCell>
                      <TableCell>${donation.amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

