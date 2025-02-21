"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, UserPlus, Plus, Settings2, ChevronDown, Search, Filter, MoreHorizontal, FileText, LayoutDashboard } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DataManagement from "./databaseConfig"
// Sample data
const membershipTypes = [
  { id: 1, name: "Basic", members: 234 },
  { id: 2, name: "Premium", members: 156 },
  { id: 3, name: "Enterprise", members: 89 },
]

const members = [
  { id: 1, name: "John Doe", email: "john@example.com", type: "Basic", status: "Active", joinDate: "2024-01-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", type: "Premium", status: "Active", joinDate: "2024-01-20" },
]

const groups = [
  { id: 1, name: "Technology", members: 45, status: "Active", created: "2024-01-10" },
  { id: 2, name: "Marketing", members: 32, status: "Active", created: "2024-01-12" },
]

const userRoles = [
  { id: 1, name: "Admin", users: 5 },
  { id: 2, name: "Moderator", users: 12 },
  { id: 3, name: "Member", users: 245 },
]

export default function UserManagementPage() {
  const router = useRouter()
  const [view, setView] = useState("members")
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["name", "email", "type", "status", "joinDate"])
  const [activeSection, setActiveSection] = useState("")
  const columns = {
    members: {
      name: "Name",
      email: "Email",
      type: "Membership Type",
      status: "Status",
      joinDate: "Join Date",
    },
    groups: {
      name: "Name",
      members: "Members",
      status: "Status",
      created: "Created Date",
    },
  }

  const toggleColumn = (columnId: string) => {
    setSelectedColumns((current) =>
      current.includes(columnId) ? current.filter((id) => id !== columnId) : [...current, columnId],
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              User Management
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Manage</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Membership Types</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-56">
                {membershipTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.id}
                    onClick={() => router.push(`/dashboard/user-management/membership-types/${type.id}`)}
                  >
                    <span>{type.name}</span>
                    <span className="ml-auto text-muted-foreground">{type.members}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add New Type</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={() => setView("members")}>
              <Users className="mr-2 h-4 w-4" />
              <span>Members</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView("groups")}>
              <Users className="mr-2 h-4 w-4" />
              <span>Groups</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/user-management/roles")}>
              <Settings2 className="mr-2 h-4 w-4" />
              <span>User Roles</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={() => setActiveSection(activeSection === 'data' ? '' : 'data')}
          className="flex items-center gap-2 transition-all hover:gap-3"
        >
          {activeSection === 'data' ? (
        <>
          <LayoutDashboard className="h-4 w-4" />
          Back to User Management
        </>
          ) : (
        <>
          <FileText className="h-4 w-4" />
           Data management
        </>
          )}
        </Button>
          {view === "members" ? (
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          ) : (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          )}
        </div>
      </div>

      {activeSection === "data" ?(<DataManagement/>):(
            <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {view === "members" ? (
          <>
            {membershipTypes.map((type) => (
              <Card key={type.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{type.name}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{type.members}</div>
                  <p className="text-xs text-muted-foreground">Total members</p>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            {userRoles.map((role) => (
              <Card key={role.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{role.name}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{role.users}</div>
                  <p className="text-xs text-muted-foreground">Total users</p>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{view === "members" ? "All Members" : "All Groups"}</CardTitle>
          <CardDescription>
            Manage and monitor all {view === "members" ? "members" : "groups"} in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={`Search ${view}...`}
                  className="pl-8"
                />
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {Object.entries(columns[view as keyof typeof columns]).map(([key, label]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={selectedColumns.includes(key)}
                    onCheckedChange={() => toggleColumn(key)}
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.entries(columns[view as keyof typeof columns])
                    .filter(([key]) => selectedColumns.includes(key))
                    .map(([key, label]) => (
                      <TableHead key={key}>{label}</TableHead>
                    ))}
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {view === "members"
                  ? members.map((member) => (
                      <TableRow key={member.id}>
                        {selectedColumns.includes("name") && (
                          <TableCell className="font-medium">{member.name}</TableCell>
                        )}
                        {selectedColumns.includes("email") && <TableCell>{member.email}</TableCell>}
                        {selectedColumns.includes("type") && <TableCell>{member.type}</TableCell>}
                        {selectedColumns.includes("status") && (
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {member.status}
                            </Badge>
                          </TableCell>
                        )}
                        {selectedColumns.includes("joinDate") && (
                          <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                        )}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  : groups.map((group) => (
                      <TableRow key={group.id}>
                        {selectedColumns.includes("name") && (
                          <TableCell className="font-medium">{group.name}</TableCell>
                        )}
                        {selectedColumns.includes("members") && <TableCell>{group.members}</TableCell>}
                        {selectedColumns.includes("status") && (
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {group.status}
                            </Badge>
                          </TableCell>
                        )}
                        {selectedColumns.includes("created") && (
                          <TableCell>{new Date(group.created).toLocaleDateString()}</TableCell>
                        )}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

