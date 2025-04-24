"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, UserPlus, Download, Plus, Settings2, ChevronDown, Search, Filter, MoreHorizontal } from "lucide-react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AddMemberTypeForm from "../add-memberType"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AddMemberForm from "../invite-member"
import { deleteMemberById, getMembers } from "@/lib/members"
import { fetchMemberType } from "@/lib/members"
interface memberTypes extends Array<{
  id: number
  name: string
  members?: number
}> {}

const groups = [
  { id: 1, name: "Technology", members: 45, status: "Active", created: "2024-01-10" },
  { id: 2, name: "Marketing", members: 32, status: "Active", created: "2024-01-12" },
]

const userRoles = [
  { id: 1, name: "Admin", users: 5 },
  { id: 2, name: "Moderator", users: 12 },
  { id: 3, name: "Member", users: 245 },
]

// Define columns for both views
const columns = {
  members: {
    name: "Name",
    email: "Email",
    type: "Membership Type",
    status: "Status",
    joinDate: "Join Date"
  },
  groups: {
    name: "Group Name",
    members: "Members",
    status: "Status",
    created: "Created Date"
  }
}

export default function UserManagementPage() {
  const router = useRouter()
  const [view, setView] = useState("members")
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["name", "email", "type", "status", "joinDate"])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddMemberTypeDialog, setShowAddMemberTypeDialog] = useState(false)
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [membershipTypes, setMembershipTypes] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const deleteMember = async (memberId: string) => {
    try {
     await deleteMemberById(memberId)
        setMembers((prevMembers) => prevMembers.filter((member) => member.id !== memberId))
        console.log("Member deleted successfully")
    } catch (error) {
      console.error("Error deleting member:", error)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch membership types
        const response = await fetchMemberType({} as any)
        console.log('Member types:', response)
        
        if (response && response.data && response.data.data) {
          setMembershipTypes(response.data.data)
        } else {
          console.error('Unexpected response structure:', response)
          setMembershipTypes([])
        }
        
        // Fetch members
        const membersResponse = await getMembers()
        console.log('Members:', membersResponse)
        
        if (membersResponse && membersResponse.data && membersResponse.data.data) {
          setMembers(membersResponse.data.data)
          console.log('members3', membersResponse.data.data)
        } else {
          console.error('Unexpected response structure:', membersResponse)
          setMembers([])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setMembershipTypes([])
        setMembers([])
      }
    }
    fetchData()
  }, [])
    
  // Filter members based on search query
  const filteredMembers = members.filter(member => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      (member.name && member.name.toLowerCase().includes(query)) ||
      (member.email && member.email.toLowerCase().includes(query))
    )
  })
 
  console.log("Membership Types main:", membershipTypes)
  console.log("Members:", members)
  
  const toggleColumn = (columnId: string) => {
    setSelectedColumns((current) =>
      current.includes(columnId) ? current.filter((id) => id !== columnId) : [...current, columnId],
    )
  }

  // Helper function to get membership type name by ID
  const getMembershipTypeName = (typeId: number | string) => {
    console.log("Membership Type ID:", typeId)
    const type = membershipTypes.find(t => String(t.id) === String(typeId))
    return type ? type.name : 'Unknown'
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
                {membershipTypes && membershipTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.id}
                    onClick={() => router.push(`/dashboard/user-management/membership-types/${type.id}`)}
                  >
                    <span>{type.name}</span>
                    {type.members && <span className="ml-auto text-muted-foreground">{type.members}</span>}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                <Button onClick={() => setShowAddMemberTypeDialog(true)} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add New Type</span>
                </Button>
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
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {view === "members" ? (
            <Button onClick={() => setShowAddMemberDialog(true)}>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {view === "members" ? (
          <>
            {membershipTypes && membershipTypes.map((type) => (
              <Card key={type.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-400 rounded-md">
                  <CardTitle className="text-sm font-medium ">{type.name}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                {type.members && (
                  <CardContent>
                    <div className="text-2xl font-bold">{type.members}</div>
                    <p className="text-xs text-muted-foreground">Total members</p>
                  </CardContent>
                )}
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
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder={`Search ${view}...`}
                  className="pl-9 max-w-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                {view === "members" ? (
                  filteredMembers.length > 0 ? (
                    filteredMembers.map(member => (
                      <TableRow key={member.id}>
                        {selectedColumns.includes("name") && (
                            <TableCell className="font-medium">{member.firstName} {member.lastName}</TableCell>
                        )}
                        
                        {selectedColumns.includes("email") && (
                          <TableCell>{member.email}</TableCell>
                        )}
                        {selectedColumns.includes("type") && (
                          <TableCell>{getMembershipTypeName(member.membershipTypeId	)}</TableCell>
                        )}
                        {selectedColumns.includes("status") && (
                          <TableCell>
                            <Badge variant="outline" className={member.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
                              {member.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        )}
                        {selectedColumns.includes("joinDate") && (
                          <TableCell>{member.createdAt? new Date(member.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
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
                              <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => deleteMember(member.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={selectedColumns.length + 1} className="text-center py-4 text-muted-foreground">
                        {searchQuery ? "No members match your search criteria." : "No members data available. Add members to see them listed here."}
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  groups.map((group) => (
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
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Dialog for Add Member Type */}
            <Dialog open={showAddMemberTypeDialog} onOpenChange={setShowAddMemberTypeDialog}>
              <DialogContent>
                <AddMemberTypeForm onClose={() => setShowAddMemberTypeDialog(false)} />
              </DialogContent>
            </Dialog>
            
            {/* Dialog for Add Member */}
            <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Member</DialogTitle>
                </DialogHeader>
                <AddMemberForm onClose={() => setShowAddMemberDialog(false)} memberTypes={membershipTypes} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}