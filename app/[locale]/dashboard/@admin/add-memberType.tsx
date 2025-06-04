"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Shield, Check } from "lucide-react"
import { createMemberType, fetchMemberType } from "@/lib/members"

interface MemberType {
  name: string
  description: string
  organizationId: number | null
}

export default function AddMemberTypeForm({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const organization = localStorage.getItem("organizationId")
  const [formData, setFormData] = useState<MemberType>({
    name: "",
    description: "",
    organizationId: organization ? Number(organization) : null
  })

  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [isLoading, onClose]);

  // Auto-close after success with a delay
  useEffect(() => {
    if (!isSuccess) return;
    
    const timer = setTimeout(() => {
      handleClose();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [isSuccess, handleClose]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isLoading) return;
    setIsLoading(true)

    try {
      const formDataToSubmit = {
        ...formData,
        organizationId: formData.organizationId ? Number(formData.organizationId) : null
      }
      
      const response = await createMemberType(formDataToSubmit)
      
      if (!response) {
        throw new Error("Failed to create member type")
      }

      // Show success state first
      setIsSuccess(true)
      
      // Show success toast
      toast({
        title: "Success",
        description: `Member type "${formData.name}" has been created`,
      })
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        organizationId: organization ? Number(organization) : null
      })

      // Refresh member types list after a short delay
      if (organization) {
        setTimeout(async () => {
          try {
            await fetchMemberType(organization)
          } catch (error) {
            console.error("Error refreshing member types:", error)
          }
        }, 100)
      }
      
    } catch (error) {
      console.error("Error creating member type:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setIsSuccess(false)
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
              {isSuccess ? 
                <Check className="h-6 w-6 text-green-600" /> :
                <Shield className="h-6 w-6 text-blue-600" />
              }
              Add Member Type
            </div>
          </CardTitle>
          <CardDescription className="text-blue-600">
            Create a new member type with custom permissions for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Check className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-700">Member Type Created!</h3>
              <p className="text-center text-gray-600">
                Successfully added "{formData.name}" as a new member type
              </p>
              <p className="text-sm text-gray-500">Closing automatically...</p>
            </div>
          ) : (
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

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  className="w-1/2 border-blue-200 text-blue-600 hover:bg-blue-50"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.name || !formData.description}
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Creating..." : "Create Member Type"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


