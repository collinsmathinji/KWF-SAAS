"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Menu } from "lucide-react";

export default function OrganizationManagement() {
  interface Navbar {
    id: number;
    name: string;
    allowedUsers: string[];
    userType: string; // Added userType property
  }

  // Sample user types. Modify according to your application's user types.
  const userTypes = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Member', label: 'Member' },
    { value: 'Guest', label: 'Guest' },
  ];

  const [navbars, setNavbars] = useState<Navbar[]>([
    { id: 1, name: 'Sales Team', allowedUsers: ['john.doe@company.com'], userType: 'Member' },
    { id: 2, name: 'HR Department', allowedUsers: ['hr.manager@company.com'], userType: 'Admin' }
  ]);

  const [newNavbar, setNewNavbar] = useState<Omit<Navbar, 'id'>>({
    name: '',
    allowedUsers: [],
    userType: ''
  });

  const handleCreateNavbar = () => {
    const navbar: Navbar = {
      id: navbars.length + 1,
      ...newNavbar
    };
    setNavbars([...navbars, navbar]);
    setNewNavbar({ name: '', allowedUsers: [], userType: '' });
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Organization Management</h1>
        <p className="text-gray-600">Configure your organization's navigation structure</p>
      </div>

      <div className="grid gap-6">
        {/* Navbar Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Menu className="mr-2" /> Navbar Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mb-4">
                  <Plus className="mr-2" /> Create New Navbar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Navbar</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Navbar Name"
                    value={newNavbar.name}
                    onChange={(e) => setNewNavbar({ ...newNavbar, name: e.target.value })}
                  />
                  <Select
                    onValueChange={(email) => setNewNavbar(prev => ({
                      ...prev,
                      allowedUsers: [...prev.allowedUsers, email]
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Allowed Users" />
                    </SelectTrigger>
                    <SelectContent>
                      {/** Replace with actual user data */}
                      <SelectItem value="user1@example.com">User 1</SelectItem>
                      <SelectItem value="user2@example.com">User 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(type) => setNewNavbar(prev => ({ ...prev, userType: type }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select User Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {userTypes.map(userType => (
                        <SelectItem key={userType.value} value={userType.value}>
                          {userType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleCreateNavbar}>Create</Button>
                </div>
              </DialogContent>
            </Dialog>

            {navbars.map((navbar) => (
              <div key={navbar.id} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{navbar.name}</h3>
                  <div>
                    <Button variant="ghost" size="sm" className="mr-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User Type: {navbar.userType}</p>
                  <p className="text-sm text-gray-600">Allowed Users:</p>
                  {navbar.allowedUsers.map(email => (
                    <div key={email} className="flex justify-between items-center bg-gray-100 p-2 rounded mt-1">
                      <span>{email}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => /* Function to remove user */ {}}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}