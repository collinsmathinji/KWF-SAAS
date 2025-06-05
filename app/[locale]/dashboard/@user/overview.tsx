"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Users, Building2, CircleDollarSign, UserPlus, ArrowUpRight, ArrowDownRight, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { LineChart } from "recharts"

// Data interfaces
interface GroupData {
  name: string
  members: number
  active: number
  events: number
}

interface EventData {
  id: number
  name: string
  date: string
  attendees: number
}

interface DonationData {
  id: number
  donor: string
  amount: number
  date: string
  type: string
}

// Empty initial states
const groupsData: {
  name: string
  members: number
  active: number
  events: number
}[] = []

const upcomingEvents: {
  id: number
  name: string
  date: string
  attendees: number
}[] = []

const recentDonations: {
  id: number
  donor: string
  amount: number
  date: string
  type: string
}[] = []

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

export default function Overview() {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Overview</h2>
        <Button onClick={() => router.push("/dashboard/report")} className="gap-2">
          <FileText className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={<Users className="h-4 w-4" />} title="Total Contacts" value="0" />
        <MetricCard
          icon={<UserPlus className="h-4 w-4" />}
          title="Registered Members"
          value="0"
          description="Including portal access members"
        />
        <MetricCard
          icon={<Building2 className="h-4 w-4" />}
          title="Total Groups"
          value="0"
          description="0 active groups"
        />
        <MetricCard
          icon={<CircleDollarSign className="h-4 w-4" />}
          title="Monthly Revenue"
          value="$0"
        />
      </div>

      {/* Membership Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Growth</CardTitle>
          <CardDescription>Total members over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No membership data available
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="groups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="groups">Top Groups</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          <TabsTrigger value="donations">Recent Donations</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Groups</CardTitle>
              <CardDescription>Based on membership and event activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group Name</TableHead>
                    <TableHead>Total Members</TableHead>
                    <TableHead>Active Members</TableHead>
                    <TableHead>Events This Month</TableHead>
                    <TableHead>Activity Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupsData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No groups data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    groupsData.map((group) => (
                      <TableRow key={group.name}>
                        <TableCell className="font-medium">{group.name}</TableCell>
                        <TableCell>{group.members}</TableCell>
                        <TableCell>{group.active}</TableCell>
                        <TableCell>{group.events}</TableCell>
                        <TableCell>{Math.round((group.active / group.members) * 100)}%</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Expected Attendees</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingEvents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No upcoming events
                      </TableCell>
                    </TableRow>
                  ) : (
                    upcomingEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell>{event.attendees}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Latest contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDonations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No recent donations
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentDonations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="font-medium">{donation.donor}</TableCell>
                        <TableCell>${donation.amount.toLocaleString()}</TableCell>
                        <TableCell>{donation.type}</TableCell>
                        <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

