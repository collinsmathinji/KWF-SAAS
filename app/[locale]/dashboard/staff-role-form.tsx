"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Bell, Users, Building2, Calendar, Shield, Eye, Plus, Edit, Trash2, Settings, CheckCircle2, Circle, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react"
import { getAvailablePermissions, createStaffRole } from "@/lib/staffRole"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useSession } from "next-auth/react"
import { StaffRole } from "@/lib/staffRole"
import { toast } from "@/components/ui/use-toast"
import type { Permission } from "@/types/permissions"

interface StaffRoleFormProps {
  onClose: () => void
  onRoleCreated: (role: StaffRole) => void
}

interface FormData {
  roleName: string
  description: string
  selectedCategories: string[]
  scope: {
    field: string
    value: string
  }
}

// Enhanced permission descriptions for non-technical users
const getHumanFriendlyPermission = (permission: Permission) => {
  const permissionMap: Record<string, Record<string, { 
    title: string, 
    description: string, 
    icon: React.ComponentType<any>,
    category: string,
    risk: 'low' | 'medium' | 'high'
  }>> = {
    notification: {
      'GET /notifications': {
        title: 'View Notifications',
        description: 'Can see all system notifications and alerts',
        icon: Eye,
        category: 'Communication',
        risk: 'low'
      },
      'POST /notifications': {
        title: 'Send Notifications',
        description: 'Can create and send notifications to users',
        icon: Plus,
        category: 'Communication',
        risk: 'medium'
      },
      'PUT /notifications': {
        title: 'Edit Notifications',
        description: 'Can modify existing notifications',
        icon: Edit,
        category: 'Communication',
        risk: 'medium'
      },
      'DELETE /notifications': {
        title: 'Delete Notifications',
        description: 'Can remove notifications from the system',
        icon: Trash2,
        category: 'Communication',
        risk: 'high'
      }
    },
    staff: {
      'GET /staff': {
        title: 'View Staff Members',
        description: 'Can see staff directory and member details',
        icon: Eye,
        category: 'Team Management',
        risk: 'low'
      },
      'POST /staff': {
        title: 'Add New Staff',
        description: 'Can invite and add new team members',
        icon: Plus,
        category: 'Team Management',
        risk: 'high'
      },
      'PUT /staff': {
        title: 'Edit Staff Details',
        description: 'Can update staff member information and roles',
        icon: Edit,
        category: 'Team Management',
        risk: 'high'
      },
      'DELETE /staff': {
        title: 'Remove Staff Members',
        description: 'Can deactivate or remove staff from the system',
        icon: Trash2,
        category: 'Team Management',
        risk: 'high'
      },
      'GET /staff/roles': {
        title: 'View Staff Roles',
        description: 'Can see all available staff roles and permissions',
        icon: Shield,
        category: 'Team Management',
        risk: 'low'
      },
      'POST /staff/roles': {
        title: 'Create Staff Roles',
        description: 'Can create new roles with custom permissions',
        icon: Plus,
        category: 'Team Management',
        risk: 'high'
      }
    },
    organization: {
      'GET /organization': {
        title: 'View Organization Info',
        description: 'Can access organization details and settings',
        icon: Eye,
        category: 'Administration',
        risk: 'low'
      },
      'PUT /organization': {
        title: 'Edit Organization',
        description: 'Can modify organization settings and information',
        icon: Edit,
        category: 'Administration',
        risk: 'high'
      },
      'GET /organization/settings': {
        title: 'View System Settings',
        description: 'Can access system configuration and preferences',
        icon: Settings,
        category: 'Administration',
        risk: 'low'
      },
      'PUT /organization/settings': {
        title: 'Manage System Settings',
        description: 'Can change system configuration and preferences',
        icon: Settings,
        category: 'Administration',
        risk: 'high'
      }
    },
    event: {
      'GET /events': {
        title: 'View Events',
        description: 'Can see all events and event details',
        icon: Eye,
        category: 'Event Management',
        risk: 'low'
      },
      'POST /events': {
        title: 'Create Events',
        description: 'Can create new events and activities',
        icon: Plus,
        category: 'Event Management',
        risk: 'medium'
      },
      'PUT /events': {
        title: 'Edit Events',
        description: 'Can modify event details, dates, and settings',
        icon: Edit,
        category: 'Event Management',
        risk: 'medium'
      },
      'DELETE /events': {
        title: 'Delete Events',
        description: 'Can remove events from the system',
        icon: Trash2,
        category: 'Event Management',
        risk: 'high'
      },
      'GET /events/registrations': {
        title: 'View Event Registrations',
        description: 'Can see who has registered for events',
        icon: Eye,
        category: 'Event Management',
        risk: 'low'
      },
      'POST /events/registrations': {
        title: 'Manage Registrations',
        description: 'Can register people for events',
        icon: Plus,
        category: 'Event Management',
        risk: 'medium'
      }
    }
  }

  const key = `${permission.method} ${permission.endpoint}`
  const modulePerms = permissionMap[permission.module.toLowerCase()]
  
  if (modulePerms && modulePerms[key]) {
    return modulePerms[key]
  }

  // Fallback for unmapped permissions
  const methodMap: Record<string, string> = {
    GET: "View",
    POST: "Create",
    PUT: "Update", 
    DELETE: "Delete"
  }
  
  const action = methodMap[permission.method] || permission.method
  const resource = permission.endpoint.split("/").pop() || permission.endpoint
  
  return {
    title: `${action} ${resource.replace(/([A-Z])/g, " $1")}`,
    description: `Can ${action.toLowerCase()} ${resource.toLowerCase()} in the system`,
    icon: Eye,
    category: 'General',
    risk: 'medium' as const
  }
}

