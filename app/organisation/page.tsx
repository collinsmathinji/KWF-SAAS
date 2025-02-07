"use client"
import React, { useState } from "react"
import Link from "next/link"
import { Calendar, CalendarDays, ChevronDown, Group, Plus,LayoutDashboard,  Users } from "lucide-react"

import  DashboardContent  from "./dashboard-content"
import { EventsTable } from "./events-table"
import { GroupsContent } from "./groups-content"
import { MemberTypesContent } from "./member-types-content"
import UserProfile from "../profile-page/page"
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

const memberTypes = [
    {
      id: "1",
      name: "Executives",
      level: "Top Management",
      totalMembers: 10,
      responsibilities: [
        "Strategic decision-making",
        "Overseeing company operations",
        "High-level partnerships",
      ],
    },
    {
      id: "2",
      name: "Managers",
      level: "Middle Management",
      totalMembers: 50,
      responsibilities: [
        "Supervising teams",
        "Implementing company policies",
        "Project management",
      ],
    },
    {
      id: "3",
      name: "Team Leads",
      level: "Operational Leadership",
      totalMembers: 100,
      responsibilities: [
        "Managing daily tasks",
        "Mentoring team members",
        "Ensuring productivity",
      ],
    },
    {
      id: "4",
      name: "Employees",
      level: "General Staff",
      totalMembers: 500,
      responsibilities: [
        "Executing assigned tasks",
        "Collaborating with teams",
        "Following company guidelines",
      ],
    },
    {
      id: "5",
      name: "Interns",
      level: "Entry Level",
      totalMembers: 50,
      responsibilities: [
        "Learning company processes",
        "Assisting teams",
        "Gaining work experience",
      ],
    },
  ];
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
        projectsInvolved: 2
      },
      // ... more memberships
    ],
    recentActivity: [
      {
        date: "2024-02-07",
        action: "Completed",
        project: "Dashboard UI"
      },
      // ... more activities
    ]
  };
const groups = [
  {
    id: "1",
    name: "Marketing Team",
    type: "department",
    members: 95,
    activeProjects: 5,
    lead: "Sarah Johnson",
  },
  {
    id: "2",
    name: "Engineering",
    type: "department",
    members: 25,
    activeProjects: 8,
    lead: "Mike Chen",
  },
]

const events = [
  { id: "1", title: "Annual Meeting", date: "2025-02-15", location: "Main Hall" },
  { id: "2", title: "Team Building", date: "2025-02-20", location: "Conference Room" },
]

export default function OrganizationDashboard() {
  const [activeMainMenu, setActiveMainMenu] = useState<string>("dashboard")
  const [activeSubMenu, setActiveSubMenu] = useState<string>("")

  const handleMainMenuClick = (menu: string) => {
    setActiveMainMenu(menu)
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 to-white">
        {/* Sidebar with flex-shrink-0 to prevent shrinking */}
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
                        Dashboard
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <Collapsible defaultOpen>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Member Types</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Add member type logic
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu className="p-7">
                        {memberTypes.map((type) => (
                          <SidebarMenuItem key={type.id}>
                            <SidebarMenuButton
                              onClick={() => {
                                setActiveMainMenu("membertypes")
                                setActiveSubMenu(type.id)
                              }}
                              isActive={activeMainMenu === "membertypes" && activeSubMenu === type.id}
                            >
                              {type.name}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroup>

              <SidebarGroup>
                <Collapsible defaultOpen>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-2">
                      <div className="flex items-center gap-2">
                        <Group className="h-4 w-4" />
                        <span>Groups</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Add group logic
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu className="px-7">
                        {groups.map((group) => (
                          <SidebarMenuItem key={group.id}>
                            <SidebarMenuButton
                               className="text-blue text-sm"
                              onClick={() => {
                                setActiveMainMenu("groups")
                                setActiveSubMenu(group.id)
                              }}
                              isActive={activeMainMenu === "groups" && activeSubMenu === group.id}
                            >
                              {group.name}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroup>

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
                        Events
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => handleMainMenuClick("calendar")}
                        isActive={activeMainMenu === "calendar"}
                      >
                        <Calendar className="h-4 w-4" />
                        Calendar
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
          </Sidebar>
        </div>

        {/* Main Content with flex-grow to take remaining space */}
        <main className="flex-1 overflow-auto p-8">
        <header className="flex justify-end items-center mb-8">
       
          <div className="flex items-center">
            {/* <Bell className="mr-4 text-blue-600" /> */}
            <div className="flex items-center">
              <img 
                src="/api/placeholder/40/40" 
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
            {activeMainMenu === "userProfile" && <UserProfile/>}
            {activeMainMenu === "membertypes" && (
              <MemberTypesContent memberType={memberTypes.find((t) => t.id === activeSubMenu)} />
            )}
            {activeMainMenu === "groups" && <GroupsContent group={groups.find((g) => g.id === activeSubMenu)} />}
          </Card>
        </main>
      </div>
    </SidebarProvider>
  )
}