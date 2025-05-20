"use client"
import type React from "react"
import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Mail, UserPlus, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { createMember } from "@/lib/members"

export default function AddMemberForm({ 
  onClose, 
  memberTypes = [] 
}: { 
  onClose?: () => void,
  memberTypes?: Array<{ id: string, name: string, description: string }>
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("inviteByEmail")
  const OrganisationId=localStorage.getItem("organizationId")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("")
  console.log('memberTypesForm:', memberTypes)
  // Full member creation state
  const [formData, setFormData] = useState({
    OrganisationId: Number(OrganisationId),
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    membershipType: "",
    isPortalAccess: false,
  })
  useEffect(() => {
    console.log("memberTypes prop received:", memberTypes);
    console.log("memberTypes length:", memberTypes?.length);
    console.log("memberTypes data structure:", memberTypes?.[0]);
  }, [memberTypes]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPortalAccess: checked }))
  }

  const nextTab = () => {
    if (activeTab === "basicInfo") {
      setActiveTab("accountInfo")
    }
  }

  const prevTab = () => {
    if (activeTab === "accountInfo") {
      setActiveTab("basicInfo")
    }
  }

  async function onSubmitFullMember(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
     
      await createMember({
        OrganizationId: OrganisationId,
        firstName: formData.firstName,      
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        phoneNumber:formData.phoneNumber,
        membershipTypeId: formData.membershipType,
        isPortalAccess: true
      })
      toast({
        title: "Success",
        description: `Member ${formData.firstName} ${formData.lastName} has been added`,
      })
      setFormData({
        OrganisationId: Number(OrganisationId),
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phoneNumber: "",
        membershipType: "",
        isPortalAccess: false,
      })
      if (onClose) onClose()
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

  async function onSubmitInvite(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would typically make an API call to send the invite
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated API call
      toast({
        title: "Invitation Sent",
        description: `An invitation has been sent to ${inviteEmail}`,
      })
      // Reset invite form
      setInviteEmail("")
      setInviteRole("")
      if (onClose) onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isBasicInfoComplete = formData.firstName && formData.lastName && formData.email
  const isFullFormComplete = isBasicInfoComplete && formData.membershipType
  const isInviteFormComplete = inviteEmail && inviteRole

  return (
    <div className="py-4">
      <Card className="w-full border-blue-100 bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-blue-900">Add Team Member</CardTitle>
          <CardDescription className="text-blue-600">
            Add a new member or send an invitation to join your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="inviteByEmail" className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                <span>Quick Invite</span>
              </TabsTrigger>
              <TabsTrigger value="basicInfo" className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Basic Info</span>
              </TabsTrigger>
              <TabsTrigger value="accountInfo" disabled={!isBasicInfoComplete} className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Invite by Email Tab */}
            <TabsContent value="inviteByEmail">
              <form onSubmit={onSubmitInvite} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteEmail" className="text-blue-900">Email Address</Label>
                  <Input
                    id="inviteEmail"
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="inviteRole" className="text-blue-900">Role</Label>
                  <Select 
                    value={inviteRole} 
                    onValueChange={setInviteRole} 
                    required
                  >
                    <SelectTrigger
                      id="inviteRole"
                      disabled={isLoading}
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
  {memberTypes.map((memberType) => (
    <SelectItem key={memberType.id} value={memberType.id}>
      {memberType.name}
    </SelectItem>
  ))}
</SelectContent>
                  </Select>
                  <p className="text-sm text-blue-600">
                    {inviteRole === "owner" && "Full access to all resources and settings"}
                    {inviteRole === "admin" && "Can manage team members and most settings"}
                    {inviteRole === "member" && "Can view and edit most resources"}
                    {inviteRole === "viewer" && "Can only view resources"}
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || !isInviteFormComplete}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Sending Invitation..." : "Send Invitation"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            {/* Create Full Member Tabs */}
            <form onSubmit={onSubmitFullMember}>
              <TabsContent value="basicInfo" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-blue-900">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-blue-900">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-900">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="member@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-blue-900">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={nextTab}
                    disabled={!isBasicInfoComplete}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="accountInfo" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-blue-900">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    placeholder={`${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="membershipType" className="text-blue-900">Membership Type</Label>
                  <Select 
                    value={formData.membershipType} 
                    onValueChange={(value) => handleSelectChange("membershipType", value)} 
                    required
                  >
                    <SelectTrigger
                      id="membershipType"
                      disabled={isLoading}
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    >
                      <SelectValue placeholder="Select a membership type" />
                    </SelectTrigger>
                    <SelectContent>
  {memberTypes.map((memberType) => (
    <SelectItem key={memberType.id} value={memberType.id}>
      {memberType.name}
    </SelectItem>
  ))}
</SelectContent>
                  </Select>
                  <p className="text-sm text-blue-600">
                    {formData.membershipType === "owner" && "Full access to all resources and settings"}
                    {formData.membershipType === "admin" && "Can manage team members and most settings"}
                    {formData.membershipType === "member" && "Can view and edit most resources"}
                    {formData.membershipType === "viewer" && "Can only view resources"}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="portalAccess"
                    checked={formData.isPortalAccess}
                    onCheckedChange={handleSwitchChange}
                    disabled={isLoading}
                  />
                  <Label htmlFor="portalAccess" className="text-blue-900">Enable Portal Access</Label>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    onClick={prevTab}
                    variant="outline"
                    className="border-blue-200 text-blue-700"
                  >
                    Back
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isLoading || !isFullFormComplete}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Adding Member..." : "Add Member"}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}