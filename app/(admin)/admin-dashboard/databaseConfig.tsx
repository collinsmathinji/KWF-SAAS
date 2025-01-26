"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowDownToLine, ArrowUpFromLine, Database, HardDrive, History, Table, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DataManagement() {
  // This would typically come from your backend
  const storageInfo = {
    used: 2.5,
    total: 5,
    lastBackup: "November 15, 2023",
    tables: [
      { name: "Users", records: 1250, size: "500KB" },
      { name: "Products", records: 450, size: "250KB" },
      { name: "Orders", records: 3200, size: "1.2MB" },
    ],
    recentActivity: [
      { type: "Import", date: "Nov 20, 2023", details: "Users data imported" },
      { type: "Export", date: "Nov 18, 2023", details: "Full database backup" },
      { type: "Delete", date: "Nov 15, 2023", details: "Outdated records cleaned" },
    ],
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Data Management</h1>
        <p className="text-gray-600">Import, export, and manage your database</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Storage Overview Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Storage Overview</CardTitle>
            <CardDescription>Monitor your database storage usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Storage used</span>
                <span className="font-medium">
                  {storageInfo.used}GB of {storageInfo.total}GB
                </span>
              </div>
              <Progress value={(storageInfo.used / storageInfo.total) * 100} className="h-2 bg-blue-100" />
            </div>

            <Alert>
              <HardDrive className="h-4 w-4" />
              <AlertTitle>Last Backup</AlertTitle>
              <AlertDescription>Your data was last backed up on {storageInfo.lastBackup}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-4">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Import Data
            </Button>
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </CardFooter>
        </Card>

        {/* Database Tables Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Database Tables</CardTitle>
            <CardDescription>Overview of your data tables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storageInfo.tables.map((table, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Table className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{table.name}</p>
                      <p className="text-sm text-gray-500">{table.records} records</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{table.size}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 w-full">
              <Database className="mr-2 h-4 w-4" />
              Manage Tables
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Recent Activity</CardTitle>
            <CardDescription>Latest data operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storageInfo.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center space-x-3">
                    <History className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{activity.type}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="text-gray-600 hover:bg-gray-100 w-full">
              View All Activity
            </Button>
          </CardFooter>
        </Card>

        {/* Data Cleanup Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Data Cleanup</CardTitle>
            <CardDescription>Clean and optimize your database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Duplicate Records</h3>
                <p className="text-sm text-gray-600 mb-4">Found 23 potential duplicate records across all tables</p>
                <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  Review Duplicates
                </Button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Outdated Data</h3>
                <p className="text-sm text-gray-600 mb-4">154 records have not been updated in over 12 months</p>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clean Old Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

