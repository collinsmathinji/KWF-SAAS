import { Activity, DollarSign, Group, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface MemberType {
  id: string
  name: string
  type: string
  totalMembers: number
  monthlyRevenue: number
  benefits: string[]
}

interface Group {
  id: string
  name: string
  type: string
  members: number
  activeProjects: number
  lead: string
}

interface DashboardContentProps {
  memberTypes: MemberType[]
  groups: Group[]
}

export function DashboardContent({ memberTypes, groups }: DashboardContentProps) {
  const totalMembers = memberTypes.reduce((acc, type) => acc + type.totalMembers, 0)
  const totalRevenue = memberTypes.reduce((acc, type) => acc + type.monthlyRevenue, 0)
  const totalGroups = groups.length
  const activeProjects = groups.reduce((acc, group) => acc + group.activeProjects, 0)

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold">Organization Overview</h2>
        <p className="text-muted-foreground">Here is what is happening across your organization</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{totalMembers}</div>
              <Users className="h-4 w-4 text-blue-100" />
            </div>
            <p className="text-xs text-blue-100">Across all member types</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">${totalRevenue}</div>
              <DollarSign className="h-4 w-4 text-blue-100" />
            </div>
            <p className="text-xs text-blue-100">From premium memberships</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-700 to-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{totalGroups}</div>
              <Group className="h-4 w-4 text-blue-100" />
            </div>
            <p className="text-xs text-blue-100">Active departments</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-800 to-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{activeProjects}</div>
              <Activity className="h-4 w-4 text-blue-100" />
            </div>
            <p className="text-xs text-blue-100">In progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Member Types Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>{type.totalMembers}</TableCell>
                    <TableCell>${type.monthlyRevenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Groups Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Projects</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>{group.members}</TableCell>
                    <TableCell>{group.activeProjects}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

