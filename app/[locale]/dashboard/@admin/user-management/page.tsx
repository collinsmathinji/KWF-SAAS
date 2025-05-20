"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, UserPlus, Download, Plus, ChevronDown, Search, Filter, MoreHorizontal } from "lucide-react"
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
import GroupForm from "../group-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AddMemberForm from "../invite-member"
import { deleteMemberById, getMembers } from "@/lib/members"
import { fetchMemberType } from "@/lib/members"
import { getGroups } from "@/lib/group"

interface MemberType {
  id: any
  name: string
  members?: any
  description: string
}

interface Member {
  id: string
  firstName: string
  lastName: string
  description: any
  email: string
  membershipTypeId: number | string
  isActive: boolean
  createdAt: string
}

interface Group {
  id: string
  name: string
  members?: number
  status?: string
  created?: string
  logo?: string
  description?: string
  organizationId?: string
  groupTypeId: string
  groupType?: string | null
  createdAt?: string
  updatedAt?: string
}

// Define columns for both views
const columns = {
  members: {
    name: "Name",
    email: "Email",
    type: "Membership Type",
    status: "Status",
    joinDate: "Join Date",
  },
  groups: {
    "Group-Logo": "Group Logo",
    name: "Group Name",
    members: "Members",
    description: "Description",
    groupType: "Group Type",
    created: "Created Date",
  },
}

// Map group types to user-friendly display names
const groupTypeDisplayNames: Record<string, string> = {
  private: "Private",
  public_open: "Public Open",
  public_closed: "Public Closed",
}

