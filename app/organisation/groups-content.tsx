import { Group } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface GroupData {
  id: string
  name: string
  type: string
  members: number
  activeProjects: number
  lead: string
}

interface GroupsContentProps {
  group: GroupData | undefined
}

export function GroupsContent({ group }: GroupsContentProps) {
  if (!group) return null

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{group.name}</h2>
          <p className="text-muted-foreground">{group.type}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Group className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Members</p>
                  <p className="text-2xl font-bold">{group.members}</p>
                </div>
              </div>
              <div>
                <p className="font-medium">Active Projects</p>
                <p className="text-2xl font-bold">{group.activeProjects}</p>
              </div>
              <div>
                <p className="font-medium">Team Lead</p>
                <p className="text-lg">{group.lead}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Website Redesign</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                      In Progress
                    </span>
                  </TableCell>
                  <TableCell>Mar 30, 2024</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>Senior Developer</TableCell>
                <TableCell>jane@example.com</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Active
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

