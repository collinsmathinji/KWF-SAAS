"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Building2, Mail, Phone, MapPin, Globe, Camera, Save, User, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

// Modified schema to match the backend model
const organizationFormSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  description: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  website: z.string().url("Invalid website URL").optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  language: z.string().optional(),
  organizationLogo: z.instanceof(File).optional(),
})

type OrganizationFormValues = z.infer<typeof organizationFormSchema>

export default function OrganizationProfile({ organizationId }: { organizationId: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("basic-info")
  const [loading, setLoading] = useState(false)
  const [organization, setOrganization] = useState<Record<string, any> | null>(null)
  const [lastUpdated, setLastUpdated] = useState("")

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: "",
      description: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      language: "en",
    },
  })

  // Fetch organization data on component mount
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/organization/${organizationId}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch organization data")
        }
        
        const data = await response.json()
        setOrganization(data)
        
        // Set form values from fetched data
        form.reset({
          name: data.name || "",
          description: data.description || "",
          email: data.email || "",
          phone: data.phone || "",
          website: data.website || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          language: data.language || "en",
          zipCode: data.zipCode || "",
        })
        
        // Format the last updated date
        if (data.updatedAt) {
          const date = new Date(data.updatedAt);
          setLastUpdated(date.toLocaleString())
        }
      } catch (error) {
        console.error("Error fetching organization:", error)
        toast({
          title: "Error",
          description: "Failed to load organization data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (organizationId) {
      fetchOrganization()
    }
  }, [organizationId, form])

  async function onSubmit(data: OrganizationFormValues) {
    try {
      setLoading(true)
      
      // Prepare the update data
      const updateData = {
        id: organizationId,
        ...data
      }

      // Call the updateOrganization function
      await updateOrganization(updateData)
      
      // Update the UI
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Organization updated successfully",
      })
      
      // Update the last updated timestamp
      setLastUpdated(new Date().toLocaleString())
      
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Function to handle logo file selection
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      form.setValue("organizationLogo", file)
    }
  }

  // Implementation of updateOrganization function
  async function updateOrganization(data: { [x: string]: any; name?: any; email?: any; phone?: any; address?: any; city?: any; state?: any; zipCode?: any; country?: any; description?: any; website?: any; language?: any; organizationLogo?: any; id: any }) {
    try {
      const { id, ...updateData } = data
      let logoUrl = null

      if (updateData.organizationLogo instanceof File) {
        const imageFormData = new FormData()
        imageFormData.append("File", updateData.organizationLogo)
  
        const uploadResponse = await fetch("http://localhost:5000/admin/uploads/single", {
          method: "POST",
          body: imageFormData,
        })
  
        if (!uploadResponse.ok) {
          throw new Error("Failed to upload organization logo")
        }
        const uploadData = await uploadResponse.json()
        logoUrl = uploadData.url
        delete updateData.organizationLogo
      }
      
      const organizationFormData = new FormData()
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          organizationFormData.append(key, String(value))
        }
      })
      
      if (logoUrl) {
        organizationFormData.append("logoUrl", logoUrl)
      }
  
 
      const response = await fetch(`/api/organization/update/${id}`, {
        method: "PUT",
        body: organizationFormData,
      })
  
      const responseData = await response.json()
  
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update organization")
      }
  
      // Update the local organization state
      setOrganization(organization ? {
        ...organization,
        ...updateData,
        logoUrl: logoUrl || organization.logoUrl,
        updatedAt: new Date().toISOString(),
      } : null)
      
      return responseData
    } catch (error) {
      console.error("Error updating organization:", error)
      throw error
    }
  }

  if (loading && !organization) {
    return (
      <div className="container mx-auto p-6 flex justify-center">
        <div className="text-center">
          <p>Loading organization data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Organization Profile</h1>
        <p className="text-gray-600">Manage your organization's information</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic-info" className="gap-2">
                <User className="h-4 w-4" />
                Basic Information
              </TabsTrigger>
              <TabsTrigger value="address-info" className="gap-2">
                <Map className="h-4 w-4" />
                Address Information
              </TabsTrigger>
            </TabsList>

            {/* Page 1: Basic Information */}
            <TabsContent value="basic-info" className="space-y-6 mt-6">
              {/* Organization Logo Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Organization Logo</CardTitle>
                  <CardDescription>Your organization's visual identity</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={organization?.logoUrl || "/placeholder.svg"} />
                    <AvatarFallback>{organization?.name?.substring(0, 2).toUpperCase() || "AC"}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div>
                      <input
                        type="file"
                        id="logo-upload"
                        className="hidden"
                        accept="image/*"
                        disabled={!isEditing}
                        onChange={handleLogoChange}
                      />
                      <Button 
                        variant="outline" 
                        className="gap-2" 
                        disabled={!isEditing}
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <Camera className="h-4 w-4" />
                        Change Logo
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Recommended size: 256x256px. Max file size: 5MB.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Details Card */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Basic Details</CardTitle>
                      <CardDescription>Essential organization information</CardDescription>
                    </div>
                    <Button 
                      variant={isEditing ? "ghost" : "default"} 
                      onClick={() => setIsEditing(!isEditing)}
                      disabled={loading}
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} className="pl-9" disabled={!isEditing} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} type="email" className="pl-9" disabled={!isEditing} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} className="pl-9" disabled={!isEditing} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} className="pl-9" disabled={!isEditing} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} disabled={!isEditing} className="min-h-[100px]" />
                        </FormControl>
                        <FormDescription>Brief description of your organization</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Language</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isEditing && (
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("address-info")}
                      >
                        Next: Address Information
                      </Button>
                      <Button type="submit" className="gap-2" disabled={loading}>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Page 2: Address Information */}
            <TabsContent value="address-info" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Address Information</CardTitle>
                      <CardDescription>Location details for your organization</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button 
                        variant="default" 
                        onClick={() => setIsEditing(true)}
                        disabled={loading}
                      >
                        Edit Address
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} className="pl-9" disabled={!isEditing} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP/Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("basic-info")}
                      >
                        Back to Basic Information
                      </Button>
                      <Button type="submit" className="gap-2" disabled={loading}>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Last Updated Info */}
              {lastUpdated && (
                <Alert>
                  <AlertDescription className="text-sm text-muted-foreground">
                    Last updated: {lastUpdated}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}