"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, EyeOff } from "lucide-react"

interface StaffRole {
  id: string
  name: string
  description: string
  apiAccess: string[]
  createdAt: string
  staffCount?: number
}

interface Staff {
  id: string
  name: string
  email: string
  staffRoleId: string
  staffRole?: StaffRole
  hasPortalAccess: boolean
  isActive: boolean
  createdAt: string
}

interface StaffFormProps {
  onClose: () => void
  staffRoles: StaffRole[]
  onStaffCreated: (staff: Staff) => void
}

export default function StaffForm({ onClose, staffRoles, onStaffCreated }: StaffFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    staffRoleId: "",
  })
  const [hasPortalAccess, setHasPortalAccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRoleDetails, setShowRoleDetails] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const selectedRole = staffRoles.find((role) => role.id === formData.staffRoleId)

      const newStaff: Staff = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        staffRoleId: formData.staffRoleId,
        staffRole: selectedRole,
        hasPortalAccess,
        isActive: true,
        createdAt: new Date().toISOString(),
      }

      onStaffCreated(newStaff)
      console.log("Staff created:", newStaff)
    } catch (error) {
      console.error("Error creating staff:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedRole = staffRoles.find((role) => role.id === formData.staffRoleId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Staff Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter full name"
            required
          />
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
          <Label htmlFor="staffRole">Staff Role</Label>
          <Select value={formData.staffRoleId} onValueChange={(value) => handleInputChange("staffRoleId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a staff role" />
            </SelectTrigger>
            <SelectContent>
              {staffRoles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>{role.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {staffRoles.length === 0 && (
            <p className="text-sm text-muted-foreground">No staff roles available. Create a staff role first.</p>
          )}
        </div>

        {/* Role Details Preview */}
        {selectedRole && (
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {selectedRole.name} Role Details
                </CardTitle>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowRoleDetails(!showRoleDetails)}>
                  {showRoleDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <CardDescription className="text-xs">{selectedRole.description}</CardDescription>
            </CardHeader>
            {showRoleDetails && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">API Access Permissions:</Label>
                  <div className="flex flex-wrap gap-1">
                    {selectedRole.apiAccess.map((api) => (
                      <Badge key={api} variant="outline" className="text-xs">
                        {api}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        <div className="space-y-3">
          <Label className="text-sm font-medium">Access Settings</Label>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Portal Access</Label>
              <p className="text-xs text-muted-foreground">Allow this staff member to access the admin portal</p>
            </div>
            <Switch checked={hasPortalAccess} onCheckedChange={setHasPortalAccess} />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !formData.name || !formData.email || !formData.staffRoleId}>
          {isSubmitting ? "Creating..." : "Create Staff"}
        </Button>
      </div>
    </form>
  )
}