// Helper function to get icon for module
const getModuleIcon = (module: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    notification: Bell,
    staff: Users,
    organization: Building2,
    event: Calendar
  }
  return icons[module.toLowerCase()] || Users
}

// Get risk color
const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
  switch (risk) {
    case 'low': return 'bg-green-100 text-green-800 border-green-200'
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'high': return 'bg-red-100 text-red-800 border-red-200'
  }
}

const getRiskIcon = (risk: 'low' | 'medium' | 'high') => {
  switch (risk) {
    case 'low': return CheckCircle2
    case 'medium': return Circle
    case 'high': return AlertCircle
  }
}

export default function StaffRoleForm({ onClose, onRoleCreated }: StaffRoleFormProps) {
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<FormData>({
    roleName: "",
    description: "",
    selectedCategories: [],
    scope: {
      field: "",
      value: ""
    }
  })
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = useCallback(() => {
    if (!isLoading && !isSubmitting) {
      onClose();
    }
  }, [isLoading, isSubmitting, onClose]);

  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoading(true)
      try {
        const permissions = await getAvailablePermissions()
        setAvailablePermissions(permissions)
      } catch (error) {
        console.error('Error fetching permissions:', error)
        toast({
          title: "Error",
          description: "Failed to fetch available permissions. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPermissions()
  }, [])

  type FormDataKeys = keyof Omit<FormData, 'scope'>
  
  const handleInputChange = (field: FormDataKeys, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleScopeChange = (field: 'field' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      scope: {
        ...prev.scope,
        [field]: value
      }
    }))
  }

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    const module = permission.module
    if (!acc[module]) {
      acc[module] = []
    }
    acc[module].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  const handlePermissionToggle = (permission: Permission, checked: boolean) => {
    setSelectedPermissions(prev => {
      if (checked) {
        return [...prev, permission]
      } else {
        return prev.filter(
          p => !(p.module === permission.module && 
                p.endpoint === permission.endpoint && 
                p.method === permission.method)
        )
      }
    })
  }

  const isPermissionSelected = (permission: Permission): boolean => {
    return selectedPermissions.some(
      p => p.module === permission.module && 
          p.endpoint === permission.endpoint && 
          p.method === permission.method
    )
  }

  const handleSubmit = async () => {
    if (!session?.user?.organizationId) {
      toast({
        title: "Error",
        description: "No organization ID found. Please try logging in again.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const newRole = await createStaffRole({
        roleName: formData.roleName,
        description: formData.description,
        permissions: selectedPermissions,
        organizationId: Number(session.user.organizationId),
        isDeleted: false,
        createdBy: session.user.email || 'SYSTEM',
        createdByUserType: 'ADMIN',
        scope: formData.scope.field && formData.scope.value ? formData.scope : undefined
      })
      
      toast({
        title: "Success",
        description: "Staff role created successfully",
      })
      
      onRoleCreated(newRole)
      onClose()
    } catch (error) {
      console.error("Error creating staff role:", error)
      toast({
        title: "Error",
        description: "Failed to create staff role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.roleName.trim() !== "" && formData.description.trim() !== ""
      case 2:
        return formData.selectedCategories.length > 0
      case 3:
        return selectedPermissions.length > 0
      default:
        return false
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50/90 via-blue-50/90 to-indigo-50/90 backdrop-blur-sm flex items-center justify-center">
      <div className="w-[900px] h-[700px] bg-white rounded-xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Create New Staff Role</h1>
            <Button 
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isLoading || isSubmitting}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center gap-4">
            {[
              "Basic Information",
              "Select Categories",
              "Configure Access"
            ].map((stepName, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    index + 1 === currentStep
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : index + 1 < currentStep
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}
                >
                  {index + 1 < currentStep ? '✓' : index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-24 h-0.5 mx-2 ${
                    index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-6 overflow-y-auto">
            {currentStep === 1 ? (
              // Step 1: Basic Information (Fixed height, no scroll needed)
              <div className="h-full flex flex-col justify-center max-w-2xl mx-auto">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
                  <p className="text-gray-600 mb-6">
                    Start by providing the basic details for this staff role.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="roleName" className="text-base">Role Name *</Label>
                    <Input
                      id="roleName"
                      value={formData.roleName}
                      onChange={(e) => handleInputChange("roleName", e.target.value)}
                      placeholder="e.g., Event Manager, Content Editor"
                      className="h-12"
                    />
                    <p className="text-sm text-gray-500">Choose a clear, descriptive name for this role</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base">Role Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe the purpose and responsibilities..."
                      className="min-h-[150px] resize-none"
                    />
                    <p className="text-sm text-gray-500">Explain what this role does and its main responsibilities</p>
                  </div>
                </div>
              </div>
            ) : currentStep === 2 ? (
              // Step 2: Category Selection
              <div className="h-full">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Select Categories</h2>
                  <p className="text-gray-600">
                    Choose the categories of permissions this role should have access to.
                  </p>
                </div>
                <ScrollArea className="h-[calc(100%-100px)]">
                  <div className="grid grid-cols-2 gap-4 pr-4">
                    {Object.keys(groupedPermissions).map((module) => {
                      const Icon = getModuleIcon(module)
                      const isSelected = formData.selectedCategories.includes(module)
                      
                      return (
                        <button
                          key={module}
                          onClick={() => {
                            const newCategories = isSelected
                              ? formData.selectedCategories.filter(c => c !== module)
                              : [...formData.selectedCategories, module]
                            handleInputChange("selectedCategories", newCategories)
                          }}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium capitalize">{module}</p>
                              <p className="text-sm text-gray-500">
                                {groupedPermissions[module].length} permissions
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              // Step 3: Permission Configuration and Scope
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Configure Access</h2>
                  <p className="text-gray-600">
                    Select specific permissions and optionally set access scope.
                  </p>
                </div>
                <Tabs defaultValue="permissions" className="flex-1 flex flex-col">
                  <TabsList className="w-full flex-wrap h-auto p-1 bg-gray-100/80">
                    <TabsTrigger value="permissions" className="flex items-center gap-2 px-4 py-3">
                      <Shield className="h-4 w-4" />
                      <span>Permissions</span>
                    </TabsTrigger>
                    <TabsTrigger value="scope" className="flex items-center gap-2 px-4 py-3">
                      <Building2 className="h-4 w-4" />
                      <span>Scope</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="permissions" className="flex-1 mt-4">
                    <ScrollArea className="h-[calc(100%-20px)]">
                      <div className="space-y-4 pr-4">
                        {formData.selectedCategories.map((module) => (
                          <div key={module} className="space-y-4">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold capitalize">{module}</h3>
                            </div>
                            {groupedPermissions[module]?.map((permission, index) => {
                              const permInfo = getHumanFriendlyPermission(permission)
                              const isSelected = isPermissionSelected(permission)
                              const RiskIcon = getRiskIcon(permInfo.risk)
                              
                              return (
                                <div
                                  key={index}
                                  onClick={() => handlePermissionToggle(permission, !isSelected)}
                                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                    isSelected
                                      ? 'border-blue-300 bg-blue-50/50'
                                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-start gap-4">
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) => handlePermissionToggle(permission, checked === true)}
                                      className="mt-1"
                                    />
                                    <div>
                                      <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-medium text-gray-900">
                                          {permInfo.title}
                                        </h4>
                                        <div className={`px-2 py-1 rounded text-xs ${
                                          permission.method === 'GET' ? 'bg-green-100 text-green-700' :
                                          permission.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                                          permission.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                                          'bg-red-100 text-red-700'
                                        }`}>
                                          {permission.method}
                                        </div>
                                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getRiskColor(permInfo.risk)}`}>
                                          <RiskIcon className="h-3 w-3" />
                                          <span className="capitalize">{permInfo.risk} Risk</span>
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        {permInfo.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="scope" className="flex-1 mt-4">
                    <div className="max-w-2xl mx-auto">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Access Scope (Optional)</h3>
                          <p className="text-gray-600 mb-4">
                            Limit this role's access to specific areas or regions. Leave empty for unrestricted access.
                          </p>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="scopeField" className="text-base">Scope Field</Label>
                            <Input
                              id="scopeField"
                              placeholder="e.g., countries, departments, regions"
                              value={formData.scope.field}
                              onChange={(e) => handleScopeChange('field', e.target.value)}
                              className="h-12"
                            />
                            <p className="text-sm text-gray-500">The type of scope to apply (e.g., countries)</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="scopeValue" className="text-base">Scope Value</Label>
                            <Input
                              id="scopeValue"
                              placeholder="e.g., US,UK,AU or Sales,Marketing"
                              value={formData.scope.value}
                              onChange={(e) => handleScopeChange('value', e.target.value)}
                              className="h-12"
                            />
                            <p className="text-sm text-gray-500">Comma-separated list of allowed values</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t bg-gray-50/80 rounded-b-xl">
          <div className="flex justify-between">
            {currentStep > 1 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev - 1)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Step
              </Button>
            ) : (
              <Button
                onClick={handleClose}
                variant="outline"
              >
                Cancel
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Next Step
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !canProceed()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating Role...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Create Role
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}