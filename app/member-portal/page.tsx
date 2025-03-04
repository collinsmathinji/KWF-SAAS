"use client"

import { useState, useEffect } from "react"
import {
  CalendarDays,
  Group,
  Lock,
  LayoutDashboard,
  Users,
  Bell,
  Search,
  ChevronRight,
  Award,
  Zap,
  BarChart3,
  TrendingUp,
  Star,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Import your components
import DashboardContent from "./dashboard-content"
import EventsTable from "./events-table"
import { GroupsContent } from "./groups-content"
import { MemberTypesContent } from "./member-types-content"
import UserProfile from "../profile-page/page"

// Define types
type GroupVisibility = "public" | "private"

interface Group {
  id: string
  name: string
  visibility: GroupVisibility
  memberCount: number
  isMember: boolean
  isPending?: boolean
  type?: string
  members?: number
  activeProjects?: number
  lead?: string
  activity?: any
  color?: string
}

// Mock data
const groups: Group[] = [
  { id: "1", name: "Engineering", visibility: "public", memberCount: 25, isMember: true, activity: 87, color: "blue" },
  { id: "2", name: "Design", visibility: "public", memberCount: 12, isMember: true, activity: 92, color: "purple" },
  { id: "3", name: "Marketing", visibility: "public", memberCount: 8, isMember: false, activity: 76, color: "green" },
  {
    id: "4",
    name: "Leadership",
    visibility: "private",
    memberCount: 5,
    isMember: false,
    isPending: true,
    activity: 95,
    color: "amber",
  },
]

const events = [
  { id: "1", title: "Annual Meeting", date: "2025-02-15", location: "Main Hall" },
  { id: "2", title: "Team Building", date: "2025-02-20", location: "Conference Room" },
]

const memberData = {
  id: "1",
  name: "John Doe",
  type: "Executive",
  joinDate: "Jan 2024",
  projectsCompleted: 12,
  currentProjects: 3,
  monthlyContribution: 99,
  points: 1250,
  level: 4,
  nextLevelPoints: 1500,
  badges: ["Top Contributor", "Project Lead", "Innovator"],
  groupMemberships: [
    {
      groupName: "Development",
      role: "Lead",
      projectsInvolved: 2,
    },
  ],
  recentActivity: [
    {
      date: "2024-02-07",
      action: "Completed",
      project: "Dashboard UI",
    },
  ],
}

const memberTypes = [
  {
    id: "1",
    name: "Executives",
    level: "Top Management",
    totalMembers: 10,
    responsibilities: ["Strategic decision-making", "Overseeing company operations", "High-level partnerships"],
  },
  // Add more member types as needed
]

const notifications = [
  {
    id: "1",
    title: "New project opportunity",
    message: "You've been invited to join the Mobile App project",
    time: "2 hours ago",
  },
  { id: "2", title: "Group meeting", message: "Engineering team meeting tomorrow at 10 AM", time: "5 hours ago" },
  { id: "3", title: "Achievement unlocked", message: "You've earned the 'Team Player' badge!", time: "1 day ago" },
]

export default function Page() {
  const [activeMainMenu, setActiveMainMenu] = useState<string>("dashboard")
  const [activeSubMenu, setActiveSubMenu] = useState<string>("")
  const [activeGroup, setActiveGroup] = useState<string>("")
  const [progress, setProgress] = useState(0)
  console.log(setActiveSubMenu)
  const memberGroups = groups.filter((g) => g.isMember)
  const availableGroups = groups.filter((g) => !g.isMember)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(66)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleMainMenuClick = (menu: string) => {
    setActiveMainMenu(menu)
  }

  const handleGroupSelect = (groupId: string) => {
    setActiveGroup(groupId)
    setActiveMainMenu("groups")
  }


  const handleJoinGroup = (groupId: string) => {
    // Implement group joining logic
    console.log("Join group", groupId)
  }

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
          <div className="flex-shrink-0">
            <Sidebar className="h-screen border-r">
              <SidebarHeader className="border-b bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white font-semibold text-blue-700 shadow-md">
                    O
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-white">Organization</span>
                    <span className="text-xs text-blue-100">Members Portal</span>
                  </div>
                </div>
              </SidebarHeader>

              <SidebarContent className="bg-gradient-to-b from-white to-blue-50">
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => handleMainMenuClick("dashboard")}
                          isActive={activeMainMenu === "dashboard"}
                          className="hover:bg-blue-100 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                          {activeMainMenu === "dashboard" && <ChevronRight className="ml-auto h-4 w-4 text-blue-600" />}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <div className="space-y-4">
                  <SidebarGroup>
                    <Collapsible defaultOpen>
                      <SidebarGroupLabel asChild>
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-blue-100 transition-colors">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Your Groups</span>
                          </div>
                         
                        </CollapsibleTrigger>
                      </SidebarGroupLabel>
                      <CollapsibleContent>
                        <SidebarGroupContent>
                          <SidebarMenu>
                            {memberGroups.map((group) => (
                              <SidebarMenuItem key={group.id}>
                                <SidebarMenuButton
                                  onClick={() => handleGroupSelect(group.id)}
                                  isActive={activeGroup === group.id}
                                  className="hover:bg-blue-100 transition-colors"
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                      <div className={`h-2 w-2 rounded-full bg-${group.color || "blue"}-500`}></div>
                                      <span>{group.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Zap className={`h-3 w-3 text-${group.color || "blue"}-500`} />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{group.activity}% active</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      <span className="text-xs text-muted-foreground">{group.memberCount}</span>
                                    </div>
                                  </div>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarGroup>

                  {availableGroups.length > 0 && (
                    <SidebarGroup>
                      <Collapsible defaultOpen>
                        <SidebarGroupLabel asChild>
                          <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-blue-100 transition-colors">
                            <div className="flex items-center gap-2">
                              <Group className="h-4 w-4 text-indigo-600" />
                              <span className="font-medium">Available Groups</span>
                            </div>
                          </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                          <SidebarGroupContent>
                            <SidebarMenu>
                              {availableGroups.map((group) => (
                                <SidebarMenuItem key={group.id}>
                                  <SidebarMenuButton
                                    onClick={() => handleGroupSelect(group.id)}
                                    isActive={activeGroup === group.id}
                                    className="hover:bg-blue-100 transition-colors"
                                  >
                                    <div className="flex items-center justify-between w-full group">
                                      <div className="flex items-center gap-2">
                                        {group.visibility === "private" ? (
                                          <Lock className={`h-4 w-4 text-${group.color || "amber"}-500`} />
                                        ) : (
                                          <Group className={`h-4 w-4 text-${group.color || "green"}-500`} />
                                        )}
                                        <span>{group.name}</span>
                                        {group.activity > 90 && (
                                          <Badge
                                            variant="outline"
                                            className="ml-2 bg-amber-100 text-amber-800 border-amber-200 text-[10px]"
                                          >
                                            Hot
                                          </Badge>
                                        )}
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className={`opacity-0 group-hover:opacity-100 transition-opacity ${!group.isPending ? "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200" : ""}`}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleJoinGroup(group.id)
                                        }}
                                        disabled={group.isPending}
                                      >
                                        {group.isPending ? (
                                          <span className="text-xs text-muted-foreground">Pending</span>
                                        ) : (
                                          <span className="text-xs">Join</span>
                                        )}
                                      </Button>
                                    </div>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              ))}
                            </SidebarMenu>
                          </SidebarGroupContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarGroup>
                  )}
                </div>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-blue-700 font-medium">Schedule</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => handleMainMenuClick("events")}
                          isActive={activeMainMenu === "events"}
                          className="hover:bg-blue-100 transition-colors"
                        >
                          <CalendarDays className="h-4 w-4 text-blue-600" />
                          <span>Events</span>
                          {events.length > 0 && (
                            <Badge className="ml-auto bg-blue-100 text-blue-800 hover:bg-blue-200">
                              {events.length}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarRail />
            </Sidebar>
          </div>

          <main className="flex-1 overflow-auto">
            <header className="flex justify-between items-center p-4 bg-white border-b shadow-sm sticky top-0 z-10">
              <div className="flex items-center gap-4 w-1/3">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search members, groups, events..."
                    className="pl-8 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Bell className="h-4 w-4" />
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                        3
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      Notifications
                      <Badge variant="outline" className="ml-2">
                        New
                      </Badge>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start p-3 cursor-pointer hover:bg-slate-50"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{notification.title}</span>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <span className="text-sm text-muted-foreground mt-1">{notification.message}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-3">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-medium">{memberData.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">{memberData.type}</span>
                      <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                        Level {memberData.level}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                        <img
                          src="/placeholder.svg?height=40&width=40"
                          alt="Profile"
                          className="h-10 w-10 rounded-full border-2 border-blue-200"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleMainMenuClick("userProfile")}>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>

            <div className="p-6">
              {activeMainMenu === "dashboard" && (
                <div className="mb-6">
                  <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none shadow-lg mb-6">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Welcome back, {memberData.name}!</h2>
                          <p className="text-blue-100">Your membership journey is progressing well. Keep it up!</p>
                        </div>
                        
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <BarChart3 className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Projects Completed</p>
                          <h3 className="text-2xl font-bold">{memberData.projectsCompleted}</h3>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-full">
                          <TrendingUp className="h-6 w-6 text-green-700" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active Projects</p>
                          <h3 className="text-2xl font-bold">{memberData.currentProjects}</h3>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-amber-100 p-3 rounded-full">
                          <Star className="h-6 w-6 text-amber-700" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Badges Earned</p>
                          <h3 className="text-2xl font-bold">{memberData.badges.length}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {memberData.badges.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Your Achievements</h3>
                      <div className="flex flex-wrap gap-2">
                        {memberData.badges.map((badge, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1 bg-indigo-100 text-indigo-800 border-indigo-200"
                          >
                            <Award className="h-3 w-3 mr-1" />
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Card className="border-none bg-white/80 backdrop-blur-xl shadow-sm">
                {activeMainMenu === "dashboard" && <DashboardContent member={memberData} />}
                {activeMainMenu === "events" && <EventsTable />}
                {activeMainMenu === "userProfile" && <UserProfile />}
                {activeMainMenu === "membertypes" && (
                  <MemberTypesContent memberType={memberTypes.find((t) => t.id === activeSubMenu)} />
                )}
                {activeMainMenu === "groups" && (
                  <GroupsContent
                    group={
                      groups.find((g) => g.id === activeGroup) as Group & {
                        type: string
                        members: number
                        activeProjects: number
                        lead: string
                      }
                    }
                  />
                )}
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}

