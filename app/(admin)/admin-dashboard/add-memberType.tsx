"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Shield } from "lucide-react"

const defaultPermissions = [
  {
    id: "view",
    label: "View Content",
    description: "Can view all content and resources",
  },
  {
    id: "create",
    label: "Create Content",
    description: "Can create new content and resources",
  },
  {
    id: "edit",
    label: "Edit Content",
    description: "Can modify existing content and resources",
  },
  {
    id: "delete",
    label: "Delete Content",
    description: "Can remove content and resources",
  },
  {
    id: "manage-members",
    label: "Manage Members",
    description: "Can add and remove members",
  },
  {
    id: "manage-settings",
    label: "Manage Settings",
    description: "Can modify organization settings",
  },
]

export default function AddMemberTypeForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (formData.permissions.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one permission",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Here you would typically make an API call to add the member type
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated API call
      toast({
        title: "Success",
        description: `Member type "${formData.name}" has been created`,
      })
      setFormData({
        name: "",
        description: "",
        permissions: [],
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }))
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl border-blue-100 bg-white shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-blue-900">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Add Member Type
            </div>
          </CardTitle>
          <CardDescription className="text-blue-600">
            Create a new member type with custom permissions for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-900">
                Role Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Project Manager"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                disabled={isLoading}
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-blue-900">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the responsibilities and access level of this role"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                required
                disabled={isLoading}
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-blue-900">Permissions</Label>
              <div className="grid gap-4 md:grid-cols-2">
                {defaultPermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-start space-x-3 space-y-0 rounded-md border border-blue-100 p-4 hover:bg-blue-50 transition-colors"
                  >
                    <Checkbox
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                      disabled={isLoading}
                    />
                    <div className="space-y-1 leading-none">
                      <Label
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.label}
                      </Label>
                      <p className="text-sm text-blue-600">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {formData.name && formData.permissions.length > 0 && (
              <div className="rounded-lg bg-blue-50 p-4 space-y-2">
                <h3 className="font-medium text-blue-900">Preview</h3>
                <div className="text-blue-600">
                  <p className="font-medium">{formData.name}</p>
                  <p className="text-sm">{formData.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                      >
                        {defaultPermissions.find((p) => p.id === permission)?.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.description || formData.permissions.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Creating..." : "Create Member Type"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

