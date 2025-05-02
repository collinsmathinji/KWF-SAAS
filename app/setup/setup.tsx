"use client"
import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Image as ImageIcon, ArrowLeft, ArrowRight, AlertCircle, ExternalLink } from 'lucide-react'
import { uploadOrganizationLogo } from "@/lib/organization"
import { useRouter } from 'next/navigation'
import { toast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"

// Import the updated function
import { updateOnBoarding } from "@/lib/organization"

interface OrganizationType {
  id?: string
  stripeAccountId?: string
  stripeCustomerId?: string
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

interface OrganizationTwoType {
  name: string | null
  logoUrl: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  zipCode: string | null
  state: string | null
  country: string | null
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
  // Get the session
  const { data: session, status, update: updateSession } = useSession()
  
  const [open, setOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stripeConsent, setStripeConsent] = useState(false)
  const [stripeOnboardingUrl, setStripeOnboardingUrl] = useState<string | null>(null)
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [stripeTabOpened, setStripeTabOpened] = useState(false)
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

  // Modified effect to handle Stripe onboarding URL
  useEffect(() => {
    if (stripeOnboardingUrl && showSuccessDialog && !stripeTabOpened) {
      // We'll use this variable to track if we've attempted to open the tab
      const openStripeTab = () => {
        try {
          // Attempt to open the tab
          const newWindow = window.open(stripeOnboardingUrl, '_blank');
          
          // Check if the window was blocked
          if (newWindow === null || typeof newWindow === 'undefined') {
            console.warn("Stripe window was blocked by the browser's popup blocker");
            // We don't set stripeTabOpened to true here, so the manual button remains prominent
          } else {
            // Successfully opened the tab
            setStripeTabOpened(true);
          }
        } catch (error) {
          console.error("Error opening Stripe tab:", error);
        }
      };
      
      // Small delay to ensure the success dialog is visible first
      const timer = setTimeout(() => {
        openStripeTab();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [stripeOnboardingUrl, showSuccessDialog, stripeTabOpened]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Update session after successful onboarding to refresh isOnboarded status
  const updateUserSession = async () => {
    try {
      // This will trigger a session refresh
      await updateSession();
      console.log("Session updated after onboarding");
    } catch (error) {
      console.error("Failed to update session:", error);
    }
  };

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
  async function updateUser() {
    const userId = localStorage.getItem("userId");
    if (!userId) throw new Error("User ID not found");
  
    try {
      const userResponse = await fetch(`/api/user/update-profile`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isOnboarded: true,
        }),
      });
      
      // Check if response is OK before parsing JSON
      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        console.log("userErrorResponse", errorData);
        throw new Error("Failed to update user onboarded status");
      }
      
      // Now parse the JSON response
      const userData = await userResponse.json();
      console.log("userResponse", userData);
      localStorage.setItem("isOnboarded", "true");
      return userData;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripeConsent) {
      toast({
        title: "Consent Required",
        description: "You must agree to create a Stripe account to proceed.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!formData.name || !formData.email) {
        throw new Error("Organization name and email are required");
      }
      
      // Convert to regular object with all form fields
      const dataToSubmit: OrganizationTwoType = {
        name: formData.name || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        city: formData.city || null,
        zipCode: formData.zipCode || null,
        state: formData.state || null,
        country: formData.country || null,
        logoUrl: logoUrl
      };
      
      // Submit the organization data and get back the response
      const response = await updateOnBoarding(dataToSubmit);
      console.log("Organization and Stripe setup response:", response);
    if(response.data) {
     const userRespsonse2=await updateUser()
     console.log("users",userRespsonse2)
    }
      
      // Check if we have a successful response with Stripe data
      if (response && response.data) {
        // Store the Stripe account ID and onboarding URL
        const stripeAccount = response.data.stripeAccountId || null;
        const stripeUrl = response.data.onboardingUrl || null;
        
        setStripeAccountId(stripeAccount);
        setStripeOnboardingUrl(stripeUrl);
        
        console.log("Stripe URL received:", stripeUrl);
        
        // Store Stripe account ID in localStorage if available
        if (stripeAccount && typeof window !== 'undefined') {
          const orgData = JSON.parse(localStorage.getItem("currentOrganization") || "{}");
          orgData.stripeAccountId = stripeAccount;
          localStorage.setItem("currentOrganization", JSON.stringify(orgData));
        }
        
        // Show success dialog regardless of whether we have a Stripe URL
        setShowSuccessDialog(true);
        
        // Toast notification for better feedback
        toast({
          title: "Organization Created",
          description: "Your organization was created successfully. Please complete the Stripe onboarding process.",
          variant: "default"
        });
      } else {
        // Successful organization creation but without Stripe data
        toast({
          title: "Organization Created",
          description: "Your organization was created successfully, but Stripe account setup couldn't be initialized.",
          variant: "default"
        });
        // Handle redirect here
        router.refresh(); // Refresh the page to get updated session
        router.push("/dashboard");
      }
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
      return;
    }
    
    // Allow closing if we're showing the success dialog
    if (showSuccessDialog) {
      setOpen(isOpen);
      if (!isOpen) {
        router.refresh(); // Refresh the page to get updated session
        router.push('/dashboard');
      }
      return;
    }
    
    // Otherwise, proceed with normal close behavior
    setOpen(isOpen);
    if (!isOpen && !showSuccessDialog) {
      router.push('/login');
    }
  }

  // Explicitly handle opening the Stripe tab
  const openStripeOnboarding = () => {
    if (stripeOnboardingUrl) {
      try {
        window.open(stripeOnboardingUrl, '_blank', 'noopener,noreferrer');
        setStripeTabOpened(true);
        toast({
          title: "Stripe Setup Opened",
          description: "Please complete the Stripe onboarding in the new tab.",
          variant: "default"
        });
      } catch (error) {
        console.error("Error manually opening Stripe tab:", error);
        toast({
          title: "Error",
          description: "Failed to open Stripe setup. Please try again or check your browser settings.",
          variant: "destructive"
        });
      }
    }
  };

  const handleContinueToDashboard = () => {
    setOpen(false);
    router.refresh(); // Refresh the page to get updated session
    router.push('/dashboard');
  };

  const nextStep = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in organization name and email before proceeding.",
        variant: "destructive"
      })
      return;
    }
    setCurrentStep(2);
  }

  const prevStep = () => {
    setCurrentStep(1);
  }

  // Rest of the component remains the same...
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

      {/* Stripe Consent Checkbox */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start space-x-3">
          <div className="flex items-center h-5 mt-1">
            <Checkbox 
              id="stripe-consent" 
              checked={stripeConsent}
              onCheckedChange={(checked) => setStripeConsent(checked === true)}
            />
          </div>
          <div className="flex flex-col">
            <Label 
              htmlFor="stripe-consent" 
              className="font-medium text-gray-900"
            >
              Create Stripe Account
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              I agree to create a Stripe account for my organization which will be used for payment processing. By checking this box, I understand that I will be redirected to Stripe's website to complete the account setup after organization creation.
            </p>
          </div>
        </div>
        {!stripeConsent && (
          <div className="mt-2 flex items-center text-amber-600 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>You must agree to create a Stripe account to proceed</span>
          </div>
        )}
      </div>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="pb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mt-4">Organization Created Successfully!</h2>
        <p className="text-gray-500 mt-2">
          {stripeTabOpened ? 
            "A new tab has been opened to complete your Stripe account setup." : 
            "Please click the button below to continue with your Stripe account setup."}
          {" "}Complete the Stripe onboarding process to enable payments for your organization.
        </p>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-gray-700">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
          <span className="font-medium">Important:</span>
        </div>
        <p className="mt-1 ml-7">
          {stripeTabOpened ? 
            "If you accidentally closed the Stripe setup tab, you can reopen it using the button below." : 
            "Your browser may have blocked the automatic popup. Please use the button below to open the Stripe setup."}
        </p>
      </div>

      <div className="flex flex-col space-y-3">
        {stripeOnboardingUrl && (
          <Button
            type="button"
            className={`w-full ${!stripeTabOpened ? 'bg-blue-600 text-white hover:bg-blue-700 animate-pulse' : 'bg-blue-500 text-white hover:bg-blue-600'} flex items-center justify-center gap-2`}
            onClick={openStripeOnboarding}
          >
            {stripeTabOpened ? "Reopen" : "Open"} Stripe Setup <ExternalLink className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleContinueToDashboard}
        >
          Continue to Dashboard
        </Button>
      </div>
    </div>
  )

  // Show loading state if session is loading
  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-lg p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-blue-700 text-center">
            {showSuccessDialog ? 'Success' : currentStep === 1 ? 'Create Organization' : 'Organization Details'}
          </DialogTitle>
        </DialogHeader>

        {showSuccessDialog ? (
          renderSuccessStep()
        ) : (
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
              
              {currentStep === 2 && (
                <Button
                  type="submit"
                  className={`bg-blue-600 text-white hover:bg-blue-700 ${!stripeConsent ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting || !stripeConsent}
                >
                  {isSubmitting ? "Creating..." : "Create Organization"}
                </Button>
              )}
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
        )}
      </DialogContent>
    </Dialog>
  )
}

export default OrganizationSetup