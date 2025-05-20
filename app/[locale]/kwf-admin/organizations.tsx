"use client"

import { useState } from "react"
import { Building2, Check, Download, MoreHorizontal, Plus, Search, SlidersHorizontal, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

type Organization = {
  id: string
  name: string
  users: number
  status: "active" | "pending" | "inactive"
  plan: "free" | "pro" | "enterprise"
  createdAt: string
}

const organizations: Organization[] = [
  {
    id: "1",
    name: "Acme Inc",
    users: 25,
    status: "active",
    plan: "enterprise",
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Globex Corporation",
    users: 18,
    status: "active",
    plan: "pro",
    createdAt: "2023-02-20",
  },
  {
    id: "3",
    name: "Initech",
    users: 12,
    status: "active",
    plan: "pro",
    createdAt: "2023-03-10",
  },
  {
    id: "4",
    name: "Umbrella Corp",
    users: 32,
    status: "active",
    plan: "enterprise",
    createdAt: "2023-01-05",
  },
  {
    id: "5",
    name: "Stark Industries",
    users: 8,
    status: "pending",
    plan: "free",
    createdAt: "2023-04-22",
  },
  {
    id: "6",
    name: "Wayne Enterprises",
    users: 15,
    status: "active",
    plan: "pro",
    createdAt: "2023-02-28",
  },
  {
    id: "7",
    name: "Cyberdyne Systems",
    users: 5,
    status: "inactive",
    plan: "free",
    createdAt: "2023-03-15",
  },
]

export default function OrganizationsPage() {
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedOrgs.length === organizations.length) {
      setSelectedOrgs([])
    } else {
      setSelectedOrgs(organizations.map((org) => org.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedOrgs.includes(id)) {
      setSelectedOrgs(selectedOrgs.filter((orgId) => orgId !== id))
    } else {
      setSelectedOrgs([...selectedOrgs, id])
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Organizations
            </CardTitle>
            <CardDescription>Manage organizations and their subscriptions.</CardDescription>
          </div>
          
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search organizations..." className="pl-8 bg-white" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-10">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" size="sm" className="h-10">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px] h-10">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedOrgs.length === organizations.length && organizations.length > 0}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all organizations"
                    />
                  </TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((org) => (
                  <TableRow key={org.id} className="hover:bg-slate-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedOrgs.includes(org.id)}
                        onCheckedChange={() => toggleSelect(org.id)}
                        aria-label={`Select ${org.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {org.users}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`
                          ${org.status === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : ""}
                          ${org.status === "pending" ? "border-amber-200 bg-amber-50 text-amber-700" : ""}
                          ${org.status === "inactive" ? "border-slate-200 bg-slate-50 text-slate-700" : ""}
                        `}
                      >
                        {org.status === "active" && <Check className="mr-1 h-3 w-3" />}
                        {org.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`
                          ${org.plan === "free" ? "border-slate-200 bg-slate-50 text-slate-700" : ""}
                          ${org.plan === "pro" ? "border-blue-200 bg-blue-50 text-blue-700" : ""}
                          ${org.plan === "enterprise" ? "border-purple-200 bg-purple-50 text-purple-700" : ""}
                        `}
                      >
                        {org.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(org.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit organization</DropdownMenuItem>
                          <DropdownMenuItem>Manage users</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete organization</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{organizations.length}</strong> of <strong>{organizations.length}</strong> organizations
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

