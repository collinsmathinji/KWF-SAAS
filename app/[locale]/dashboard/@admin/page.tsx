"use client"
import React, { useEffect, useState } from "react"
import { 
  Bell, 
  CreditCard, 
  Calendar, 
  Layers, 
  LayoutDashboard, 
  Menu, 
  Settings, 
  Users, 
  HeartPulse,
  Landmark, 
  LogOut,
  Palette 
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import OrganizationCampaigns from "./campaign/campaignsOrg"
// Page components
import Overview from "./overview"
import UserManagementPage from "./user-management/page"
import SubscriptionsPage from "./subscription"
import SettingsPage from "./settings/page"
import OrganizationProfile from "./organization"
import ConnectPage from "./connect/page"
import EventPage from "./event/page"
import WebStudio from "./webstudio/page"

// API functions
import { fetchMemberType } from "@/lib/members"
import { getOrganizationById } from "@/lib/organization"
import { EventCalendar } from "./EventCalendar"

// Types
type UserType = "admin" | "user" | null;
type MenuItemType = {
  icon: React.ReactNode;
  label: string;
  section: string;
  description: string;
};

interface OrganizationDetails {
  organizationId?: string;
  name?: string;
  logoUrl?: string;
  [key: string]: any;
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("overview")
  const [memberType, setMemberType] = useState<any>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isOnBoarded, setIsOnBoarded] = useState<string | null>('')
  const [actualUserType, setActualUserType] = useState<UserType>(null)
  const [viewAs, setViewAs] = useState<UserType>(null)
  const [organizationDetails, setOrganizationDetails] = useState<any>(null)
  
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const menuItems: MenuItemType[] = [
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
      icon: <HeartPulse />,
      label: "Campaign",
      section: "campaigns",
      description: "donations and campaigns",
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
    {
      icon: <Layers />,
      label: "Organization",
      section: "organization",
      description: "Manage organization settings",
    },
    {
      icon: <Palette />,
      label: "WebStudio",
      section: "webstudio",
      description: "Create and manage your website",
    },
  ]
  
  useEffect(() => {
    const loadUserData = async () => {
      console.log("Current session status:", status);
      console.log("Current session data:", session);
      
      if (status === "loading") {
        setIsLoading(true);
        return;
      }

      if (status === "authenticated" && session?.user) {
        const userType = session.user.userType;
        const onboardingStatus=localStorage.getItem('isOnboarded')
        const orgId = session.user.organizationId;
        const createdBy= session.user.id 
        console.log("User type from session:", userType);
        console.log("Onboarding status from session:", onboardingStatus);
        console.log("Organization ID from session:", orgId);
        
        // Set user type based on the value
        let userTypeValue: UserType = null;
        if (userType === '2') {
          userTypeValue = "admin";
        } else if (userType === '1') {
          userTypeValue = "user";
        }
        
        setActualUserType(userTypeValue);
        setIsOnBoarded(onboardingStatus);
        setViewAs(userTypeValue);
        
        try {
          // Fetch organization details
          if (orgId) {
            console.log('Organization ID from session:', orgId);
            const response:any = await getOrganizationById(orgId);
            console.log("org Details",response)
            setOrganizationDetails(response.data || null);
            setMemberType(response as unknown as string[]);
          } else {
            console.log('Organization ID not found');
          }
        } catch (error) {
          console.error("Error fetching organization details:", error);
        }
        
        setIsLoading(false);
      } else if (status === "unauthenticated") {
        // Redirect to login if not authenticated
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [session, status, router]);
  
  // Fetch member type if organization details are available
  useEffect(() => {
    const handleFetch = async () => {
      try {
        const orgId = organizationDetails?.organizationId || session?.user?.organizationId;
        
        if (orgId) {
          console.log('Fetching member types for organization ID:', orgId);
          const response:any = await fetchMemberType(orgId);
          console.log("Member types response:", response);
          setMemberType(response as unknown as string[]);
        } else {
          console.log('Organization ID not found for fetching member types');
        }
      } catch (error) {
        console.error("Error fetching member types:", error);
      }
    };
    
    if (!isLoading) {
      handleFetch();
    }
  }, [organizationDetails, session, isLoading]);

  const handleLogout = async () => {
    try {
      // Clear any local storage that might have been set
      localStorage.removeItem('isOnBoarded');
      localStorage.removeItem('currentOrganization');
      
      await signOut({ 
        callbackUrl: '/login',
        redirect: true
      });
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    }
  };
  
  const renderContent = () => {
    const orgData = organizationDetails || (session?.user || {});
    
    switch (activeSection) {
      case "overview":
        return <Overview organisationDetails={orgData} />;
      case "users":
        return <UserManagementPage />;
      case "campaigns":
        return <OrganizationCampaigns />;
      case "event":
        return <EventPage organisationDetails={orgData} />;
      case "calender":
        return <EventCalendar />
      case "settings":
        return <SettingsPage organisationDetails={orgData} />;
      case "organization":
        return <OrganizationProfile organisationDetails={orgData} />;
      case "webstudio":
        return <WebStudio organisationDetails={orgData} />;
      default:
        return (
          <div className="text-center text-muted-foreground">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} content goes here
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-blue-800 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isOnBoarded==='false') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">Account Setup Incomplete</h1>
          <p className="text-gray-600 mb-6">
            Your account hasn't been fully onboarded yet. Please complete the onboarding process to access the dashboard.
          </p>
          <div className="flex justify-between">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => router.push('/onboarding')}
            >
              Complete Onboarding
            </button>
            <button 
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-30 transition-transform transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:w-80 bg-white border-r shadow-md p-4 flex flex-col`}
      >
        <div className="flex items-center justify-center mb-8">
          {organizationDetails?.logoUrl && (
            <img 
              src={organizationDetails.logoUrl} 
              alt="Organization Logo" 
              className="w-8 h-8 mr-2 object-contain rounded-full"
            />
          )}
          <div className="text-2xl font-bold text-blue-600">
            {organizationDetails?.name || session?.user?.email?.split('@')[0] || "Dashboard"}
          </div>
        </div>

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
                  {React.cloneElement(item.icon as React.ReactElement, {
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
          <div className="mt-4 border-t pt-4 space-y-2">
            <button 
              className="w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600"  
              onClick={() => {
                setActiveSection('settings')
                setSidebarOpen(false)
              }}
            >
              <Settings className="mr-3 w-5 h-5" /> Settings
            </button>
            
            <button 
              className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 w-5 h-5" /> Log Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 bg-blue-50">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-blue-600" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-blue-800 capitalize">
              {activeSection.replace(/([A-Z])/g, " $1").replace(/-/g, " ")}
            </h1>
          </div>
          <div className="flex items-center">
            <Bell className="mr-4 text-blue-600" />
            <div className="flex items-center">
              <Avatar className="w-10 h-10 border-2 border-blue-200">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  {session?.user?.email ? session.user.email.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="ml-2 text-blue-800">
                {actualUserType === "admin" ? "Admin" : "User"}: {session?.user?.email || ""}
              </span>
            </div>
          </div>
        </header>

        <main className="bg-white rounded-lg shadow-sm p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}