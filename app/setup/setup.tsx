"use client"
import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Image as ImageIcon } from 'lucide-react'

import { useRouter } from 'next/navigation';

interface OrganizationType {
  id: string
  connectAccountId: string
  customerId: string
  name: string
  organizationLogo: File | null
  logoPreview: string
  organizationEmail: string
  organizationPhone: string
  address: string
  city: string
  zipCode: string
  state: string
  country: string
  email: string
  phone: string
}

interface OrganizationSetupProps {
  onComplete: (organization: OrganizationType) => void;
  onClose: () => void;
  persistent?: boolean;
}

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  // Add more countries as needed
]

const OrganizationSetup = ({ onComplete, onClose, persistent = false }: OrganizationSetupProps) => {
  const [open, setOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<Partial<OrganizationType>>({
    logoPreview: '',
    organizationLogo: null
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          organizationLogo: file,
          logoPreview: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === 1) {
      setCurrentStep(2)
    } else {
      router.push('/admin-dashboard')
     
      const completeFormData = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        connectAccountId: '',
        customerId: '',
      } as OrganizationType
      
      onComplete(completeFormData)
      setOpen(false)
      onClose()
    }
  }

  // Modified to prevent navigation if persistent is true
  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen && persistent) {
      // If persistent, don't allow closing
      return;
    }
    
    // Otherwise, proceed with normal close behavior
    setOpen(isOpen);
    if (!isOpen) {
      router.push('/login');
      onClose();
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center pb-6">
        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
        <p className="text-gray-500">Lets start with your organizations basic details</p>
      </div>

      <div className="space-y-6">
        <div className="mx-auto w-40 h-40 relative">
          <div 
            className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {formData.logoPreview ? (
              <img 
                src={formData.logoPreview} 
                alt="Logo preview" 
                className="w-full h-full object-cover rounded-lg"
              />
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
            onChange={handleFileUpload}
          />
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter organization name"
              onChange={handleInputChange}
              className="border border-gray-200"
              value={formData.name || ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationEmail">Email</Label>
            <Input
              id="organizationEmail"
              name="organizationEmail"
              type="email"
              placeholder="organization@example.com"
              onChange={handleInputChange}
              className="border border-gray-200"
              value={formData.organizationEmail || ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationPhone">Phone</Label>
            <Input
              id="organizationPhone"
              name="organizationPhone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              onChange={handleInputChange}
              className="border border-gray-200"
              value={formData.organizationPhone || ''}
            />
          </div>
        </div>
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
              <SelectTrigger>
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
      <DialogContent className="sm:max-w-[600px] bg-white rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-blue-700 text-center">
            {currentStep === 1 ? 'Create Organization' : 'Organization Details'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6">
          {currentStep === 1 ? renderStep1() : renderStep2()}

          <div className="flex justify-between mt-8">
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {currentStep === 1 ? 'Next' : 'Create Organization'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default OrganizationSetup