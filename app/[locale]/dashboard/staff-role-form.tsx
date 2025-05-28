"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface StaffRole {
  id: string
  name: string
  description: string
  apiAccess: string[]
  createdAt: string
  staffCount?: number
}

interface StaffRoleFormProps {
  onClose: () => void
  onRoleCreated: (role: StaffRole) => void
}

// Available APIs that can be assigned to staff roles
const availableApis = [
  { id: "users", name: "Users Management", description: "Create, read, update, delete users" },
  { id: "groups", name: "Groups Management", description: "Manage user groups and memberships" },
  { id: "settings", name: "System Settings", description: "Access and modify system configurations" },
  { id: "analytics", name: "Analytics", description: "View reports and analytics data" },
  { id: "billing", name: "Billing", description: "Manage billing and subscription data" },
  { id: "support", name: "Support", description: "Access support tickets and customer communications" },
  { id: "content", name: "Content Management", description: "Manage content and media files" },
  { id: "notifications", name: "Notifications", description: "Send and manage notifications" },
  { id: "audit", name: "Audit Logs", description: "View system audit logs and activity" },
  { id: "integrations", name: "Integrations", description: "Manage third-party integrations" },
]

export default function StaffRoleForm({ onClose, onRoleCreated }: StaffRoleFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [selectedApis, setSelectedApis] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleApiToggle = (apiId: string) => {
    setSelectedApis((prev) => (prev.includes(apiId) ? prev.filter((id) => id !== apiId) : [...prev, apiId]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newRole: StaffRole = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        apiAccess: selectedApis,
        createdAt: new Date().toISOString(),
        staffCount: 0,
      }

      onRoleCreated(newRole)
      console.log("Staff role created:", newRole)
    } catch (error) {
      console.error("Error creating staff role:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeApi = (apiId: string) => {
    setSelectedApis((prev) => prev.filter((id) => id !== apiId))
  }

  const getApiName = (apiId: string) => {
    return availableApis.find((api) => api.id === apiId)?.name || apiId
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Staff Role Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., Content Manager, Support Agent"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe the responsibilities and scope of this role..."
            className="min-h-[80px]"
            required
          />
        </div>

        <div className="space-y-4">
          <Label>API Access Permissions</Label>
          <p className="text-sm text-muted-foreground">Select which APIs this staff role should have access to:</p>

          {/* Selected APIs */}
          {selectedApis.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected APIs:</Label>
              <div className="flex flex-wrap gap-2">
                {selectedApis.map((apiId) => (
                  <Badge key={apiId} variant="secondary" className="flex items-center gap-1">
                    {getApiName(apiId)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeApi(apiId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Available APIs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Available APIs</CardTitle>
              <CardDescription className="text-xs">Check the APIs you want to grant access to</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableApis.map((api) => (
                <div key={api.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={api.id}
                    checked={selectedApis.includes(api.id)}
                    onCheckedChange={() => handleApiToggle(api.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={api.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {api.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">{api.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.name || !formData.description || selectedApis.length === 0}
        >
          {isSubmitting ? "Creating..." : "Create Staff Role"}
        </Button>
      </div>
    </form>
  )
}
