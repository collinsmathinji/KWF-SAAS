"use client"

import { useEffect, useState } from "react"
import { getStaffRoles } from "@/lib/staffRole"
import { useSession } from "next-auth/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { StaffRole } from "@/lib/staffRole"

export default function StaffRoleList() {
  const { data: session } = useSession()
  const [roles, setRoles] = useState<StaffRole[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRoles = async () => {
      if (!session?.user?.organizationId) return
      
      try {
        const fetchedRoles = await getStaffRoles(Number(session.user.organizationId))
        setRoles(fetchedRoles)
      } catch (error) {
        console.error("Error fetching roles:", error)
        toast({
          title: "Error",
          description: "Failed to fetch staff roles",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoles()
  }, [session?.user?.organizationId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800" />
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-gray-500 gap-2">
        <AlertCircle className="h-8 w-8" />
        <p>No staff roles found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Staff Roles</h2>
        <Badge variant="outline" className="font-normal">
          {roles.length} {roles.length === 1 ? 'role' : 'roles'}
        </Badge>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{role.roleName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{role.description}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{role.createdBy}</span>
                    <span className="text-xs text-gray-500">{role.createdByUserType}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(role.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {role.updatedAt 
                    ? new Date(role.updatedAt).toLocaleDateString()
                    : 'Never'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 