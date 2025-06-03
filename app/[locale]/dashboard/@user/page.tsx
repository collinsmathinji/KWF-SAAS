"use client"

import React from "react"
import { useState, useEffect } from "react"
import { 
  Bell, 
  CreditCard, 
  Database, 
  Layers, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  PieChart, 
  Users, 
  Calendar,
  FolderOpen 
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Overview from "./overview"
import EventsDisplay from "./eventsDisplay"
import GroupsExplorer from "./groupExplorer"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [isResizing, setIsResizing] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Check authentication status
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login')
    }
  }, [status, router])

  const menuItems = [
    {
      icon: <LayoutDashboard />,
      label: "Dashboard",
      section: "overview",
      description: "Platform overview and key metrics",
    },
   
    {
      icon: <FolderOpen />,
      label: "Groups",
      section: "groups",
      description: "Explore and manage groups",
    },
 
    {
      icon: <Calendar />,
      label: "Events",
      section: "event",
      description: "Manage organization events",
    },
    {
      icon: <Calendar />,
      label: "Calendar",
      section: "calender",
      description: "Manage organization events",
    },
 
  ]

  // For Notion-like resize functionality
  const startResizing = (e:any) => {
    setIsResizing(true)
  }

  const stopResizing = () => {
    setIsResizing(false)
  }

  const resize = (e:any) => {
    if (isResizing) {
      const newWidth = e.clientX
      // Set min and max width constraints
      if (newWidth > 180 && newWidth < 480) {
        setSidebarWidth(newWidth)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResizing)
    
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing])

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <Overview />
      case "event":
        return <EventsDisplay />
      case "groups":
        return <GroupsExplorer />

      default:
        return (
          <div className="text-center text-muted-foreground p-12">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} content goes here
          </div>
        )
    }
  }

  const handleLogout = async () => {
    try {
      // Clear all localStorage items
      localStorage.removeItem('isOnboarded');
      localStorage.removeItem('currentOrganization');
      localStorage.removeItem('organizationId');
      localStorage.removeItem('userId');
      localStorage.removeItem('currentMemberType');
      
      // Clear the entire localStorage as a safety measure
      localStorage.clear();
      
      // Sign out with force reload to ensure session is cleared
      await signOut({ 
        callbackUrl: '/login',
        redirect: false
      });
      
      // Force a page reload to clear any remaining state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect to login even if signOut fails
      window.location.href = '/login';
    }
  };

  return (
    <div 
      className="flex min-h-screen bg-blue-50"
      onMouseUp={stopResizing}
      onMouseMove={resize}
    >
      {/* Sidebar */}
      <div
        style={{ width: sidebarOpen || window.innerWidth >= 1024 ? `${sidebarWidth}px` : '0px' }}
        className={`fixed inset-0 z-30 transition-all duration-300 ease-in-out transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white border-r shadow-md flex flex-col`}
      >
        <div className="text-2xl font-bold p-4 text-center text-blue-600 border-b">KWF-SAAS</div>

        <nav className="flex-grow overflow-y-auto p-2">
          {menuItems.map((item) => (
            <div
              key={item.section}
              onClick={() => {
                setActiveSection(item.section)
                if (window.innerWidth < 1024) setSidebarOpen(false)
              }}
              className={cn(
                "group cursor-pointer p-3 mb-1 rounded-lg transition-all",
                activeSection === item.section
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "hover:bg-gray-100 text-gray-600 hover:text-blue-600"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {React.cloneElement(item.icon, {
                    className: cn(
                      "mr-3 w-5 h-5",
                      activeSection === item.section ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
                    ),
                  })}
                  <span className="font-medium">{item.label}</span>
                </div>
                {activeSection === item.section && <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>}
              </div>
              <p className="text-xs text-gray-400 mt-1">{item.description}</p>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t pt-4">
          <button className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="mr-3" /> Logout
          </button>
        </div>
        
        {/* Resizer handle - Notion style */}
        <div 
          className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-transparent hover:bg-blue-200 transition-colors"
          onMouseDown={startResizing}
        />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-blue-600" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-blue-800 capitalize">
              {activeSection.replace(/([A-Z])/g, " $1")}
            </h1>
          </div>
          <div className="flex items-center">
            <button className="relative mr-4 text-blue-600 hover:bg-blue-50 p-2 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center">
              <Avatar className="w-8 h-8 border-2 border-blue-200">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-blue-800 hidden md:inline">Admin User</span>
            </div>
          </div>
        </header>

        <main className="flex-grow p-4 bg-blue-50 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}