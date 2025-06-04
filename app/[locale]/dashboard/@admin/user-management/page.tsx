"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, UserPlus, Download, Plus, ChevronDown, Search, Filter, MoreHorizontal, Shield } from "lucide-react"
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
import StaffRoleForm from "@/app/[locale]/dashboard/staff-role-form"
import StaffForm from "@/app/[locale]/dashboard/staff-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AddMemberForm from "../invite-member"
import { deleteMemberById, getMembers } from "@/lib/members"
import { fetchMemberType } from "@/lib/members"
import { getGroups } from "@/lib/group"
import { useSession } from "next-auth/react"
import { getStaffRoles } from "@/lib/staffRole"
import type { StaffRole } from "@/lib/staffRole"
import { getStaff, deleteStaff as deleteStaffAPI } from "@/lib/staff"
import { Staff as APIStaff } from "@/lib/staff"
import { Permission } from "@/types/permissions"
import type { GroupData } from "@/lib/group"

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

interface Group extends GroupData {}

interface StaffRoleDisplay {
  id: string
  roleName: string
  name: string
  description: string
  permissions: Permission[]
  createdAt: string
  organizationId: number | null
  apiAccess: string[]
  staffCount: number
}

interface StaffDisplay extends APIStaff {
  staffRole?: StaffRoleDisplay
}

const mapStaffRoleToDisplay = (role: StaffRole): StaffRoleDisplay => ({
  ...role,
  id: role.id.toString(),
  name: role.roleName,
  apiAccess: role.permissions?.map(p => `${p.method} ${p.endpoint}`) || [],
  permissions: role.permissions || [],
  staffCount: 0 // This would need to be calculated from staff data
})

