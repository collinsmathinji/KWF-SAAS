"use client"

import { useState, useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Building2, Mail, Phone, MapPin, Globe, Camera, Save, User, Map, Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { uploadOrganizationLogo } from "@/lib/organization"

// Modified schema to match the backend model
const organizationFormSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  description: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  language: z.string().optional(),
  organizationLogo: z.instanceof(File).optional(),
})

type OrganizationFormValues = z.infer<typeof organizationFormSchema>

export default function OrganizationProfile({ organisationDetails }) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("basic-info")
  const [loading, setLoading] = useState(false)
  const [organization, setOrganization] = useState(organisationDetails || null)
  const [lastUpdated, setLastUpdated] = useState("")
  const [previewUrl, setPreviewUrl] = useState(null)
  const [logoUrl, setLogoUrl] = useState(organisationDetails?.logoUrl || null)
  const fileInputRef = useRef(null)

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const form = useForm({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: organization?.name || "",
      description: organization?.description || "",
      email: organization?.email || "",
      phone: organization?.phone || "",
      address: organization?.address || "",
      city: organization?.city || "",
      state: organization?.state || "",
      zipCode: organization?.zipCode || "",
      country: organization?.country || "",
      language: organization?.language || "en",
    },
  })

  // Effect to initialize form with organization details
  useEffect(() => {
    if (organisationDetails) {
      setOrganization(organisationDetails);
      setLogoUrl(organisationDetails.logoUrl || null);
      
      // Set form values from organization data
      form.reset({
        name: organisationDetails.name || "",
        description: organisationDetails.description || "",
        email: organisationDetails.email || "",
        phone: organisationDetails.phone || "",
        address: organisationDetails.address || "",
        city: organisationDetails.city || "",
        state: organisationDetails.state || "",
        country: organisationDetails.country || "",
        language: organisationDetails.language || "en",
        zipCode: organisationDetails.zipCode || "",
      });
      
      // Format the last updated date
      if (organisationDetails.updatedAt) {
        setLastUpdated(formatDate(organisationDetails.updatedAt));
      }
    }
  }, [organisationDetails]);

  // Handle logo file selection
  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Set preview immediately for visual feedback
    setPreviewUrl(URL.createObjectURL(file))
    form.setValue("organizationLogo", file)

    try {
      // Upload the logo to get a URL
      const uploadedUrl = await uploadOrganizationLogo(file)
      setLogoUrl(uploadedUrl)
      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading logo:", error)
      toast({
        title: "Error",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function onSubmit(data) {
    try {
      setLoading(true)
      
      // Prepare the update data
      const updateData = {
        id: organization?.id,
        ...data,
        logoUrl: logoUrl
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

  // Implementation of updateOrganization function
  async function updateOrganization(data) {
    try {
      const { id, organizationLogo, ...updateData } = data
      
      const organizationFormData = new FormData()
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          organizationFormData.append(key, String(value))
        }
      })
  
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Loading organization data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Organization Profile</h1>
        <div className="flex items-center mt-2 text-gray-600">
          <p>Manage your organization's information</p>
          {organization?.isActive && (
            <Badge variant="outline" className="ml-4 bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Active
            </Badge>
          )}
        </div>
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
              <Card className="overflow-hidden border-2 border-gray-100 shadow-sm">
                <CardHeader className="bg-gray-50">
                  <CardTitle>Organization Logo</CardTitle>
                  <CardDescription>Your organization's visual identity</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 ring-4 ring-gray-100">
                      {/* Use preview URL if available, otherwise use the existing logo or placeholder */}
                      <AvatarImage src={previewUrl || logoUrl || "/placeholder.svg"} alt={organization?.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl font-bold">
                        {organization?.name?.substring(0, 2).toUpperCase() || "AC"}
                      </AvatarFallback>
                    </Avatar>
                    {(logoUrl || previewUrl) && (
                      <div className="absolute -bottom-2 -right-2">
                        <Badge className="bg-blue-500">Logo</Badge>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gray-800">{organization?.name}</h3>
                    <div className="space-y-2">
                      <div>
                        <input
                          type="file"
                          id="logo-upload"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          disabled={!isEditing}
                          onChange={handleLogoChange}
                        />
                        <Button 
                          variant="outline" 
                          className="gap-2" 
                          disabled={!isEditing}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-4 w-4" />
                          Change Logo
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">Recommended size: 256x256px. Max file size: 5MB.</p>
                    </div>
                  </div>
                </CardContent>
                {organization?.stripeCustomerId && (
                  <CardFooter className="bg-gray-50 text-sm text-gray-500 py-2">
                    Stripe Customer ID: {organization.stripeCustomerId}
                  </CardFooter>
                )}
              </Card>

              {/* Basic Details Card */}
              <Card className="border-2 border-gray-100 shadow-sm">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Basic Details</CardTitle>
                      <CardDescription>Essential organization information</CardDescription>
                    </div>
                    <Button 
                      variant={isEditing ? "ghost" : "default"} 
                      onClick={() => setIsEditing(!isEditing)}
                      disabled={loading}
                      className={isEditing ? "hover:bg-red-50 hover:text-red-600" : ""}
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Organization Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} className="pl-9 border-gray-300" disabled={!isEditing} />
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
                          <FormLabel className="font-medium">Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} type="email" className="pl-9 border-gray-300" disabled={!isEditing} />
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
                          <FormLabel className="font-medium">Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} className="pl-9 border-gray-300" disabled={!isEditing} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} disabled={!isEditing} className="min-h-[100px] border-gray-300" />
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
                        <FormLabel className="font-medium">Primary Language</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} className="border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Created/Updated Info */}
                  {!isEditing && organization?.createdAt && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-sm text-gray-500 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {formatDate(organization.createdAt)}</span>
                      </div>
                      {organization?.updatedAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Updated: {formatDate(organization.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {isEditing && (
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("address-info")}
                        className="gap-2"
                      >
                        <Map className="h-4 w-4" />
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
              <Card className="border-2 border-gray-100 shadow-sm">
                <CardHeader className="bg-gray-50">
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
                <CardContent className="space-y-6 pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Street Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} className="pl-9 border-gray-300" disabled={!isEditing} />
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
                          <FormLabel className="font-medium">City</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} className="border-gray-300" />
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
                          <FormLabel className="font-medium">State/Province</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} className="border-gray-300" />
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
                          <FormLabel className="font-medium">ZIP/Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} className="border-gray-300" />
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
                          <FormLabel className="font-medium">Country</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("basic-info")}
                        className="gap-2"
                      >
                        <User className="h-4 w-4" />
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
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="flex items-center gap-2 text-sm text-blue-700">
                    <Calendar className="h-4 w-4" />
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