"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, EyeOff, AlertCircle, X, Check } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"
import { getStaffRoles } from "@/lib/staffRole"
import type { StaffRole } from "@/lib/staffRole"
import { createStaff } from "@/lib/staff"
import type { Staff } from "@/lib/staff"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StaffFormProps {
  onClose: () => void
  onStaffCreated: (staff: Staff) => void
  staffRoles: {
    id: string
    name: string
    description: string
    apiAccess: string[]
  }[]
}

export default function StaffForm({ onClose, onStaffCreated, staffRoles }: StaffFormProps) {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    gender: "",
    position: "",
    isAdminAccess: false,
    staffRoleId: "",
    nextOfKin: {
      fullName: "",
      phoneNo: "",
      email: "",
      relationship: "",
      address: ""
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showRoleDetails, setShowRoleDetails] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showSubscriptionWarning, setShowSubscriptionWarning] = useState(false)

  // Auto-close effect after success
  useEffect(() => {
    if (!isSuccess) return;
    
    const timer = setTimeout(() => {
      onClose();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [isSuccess, onClose]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRoleSelect = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      staffRoleId: roleId
    }))
  }

  const handleAdminAccessToggle = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isAdminAccess: checked
    }))
    if (!checked) {
      setShowSubscriptionWarning(false)
    }
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
        staffRoleId: Number(formData.staffRoleId),
        organizationId: Number(session.user.organizationId),
        isActive: true,
        hasPortalAccess: formData.isAdminAccess,
        createdBy: session.user.email || "SYSTEM",
        createdByUserType: "ADMIN"
      })

      // Show success state
      setIsSuccess(true)
      
      // Show success toast with the response message
      toast({
        title: "Success",
        description: `Staff member ${formData.firstName} ${formData.lastName} has been created successfully`
      })

      onStaffCreated(newStaff)
      
      // Form will auto-close after 1.5 seconds due to the useEffect
    } catch (error: any) {
      console.error("Error creating staff:", error)
      
      // Handle different types of error responses
      let errorMessage = "Failed to create staff member"
      
      if (error.response?.data?.message) {
        // Backend error message
        errorMessage = error.response.data.message
      } else if (error.message) {
        // Standard error message
        errorMessage = error.message
      }

      // Show error toast with appropriate styling
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        // Add longer duration for subscription-related errors
        duration: errorMessage.includes("subscription") ? 5000 : 3000
      })

      // If it's a subscription error, you might want to show it in the form as well
      if (errorMessage.includes("subscription")) {
        setFormData(prev => ({
          ...prev,
          isAdminAccess: false // Reset admin access toggle
        }))
      }

      setIsSuccess(false)
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
    <form onSubmit={handleSubmit} className="space-y-6 min-h-[600px] overflow-y-auto">
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="bg-green-100 p-4 rounded-full">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-700">Staff Member Created!</h3>
          <p className="text-center text-gray-600">
            Successfully added {formData.firstName} {formData.lastName} as a staff member
          </p>
          <p className="text-sm text-gray-500">Closing automatically...</p>
        </div>
      ) : (
        <>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="nextOfKin">Next of Kin</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
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
                <Label htmlFor="phoneNo">Phone Number</Label>
                <Input
                  id="phoneNo"
                  value={formData.phoneNo}
                  onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => handleInputChange("gender", value)} value={formData.gender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="employment" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  placeholder="Enter position"
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
                      <h3 className="font-medium">{role.name}</h3>
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
                      {selectedRole.apiAccess.map((permission, index) => (
                        <div
                          key={index}
                          className="p-2 bg-white rounded border text-sm flex items-center gap-2"
                        >
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span>{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isAdminAccess">Admin Access</Label>
                  <Switch
                    id="isAdminAccess"
                    checked={formData.isAdminAccess}
                    onCheckedChange={handleAdminAccessToggle}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Grant administrative access to this staff member
                </p>
                {showSubscriptionWarning && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your current subscription plan does not support admin access. Please upgrade your plan to enable this feature.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="nextOfKin" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nextOfKinFullName">Full Name</Label>
                  <Input
                    id="nextOfKinFullName"
                    value={formData.nextOfKin.fullName}
                    onChange={(e) => handleInputChange("nextOfKin", { ...formData.nextOfKin, fullName: e.target.value })}
                    placeholder="Enter next of kin's full name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nextOfKinPhone">Phone Number</Label>
                    <Input
                      id="nextOfKinPhone"
                      value={formData.nextOfKin.phoneNo}
                      onChange={(e) => handleInputChange("nextOfKin", { ...formData.nextOfKin, phoneNo: e.target.value })}
                      placeholder="Enter next of kin's phone number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextOfKinEmail">Email</Label>
                    <Input
                      id="nextOfKinEmail"
                      type="email"
                      value={formData.nextOfKin.email}
                      onChange={(e) => handleInputChange("nextOfKin", { ...formData.nextOfKin, email: e.target.value })}
                      placeholder="Enter next of kin's email"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextOfKinRelationship">Relationship</Label>
                  <Input
                    id="nextOfKinRelationship"
                    value={formData.nextOfKin.relationship}
                    onChange={(e) => handleInputChange("nextOfKin", { ...formData.nextOfKin, relationship: e.target.value })}
                    placeholder="Enter relationship"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextOfKinAddress">Address</Label>
                  <Input
                    id="nextOfKinAddress"
                    value={formData.nextOfKin.address}
                    onChange={(e) => handleInputChange("nextOfKin", { ...formData.nextOfKin, address: e.target.value })}
                    placeholder="Enter next of kin's address"
                    required
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
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
        </>
      )}
    </form>
  )
}
