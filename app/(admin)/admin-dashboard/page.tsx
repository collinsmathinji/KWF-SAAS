"use client"

import React from "react"

import { useState } from "react"
import { Bell, CreditCard, Calendar, Layers, LayoutDashboard, Menu,  Settings, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Overview from "./overview"
import UserManagementPage from "./users"
import SubscriptionsPage from "./subscription"
import SettingsPage from "./settings/page"
import OrganizationProfile from "./organization"
import EventPage from "./event/page"
export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    {
      icon: <LayoutDashboard />,
      label: "Dashboard",
      section: "overview",
      description: "Platform overview and key metrics",
    },
    {
      icon: <Users />,
      label: "User Management",
      section: "users",
      description: "Manage users and access",
    },
    {
      icon: <CreditCard />,
      label: "Subscriptions",
      section: "subscriptions",
      description: "Manage plans and billing",
    },
    {
      icon: <Layers />,
      label: "Organization",
      section: "organization",
      description: "Manage organization settings",
    },
    {
      icon: <Calendar />,
      label: "Events",
      section: "event",
      description: "Manage organization events",
    },
 
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <Overview />
      case "users":
        return <UserManagementPage />
      case "subscriptions":
        return <SubscriptionsPage />
        case "organization":
          return <OrganizationProfile />
      case "event":
        return  <EventPage />
      case 'settings':
        return <SettingsPage />
      default:

        return (
          <div className="text-center text-muted-foreground">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} content goes here
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-30 transition-transform transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:w-80 bg-white border-r shadow-md p-4 flex flex-col`}
      >
        <div className="text-2xl font-bold mb-8 text-center text-blue-600">KWF-SAAS</div>

        <nav className="flex-grow">
          {menuItems.map((item) => (
            <div
              key={item.section}
              onClick={() => {
                setActiveSection(item.section)
                setSidebarOpen(false)
              }}
              className={`group cursor-pointer p-3 rounded-lg ${
                activeSection === item.section
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "hover:bg-blue-50 text-gray-600 hover:text-blue-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {React.cloneElement(item.icon, {
                    className: `mr-3 w-5 h-5 ${
                      activeSection === item.section ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
                    }`,
                  })}
                  <span className="font-medium">{item.label}</span>
                </div>
                {activeSection === item.section && <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>}
              </div>
              <p className="text-xs text-gray-400 mt-1">{item.description}</p>
            </div>
          ))}
        </nav>

        <div className="mt-4 border-t pt-4">
          <button className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50"  onClick={() => {
                setActiveSection('settings')
                setSidebarOpen(false)
              
              }}>
            <Settings  className="mr-3" /> Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 bg-blue-50">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-blue-600" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-blue-800 capitalize">{activeSection.replace(/([A-Z])/g, " $1")}</h1>
          </div>
          <div className="flex items-center">
            <Bell className="mr-4 text-blue-600" />
            <div className="flex items-center">
              <Avatar className="w-10 h-10 border-2 border-blue-200">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-blue-800">Admin User</span>
            </div>
          </div>
        </header>

        <main className="bg-white rounded-lg shadow-sm p-6">{renderContent()}</main>
      </div>
    </div>
  )
}

