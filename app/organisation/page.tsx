"use client"
import React, { useState } from "react"
import { Calendar, CalendarDays, ChevronDown, Group, LayoutDashboard, Plus, Users } from "lucide-react"

import { DashboardContent } from "./dashboard-content"
import { EventsTable } from "./events-table"
import { GroupsContent } from "./groups-content"
import { MemberTypesContent } from "./member-types-content"
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

// Sample data
const memberTypes = [
  {
    id: "1",
    name: "Premium",
    type: "paid",
    totalMembers: 150,
    monthlyRevenue: 7500,
    benefits: ["Access to all features", "Priority support", "Custom branding"],
  },
  {
    id: "2",
    name: "Basic",
    type: "free",
    totalMembers: 300,
    monthlyRevenue: 0,
    benefits: ["Basic features", "Community support", "Standard branding"],
  },
]

const groups = [
  {
    id: "1",
    name: "Marketing Team",
    type: "department",
    members: 15,
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
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Main Sidebar */}
        <Sidebar className="border-r">
          <SidebarHeader className="border-b bg-white px-4 py-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-semibold text-white">
                O
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">Organization</span>
                <span className="text-xs text-muted-foreground">organisation  Dashboard</span>
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
                    <div className="flex items-center gap-2">
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
                    <SidebarMenu>
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
                    <SidebarMenu>
                      {groups.map((group) => (
                        <SidebarMenuItem key={group.id}>
                          <SidebarMenuButton
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

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-8">
          <Card className="border-none bg-white/50 backdrop-blur-xl">
            {activeMainMenu === "dashboard" && <DashboardContent memberTypes={memberTypes} groups={groups} />}
            {activeMainMenu === "events" && <EventsTable events={events} />}
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

