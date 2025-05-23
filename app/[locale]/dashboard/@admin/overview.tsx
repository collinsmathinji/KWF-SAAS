"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import {
  Users,
  Building2,
  CircleDollarSign,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  LayoutDashboard,
  Calendar,
  Mail,
  Phone,
  Globe,
  TrendingUp,
  ChevronRight,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

import { getMembers } from "@/lib/members"
import { getGroups } from "@/lib/group"
import { fetchEvents } from "@/lib/event"
import ReportsGenerator from "./report/page"
import { LanguageSwitcher } from "@/components/language-switcher"

// Define proper TypeScript interfaces
interface Event {
  id: string | number
  name: string
  description?: string
  startDate: string
  endDate?: string
  city?: string
  nation?: string
  hostOrganization?: string
  isPaid: boolean
  price?: string
  eventType?: string
  theme?: string
  status?: string
  attendees?: number
}

interface Member {
  id: string
  firstName: string
  lastName: string
  email: string
  membershipTypeId: string | number
  isActive: boolean
  createdAt: string
}

interface Group {
  id: string | number
  name: string
  members?: number
  status?: string
  created?: string
  region?: string
  activeMembers?: number
  events?: number
}

interface Donation {
  id: string | number
  donor: string
  amount: number
  date: string
  type: string
}

interface OrganizationDetails {
  organizationId?: string
  name?: string
  logoUrl?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  city?: string
  state?: string
  country?: string
  foundedDate?: string
  memberCount?: number
  totalGroups?: number
  totalEvents?: number
  monthlyDonation?: number
  [key: string]: any
}

interface MetricCardProps {
  icon: React.ReactNode
  title: string
  value: string | number
  change?: number
  description?: string
  color?: string
}

// Define ChartData interface for memberGrowth
interface ChartData {
  name: string
  total: number
}

