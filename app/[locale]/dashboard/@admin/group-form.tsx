"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Save, Upload, Info, X, HelpCircle, AlertCircle } from "lucide-react"
import { uploadOrganizationLogo } from "@/lib/organization"
import { createGroup } from "@/lib/group"
import { toast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define proper TypeScript interfaces
interface GroupFormProps {
  onClose?: () => void
}

interface FormData {
  organizationId: string | undefined
  name: string
  logo?: string
  logoPreview: string
  description: string
  groupType: string
}

interface GroupType {
  id: string  // Changed to string since API returns UUID
  name: string
  description: string
  behavior: string
  isActive: boolean
}

interface FormErrors {
  name?: string
  groupType?: string
}

const GroupForm = ({ onClose }: GroupFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    organizationId: undefined,
    name: "",
    logoPreview: "",
    description: "",
    groupType: "",
  })

  const [groupTypes, setGroupTypes] = useState<GroupType[]>([])
  const [loadingGroupTypes, setLoadingGroupTypes] = useState(true)
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [uploadingLogo, setUploadingLogo] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("basic")

  // Set organization ID from session when it's available
  useEffect(() => {
    if (session?.user?.organizationId) {
      setFormData((prev:any) => ({
        ...prev,
        organizationId: session.user.organizationId,
      }))
    }
  }, [session])

  // Add this useEffect to fetch group types
  useEffect(() => {
    const fetchGroupTypes = async () => {
      setLoadingGroupTypes(true)
      try {
        const response = await fetch('/api/groupType/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch group types')
        }

        const responseData = await response.json()
        
        // Navigate through the nested structure
        const groupTypesData = responseData.data?.data || []

        // Transform the data to match our needs
        const validGroupTypes = groupTypesData.map((item: any) => ({
          id: item.id,  // Keep as string since it's a UUID
          name: String(item.name),
          description: item.description || "No description available",
          behavior: item.behavior,
          isActive: Boolean(item.isActive)
        })).filter((type: GroupType) => type.isActive) // Only include active group types

        setGroupTypes(validGroupTypes)
      } catch (error) {
        console.error('Error fetching group types:', error)
        toast({
          title: "Error",
          description: "Failed to load group types",
          variant: "destructive",
        })
        // Fallback to empty array instead of default values since we want to match API structure
        setGroupTypes([])
      } finally {
        setLoadingGroupTypes(false)
      }
    }

    fetchGroupTypes()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFormData({
      ...formData,
      logoPreview: URL.createObjectURL(file),
    })

    try {
      setUploadingLogo(true)
      const uploadedUrl = await uploadOrganizationLogo(file)
      console.log("Uploaded URL:", uploadedUrl)

      setFormData((prevData) => ({
        ...prevData,
        logo: uploadedUrl,
      }))

      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      })
    } catch (err) {
      console.error("Upload failed:", err)
      toast({
        title: "Error",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingLogo(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Group name is required"
    }

    if (!formData.groupType) {
      newErrors.groupType = "Please select a group type"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage("") // Clear any previous success message

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Ensure organizationId is available
      if (!formData.organizationId && session?.user?.organizationId) {
        setFormData((prev:any) => ({
          ...prev,
          organizationId: session.user.organizationId,
        }))
      }

      // Double-check organizationId before submission
      if (!formData.organizationId) {
        throw new Error("Organization ID is required")
      }

      // Prepare the data to send to the API
      const groupData = {
        name: formData.name,
        logo: formData.logo,
        description: formData.description,
        organizationId: Number(formData.organizationId) || 0,
        groupTypeId: formData.groupType,
        addedBy: Number(session?.user?.id) || 0,
      }

      console.log("Submitting group data:", groupData)

      try {
        // Call the createGroup function
        const response = await createGroup(groupData as any) // Temporary type assertion until API types are updated
        console.log("Group created successfully:", response)
        setSuccessMessage("Group created successfully!")

        toast({
          title: "Success",
          description: "Group has been created successfully!",
        })

        // Clear form data and close after successful creation
        setTimeout(() => {
          if (onClose) {
            onClose()
          }
        }, 1500)
      } catch (apiError: any) {
        // Handle API-specific errors
        const errorMessage = apiError.response?.data?.message || apiError.message
        setSuccessMessage("") // Clear success message
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      // Handle other errors
      console.error("Error creating group:", error)
      const errorMessage = error?.message || "Failed to create group. Please try again."
      setSuccessMessage("") // Clear success message
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getGroupTypeDescription = (typeId: string) => {
    const type = groupTypes.find((t) => t.id.toString() === typeId)
    return type?.description || "No description available"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold text-blue-700">Create New Group</CardTitle>
            <CardDescription className="text-blue-600 mt-1">
              Fill out the form below to create a new group
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
            aria-label="Close form"
          >
            <X size={18} />
          </Button>
        </div>
      </CardHeader>

      <Tabs defaultValue="basic" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>
        </div>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6">
            {successMessage && (
              <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="basic" className="mt-0 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Group Name <span className="text-red-500">*</span>
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <HelpCircle className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">Choose a clear, descriptive name for your group</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter group name"
                    className={errors.name ? "border-red-300 focus-visible:ring-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo" className="text-sm font-medium">
                    Group Logo
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-md border bg-muted flex items-center justify-center overflow-hidden">
                      {formData.logoPreview ? (
                        <img
                          src={formData.logoPreview || "/placeholder.svg"}
                          alt="Logo Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Info className="h-6 w-6 mb-1" />
                          <span className="text-xs">No logo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById("logoUpload")?.click()}
                        disabled={uploadingLogo}
                      >
                        {uploadingLogo ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Logo
                          </>
                        )}
                      </Button>
                      <Input
                        type="file"
                        id="logoUpload"
                        name="logo"
                        onChange={handleLogoChange}
                        className="hidden"
                        accept="image/*"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Recommended size: 512×512px</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="groupType" className="text-sm font-medium">
                      Group Type <span className="text-red-500">*</span>
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <HelpCircle className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">The group type determines who can join and how</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {loadingGroupTypes ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    <>
                      {!loadingGroupTypes && Array.isArray(groupTypes) && groupTypes.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                          {groupTypes.map((type) => (
                            <div
                              key={type.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                formData.groupType === type.id.toString()
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
                              }`}
                              onClick={() => setFormData({ ...formData, groupType: type.id.toString() })}
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{type.name}</div>
                                {formData.groupType === type.id.toString() && (
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                    Selected
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4 text-gray-500">
                          No group types available
                        </div>
                      )}

                      {errors.groupType && (
                        <p className="text-sm text-red-500 flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.groupType}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="mt-0 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe the purpose of this group"
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide details about the group's purpose and activities
                  </p>
                </div>

                {/* Organization ID info */}
                <div className="rounded-md bg-blue-50 p-3">
                  <div className="flex">
                    <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Organization Information</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        This group will be created under organization ID: {formData.organizationId || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>

          <CardFooter className="flex justify-between border-t px-6 py-4 bg-gray-50 rounded-b-lg">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Group
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Tabs>
    </Card>
  )
}

export default GroupForm
