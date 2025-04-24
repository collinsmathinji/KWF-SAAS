"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Shield } from "lucide-react"
import { createMemberType } from "@/lib/members"

interface MemberType {
  name: string
  description: string
  organizationId: number| null
}

export default function AddMemberTypeForm({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const organization=localStorage.getItem("organizationId")
  const [formData, setFormData] = useState<MemberType>({
    name: "",
    description: "",
    organizationId: Number(organization)
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createMemberType(formData)
      toast({
        title: "Success",
        description: `Member type "${formData.name}" has been created`,
      })
      setFormData({
        name: "",
        description: "",
        organizationId: null
      })
      onClose()
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

  return (
    <div className="bg-blue-50 p-4 flex items-center justify-center">
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

            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.description}
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