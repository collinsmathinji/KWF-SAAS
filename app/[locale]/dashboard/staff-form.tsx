"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, EyeOff, AlertCircle, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"
import { getStaffRoles } from "@/lib/staffRole"
import type { StaffRole } from "@/lib/staffRole"
import { createStaff } from "@/lib/staff"
import type { Staff } from "@/lib/staff"

interface StaffFormProps {
  onClose: () => void
  onStaffCreated: (staff: Staff) => void
}

export default function StaffForm({ onClose, onStaffCreated }: StaffFormProps) {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    staffRoleId: 0,
    hasPortalAccess: true
  })
  const [staffRoles, setStaffRoles] = useState<StaffRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showRoleDetails, setShowRoleDetails] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchRoles = async () => {
      if (!session?.user?.organizationId) return
      
      try {
        const roles = await getStaffRoles(Number(session.user.organizationId))
        setStaffRoles(roles)
      } catch (error) {
        console.error("Error fetching staff roles:", error)
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRoleSelect = (roleId: number) => {
    setFormData(prev => ({
      ...prev,
      staffRoleId: roleId
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.organizationId) {
      toast({
        title: "Error",
        description: "No organization ID found",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      const newStaff = await createStaff({
        ...formData,
        organizationId: Number(session.user.organizationId),
        isActive: true,
        createdBy: session.user.email || "SYSTEM",
        createdByUserType: "ADMIN"
      })

      toast({
        title: "Success",
        description: "Staff member created successfully"
      })

      onStaffCreated(newStaff)
      onClose()
    } catch (error) {
      console.error("Error creating staff:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create staff member",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedRole = staffRoles.find(role => role.id === formData.staffRoleId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter first name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Staff Role</Label>
          <div className="grid grid-cols-2 gap-4">
            {staffRoles.map(role => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleSelect(role.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  formData.staffRoleId === role.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-medium">{role.roleName}</h3>
                <p className="text-sm text-gray-500">{role.description}</p>
              </button>
            ))}
          </div>
        </div>

        {selectedRole && showRoleDetails && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Role Details</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowRoleDetails(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Permissions</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedRole.permissions?.map((permission, index) => (
                  <div
                    key={index}
                    className="p-2 bg-white rounded border text-sm flex items-center gap-2"
                  >
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>{`${permission.method} ${permission.endpoint}`}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedRole.scope && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Access Scope</h4>
                <div className="p-2 bg-white rounded border text-sm">
                  <span className="font-medium">{selectedRole.scope.field}:</span>{' '}
                  {selectedRole.scope.value}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="hasPortalAccess">Portal Access</Label>
            <Switch
              id="hasPortalAccess"
              checked={formData.hasPortalAccess}
              onCheckedChange={(checked) => handleInputChange("hasPortalAccess", checked)}
            />
          </div>
          <p className="text-sm text-gray-500">
            Allow this staff member to access the portal
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !formData.staffRoleId || !formData.firstName || staffRoles.length === 0}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Creating...
            </>
          ) : (
            'Create Staff Member'
          )}
        </Button>
      </div>
    </form>
  )
}
