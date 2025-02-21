"use client"

import { useState } from "react"
import { Calendar, CalendarDays, Group, Lock, Plus, LayoutDashboard, Users } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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

// Import your components
import DashboardContent from "./dashboard-content"
import { EventsTable } from "./events-table"
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
}

// Mock data
const groups: Group[] = [
  { id: "1", name: "Engineering", visibility: "public", memberCount: 25, isMember: true },
  { id: "2", name: "Design", visibility: "public", memberCount: 12, isMember: true },
  { id: "3", name: "Marketing", visibility: "public", memberCount: 8, isMember: false },
  { id: "4", name: "Leadership", visibility: "private", memberCount: 5, isMember: false, isPending: true },
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

export default function Page() {
  const [activeMainMenu, setActiveMainMenu] = useState<string>("dashboard")
  const [activeSubMenu, setActiveSubMenu] = useState<string>("")
  const [activeGroup, setActiveGroup] = useState<string>("")
  console.log(setActiveSubMenu)
  const memberGroups = groups.filter((g) => g.isMember)
  const availableGroups = groups.filter((g) => !g.isMember)

  const handleMainMenuClick = (menu: string) => {
    setActiveMainMenu(menu)
  }

  const handleGroupSelect = (groupId: string) => {
    setActiveGroup(groupId)
    setActiveMainMenu("groups")
  }

  const handleCreateGroup = () => {
    // Implement group creation logic
    console.log("Create group")
  }

  const handleJoinGroup = (groupId: string) => {
    // Implement group joining logic
    console.log("Join group", groupId)
  }

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 to-white">
          <div className="flex-shrink-0">
            <Sidebar className="h-screen border-r">
              <SidebarHeader className="border-b bg-white px-4 py-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-semibold text-white">
                    O
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">Organization</span>
                    <span className="text-xs text-muted-foreground">Dashboard</span>
                  </div>
                </div>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => handleMainMenuClick("dashboard")}
                          isActive={activeMainMenu === "dashboard"}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <div className="space-y-4">
                  <SidebarGroup>
                    <Collapsible defaultOpen>
                      <SidebarGroupLabel asChild>
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Your Groups</span>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCreateGroup()
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Create new group</TooltipContent>
                          </Tooltip>
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
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                      <Group className="h-4 w-4" />
                                      <span>{group.name}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{group.memberCount}</span>
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
                          <CollapsibleTrigger className="flex w-full items-center justify-between p-2">
                            <div className="flex items-center gap-2">
                              <Group className="h-4 w-4" />
                              <span>Available Groups</span>
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
                                  >
                                    <div className="flex items-center justify-between w-full group">
                                      <div className="flex items-center gap-2">
                                        {group.visibility === "private" ? (
                                          <Lock className="h-4 w-4" />
                                        ) : (
                                          <Group className="h-4 w-4" />
                                        )}
                                        <span>{group.name}</span>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
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
                  <SidebarGroupLabel>Schedule</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => handleMainMenuClick("events")}
                          isActive={activeMainMenu === "events"}
                        >
                          <CalendarDays className="h-4 w-4" />
                          <span>Events</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => handleMainMenuClick("calendar")}
                          isActive={activeMainMenu === "calendar"}
                        >
                          <Calendar className="h-4 w-4" />
                          <span>Calendar</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarRail />
            </Sidebar>
          </div>

          <main className="flex-1 overflow-auto p-8">
            <header className="flex justify-end items-center mb-8">
              <div className="flex items-center">
                <div className="flex items-center">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Admin"
                    className="w-10 h-10 rounded-full mr-2 border-2 border-blue-200"
                  />
                  <button onClick={() => handleMainMenuClick("userProfile")}>User Profile</button>
                </div>
              </div>
            </header>

            <Card className="h-full border-none bg-white/50 backdrop-blur-xl">
              {activeMainMenu === "dashboard" && <DashboardContent member={memberData} />}
              {activeMainMenu === "events" && <EventsTable events={events} />}
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
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}

