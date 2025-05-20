import { BarChart, Calendar, Clock, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Member {
  id: string
  name: string
  type: string
  joinDate: string
  projectsCompleted: number
  currentProjects: number
  monthlyContribution: number
  groupMemberships: {
    groupName: string
    role: string
    projectsInvolved: number
  }[]
  recentActivity: {
    date: string
    action: string
    project: string
  }[]
}

interface DashboardContentProps {
  member: Member
}

export default function DashboardContent({ member }: DashboardContentProps) {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  // Get upcoming events (mock data)
  const upcomingEvents = [
    { id: 1, title: "Team Meeting", date: "2024-03-10", time: "10:00 AM", location: "Conference Room A" },
    { id: 2, title: "Project Review", date: "2024-03-15", time: "2:00 PM", location: "Virtual" },
  ]

  // Get recommended groups (mock data)
  const recommendedGroups = [
    { id: 1, name: "Product Development", members: 18, activity: 85 },
    { id: 2, name: "Research Team", members: 12, activity: 92 },
  ]

  return (
    <div className="p-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Membership Status</CardTitle>
                <CardDescription>Your current membership details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Member Type</span>
                    <span className="text-sm">{member.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Join Date</span>
                    <span className="text-sm">{member.joinDate}</span>
                  </div>
                 
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Membership Renewal</span>
                      <span className="text-xs text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Renews in 45 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Group Memberships</CardTitle>
                <CardDescription>Groups you're currently part of</CardDescription>
              </CardHeader>
              <CardContent>
                {member.groupMemberships.length > 0 ? (
                  <div className="space-y-4">
                    {member.groupMemberships.map((group, index) => (
                      <div key={index} className="flex items-start justify-between border-b pb-3 last:border-0">
                        <div>
                          <p className="font-medium">{group.groupName}</p>
                          <p className="text-sm text-muted-foreground">Role: {group.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{group.projectsInvolved} Projects</p>
                          <Button variant="link" size="sm" className="h-auto p-0 text-blue-600">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Users className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-center">You're not part of any groups yet</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Browse Groups
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
                <CardDescription>Your latest contributions</CardDescription>
              </CardHeader>
              <CardContent>
                {member.recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {member.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                        <div className="rounded-full bg-blue-100 p-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {activity.action} {activity.project}
                          </p>
                          <p className="text-sm text-muted-foreground">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="link" className="w-full text-blue-600">
                      View All Activity
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Clock className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-center">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Your recent interactions and contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="w-px h-full bg-blue-200 mt-2"></div>
                  </div>
                  <div className="pb-8">
                    <p className="text-sm text-muted-foreground">Today</p>
                    <h4 className="text-base font-medium mt-1">Commented on Project Proposal</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      You provided feedback on the new marketing campaign proposal
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@user" />
                        <AvatarFallback>U1</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@user" />
                        <AvatarFallback>U2</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">+3 others involved</span>
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                      <BarChart className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="w-px h-full bg-blue-200 mt-2"></div>
                  </div>
                  <div className="pb-8">
                    <p className="text-sm text-muted-foreground">Yesterday</p>
                    <h4 className="text-base font-medium mt-1">Completed Project Milestone</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      You completed the first phase of the Dashboard UI project
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      View Project Details
                    </Button>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Week</p>
                    <h4 className="text-base font-medium mt-1">Joined Engineering Group</h4>
                    <p className="text-sm text-muted-foreground mt-1">You became a member of the Engineering team</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                Load More Activity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events you might be interested in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 border-b pb-4 last:border-0">
                      <div className="flex-shrink-0 rounded-md bg-blue-100 p-2 text-center w-12">
                        <span className="block text-xs font-medium text-blue-800">
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="block text-lg font-bold text-blue-800">{new Date(event.date).getDate()}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        RSVP
                      </Button>
                    </div>
                  ))}
                  <Button variant="link" className="w-full text-blue-600">
                    View All Events
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Groups</CardTitle>
                <CardDescription>Groups that match your interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedGroups.map((group) => (
                    <div key={group.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                      <div>
                        <h4 className="font-medium">{group.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Users className="mr-1 h-3 w-3" />
                          <span>{group.members} members</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Activity</span>
                            <span className="text-xs font-medium">{group.activity}%</span>
                          </div>
                          <Progress value={group.activity} className="h-1" />
                        </div>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Join
                      </Button>
                    </div>
                  ))}
                  <Button variant="link" className="w-full text-blue-600">
                    Explore More Groups
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