export default function UserManagementPage() {
  const router = useRouter()
  const [view, setView] = useState<"members" | "groups">("members")
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["name", "email", "type", "status", "joinDate"])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddMemberTypeDialog, setShowAddMemberTypeDialog] = useState(false)
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [showGroupDialog, setShowGroupDialog] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [groupTypes, setGroupTypes] = useState<MemberType[]>([
    { id: "private", name: "Private", description: "private" },
    { id: "public_open", name: "Public Open", description: "private" },
    { id: "public_closed", name: "Public Closed", description: "private" },
  ])
  const [membershipTypes, setMembershipTypes] = useState<MemberType[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      setIsLoading(true)
      try {
        // Fetch membership types
        const response: any = await fetchMemberType()

        if (response && response.data && response.data.data) {
          setMembershipTypes(response.data.data)
        } else {
          console.error("Unexpected response structure:", response)
          setMembershipTypes([])
        }

        // Fetch members
        const membersResponse: any = await getMembers()

        if (membersResponse && membersResponse.data && membersResponse.data.data) {
          setMembers(membersResponse.data.data)
        } else {
          console.error("Unexpected response structure:", membersResponse)
          setMembers([])
        }

        // Fetch groups
        try {
          const groupsResponse: any = await getGroups()
          if (groupsResponse && groupsResponse.data && groupsResponse.data.data) {
            const formattedGroups = groupsResponse.data.data.map((group: any) => ({
              ...group,
              // Ensure all required fields are present or provide defaults
              members: group.members || 0,
              created: group.createdAt || new Date().toISOString(),
              status: "Active", // Default status if not provided
              // Ensure groupType is available for filtering and display
              groupType: group.groupType || "private",
            }))

            console.log("Fetched groups:", formattedGroups)
            setGroups(formattedGroups)
          } else {
            console.error("Unexpected groups response structure:", groupsResponse)
            setGroups([])
          }
        } catch (groupError) {
          console.error("Error fetching group data:", groupError)
          setGroups([])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setMembershipTypes([])
        setMembers([])
        setGroups([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter members based on search query
  const filteredMembers = members.filter((member) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      (member.firstName && member.firstName.toLowerCase().includes(query)) ||
      (member.lastName && member.lastName.toLowerCase().includes(query)) ||
      (member.email && member.email.toLowerCase().includes(query))
    )
  })

  // Filter groups based on search query
  const filteredGroups = groups.filter((group) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      (group.name && group.name.toLowerCase().includes(query)) ||
      (group.description && group.description.toLowerCase().includes(query))
    )
  })

  // Count groups by type
  const groupCounts = groupTypes.map((type) => {
    const count = groups.filter((g) => g.groupType === type.id).length
    return {
      ...type,
      members: count,
    }
  })

  const toggleColumn = (columnId: string) => {
    setSelectedColumns((current) =>
      current.includes(columnId) ? current.filter((id) => id !== columnId) : [...current, columnId],
    )
  }

  // Helper function to get membership type name by ID
  const getMembershipTypeName = (typeId: number | string) => {
    const type = membershipTypes.find((t) => String(t.id) === String(typeId))
    return type ? type.name : "Unknown"
  }

  // Helper function to get group type display name
  const getGroupTypeDisplayName = (typeId: string | null | undefined) => {
    if (!typeId) return "Unknown"
    return groupTypeDisplayNames[typeId] || typeId
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (error) {
      return "Invalid Date"
    }
  }

  // Update selected columns when view changes
  useEffect(() => {
    if (view === "members") {
      setSelectedColumns(["name", "email", "type", "status", "joinDate"])
    } else {
      setSelectedColumns(["Group-Logo", "name", "members", "description", "groupType", "created"])
    }
  }, [view])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 h-10">
              <span className="font-medium">User Management</span>
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
                    {type.members && <span className="ml-auto text-muted-foreground">{type.members}</span>}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowAddMemberTypeDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add New Type</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Group Types</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-56">
                {groupTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.id}
                    onClick={() => router.push(`/dashboard/user-management/group-types/${type.id}`)}
                  >
                    <span>{type.name}</span>
                    {type.members !== undefined && (
                      <span className="ml-auto text-muted-foreground">{type.members}</span>
                    )}
                  </DropdownMenuItem>
                ))}
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
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {view === "members" ? (
            <Button onClick={() => setShowAddMemberDialog(true)} className="flex-1 sm:flex-none">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          ) : (
            <Button onClick={() => setShowGroupDialog(true)} className="flex-1 sm:flex-none">
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {view === "members" ? (
          membershipTypes.length > 0 ? (
            membershipTypes.map((type) => (
              <Card key={type.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                  <CardTitle className="text-sm font-medium">{type.name}</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">
                    {type.members || members.filter((m) => String(m.membershipTypeId) === String(type.id)).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Total members</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">No membership types</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Add membership types to see stats</p>
              </CardContent>
            </Card>
          )
        ) : (
          groupCounts.map((type) => (
            <Card key={type.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardTitle className="text-sm font-medium">{type.name}</CardTitle>
                <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{type.members}</div>
                <p className="text-xs text-muted-foreground">Total groups</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">{view === "members" ? "All Members" : "All Groups"}</CardTitle>
          <CardDescription>
            Manage and monitor all {view === "members" ? "members" : "groups"} in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={`Search ${view}...`}
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {Object.entries(columns[view]).map(([key, label]) => (
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

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.entries(columns[view])
                    .filter(([key]) => selectedColumns.includes(key))
                    .map(([key, label]) => (
                      <TableHead key={key}>{label}</TableHead>
                    ))}
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={selectedColumns.length + 1} className="text-center py-8">
                      <div className="flex justify-center">
                        <svg
                          className="animate-spin h-6 w-6 text-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : view === "members" ? (
                  filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        {selectedColumns.includes("name") && (
                          <TableCell className="font-medium">
                            {member.firstName} {member.lastName}
                          </TableCell>
                        )}

                        {selectedColumns.includes("email") && <TableCell>{member.email}</TableCell>}
                        {selectedColumns.includes("type") && (
                          <TableCell>{getMembershipTypeName(member.membershipTypeId)}</TableCell>
                        )}
                        {selectedColumns.includes("status") && (
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={member.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                            >
                              {member.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        )}
                        {selectedColumns.includes("joinDate") && (
                          <TableCell>{member.createdAt ? formatDate(member.createdAt) : "N/A"}</TableCell>
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
                              <DropdownMenuItem className="text-destructive" onClick={() => deleteMember(member.id)}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={selectedColumns.length + 1}
                        className="text-center py-4 text-muted-foreground"
                      >
                        {searchQuery
                          ? "No members match your search criteria."
                          : "No members data available. Add members to see them listed here."}
                      </TableCell>
                    </TableRow>
                  )
                ) : filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <TableRow key={group.id}>
                      {selectedColumns.includes("Group-Logo") && (
                        <TableCell className="font-medium">
                          {group.logo ? (
                            <img
                              src={group.logo || "/placeholder.svg"}
                              alt={group.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {group.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </TableCell>
                      )}

                      {selectedColumns.includes("name") && <TableCell className="font-medium">{group.name}</TableCell>}
                      {selectedColumns.includes("members") && <TableCell>{group.members || 0}</TableCell>}
                      {selectedColumns.includes("description") && (
                        <TableCell>
                          {group.description
                            ? group.description.length > 50
                              ? `${group.description.substring(0, 50)}...`
                              : group.description
                            : "No description"}
                        </TableCell>
                      )}
                      {selectedColumns.includes("groupType") && (
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              group.groupTypeId === "private"
                                ? "bg-blue-50 text-blue-700"
                                : group.groupTypeId === "public_open"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-amber-50 text-amber-700"
                            }
                          >
                            {getGroupTypeDisplayName(group.groupType)}
                          </Badge>
                        </TableCell>
                      )}
                      {selectedColumns.includes("created") && (
                        <TableCell>{formatDate(group.createdAt || group.created)}</TableCell>
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
                ) : (
                  <TableRow>
                    <TableCell colSpan={selectedColumns.length + 1} className="text-center py-4 text-muted-foreground">
                      {searchQuery
                        ? "No groups match your search criteria."
                        : "No groups data available. Create groups to see them listed here."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog for Add Member Type */}
      <Dialog open={showAddMemberTypeDialog} onOpenChange={setShowAddMemberTypeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Membership Type</DialogTitle>
          </DialogHeader>
          <AddMemberTypeForm onClose={() => setShowAddMemberTypeDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Dialog for Add Member */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
          </DialogHeader>
          <AddMemberForm onClose={() => setShowAddMemberDialog(false)} memberTypes={membershipTypes} />
        </DialogContent>
      </Dialog>

      {/* Dialog for Create Group */}
      <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
          </DialogHeader>
          <GroupForm onClose={() => setShowGroupDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