// Define columns for all views
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
  staff: {
    name: "Name",
    email: "Email",
    role: "Staff Role",
    portalAccess: "Portal Access",
    status: "Status",
    joinDate: "Join Date",
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
  const { data: session } = useSession()
  const [view, setView] = useState<"members" | "groups" | "staff">("members")
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["name", "email", "type", "status", "joinDate"])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddMemberTypeDialog, setShowAddMemberTypeDialog] = useState(false)
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [showGroupDialog, setShowGroupDialog] = useState(false)
  const [showStaffRoleDialog, setShowStaffRoleDialog] = useState(false)
  const [showStaffDialog, setShowStaffDialog] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffDisplay[]>([])
  const [staffRoles, setStaffRoles] = useState<StaffRoleDisplay[]>([])
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

  const deleteStaffMember = async (staffId: string) => {
    try {
      await deleteStaffAPI(staffId)
      setStaffMembers((prev) => prev.filter((staff:any) => staff.id !== staffId))
      console.log("Staff deleted successfully")
    } catch (error) {
      console.error("Error deleting staff:", error)
    }
  }

  const setGroupsWithData = (data: GroupData[]) => {
    setGroups(data as Group[])
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (!session?.user?.organizationId) {
          console.error("No organization ID found in session")
          setMembershipTypes([])
          setMembers([])
          setGroups([])
          setStaffMembers([])
          setStaffRoles([])
          return
        }

        // Fetch membership types
        const response: any = await fetchMemberType(String(session.user.organizationId))
        if (response && Array.isArray(response.data)) {
          setMembershipTypes(response.data)
        } else {
          setMembershipTypes([])
        }

        // Fetch members
        const membersResponse: any = await getMembers(String(session.user.organizationId))
        if (membersResponse && Array.isArray(membersResponse.data)) {
          setMembers(membersResponse.data)
        } else {
          setMembers([])
        }

        // Fetch groups
        const groupsResponse = await getGroups(String(session.user.organizationId))
        if (groupsResponse && Array.isArray(groupsResponse)) {
          setGroupsWithData(groupsResponse)
        } else {
          setGroups([])
        }

        // Fetch staff roles and map them
        const staffRolesResponse = await getStaffRoles(Number(session.user.organizationId))
        if (staffRolesResponse && Array.isArray(staffRolesResponse)) {
          const mappedRoles = staffRolesResponse.map(mapStaffRoleToDisplay)
          setStaffRoles(mappedRoles)
        } else {
          setStaffRoles([])
        }

        // Fetch staff and map with roles
        const staffResponse = await getStaff(Number(session.user.organizationId))
        if (staffResponse && Array.isArray(staffResponse)) {
          const mappedStaff = staffResponse.map(staff => ({
            ...staff,
            staffRole: staffRoles.find((role:any) => role.id === staff.staffRoleId)
          }))
          setStaffMembers(mappedStaff)
        } else {
          setStaffMembers([])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setMembershipTypes([])
        setMembers([])
        setGroups([])
        setStaffMembers([])
        setStaffRoles([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [session?.user?.organizationId])

  // Filter data based on search query
  const filteredMembers = members.filter((member) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      (member.firstName && member.firstName.toLowerCase().includes(query)) ||
      (member.lastName && member.lastName.toLowerCase().includes(query)) ||
      (member.email && member.email.toLowerCase().includes(query))
    )
  })

  const filteredGroups = groups.filter((group) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      (group.name && group.name.toLowerCase().includes(query)) ||
      (group.description && group.description.toLowerCase().includes(query))
    )
  })

  const filteredStaff = staffMembers.filter((staffMember:any) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      (staffMember.name && staffMember.name.toLowerCase().includes(query)) ||
      (staffMember.email && staffMember.email.toLowerCase().includes(query)) ||
      (staffMember.staffRole?.name && staffMember.staffRole.name.toLowerCase().includes(query))
    )
  })

  // Count groups by type
  const groupCounts = groupTypes.map((type) => {
    const count = groups.filter((g:any) => g.groupType === type.id).length
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
    } else if (view === "groups") {
      setSelectedColumns(["Group-Logo", "name", "members", "description", "groupType", "created"])
    } else if (view === "staff") {
      setSelectedColumns(["name", "email", "role", "portalAccess", "status", "joinDate"])
    }
  }, [view])

  const getStatsCards = () => {
    if (view === "members") {
      return membershipTypes.length > 0 ? (
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
    } else if (view === "groups") {
      return groupCounts.map((type) => (
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
    } else if (view === "staff") {
      return staffRoles.map((role) => (
        <Card key={role.id} className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardTitle className="text-sm font-medium">{role.name}</CardTitle>
            <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
              <Shield className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{role.staffCount || 0}</div>
            <p className="text-xs text-muted-foreground">Staff members</p>
          </CardContent>
        </Card>
      ))
    }
  }

  const getActionButton = () => {
    if (view === "members") {
      return (
        <Button onClick={() => setShowAddMemberDialog(true)} className="flex-1 sm:flex-none">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      )
    } else if (view === "groups") {
      return (
        <Button onClick={() => setShowGroupDialog(true)} className="flex-1 sm:flex-none">
          <Plus className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      )
    } else if (view === "staff") {
      return (
        <Button onClick={() => setShowStaffDialog(true)} className="flex-1 sm:flex-none">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      )
    }
  }

  const renderTableRows = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={selectedColumns.length + 1} className="text-center py-8">
            <div className="flex justify-center">
              <svg
                className="animate-spin h-6 w-6 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    if (view === "members") {
      return filteredMembers.length > 0 ? (
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
          <TableCell colSpan={selectedColumns.length + 1} className="text-center py-4 text-muted-foreground">
            {searchQuery
              ? "No members match your search criteria."
              : "No members data available. Add members to see them listed here."}
          </TableCell>
        </TableRow>
      )
    } else if (view === "groups") {
      return filteredGroups.length > 0 ? (
        filteredGroups.map((group:any) => (
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
                    <span className="text-xs font-medium text-gray-600">{group.name.charAt(0).toUpperCase()}</span>
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
      )
    } else if (view === "staff") {
      return filteredStaff.length > 0 ? (
        filteredStaff.map((staffMember:any) => (
          <TableRow key={staffMember.id}>
            {selectedColumns.includes("name") && <TableCell className="font-medium">{staffMember.name}</TableCell>}
            {selectedColumns.includes("email") && <TableCell>{staffMember.email}</TableCell>}
            {selectedColumns.includes("role") && (
              <TableCell>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  {staffMember.staffRole?.name || "Unknown"}
                </Badge>
              </TableCell>
            )}
            {selectedColumns.includes("portalAccess") && (
              <TableCell>
                <Badge
                  variant="outline"
                  className={staffMember.hasPortalAccess ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"}
                >
                  {staffMember.hasPortalAccess ? "Yes" : "No"}
                </Badge>
              </TableCell>
            )}
            {selectedColumns.includes("status") && (
              <TableCell>
                <Badge
                  variant="outline"
                  className={staffMember.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                >
                  {staffMember.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            )}
            {selectedColumns.includes("joinDate") && <TableCell>{formatDate(staffMember.createdAt)}</TableCell>}
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
                  <DropdownMenuItem className="text-destructive" onClick={() => deleteStaffMember(staffMember.id)}>
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
            {searchQuery
              ? "No staff match your search criteria."
              : "No staff data available. Add staff to see them listed here."}
          </TableCell>
        </TableRow>
      )
    }
  }

  const handleStaffCreated = (staff: any) => {
    const staffWithRole: StaffDisplay = {
      ...staff,
      organizationId: session?.user?.organizationId || null,
      staffRole: staffRoles.find(role => role.id === staff.staffRoleId)
    }
    setStaffMembers(prev => [...prev, staffWithRole])
    setShowStaffDialog(false)
  }

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
                <span>Staff Roles</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-56">
                {staffRoles.map((role) => (
                  <DropdownMenuItem
                    key={role.id}
                    onClick={() => router.push(`/dashboard/user-management/staff-roles/${role.id}`)}
                  >
                    <span>{role.name}</span>
                    <span className="ml-auto text-muted-foreground">{role.staffCount || 0}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowStaffRoleDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add Staff Role</span>
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setView("members")}>
              <Users className="mr-2 h-4 w-4" />
              <span>Members</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView("groups")}>
              <Users className="mr-2 h-4 w-4" />
              <span>Groups</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView("staff")}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Staff</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {getActionButton()}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{getStatsCards()}</div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">
            {view === "members" ? "All Members" : view === "groups" ? "All Groups" : "All Staff"}
          </CardTitle>
          <CardDescription>
            Manage and monitor all {view === "members" ? "members" : view === "groups" ? "groups" : "staff"} in the
            system
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
              <TableBody>{renderTableRows()}</TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog for Add Member Type */}
      <Dialog 
        open={showAddMemberTypeDialog} 
        onOpenChange={(open) => {
          if (!open) {
            // Only close if not in loading state
            setShowAddMemberTypeDialog(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Membership Type</DialogTitle>
          </DialogHeader>
          <AddMemberTypeForm 
            onClose={() => {
              setShowAddMemberTypeDialog(false);
            }} 
          />
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

      {/* Dialog for Add Staff Role */}
      <Dialog 
        open={showStaffRoleDialog} 
        onOpenChange={(open) => {
          if (!open) {
            setShowStaffRoleDialog(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Staff Role</DialogTitle>
          </DialogHeader>
          <StaffRoleForm
            onClose={() => {
              setShowStaffRoleDialog(false);
            }}
            onRoleCreated={(newRole:any) => {
              setStaffRoles((prev) => [...prev, mapStaffRoleToDisplay(newRole)]);
              setShowStaffRoleDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog for Add Staff */}
      <Dialog open={showStaffDialog} onOpenChange={setShowStaffDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
          </DialogHeader>
          <StaffForm
            onClose={() => setShowStaffDialog(false)}
            staffRoles={staffRoles.map(role => ({
              id: role.id.toString(),
              name: role.roleName,
              description: role.description,
              apiAccess: role.permissions?.map(p => `${p.method} ${p.endpoint}`) || []
            }))}
            onStaffCreated={handleStaffCreated}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
