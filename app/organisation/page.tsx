"use client"
import React, { useState } from 'react';
import {  Users, Calendar, LayoutDashboard, Group, ChevronRight, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// TypeScript interfaces based on the schema

interface Group {
  id: string;
  name: string;
  type: string;
  subAccountId: string;
  eventId: string;
}




const OrganizationDashboard = () => {
  const [activeMainMenu, setActiveMainMenu] = useState<string>('dashboard');
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string>('');

  // Sample data - replace with actual data from your backend
  const memberTypes = [
    { id: '1', name: 'Premium', type: 'paid' },
    { id: '2', name: 'Basic', type: 'free' }
  ];

  const groups = [
    { id: '1', name: 'Marketing Team', type: 'department' },
    { id: '2', name: 'Engineering', type: 'department' }
  ];

  const events = [
    { id: '1', title: 'Annual Meeting', date: '2025-02-15', location: 'Main Hall' },
    { id: '2', title: 'Team Building', date: '2025-02-20', location: 'Conference Room' }
  ];

  const handleMainMenuClick = (menu: string) => {
    setActiveMainMenu(menu);
    if (menu === 'membertypes' || menu === 'groups') {
      setShowSubMenu(true);
    } else {
      setShowSubMenu(false);
    }
  };

  return (
    <div className="flex h-screen bg-blue-50">
      {/* Main Sidebar */}
      <div className="w-64 bg-blue-700 text-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Organization</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleMainMenuClick('dashboard')}
                  className={`flex items-center w-full p-2 rounded-lg ${
                    activeMainMenu === 'dashboard' ? 'bg-blue-800 text-white' : 'hover:bg-blue-600'
                  }`}
                >
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMainMenuClick('membertypes')}
                  className={`flex items-center w-full p-2 rounded-lg ${
                    activeMainMenu === 'membertypes' ? 'bg-blue-800 text-white' : 'hover:bg-blue-600'
                  }`}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Member Types
                  <ChevronRight className="ml-auto h-4 w-4" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMainMenuClick('groups')}
                  className={`flex items-center w-full p-2 rounded-lg ${
                    activeMainMenu === 'groups' ? 'bg-blue-800 text-white' : 'hover:bg-blue-600'
                  }`}
                >
                  <Group className="mr-2 h-5 w-5" />
                  Groups
                  <ChevronRight className="ml-auto h-4 w-4" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMainMenuClick('events')}
                  className={`flex items-center w-full p-2 rounded-lg ${
                    activeMainMenu === 'events' ? 'bg-blue-800 text-white' : 'hover:bg-blue-600'
                  }`}
                >
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMainMenuClick('calendar')}
                  className={`flex items-center w-full p-2 rounded-lg ${
                    activeMainMenu === 'calendar' ? 'bg-blue-800 text-white' : 'hover:bg-blue-600'
                  }`}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Calendar
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Secondary Sidebar (similar to Notion) */}
      {showSubMenu && (
        <div className="w-64 bg-white border-l border-r border-blue-100">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              {activeMainMenu === 'membertypes' ? 'Member Types' : 'Groups'}
            </h3>
            <ul className="space-y-2">
              {activeMainMenu === 'membertypes'
                ? memberTypes.map((type) => (
                    <li key={type.id}>
                      <button
                        onClick={() => setActiveSubMenu(type.id)}
                        className={`w-full p-2 text-left rounded-lg ${
                          activeSubMenu === type.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'
                        }`}
                      >
                        {type.name}
                      </button>
                    </li>
                  ))
                : groups.map((group) => (
                    <li key={group.id}>
                      <button
                        onClick={() => setActiveSubMenu(group.id)}
                        className={`w-full p-2 text-left rounded-lg ${
                          activeSubMenu === group.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'
                        }`}
                      >
                        {group.name}
                      </button>
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            {activeMainMenu === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-700">Dashboard Overview</h2>
                {/* Add your dashboard content here */}
              </div>
            )}
            
            {activeMainMenu === 'events' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-700">Events</h2>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                        Event Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {showSubMenu && activeSubMenu && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-700">
                  {activeMainMenu === 'membertypes'
                    ? memberTypes.find(t => t.id === activeSubMenu)?.name
                    : groups.find(g => g.id === activeSubMenu)?.name}
                </h2>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Add your table rows here based on the selected member type or group */}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationDashboard;