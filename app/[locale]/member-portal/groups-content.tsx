import {
  Group,
  Users,
  Briefcase,
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
  BarChart3,
  MessageSquare,
  FileText,
  Search,
  Filter,
  ChevronRight,
  Mail,
  Phone,
  ExternalLink,
  Plus,
  Share2,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GroupData {
  id: string
  name: string
  type: string
  members: number
  activeProjects: number
  lead: string
  activity?: number
  color?: string
}

// Mock data for team members
const mockMembers = [
  {
    id: "1",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Senior Developer",
    email: "jane@example.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    joinDate: "Jan 15, 2024",
    projects: 3,
    activity: 92,
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Michael Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "UX Designer",
    email: "michael@example.com",
    phone: "+1 (555) 234-5678",
    status: "Active",
    joinDate: "Feb 3, 2024",
    projects: 2,
    activity: 85,
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Emily Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Project Manager",
    email: "emily@example.com",
    phone: "+1 (555) 345-6789",
    status: "On Leave",
    joinDate: "Dec 10, 2023",
    projects: 4,
    activity: 45,
    lastActive: "5 days ago",
  },
  {
    id: "4",
    name: "David Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Backend Developer",
    email: "david@example.com",
    phone: "+1 (555) 456-7890",
    status: "Active",
    joinDate: "Mar 5, 2024",
    projects: 2,
    activity: 95,
    lastActive: "Just now",
  },
  {
    id: "5",
    name: "Sarah Miller",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "QA Engineer",
    email: "sarah@example.com",
    phone: "+1 (555) 567-8901",
    status: "Inactive",
    joinDate: "Jan 22, 2024",
    projects: 0,
    activity: 12,
    lastActive: "2 weeks ago",
  },
]

// Mock data for projects
const mockProjects = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Redesign the company website with modern UI/UX principles",
    status: "In Progress",
    progress: 65,
    dueDate: "Mar 30, 2024",
    assignedTo: ["Jane Smith", "Michael Johnson"],
    priority: "High",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Create a native mobile app for iOS and Android platforms",
    status: "Planning",
    progress: 25,
    dueDate: "May 15, 2024",
    assignedTo: ["David Brown", "Emily Williams"],
    priority: "Medium",
  },
  {
    id: "3",
    name: "Database Migration",
    description: "Migrate legacy database to new cloud infrastructure",
    status: "Completed",
    progress: 100,
    dueDate: "Feb 28, 2024",
    assignedTo: ["Jane Smith", "David Brown"],
    priority: "Critical",
  },
  {
    id: "4",
    name: "User Research Study",
    description: "Conduct user research to inform product development",
    status: "In Progress",
    progress: 50,
    dueDate: "Apr 10, 2024",
    assignedTo: ["Michael Johnson", "Sarah Miller"],
    priority: "Medium",
  },
]

// Mock data for group statistics
const mockStats = {
  completionRate: 78,
  meetingsPerMonth: 8,
  avgResponseTime: "2.5 hours",
  documentsShared: 34,
}

interface GroupsContentProps {
  group: GroupData | undefined
}

