"use client"
import{useState} from'react'
import { useRouter } from "next/navigation"
import { Users, Building2, CircleDollarSign, UserPlus, ArrowUpRight, ArrowDownRight, FileText,LayoutDashboard } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { LineChart } from "recharts"
import ReportsGenerator from './report/page'
// Sample data
const groupsData = [
  { name: "Technology", members: 450, active: 380, events: 12 },
  { name: "Business", members: 320, active: 290, events: 8 },
  { name: "Design", members: 280, active: 230, events: 10 },
  { name: "Marketing", members: 190, active: 150, events: 6 },
]

const upcomingEvents = [
  { id: 1, name: "Tech Conference", date: "2024-03-01", attendees: 120 },
  { id: 2, name: "Design Workshop", date: "2024-03-05", attendees: 45 },
  { id: 3, name: "Business Meetup", date: "2024-03-10", attendees: 80 },
]

const recentDonations = [
  { id: 1, donor: "John Doe", amount: 500, date: "2024-02-14", type: "Monthly" },
  { id: 2, donor: "Jane Smith", amount: 1000, date: "2024-02-13", type: "One-time" },
  { id: 3, donor: "Bob Wilson", amount: 250, date: "2024-02-12", type: "Monthly" },
  { id: 4, donor: "Alice Brown", amount: 750, date: "2024-02-11", type: "One-time" },
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

export default function Overview({organisationDetails}:any) {
const [activeSection, setActiveSection] = useState("")

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight">{activeSection === 'reports' ? 'Reports' : 'Overview'}</h2>
        <Button 
          variant="outline"
          onClick={() => setActiveSection(activeSection === 'reports' ? '' : 'reports')}
          className="flex items-center gap-2 transition-all hover:gap-3"
        >
          {activeSection === 'reports' ? (
        <>
          <LayoutDashboard className="h-4 w-4" />
          Back to Overview
        </>
          ) : (
        <>
          <FileText className="h-4 w-4" />
           Report Generation
        </>
          )}
        </Button>
      </div>

      {activeSection === "reports" ?(<ReportsGenerator />):(
            <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard 
                icon={<Users className="h-4 w-4" />} 
                title="Total Contacts" 
                value="8,234" 
                change={12.5} 
              />
              <MetricCard 
                icon={<UserPlus className="h-4 w-4" />} 
                title="Registered Members" 
                value="500" 
                change={8.2}
                description="Including portal access members" 
              />
              <MetricCard 
                icon={<Building2 className="h-4 w-4" />} 
                title="Total Groups" 
                value="42" 
                description="24 active groups" 
              />
              <MetricCard 
                icon={<CircleDollarSign className="h-4 w-4" />} 
                title="Monthly Donation" 
                value="$42,500" 
                change={15.7} 
              />
            </div>
      
            <Card>
              <CardHeader>
                <CardTitle>Membership Growth</CardTitle>
                <CardDescription>Total members over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { name: "Sep", total: 3200 },
                    { name: "Oct", total: 3800 },
                    { name: "Nov", total: 4300 },
                    { name: "Dec", total: 4800 },
                    { name: "Jan", total: 5100 },
                    { name: "Feb", total: 5335 },
                  ]}
                />
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
                        {groupsData.map((group) => (
                          <TableRow key={group.name}>
                            <TableCell className="font-medium">{group.name}</TableCell>
                            <TableCell>{group.members}</TableCell>
                            <TableCell>{group.active}</TableCell>
                            <TableCell>{group.events}</TableCell>
                            <TableCell>{Math.round((group.active / group.members) * 100)}%</TableCell>
                          </TableRow>
                        ))}
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
                        {upcomingEvents.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.name}</TableCell>
                            <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                            <TableCell>{event.attendees}</TableCell>
                          </TableRow>
                        ))}
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
                        {recentDonations.map((donation) => (
                          <TableRow key={donation.id}>
                            <TableCell className="font-medium">{donation.donor}</TableCell>
                            <TableCell>${donation.amount.toLocaleString()}</TableCell>
                            <TableCell>{donation.type}</TableCell>
                            <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            </>)}
    </div>
  )
}
