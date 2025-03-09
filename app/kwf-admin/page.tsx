"use client"

import { useState, useEffect } from "react"
import { BarChart3, Building2, ChevronRight, CircleUser, CreditCard, DollarSign, FileBarChart, Home, LayoutDashboard, LogOut, Menu, PieChart, Settings, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { DashboardHeader } from "./dashboard-header"
import { Overview } from "./overview"
import { RecentActivity } from "./recent-activity"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import OrganizationsPage from "./organizations"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useIsMobile()
  
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "organization", label: "Organizations", icon: Building2 },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileBarChart },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const stats = [
    { 
      title: "Total Organizations", 
      value: "128", 
      change: "+12%", 
      trend: "up",
      icon: Building2,
      color: "bg-blue-50 text-blue-600"
    },
    { 
      title: "Total Users", 
      value: "1,453", 
      change: "+5.2%", 
      trend: "up",
      icon: Users,
      color: "bg-indigo-50 text-indigo-600"
    },
    { 
      title: "Active Subscriptions", 
      value: "112", 
      change: "+19%", 
      trend: "up",
      icon: CreditCard,
      color: "bg-emerald-50 text-emerald-600"
    },
    { 
      title: "Revenue", 
      value: "$45,231.89", 
      change: "+20.1%", 
      trend: "up",
      icon: DollarSign,
      color: "bg-amber-50 text-amber-600"
    },
  ]

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`${
            sidebarOpen ? 'w-64' : 'w-0 md:w-20'
          } bg-white border-r border-r-slate-200 transition-all duration-300 ease-in-out flex flex-col z-30 shadow-sm`}
        >
          <div className="p-4 border-b flex items-center justify-between h-16">
            <div className={`flex items-center gap-2 ${!sidebarOpen && 'md:hidden'}`}>
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
                K
              </div>
              <h2 className="font-bold text-lg text-kwf-blue-800">KWF_SAAS</h2>
            </div>
            {!sidebarOpen && (
              <div className="hidden md:flex h-8 w-8 rounded-md bg-primary items-center justify-center text-white font-bold">
                K
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto py-6">
            <nav className="space-y-1 px-3">
              {navItems.map((item) => (
                <Tooltip key={item.id} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                        activeTab === item.id 
                          ? 'active text-primary-foreground' 
                          : 'text-slate-600 hover:text-slate-900'
                      } ${!sidebarOpen && 'md:justify-center'}`}
                    >
                      <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-primary-foreground' : 'text-slate-500'}`} />
                      <span className={`${!sidebarOpen && 'md:hidden'}`}>{item.label}</span>
                      {item.id === "organization" && (
                        <Badge className={`ml-auto bg-primary/10 text-primary hover:bg-primary/20 ${!sidebarOpen && 'md:hidden'}`}>
                          New
                        </Badge>
                      )}
                    </button>
                  </TooltipTrigger>
                  {!sidebarOpen && (
                    <TooltipContent side="right" className="hidden md:block">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t mt-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-start gap-2 px-2 hover:bg-slate-100">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col items-start ${!sidebarOpen && 'md:hidden'}`}>
                    <span className="text-sm font-medium">Admin User</span>
                    <span className="text-xs text-muted-foreground">admin@kwf.com</span>
                  </div>
                  <ChevronRight className={`ml-auto h-4 w-4 ${!sidebarOpen && 'md:hidden'}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CircleUser className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden md:flex"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-slate-800">
                {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <PieChart className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6 bg-background">
            <div className="max-w-7xl mx-auto">
              <DashboardHeader 
                heading={navItems.find(item => item.id === activeTab)?.label || 'Dashboard'} 
                text="Welcome to your KWF_SAAS admin dashboard." 
              />
              
              {/* Content based on active tab */}
              <div className="mt-8 animate-fade-in">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {stats.map((stat, index) => (
                        <Card key={index} className="stat-card overflow-hidden border-none shadow-md">
                          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${stat.color}`}>
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-5 w-5" />
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center mt-1">
                              {stat.trend === "up" ? (
                                <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <p className={`text-xs ${stat.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                                {stat.change} from last month
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-7">
                      <Card className="md:col-span-4 border-none shadow-md">
                        <CardHeader>
                          <CardTitle>Revenue Overview</CardTitle>
                          <CardDescription>Monthly revenue and user growth.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                          <Overview />
                        </CardContent>
                      </Card>
                      <Card className="md:col-span-3 border-none shadow-md">
                        <CardHeader>
                          <CardTitle>Recent Activity</CardTitle>
                          <CardDescription>Recent actions across your platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <RecentActivity />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
                
                {activeTab === "analytics" && (
                  <Card className="border-none shadow-md">
                    <CardHeader>
                      <CardTitle>Analytics</CardTitle>
                      <CardDescription>Detailed analytics for your KWF_SAAS platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-80 flex items-center justify-center bg-slate-50 rounded-md">
                        <div className="text-center">
                          <BarChart3 className="h-16 w-16 mx-auto text-primary/50" />
                          <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
                          <p className="text-sm text-muted-foreground mt-2 max-w-md">
                            Comprehensive analytics will appear here. Track user engagement, 
                            subscription metrics, and platform performance.
                          </p>
                          <Button className="mt-4">Generate Report</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {activeTab === "organization" && (
                  <OrganizationsPage />
                )}
                
                {activeTab === "reports" && (
                  <Card className="border-none shadow-md">
                    <CardHeader>
                      <CardTitle>Reports</CardTitle>
                      <CardDescription>Generate and view reports for your KWF_SAAS platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-80 flex items-center justify-center bg-slate-50 rounded-md">
                        <div className="text-center">
                          <FileBarChart className="h-16 w-16 mx-auto text-primary/50" />
                          <h3 className="mt-4 text-lg font-medium">Report Center</h3>
                          <p className="text-sm text-muted-foreground mt-2 max-w-md">
                            Generate custom reports based on various metrics and timeframes.
                            Export data in multiple formats for your business needs.
                          </p>
                          <div className="flex gap-2 justify-center mt-4">
                            <Button variant="outline">Export CSV</Button>
                            <Button>Create Report</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {activeTab === "settings" && (
                  <Card className="border-none shadow-md">
                    <CardHeader>
                      <CardTitle>Settings</CardTitle>
                      <CardDescription>Configure your KWF_SAAS platform settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-80 flex items-center justify-center bg-slate-50 rounded-md">
                        <div className="text-center">
                          <Settings className="h-16 w-16 mx-auto text-primary/50" />
                          <h3 className="mt-4 text-lg font-medium">Platform Settings</h3>
                          <p className="text-sm text-muted-foreground mt-2 max-w-md">
                            Configure global settings, user permissions, notification preferences,
                            and integration options for your KWF_SAAS platform.
                          </p>
                          <Button className="mt-4">Save Changes</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