export function GroupsContent({ group }: GroupsContentProps) {
  if (!group) return null

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 ring-green-600/20"
      case "Inactive":
        return "bg-red-50 text-red-700 ring-red-600/20"
      case "On Leave":
        return "bg-amber-50 text-amber-700 ring-amber-600/20"
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20"
    }
  }

  // Get project status badge color
  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700 ring-green-600/20"
      case "In Progress":
        return "bg-amber-50 text-amber-700 ring-amber-600/20"
      case "Planning":
        return "bg-blue-50 text-blue-700 ring-blue-600/20"
      case "On Hold":
        return "bg-red-50 text-red-700 ring-red-600/20"
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20"
    }
  }

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-50 text-red-700 ring-red-600/20"
      case "High":
        return "bg-amber-50 text-amber-700 ring-amber-600/20"
      case "Medium":
        return "bg-blue-50 text-blue-700 ring-blue-600/20"
      case "Low":
        return "bg-green-50 text-green-700 ring-green-600/20"
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20"
    }
  }

  // Get activity color
  const getActivityColor = (activity: number) => {
    if (activity >= 80) return "text-green-600"
    if (activity >= 50) return "text-amber-600"
    return "text-red-600"
  }

  // Get activity indicator class
  const getActivityIndicator = (activity: number) => {
    if (activity >= 80) return "bg-green-500"
    if (activity >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <TooltipProvider>
      <div className="space-y-8 p-6">
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Group className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{group.name}</h2>
                <p className="text-blue-100">{group.type} Group</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-200" />
                <span className="text-sm font-medium text-blue-100">Members</span>
              </div>
              <p className="mt-2 text-2xl font-bold">{group.members}</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-200" />
                <span className="text-sm font-medium text-blue-100">Active Projects</span>
              </div>
              <p className="mt-2 text-2xl font-bold">{group.activeProjects}</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-200" />
                <span className="text-sm font-medium text-blue-100">Team Lead</span>
              </div>
              <p className="mt-2 text-xl font-bold truncate">{group.lead}</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-200" />
                <span className="text-sm font-medium text-blue-100">Activity Rate</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-2xl font-bold">{group.activity || 85}%</p>
                <div className="flex-1">
                  <Progress value={group.activity || 85} className="h-2 bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{mockStats.completionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-3">
                  <MessageSquare className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Meetings/Month</p>
                  <p className="text-2xl font-bold">{mockStats.meetingsPerMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-amber-100 p-3">
                  <Clock className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                  <p className="text-2xl font-bold">{mockStats.avgResponseTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-indigo-100 p-3">
                  <FileText className="h-6 w-6 text-indigo-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documents Shared</p>
                  <p className="text-2xl font-bold">{mockStats.documentsShared}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Active Projects</CardTitle>
                    <CardDescription>Current projects managed by this group</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search projects..." className="pl-10 w-[200px] md:w-[300px]" />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[130px]">
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="inprogress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{project.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getProjectStatusColor(project.status)}`}
                            >
                              {project.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="w-24">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">{project.progress}%</span>
                              </div>
                              <Progress
                                value={project.progress}
                                className="h-1.5"
                                
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{project.dueDate}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityColor(project.priority)}`}
                            >
                              {project.priority}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex -space-x-2">
                              {project.assignedTo.slice(0, 3).map((person, index) => (
                                <Tooltip key={index}>
                                  <TooltipTrigger asChild>
                                    <Avatar className="border-2 border-background h-7 w-7">
                                      <AvatarImage src="/placeholder.svg?height=28&width=28" alt={person} />
                                      <AvatarFallback>{person.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{person}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                              {project.assignedTo.length > 3 && (
                                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                                  +{project.assignedTo.length - 3}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{mockProjects.length}</strong> of <strong>{mockProjects.length}</strong> projects
                </div>
                <Button variant="outline">View All Projects</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>People who are part of this group</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search members..." className="pl-10 w-[200px] md:w-[300px]" />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[130px]">
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="onleave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="table" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="table">Table View</TabsTrigger>
                    <TabsTrigger value="cards">Card View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="table">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead>Projects</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockMembers.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">Joined {member.joinDate}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{member.role}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(member.status)}`}
                                >
                                  {member.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`h-2 w-2 rounded-full ${getActivityIndicator(member.activity)}`}
                                  ></div>
                                  <span className={`text-sm ${getActivityColor(member.activity)}`}>
                                    {member.activity}%
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{member.projects}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="cards">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {mockMembers.map((member) => (
                        <Card key={member.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <CardTitle className="text-base">{member.name}</CardTitle>
                                  <CardDescription>{member.role}</CardDescription>
                                </div>
                              </div>
                              <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>{member.email}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>{member.phone}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>{member.projects} active projects</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>Last active {member.lastActive}</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm">Activity</span>
                                <span className={`text-sm ${getActivityColor(member.activity)}`}>
                                  {member.activity}%
                                </span>
                              </div>
                              <Progress
                                value={member.activity}
                                className="h-1"
                              />
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline" size="sm" className="w-full">
                              <ExternalLink className="mr-2 h-3 w-3" />
                              View Profile
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{mockMembers.length}</strong> of <strong>{group.members}</strong> members
                </div>
                <Button variant="outline">View All Members</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and updates from this group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="w-px h-full bg-blue-200 mt-2"></div>
                    </div>
                    <div className="pb-8">
                      <p className="text-sm text-muted-foreground">Today</p>
                      <h4 className="text-base font-medium mt-1">Project Milestone Completed</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Website Redesign project reached 65% completion
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Jane Smith" />
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Michael Johnson" />
                          <AvatarFallback>MJ</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">+2 others involved</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="w-px h-full bg-blue-200 mt-2"></div>
                    </div>
                    <div className="pb-8">
                      <p className="text-sm text-muted-foreground">Yesterday</p>
                      <h4 className="text-base font-medium mt-1">New Document Shared</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Project requirements document was shared with the team
                      </p>
                      <Button variant="outline" size="sm" className="mt-3">
                        View Document
                      </Button>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Week</p>
                      <h4 className="text-base font-medium mt-1">Team Meeting Held</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Monthly planning meeting with all team members
                      </p>
                      <div className="mt-3 flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Mar 5, 2024</span>
                        <Clock className="ml-4 mr-2 h-4 w-4" />
                        <span>10:00 AM - 11:30 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  Load More Activity
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}

