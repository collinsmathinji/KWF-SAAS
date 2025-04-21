"use client"
import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Image as ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react'
import { updateOnBoarding } from "@/lib/organization"
import { uploadOrganizationLogo } from "@/lib/organization"
import { useRouter } from 'next/navigation'
import { toast } from "@/components/ui/use-toast"

interface OrganizationType {
  id?: string
  connectAccountId?: string
  customerId?: string
  logoUrl?: string | null
  name: string
  organizationLogo?: File | null
  logoPreview?: string
  email: string
  phone?: string
  address?: string
  address2?: string
  city?: string
  zipCode?: string
  state?: string
  country?: string
}

interface OrganizationSetupProps {
  persistent?: boolean;
}

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
]

const OrganizationSetup = ({ persistent = false }: OrganizationSetupProps) => {
  const [open, setOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<Partial<OrganizationType>>({
    logoPreview: '',
    organizationLogo: null,
    logoUrl: null
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const router = useRouter()

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))

    try {
      const uploadedUrl = await uploadOrganizationLogo(file)
      console.log("Uploaded URL:", uploadedUrl)
      setLogoUrl(uploadedUrl)
    } catch (err) {
      console.error("Upload failed:", err)
      toast({
        title: "Error",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      logoUrl: logoUrl
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!formData.name || !formData.email) {
        throw new Error("Organization name and email are required");
      }
      
      // Convert to regular object with all form fields
      const dataToSubmit = {
        ...formData,
        logoUrl: logoUrl
      };
      
      await updateOnBoarding(dataToSubmit);
      toast({
        title: "Success",
        description: "Organization created successfully!",
        variant: "default"
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to submit:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create organization",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen && persistent) {
      // If persistent, don't allow closing
      return
    }
    
    // Otherwise, proceed with normal close behavior
    setOpen(isOpen)
    if (!isOpen) {
      router.push('/login')
    }
  }

  const nextStep = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in organization name and email before proceeding.",
        variant: "destructive"
      })
      return
    }
    setCurrentStep(2)
  }

  const prevStep = () => {
    setCurrentStep(1)
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center pb-6">
        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
        <p className="text-gray-500">Let's start with your organization's basic details</p>
      </div>

      <div className="space-y-6">
        <div className="mx-auto w-40 h-40 relative">
          <div 
            className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="w-full h-full">
                <img src={previewUrl} alt="Logo Preview" className="w-full h-full object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                  <p className="text-white text-sm font-medium">Change Logo</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload Logo
                </span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter organization name"
              onChange={handleInputChange}
              className="border border-gray-200"
              value={formData.name || ''}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="organization@example.com"
              onChange={handleInputChange}
              className="border border-gray-200"
              value={formData.email || ''}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              onChange={handleInputChange}
              className="border border-gray-200"
              value={formData.phone || ''}
            />
          </div>
        </div>
        <Button
                type="button"
                className="bg-blue-600 text-white hover:bg-blue-700 ml-auto flex items-center gap-2"
                onClick={nextStep}
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center pb-6">
        <h2 className="text-xl font-semibold text-gray-900">Location Details</h2>
        <p className="text-gray-500">Where is your organization located?</p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            name="address"
            placeholder="Enter street address"
            onChange={handleInputChange}
            className="border border-gray-200"
            value={formData.address || ''}
          />
        </div>
      
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="Enter city"
              onChange={handleInputChange}
              className="border border-gray-200"
              value={formData.city || ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              name="state"
              placeholder="Enter state"
              onChange={handleInputChange}
              className="border border-gray-200"
              value={formData.state || ''}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP/Postal Code</Label>
            <Input
              id="zipCode"
              name="zipCode"
              placeholder="Enter ZIP code"
              onChange={handleInputChange}
              className="border border-gray-200"
              value={formData.zipCode || ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select 
              onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
              value={formData.country}
            >
              <SelectTrigger className="border border-gray-200">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-lg p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-blue-700 text-center">
            {currentStep === 1 ? 'Create Organization' : 'Organization Details'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6">
          {currentStep === 1 ? renderStep1() : renderStep2()}

          <div className="flex justify-between mt-8">
            {currentStep === 2 && (
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={prevStep}
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            )}
            
         
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Organization"}
              </Button>
         
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <span className="inline-flex items-center">
              Step {currentStep} of 2
              <span className="ml-2 flex gap-1">
                <span className={`h-2 w-2 rounded-full ${currentStep === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
                <span className={`h-2 w-2 rounded-full ${currentStep === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
              </span>
            </span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default OrganizationSetup