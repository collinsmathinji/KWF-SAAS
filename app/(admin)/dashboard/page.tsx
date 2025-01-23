"use client"
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  CreditCard, 
  PieChart, 
  Shield, 
  Bell, 
  LogOut,
  FileText,
  Database,
  Layers,
  Sliders,
  Menu
} from 'lucide-react';
interface MenuItem {
  icon: string;
  label: string;
  section: string;
  description: string;
}

interface Subscription {
  id: number;
  name: string;
  users: number;
  price: string;
}
const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { 
      icon: <LayoutDashboard />, 
      label: 'Dashboard', 
      section: 'overview',
      description: 'Platform overview and key metrics'
    },
    { 
      icon: <Users />, 
      label: 'User Management', 
      section: 'users',
      description: 'Manage users and access'
    },
    { 
      icon: <CreditCard />, 
      label: 'Subscriptions', 
      section: 'subscriptions',
      description: 'Manage plans and billing'
    },
    { 
      icon: <PieChart />, 
      label: 'Analytics', 
      section: 'analytics',
      description: 'Detailed platform insights'
    },
    { 
      icon: <Layers />, 
      label: 'Organization', 
      section: 'organization',
      description: 'Manage organization settings'
    },
    { 
      icon: <FileText />, 
      label: 'Reporting', 
      section: 'reporting',
      description: 'Generate and export reports'
    },
    { 
      icon: <Database />, 
      label: 'Data Management', 
      section: 'data',
      description: 'Import, export, and manage data'
    },
    { 
      icon: <Sliders />, 
      label: 'Configurations', 
      section: 'config',
      description: 'Platform-wide configurations'
    },
    { 
      icon: <Shield />, 
      label: 'Security', 
      section: 'security',
      description: 'Security and access controls'
    },
    { 
      icon: <Settings />, 
      label: 'Settings', 
      section: 'settings',
      description: 'Platform and account settings'
    }
  ];
  

  const renderSectionContent = (activeSection: string)=> {
    switch (activeSection) {
      case 'subscriptions':
        return <SubscriptionManagement />;
      default:
        return <div className="text-center text-gray-500">{activeSection} section content goes here</div>;
    }
  };
  
  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <div className={`fixed inset-0 z-30 transition-transform transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:w-80 bg-white border-r shadow-md p-4 flex flex-col`}>
        <div className="text-2xl font-bold mb-8 text-center text-blue-600">ContactHub</div>
        
        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => (
            <div 
              key={item.section}
              onClick={() => {
                setActiveSection(item.section);
                setSidebarOpen(false);
              }}
              className={`group cursor-pointer p-3 rounded-lg ${
                activeSection === item.section 
                  ? 'bg-blue-50 text-blue-600 border-blue-200' 
                  : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {React.cloneElement(item.icon, { 
                    className: `mr-3 w-5 h-5 ${
                      activeSection === item.section 
                        ? 'text-blue-600' 
                        : 'text-gray-400 group-hover:text-blue-600'
                    }`
                  })}
                  <span className="font-medium">{item.label}</span>
                </div>
                {activeSection === item.section && (
                  <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">{item.description}</p>
            </div>
          ))}
        </nav>

        <div className="mt-4 border-t pt-4">
          <button 
            className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 bg-blue-50 lg:ml-80">
        <header className="flex justify-between items-center mb-8">
          <button 
            className="lg:hidden text-blue-600" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-blue-800 capitalize">
            {activeSection.replace(/([A-Z])/g, ' $1')}
          </h1>
          <div className="flex items-center">
            <Bell className="mr-4 text-blue-600" />
            <div className="flex items-center">
              <img 
                src="/api/placeholder/40/40" 
                alt="Admin" 
                className="w-10 h-10 rounded-full mr-2 border-2 border-blue-200" 
              />
              <span className="text-blue-800">Admin User</span>
            </div>
          </div>
        </header>

        <main className="bg-white rounded-lg shadow-sm p-6">
          {/* Placeholder for section content */}
          <div className="text-center text-gray-500">
            {renderSectionContent(activeSection)}
          </div>
        </main>
      </div>
    </div>
  );
};

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: 'Basic Plan', users: 10, price: '$10/month' },
    { id: 2, name: 'Pro Plan', users: 50, price: '$50/month' },
    { id: 3, name: 'Enterprise Plan', users: 200, price: '$200/month' },
  ]);

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <div key={subscription.id} className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-blue-800">{subscription.name}</h2>
              <p className="text-gray-600">{subscription.users} users</p>
            </div>
            <div className="text-blue-600 font-semibold">{subscription.price}</div>
          </div>
        </div>
      ))}
    </div>
  );
};


export default AdminDashboard;