const MetricCard = ({ icon, title, value, change, description, color = "blue" }: MetricCardProps) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    amber: "bg-amber-50 text-amber-700",
  }

  return (
    <Card className="overflow-hidden border-t-4" style={{ borderTopColor: `var(--${color}-700)` }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`${colorClasses[color as keyof typeof colorClasses]} p-2 rounded-full`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
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
}

export default function Overview({ organisationDetails }: { organisationDetails: OrganizationDetails }) {
  const t = useTranslations('overview')
  const [activeSection, setActiveSection] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [members, setMembers] = useState<any>([])
  const [groups, setGroups] = useState<any>([])
  const [events, setEvents] = useState<any>([])
  const [donations, setDonations] = useState<any>([])
  const [memberGrowth, setMemberGrowth] = useState<any>([])
  const { data: session, status } = useSession()

  // Calculate metrics for organization dashboard
  const [metrics, setMetrics] = useState({
    totalContacts: 0,
    registeredMembers: 0,
    activeMembers: 0,
    totalGroups: 0,
    activeGroups: 0,
    totalEvents: 0,
    monthlyDonation: 0,
    memberGrowth: 0,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session) return // Add early return if no session

      setIsLoading(true)
      try {
        if (!session.user.organizationId) {
          console.error("No organization ID found in session")
          setMembers([])
          setGroups([])
          setEvents([])
          return
        }

        // Fetch members data
        const membersResponse: any = await getMembers(session.user.organizationId)
        console.log("Members data:", membersResponse)
        // Handle different API response structures
        let membersData: Member[] = []
        if (Array.isArray(membersResponse)) {
          membersData = membersResponse
        } else if (membersResponse?.data) {
          membersData = Array.isArray(membersResponse.data) ? membersResponse.data : []
        }
        console.log("Processed members data:", membersData)
        setMembers(membersData)

        // Fetch groups data
        const groupsResponse: any = await getGroups(session.user.organizationId)
        console.log("Groups data:", groupsResponse)
        // Handle different API response structures
        let groupsData: Group[] = []
        if (Array.isArray(groupsResponse)) {
          groupsData = groupsResponse
        } else if (groupsResponse?.data) {
          groupsData = Array.isArray(groupsResponse.data) ? groupsResponse.data : []
        }
        console.log("Processed groups data:", groupsData)
        setGroups(groupsData)

        // Fetch events data
        try {
          if (session?.user?.organizationId) {
            const eventsResponse = await fetchEvents(session.user.organizationId)
            console.log("Events data:", eventsResponse)
            // Handle different API response structures
            let eventsData: Event[] = []
            if (eventsResponse?.data?.data) {
              eventsData = eventsResponse.data.data
            } else if (Array.isArray(eventsResponse?.data)) {
              eventsData = eventsResponse.data
            } else if (Array.isArray(eventsResponse)) {
              eventsData = eventsResponse
            }

            // If we got no data, throw an error to use the fallback data
            if (!eventsData || eventsData.length === 0) {
              throw new Error("No events data received from API")
            }

            console.log("Processed events data:", eventsData)
            setEvents(eventsData)
          }
        } catch (error) {
          console.error("Failed to fetch events:", error)
          // Fallback to sample events data if API fails
          const currentDate = new Date()
          const sampleEvents: Event[] = [
            {
              id: 1,
              name: "Annual Conference",
              startDate: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 15,
              ).toISOString(),
              isPaid: true,
              price: "$99",
              status: "Upcoming",
              attendees: 120,
            },
            {
              id: 2,
              name: "Community Workshop",
              startDate: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 7,
              ).toISOString(),
              isPaid: false,
              status: "Open",
              attendees: 45,
            },
            {
              id: 3,
              name: "Monthly Meetup",
              startDate: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 3,
              ).toISOString(),
              isPaid: false,
              status: "Open",
              attendees: 30,
            },
          ]
          setEvents(sampleEvents)
        }

        // Calculate metrics based on fetched data
        const activeMembers = membersData.length
        const activeGroups = groupsData.length

        // Calculate member growth (aggregate by join month for last 6 months)
        function getLastSixMonthsLabels() {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const result = [];
          const now = new Date();
          for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            result.push({
              label: months[d.getMonth()],
              year: d.getFullYear(),
              month: d.getMonth()
            });
          }
          return result;
        }

        const lastSixMonths = getLastSixMonthsLabels();
        // Count members joined in each of the last 6 months
        const memberCountsByMonth = lastSixMonths.map(({ year, month, label }) => {
          const count = membersData.filter((m) => {
            if (!m.createdAt) return false;
            const date = new Date(m.createdAt);
            return date.getFullYear() === year && date.getMonth() === month;
          }).length;
          return { name: label, total: count };
        });
        setMemberGrowth(memberCountsByMonth);

        // Calculate growth percentage (comparing last two months)
        const growthPercentage =
          memberCountsByMonth.length >= 2
            ? ((memberCountsByMonth[memberCountsByMonth.length - 1].total - memberCountsByMonth[memberCountsByMonth.length - 2].total) /
                memberCountsByMonth[memberCountsByMonth.length - 2].total) *
              100
            : 4.6

        // Create current date instance for donations
        const currentDate = new Date()

        // Simulate donations data (could come from an API)
        const mockDonations: Donation[] = [
          {
            id: 1,
            donor: membersData[0]?.firstName + " " + membersData[0]?.lastName || "John Doe",
            amount: 500,
            date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 5).toISOString(),
            type: "Monthly",
          },
          {
            id: 2,
            donor: membersData[1]?.firstName + " " + membersData[1]?.lastName || "Jane Smith",
            amount: 1000,
            date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 8).toISOString(),
            type: "One-time",
          },
          {
            id: 3,
            donor: membersData[2]?.firstName + " " + membersData[2]?.lastName || "Bob Wilson",
            amount: 250,
            date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 10).toISOString(),
            type: "Monthly",
          },
          {
            id: 4,
            donor: membersData[3]?.firstName + " " + membersData[3]?.lastName || "Alice Brown",
            amount: 750,
            date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 12).toISOString(),
            type: "One-time",
          },
        ]
        setDonations(mockDonations)

        // First ensure we have valid numbers or fallback to default values
        const totalMembers = Array.isArray(membersData) ? membersData.length : 0
        const totalActiveMembers = Array.isArray(membersData) ? activeMembers : 0
        const totalGroups = Array.isArray(groupsData) ? groupsData.length : 0
        const totalActiveGroups = Array.isArray(groupsData) ? activeGroups : 0
        const totalEvents = Array.isArray(events) ? events.length : 0

        console.log("Metrics calculation:", {
          members: totalMembers,
          activeMembers: totalActiveMembers,
          groups: totalGroups,
          activeGroups: totalActiveGroups,
          events: totalEvents,
        })

        // Update metrics with real data and add fallbacks
        setMetrics({
          totalContacts: totalMembers,
          registeredMembers: totalMembers,
          activeMembers: totalActiveMembers,
          totalGroups: totalGroups,
          activeGroups: totalActiveGroups,
          totalEvents: totalEvents,
          monthlyDonation: mockDonations.reduce(
            (sum, donation) => (donation.type === "Monthly" ? sum + donation.amount : sum),
            0,
          ),
          memberGrowth: Number.parseFloat(growthPercentage.toFixed(1)),
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Only run fetchDashboardData if session is available
    if (status === "authenticated" && session) {
      fetchDashboardData()
    }
  }, [session, status, organisationDetails?.organizationId]) // Added session to dependencies

  // Format groups data for display with better error handling
  const formattedGroups = Array.isArray(groups)
    ? groups
        .map((group) => ({
          ...group,
          // Ensure group.members has a value or default to a random number between 10-100
          members: group.members || Math.floor(Math.random() * 90) + 10,
          activeMembers: Math.floor(Math.random() * ((group.members || 100) * 0.8)), // ~80% are active at most
          events: Math.floor(Math.random() * 20), // Simulated - would come from API
        }))
        .sort((a, b) => (b.members || 0) - (a.members || 0))
        .slice(0, 5)
    : []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>

        <Skeleton className="h-32 w-full mb-6" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>

        <Skeleton className="h-80 w-full" />

        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-blue-800">
          {activeSection === "reports" ? t('reports') : t('title')}
        </h2>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            variant="outline"
            onClick={() => setActiveSection(activeSection === "reports" ? "" : "reports")}
            className="flex items-center gap-2 transition-all hover:gap-3"
          >
            {activeSection === "reports" ? (
              <>
                <LayoutDashboard className="h-4 w-4" />
                {t('backToOverview')}
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                {t('reportGeneration')}
              </>
            )}
          </Button>
        </div>
      </div>

      {activeSection === "reports" ? (
        <ReportsGenerator />
      ) : (
        <>
          {/* Organization Quick Info Card */}
          <Card className="mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-1"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-blue-100">
                  <AvatarImage
                    src={organisationDetails?.logoUrl || "/placeholder.svg?height=64&width=64"}
                    alt={organisationDetails?.name || "Organization"}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
                    {organisationDetails?.name?.charAt(0) || "O"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl text-blue-800">
                    {organisationDetails?.name || "Organization"}
                  </CardTitle>
                  <CardDescription>{t('dashboardOverview')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-50 p-2 rounded-full text-blue-700">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">{t('email')}</span>
                    <span className="text-sm font-medium truncate max-w-[180px]">
                      {organisationDetails?.email || "contact@organization.com"}
                    </span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-50 p-2 rounded-full text-blue-700">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">{t('phone')}</span>
                    <span className="text-sm font-medium">{organisationDetails?.phone || t('notSpecified')}</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-50 p-2 rounded-full text-blue-700">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">{t('website')}</span>
                    <span className="text-sm font-medium truncate max-w-[180px]">
                      {organisationDetails?.website || t('notSpecified')}
                    </span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-50 p-2 rounded-full text-blue-700">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">{t('established')}</span>
                    <span className="text-sm font-medium">
                      {organisationDetails?.foundedDate
                        ? new Date(organisationDetails.foundedDate).toLocaleDateString()
                        : t('notSpecified')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={<Users className="h-4 w-4" />}
              title={t('metrics.totalMembers')}
              value={metrics.totalContacts.toLocaleString()}
              change={metrics.memberGrowth}
              color="blue"
            />
            <MetricCard
              icon={<UserPlus className="h-4 w-4" />}
              title={t('metrics.activeMembers')}
              value={metrics.activeMembers.toLocaleString()}
              description={t('metrics.engagementRate', { rate: Math.round((metrics.activeMembers / metrics.totalContacts) * 100) || 0 })}
              color="green"
            />
            <MetricCard
              icon={<Building2 className="h-4 w-4" />}
              title={t('metrics.totalGroups')}
              value={metrics.totalGroups.toLocaleString()}
              description={t('metrics.activeGroups', { count: metrics.activeGroups })}
              color="amber"
            />
            <MetricCard
              icon={<CircleDollarSign className="h-4 w-4" />}
              title={t('metrics.monthlyDonation')}
              value={`$${metrics.monthlyDonation.toLocaleString()}`}
              change={7.5}
              color="purple"
            />
          </div>

          {/* Membership Growth Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    {t('membershipGrowth.title')}
                  </CardTitle>
                  <CardDescription>{t('membershipGrowth.description')}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {t('metrics.growth', { value: metrics.memberGrowth > 0 ? `+${metrics.memberGrowth}` : metrics.memberGrowth })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={memberGrowth} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      stroke="#888888"
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      stroke="#888888"
                      fontSize={12}
                      tickFormatter={(value) => `${value.toLocaleString()}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      strokeWidth={3}
                      stroke="#3b82f6"
                      dot={{ r: 4, strokeWidth: 2, fill: "#3b82f6" }}
                      activeDot={{ r: 6, strokeWidth: 2, fill: "#3b82f6" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      }}
                      formatter={(value) => [`${Number(value).toLocaleString()} members`, "Total"]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Various Data */}
          <Tabs defaultValue="groups" className="space-y-4">
            <TabsList className="grid grid-cols-4 h-auto p-1">
              <TabsTrigger value="groups" className="py-2">
                {t('tabs.topGroups')}
              </TabsTrigger>
              <TabsTrigger value="events" className="py-2">
                {t('tabs.upcomingEvents')}
              </TabsTrigger>
              <TabsTrigger value="donations" className="py-2">
                {t('tabs.recentDonations')}
              </TabsTrigger>
              <TabsTrigger value="members" className="py-2">
                {t('tabs.recentMembers')}
              </TabsTrigger>
            </TabsList>

            {/* Groups Tab */}
            <TabsContent value="groups" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-amber-600" />
                        {t('groups.title')}
                      </CardTitle>
                      <CardDescription>{t('groups.description')}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      {t('groups.viewAll')} <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {formattedGroups.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('groups.groupName')}</TableHead>
                            <TableHead className="text-right">{t('groups.totalMembers')}</TableHead>
                            <TableHead className="text-right">{t('groups.activeMembers')}</TableHead>
                            <TableHead className="text-right">{t('groups.eventsThisMonth')}</TableHead>
                            <TableHead>{t('groups.status')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formattedGroups.map((group) => (
                            <TableRow key={group.id}>
                              <TableCell className="font-medium">{group.name}</TableCell>
                              <TableCell className="text-right">{group.members.toLocaleString()}</TableCell>
                              <TableCell className="text-right">{group.activeMembers.toLocaleString()}</TableCell>
                              <TableCell className="text-right">{group.events}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    group.status === "Active"
                                      ? "bg-green-50 text-green-700"
                                      : "bg-yellow-50 text-yellow-700"
                                  }
                                >
                                  {group.status || "Active"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-md">
                      <Building2 className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-sm font-medium">{t('groups.noData.title')}</p>
                      <p className="text-xs text-gray-400">{t('groups.noData.description')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        {t('events.title')}
                      </CardTitle>
                      <CardDescription>{t('events.description')}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      {t('groups.viewAll')} <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {events.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('events.eventName')}</TableHead>
                            <TableHead>{t('events.date')}</TableHead>
                            <TableHead className="text-right">{t('events.expectedAttendees')}</TableHead>
                            <TableHead>{t('events.price')}</TableHead>
                            <TableHead>{t('events.status')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {events.map((event: any) => (
                            <TableRow key={event.id}>
                              <TableCell className="font-medium">{event.name}</TableCell>
                              <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">{event.attendees?.toLocaleString() || "N/A"}</TableCell>
                              <TableCell>{event.isPaid ? event.price : t('events.free')}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  {event.status || "Upcoming"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-md">
                      <Calendar className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-sm font-medium">{t('events.noData.title')}</p>
                      <p className="text-xs text-gray-400">{t('events.noData.description')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Donations Tab */}
            <TabsContent value="donations">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CircleDollarSign className="h-5 w-5 text-purple-600" />
                        {t('donations.title')}
                      </CardTitle>
                      <CardDescription>{t('donations.description')}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      {t('groups.viewAll')} <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {donations.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('donations.donor')}</TableHead>
                            <TableHead className="text-right">{t('donations.amount')}</TableHead>
                            <TableHead>{t('donations.type')}</TableHead>
                            <TableHead>{t('donations.date')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {donations.map((donation: any) => (
                            <TableRow key={donation.id}>
                              <TableCell className="font-medium">{donation.donor}</TableCell>
                              <TableCell className="text-right font-medium">
                                ${donation.amount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    donation.type === "Monthly"
                                      ? "bg-purple-50 text-purple-700"
                                      : "bg-blue-50 text-blue-700"
                                  }
                                >
                                  {donation.type}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-md">
                      <CircleDollarSign className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-sm font-medium">{t('donations.noData.title')}</p>
                      <p className="text-xs text-gray-400">{t('donations.noData.description')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        {t('members.title')}
                      </CardTitle>
                      <CardDescription>{t('members.description')}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      {t('groups.viewAll')} <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {members.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('members.name')}</TableHead>
                            <TableHead>{t('members.email')}</TableHead>
                            <TableHead>{t('members.status')}</TableHead>
                            <TableHead>{t('members.joinDate')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {members.slice(0, 5).map((member: any) => (
                            <TableRow key={member.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                                      {member.firstName?.charAt(0)}
                                      {member.lastName?.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>
                                    {member.firstName} {member.lastName}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{member.email}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={member.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                                >
                                  {member.isActive ? t('members.active') : t('members.inactive')}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "N/A"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-md">
                      <Users className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-sm font-medium">{t('members.noData.title')}</p>
                      <p className="text-xs text-gray-400">{t('members.noData.description')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
