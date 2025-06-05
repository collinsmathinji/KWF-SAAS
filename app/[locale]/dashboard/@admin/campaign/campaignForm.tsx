"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Calendar,
  FileText,
  ImageIcon,
  ChevronRight,
  ChevronLeft,
  Tag,
  CreditCard,
  Check,
  AlertCircle,
  ArrowLeft,
  X,
  Upload,
  Plus,
  Info,
  DollarSign,
  Clock,
  Users,
  Target,
  Trash2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { uploadOrganizationLogo } from "@/lib/organization"
import { useSession } from "next-auth/react"

// Campaign categories
const CAMPAIGN_CATEGORIES = [
  { value: "charity", label: "Charity & Welfare", icon: "❤️" },
  { value: "education", label: "Education", icon: "📚" },
  { value: "medical", label: "Medical & Health", icon: "🏥" },
  { value: "community", label: "Community Development", icon: "🏘️" },
  { value: "environment", label: "Environment", icon: "🌱" },
  { value: "animal", label: "Animal Welfare", icon: "🐾" },
  { value: "arts", label: "Arts & Culture", icon: "🎨" },
  { value: "other", label: "Other", icon: "📋" },
]

// Component props interface
interface CampaignCreationFormProps {
  initialData?: {
    title?: string
    cause?: string
    category?: string
    donationType?: string
    targetAmount?: number
    coverImage?: string | null
    gallery?: string[]
    description?: string
    startDate?: string
    endDate?: string
    groupId?: string
    status?: string
    donorCount?: number
    currentAmount?: number
  }
  onSubmit?: (data: any) => Promise<void>
  isEditMode?: boolean
}

const CampaignCreationForm: React.FC<CampaignCreationFormProps> = ({ initialData, onSubmit, isEditMode = false }) => {
  const { data: session } = useSession()

  // Current form step
  const [currentStep, setCurrentStep] = useState(1)

  // Form data state
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    cause: initialData?.cause || "",
    category: initialData?.category || "",
    donationType: initialData?.donationType || "one-time",
    targetAmount: initialData?.targetAmount?.toString() || "",
    coverImage: initialData?.coverImage || null,
    gallery: initialData?.gallery || [],
    description: initialData?.description || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    groupId: initialData?.groupId || "",
  })

  // Payment Configuration (Step 3)
  const [stripeConnected, setStripeConnected] = useState(false)
  const [donationTiers, setDonationTiers] = useState([
    { amount: 25, label: "Basic Supporter" },
    { amount: 50, label: "Friend" },
    { amount: 100, label: "Champion" },
  ])
  const [minDonation, setMinDonation] = useState("5")
  const [enableRecurring, setEnableRecurring] = useState(true)

  // Form validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Form completion state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Stripe status state
  const [hasStripeAccount, setHasStripeAccount] = useState(false)
  const [isLoadingStripe, setIsLoadingStripe] = useState(true)
  const [stripeError, setStripeError] = useState<string | null>(null)

  // Check Stripe connection status
  const checkStripeConnection = async () => {
    try {
      const response = await fetch("/api/organization/stripe/accountStatus", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const data = await response.json()

      setHasStripeAccount(
        data.status === "SUCCESS" && data.data.isFullyVerified && data.data.chargesEnabled && data.data.payoutsEnabled,
      )
    } catch (error) {
      setStripeError("Failed to check Stripe connection status")
      console.error("Error checking Stripe status:", error)
    } finally {
      setIsLoadingStripe(false)
    }
  }

  // Check Stripe connection on mount
  useEffect(() => {
    checkStripeConnection()
  }, [])

  useEffect(() => {
    // Check for returned Stripe state
    const searchParams = new URLSearchParams(window.location.search)
    const stripeSuccess = searchParams.get("stripe_success")

    if (stripeSuccess === "true") {
      // Restore saved form data from session storage
      const savedData = sessionStorage.getItem("pendingCampaignData")
      if (savedData) {
        setFormData(JSON.parse(savedData))
        sessionStorage.removeItem("pendingCampaignData")
      }
      setHasStripeAccount(true)
    }
  }, [])

  // Handle Stripe connection
   const handleStripeConnect = async () => {
    try {
      const response = await fetch("/api/organization/stripe/createAccount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      console.log("Stripe connection response:", data)
      // Always redirect if onboardingUrl is present
      if (data.data?.onboardingUrl) {
        sessionStorage.setItem("pendingCampaignData", JSON.stringify(formData))
        window.location.href = data.data.onboardingUrl
        return
      }
      // Optionally, show a message if onboardingUrl is missing
      setStripeError(data.message || "No onboarding URL returned from Stripe.")
    } catch (error) {
      setStripeError("Failed to initiate Stripe connection")
      console.error("Error connecting to Stripe:", error)
    }
  }
  // Stripe connection required screen
  if (!isLoadingStripe && !hasStripeAccount) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white text-center">
              <div className="bg-white/20 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                <CreditCard size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Connect Your Payment Account</h2>
              <p className="text-amber-100 text-lg">Secure payment processing powered by Stripe</p>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Why connect Stripe?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-xl p-4 mb-3 mx-auto w-16 h-16 flex items-center justify-center">
                      <DollarSign className="text-blue-600" size={24} />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Secure Payments</h4>
                    <p className="text-slate-600 text-sm">Industry-leading security for all transactions</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-emerald-100 rounded-xl p-4 mb-3 mx-auto w-16 h-16 flex items-center justify-center">
                      <Clock className="text-emerald-600" size={24} />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Fast Transfers</h4>
                    <p className="text-slate-600 text-sm">Quick and reliable fund transfers</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-xl p-4 mb-3 mx-auto w-16 h-16 flex items-center justify-center">
                      <Users className="text-purple-600" size={24} />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Global Reach</h4>
                    <p className="text-slate-600 text-sm">Accept donations from anywhere</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <Info className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">What happens next?</h4>
                    <ul className="text-slate-600 text-sm space-y-1">
                      <li>• You'll be redirected to Stripe to create or connect your account</li>
                      <li>• Complete the verification process (usually takes 2-3 minutes)</li>
                      <li>• Return here to finish creating your campaign</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleStripeConnect}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center mx-auto"
                >
                  <CreditCard className="mr-3" size={20} />
                  Connect with Stripe
                </button>
                {stripeError && <p className="mt-4 text-red-600 text-sm">{stripeError}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoadingStripe) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Checking payment setup...</p>
        </div>
      </div>
    )
  }

  // Handle image uploads
  const handleCoverImageUpload = async (file: File) => {
    try {
      const fileUrl = await uploadOrganizationLogo(file)
      setFormData((prev: any) => ({
        ...prev,
        coverImage: fileUrl,
      }))
      // Clear any previous errors
      setErrors((prev) => ({ ...prev, coverImage: "" }))
    } catch (error) {
      console.error("Error uploading cover image:", error)
      setErrors((prev) => ({
        ...prev,
        coverImage: "Failed to upload cover image",
      }))
    }
  }

  const handleGalleryUpload = async (files: FileList) => {
    try {
      const uploadPromises = Array.from(files).map((file) => uploadOrganizationLogo(file))
      const uploadedUrls = await Promise.all(uploadPromises)

      setFormData((prev: any) => ({
        ...prev,
        gallery: [...prev.gallery, ...uploadedUrls],
      }))
      // Clear any previous errors
      setErrors((prev) => ({ ...prev, gallery: "" }))
    } catch (error) {
      console.error("Error uploading gallery images:", error)
      setErrors((prev) => ({
        ...prev,
        gallery: "Failed to upload one or more gallery images",
      }))
    }
  }

  // Handle donation tier updates
  const updateDonationTier = (index: number, field: "amount" | "label", value: string) => {
    const updatedTiers = [...donationTiers]
    if (field === "amount") {
      updatedTiers[index].amount = Number.parseInt(value) || 0
    } else {
      updatedTiers[index].label = value
    }
    setDonationTiers(updatedTiers)
  }

  const addDonationTier = () => {
    setDonationTiers([...donationTiers, { amount: 0, label: "" }])
  }

  const removeDonationTier = (index: number) => {
    const updatedTiers = [...donationTiers]
    updatedTiers.splice(index, 1)
    setDonationTiers(updatedTiers)
  }

  // Form validation
  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Campaign name is required"
      if (formData.title.length > 100) newErrors.title = "Campaign name must be less than 100 characters"
      if (!formData.targetAmount) newErrors.targetAmount = "Goal amount is required"
      if (Number.parseFloat(formData.targetAmount) <= 0)
        newErrors.targetAmount = "Goal amount must be greater than zero"
      if (!formData.category) newErrors.category = "Category is required"

      // Validate dates only if both are provided
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate)
        const end = new Date(formData.endDate)
        if (end < start) {
          newErrors.endDate = "End date must be after start date"
        }
      }
    }

    if (step === 2) {
      if (!formData.description.trim()) newErrors.description = "Description is required"
      if (formData.description.length < 50) newErrors.description = "Description must be at least 50 characters"
      if (!formData.cause.trim()) newErrors.cause = "Campaign story is required"
      if (formData.cause.length < 100) newErrors.cause = "Campaign story must be at least 100 characters"
      if (!formData.coverImage) newErrors.coverImage = "Cover image is required"
    }

    if (step === 3) {
      if (Number.parseFloat(minDonation) < 1) {
        newErrors.minDonation = "Minimum donation must be at least $1"
      }

      // Validate donation tiers
      const tierErrors: string[] = []
      donationTiers.forEach((tier, index) => {
        if (tier.amount <= 0) tierErrors.push(`Tier ${index + 1}: Amount must be greater than zero`)
        if (!tier.label.trim()) tierErrors.push(`Tier ${index + 1}: Label is required`)
      })

      if (tierErrors.length > 0) {
        newErrors.tiers = tierErrors.join("; ")
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Navigation between steps
  const goToNextStep = (e: React.MouseEvent) => {
    e.preventDefault()
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1)
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSubmit = {
        ...formData,
        targetAmount: Number.parseFloat(formData.targetAmount),
        gallery: formData.gallery.length ? formData.gallery : undefined,
        status: isEditMode ? initialData?.status : "active",
        donationType: formData.donationType,
        organizationId: session?.user?.organizationId,
        donorCount: isEditMode ? initialData?.donorCount : 0,
        currentAmount: isEditMode ? initialData?.currentAmount : 0,
        minDonation: Number.parseFloat(minDonation),
        donationTiers: donationTiers,
        enableRecurring: enableRecurring,
      }

      if (onSubmit) {
        await onSubmit(formDataToSubmit)
      } else {
        const response = await fetch("/api/donation/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSubmit),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to create campaign")
        }

        const result = await response.json()
        setIsComplete(true)

        if (result.data?.id) {
          sessionStorage.setItem("lastCreatedCampaignId", result.data.id)
        }
      }
    } catch (error) {
      console.error("Error submitting campaign:", error)
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : "Failed to create campaign",
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success completion screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-8 text-white text-center">
              <div className="bg-white/20 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Campaign {isEditMode ? "Updated" : "Created"} Successfully!</h2>
              <p className="text-emerald-100 text-lg">Your campaign is ready to make an impact</p>
            </div>

            <div className="p-8 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-4">"{formData.title}"</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {isEditMode
                  ? "Your campaign has been successfully updated with the latest information."
                  : "Your campaign has been created and is now under review. It will be visible to potential donors once approved."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-6">
                  <Target className="text-blue-600 mx-auto mb-3" size={32} />
                  <h4 className="font-semibold text-slate-900 mb-2">Goal Amount</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    ${Number.parseInt(formData.targetAmount).toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-6">
                  <Tag className="text-purple-600 mx-auto mb-3" size={32} />
                  <h4 className="font-semibold text-slate-900 mb-2">Category</h4>
                  <p className="text-slate-700 font-medium">
                    {CAMPAIGN_CATEGORIES.find((cat) => cat.value === formData.category)?.label || formData.category}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href={`/api/donation/${sessionStorage.getItem("lastCreatedCampaignId")}`}
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  {isEditMode ? "View Campaign" : "Preview Campaign"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Session check
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-slate-600">Please sign in to create a campaign</p>
        </div>
      </div>
    )
  }

  // Cover Image Upload Component
  const CoverImageUpload = () => (
    <div className="mb-8">
      <label className="block text-slate-700 text-sm font-semibold mb-3">
        Campaign Cover Image <span className="text-red-500">*</span>
      </label>
      <div
        className={`border-2 border-dashed ${
          errors.coverImage ? "border-red-300 bg-red-50" : "border-slate-300 hover:border-blue-400"
        } rounded-2xl p-6 transition-colors`}
      >
        {formData.coverImage ? (
          <div className="relative">
            <Image
              src={formData.coverImage || "/placeholder.svg"}
              alt="Cover preview"
              width={600}
              height={300}
              className="rounded-xl object-cover mx-auto shadow-lg"
            />
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, coverImage: null }))}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleCoverImageUpload(file)
              }}
              className="hidden"
            />
            <label htmlFor="coverImage" className="cursor-pointer">
              <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Upload size={32} className="text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Upload Cover Image</h4>
              <p className="text-slate-600 mb-2">Choose a compelling image that represents your campaign</p>
              <p className="text-sm text-slate-500">PNG, JPG up to 5MB • Recommended: 1200x600px</p>
            </label>
          </div>
        )}
      </div>
      {errors.coverImage && (
        <p className="text-red-500 text-sm mt-2 flex items-center">
          <AlertCircle size={16} className="mr-1" />
          {errors.coverImage}
        </p>
      )}
    </div>
  )

  // Gallery Upload Component
  const GalleryUpload = () => (
    <div className="mb-8">
      <label className="block text-slate-700 text-sm font-semibold mb-3">
        Gallery Images <span className="text-slate-500">(optional)</span>
      </label>
      <p className="text-slate-600 text-sm mb-4">Add additional images to showcase your campaign</p>

      {formData.gallery.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {formData.gallery.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={`Gallery image ${index + 1}`}
                width={200}
                height={200}
                className="rounded-xl object-cover w-full h-32 shadow-md"
              />
              <button
                type="button"
                onClick={() => {
                  const newGallery = formData.gallery.filter((_, i) => i !== index)
                  setFormData((prev) => ({ ...prev, gallery: newGallery }))
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        id="gallery"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files?.length) {
            handleGalleryUpload(e.target.files)
          }
        }}
        className="hidden"
      />
      <label
        htmlFor="gallery"
        className="inline-flex items-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl px-6 py-3 cursor-pointer transition-colors"
      >
        <Plus size={18} className="mr-2" />
        Add Gallery Images
      </label>
      {errors.gallery && (
        <p className="text-red-500 text-sm mt-2 flex items-center">
          <AlertCircle size={16} className="mr-1" />
          {errors.gallery}
        </p>
      )}
    </div>
  )

  // Main form render
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 font-medium transition-colors group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">{isEditMode ? "Edit Campaign" : "Create New Campaign"}</h1>
            <p className="text-blue-100 text-lg">
              {isEditMode
                ? "Update your campaign information and settings"
                : "Set up your fundraising campaign in just a few steps"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="px-8 pt-8">
            <div className="flex items-center justify-between mb-10">
              {[
                { step: 1, title: "Basic Information", icon: FileText },
                { step: 2, title: "Campaign Details", icon: ImageIcon },
                { step: 3, title: "Payment Setup", icon: CreditCard },
              ].map(({ step, title, icon: Icon }, index) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div
                      className={`rounded-full h-12 w-12 flex items-center justify-center border-2 transition-all duration-200 ${
                        currentStep >= step
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-slate-300 text-slate-400"
                      }`}
                    >
                      {currentStep > step ? <Check size={20} /> : <Icon size={20} />}
                    </div>
                    <div className="ml-4">
                      <div
                        className={`text-sm font-semibold ${currentStep >= step ? "text-blue-600" : "text-slate-400"}`}
                      >
                        Step {step}
                      </div>
                      <div className={`text-sm ${currentStep >= step ? "text-slate-900" : "text-slate-500"}`}>
                        {title}
                      </div>
                    </div>
                  </div>
                  {index < 2 && (
                    <div
                      className={`flex-1 h-1 mx-6 rounded-full transition-all duration-200 ${
                        currentStep > step ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Basic Information</h2>
                    <p className="text-slate-600">Tell us about your campaign and set your fundraising goal</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="lg:col-span-2">
                      <label className="block text-slate-700 text-sm font-semibold mb-3">
                        Campaign Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter a compelling campaign name"
                        className={`w-full p-4 border-2 ${
                          errors.title ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                        } rounded-xl focus:outline-none transition-colors text-lg`}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.title}
                        </p>
                      )}
                      <p className="text-slate-500 text-sm mt-2">{formData.title.length}/100 characters</p>
                    </div>

                    <div>
                      <label className="block text-slate-700 text-sm font-semibold mb-3">
                        Fundraising Goal <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign size={20} className="absolute left-4 top-4 text-slate-400" />
                        <input
                          type="number"
                          value={formData.targetAmount}
                          onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                          placeholder="10000"
                          min="1"
                          step="1"
                          className={`w-full p-4 pl-12 border-2 ${
                            errors.targetAmount ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                          } rounded-xl focus:outline-none transition-colors text-lg`}
                        />
                      </div>
                      {errors.targetAmount && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.targetAmount}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-700 text-sm font-semibold mb-3">
                        Campaign Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Tag size={20} className="absolute left-4 top-4 text-slate-400" />
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className={`w-full p-4 pl-12 border-2 ${
                            errors.category ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                          } rounded-xl focus:outline-none transition-colors text-lg bg-white`}
                        >
                          <option value="">Select a category</option>
                          {CAMPAIGN_CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.icon} {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-700 text-sm font-semibold mb-3">
                        Start Date <span className="text-slate-500">(optional)</span>
                      </label>
                      <div className="relative">
                        <Calendar size={20} className="absolute left-4 top-4 text-slate-400" />
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="w-full p-4 pl-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 text-sm font-semibold mb-3">
                        End Date <span className="text-slate-500">(optional)</span>
                      </label>
                      <div className="relative">
                        <Calendar size={20} className="absolute left-4 top-4 text-slate-400" />
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className={`w-full p-4 pl-12 border-2 ${
                            errors.endDate ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                          } rounded-xl focus:outline-none transition-colors`}
                        />
                      </div>
                      {errors.endDate && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.endDate}
                        </p>
                      )}
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-slate-700 text-sm font-semibold mb-3">
                        Donation Type <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="relative cursor-pointer">
                          <input
                            type="radio"
                            value="one-time"
                            checked={formData.donationType === "one-time"}
                            onChange={(e) => setFormData({ ...formData, donationType: e.target.value })}
                            className="sr-only"
                          />
                          <div
                            className={`p-6 border-2 rounded-xl transition-all ${
                              formData.donationType === "one-time"
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center mb-3">
                              <DollarSign className="text-blue-600 mr-3" size={24} />
                              <h3 className="font-semibold text-slate-900">One-time Donations</h3>
                            </div>
                            <p className="text-slate-600 text-sm">Supporters make a single donation to your campaign</p>
                          </div>
                        </label>

                        <label className="relative cursor-pointer">
                          <input
                            type="radio"
                            value="recurring"
                            checked={formData.donationType === "recurring"}
                            onChange={(e) => setFormData({ ...formData, donationType: e.target.value })}
                            className="sr-only"
                          />
                          <div
                            className={`p-6 border-2 rounded-xl transition-all ${
                              formData.donationType === "recurring"
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center mb-3">
                              <Clock className="text-blue-600 mr-3" size={24} />
                              <h3 className="font-semibold text-slate-900">Recurring Donations</h3>
                            </div>
                            <p className="text-slate-600 text-sm">Supporters can set up monthly recurring donations</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Campaign Details */}
              {currentStep === 2 && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Campaign Details</h2>
                    <p className="text-slate-600">Share your story and add compelling visuals to engage donors</p>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-slate-700 text-sm font-semibold mb-3">
                        Short Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Write a compelling summary of your campaign (50-200 words)"
                        rows={4}
                        className={`w-full p-4 border-2 ${
                          errors.description ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                        } rounded-xl focus:outline-none transition-colors resize-none`}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.description}
                        </p>
                      )}
                      <p className="text-slate-500 text-sm mt-2">{formData.description.length} characters</p>
                    </div>

                    <div>
                      <label className="block text-slate-700 text-sm font-semibold mb-3">
                        Campaign Story <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.cause}
                        onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                        placeholder="Tell the full story of your campaign. What problem are you solving? How will donations be used? What impact will this have?"
                        rows={8}
                        className={`w-full p-4 border-2 ${
                          errors.cause ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                        } rounded-xl focus:outline-none transition-colors resize-none`}
                      />
                      {errors.cause && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.cause}
                        </p>
                      )}
                      <p className="text-slate-500 text-sm mt-2">{formData.cause.length} characters</p>
                    </div>

                    <CoverImageUpload />
                    <GalleryUpload />
                  </div>
                </div>
              )}

              {/* Step 3: Payment Configuration */}
              {currentStep === 3 && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Configuration</h2>
                    <p className="text-slate-600">Set up donation amounts and payment preferences</p>
                  </div>

                  <div className="space-y-8">
                    {/* Stripe Status */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-emerald-100 rounded-full p-2 mr-4">
                          <Check className="text-emerald-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-emerald-900">Payment Processing Ready</h3>
                          <p className="text-emerald-700 text-sm">Your Stripe account is connected and verified</p>
                        </div>
                      </div>
                    </div>

                    {/* Minimum Donation */}
                    <div>
                      <label className="block text-slate-700 text-sm font-semibold mb-3">Minimum Donation Amount</label>
                      <div className="relative max-w-xs">
                        <DollarSign size={20} className="absolute left-4 top-4 text-slate-400" />
                        <input
                          type="number"
                          value={minDonation}
                          onChange={(e) => setMinDonation(e.target.value)}
                          min="1"
                          step="1"
                          className={`w-full p-4 pl-12 border-2 ${
                            errors.minDonation ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                          } rounded-xl focus:outline-none transition-colors`}
                        />
                      </div>
                      {errors.minDonation && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.minDonation}
                        </p>
                      )}
                    </div>

                    {/* Suggested Donation Amounts */}
                    <div>
                      <label className="block text-slate-700 text-sm font-semibold mb-3">
                        Suggested Donation Amounts
                      </label>
                      <p className="text-slate-600 text-sm mb-4">
                        Set up quick donation buttons to make it easy for supporters to contribute
                      </p>
                      <div className="space-y-4">
                        {donationTiers.map((tier, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="flex-1">
                              <label className="block text-slate-600 text-xs font-medium mb-1">Amount ($)</label>
                              <input
                                type="number"
                                value={tier.amount}
                                onChange={(e) => updateDonationTier(index, "amount", e.target.value)}
                                min="1"
                                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex-2">
                              <label className="block text-slate-600 text-xs font-medium mb-1">Label</label>
                              <input
                                type="text"
                                value={tier.label}
                                onChange={(e) => updateDonationTier(index, "label", e.target.value)}
                                placeholder="e.g., Basic Supporter"
                                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            {donationTiers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeDonationTier(index)}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={addDonationTier}
                        className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Plus size={18} className="mr-2" />
                        Add Another Amount
                      </button>
                      {errors.tiers && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.tiers}
                        </p>
                      )}
                    </div>

                    {/* Recurring Donations Toggle */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">Enable Recurring Donations</h3>
                          <p className="text-slate-600 text-sm">
                            Allow supporters to set up monthly recurring donations
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={enableRecurring}
                            onChange={(e) => setEnableRecurring(e.target.checked)}
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-6 rounded-full transition-colors ${
                              enableRecurring ? "bg-blue-600" : "bg-slate-300"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                enableRecurring ? "translate-x-5" : "translate-x-0"
                              } mt-0.5 ml-0.5`}
                            ></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-slate-200">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="flex items-center text-slate-600 hover:text-slate-900 font-medium transition-colors"
                  >
                    <ChevronLeft size={20} className="mr-1" />
                    Previous Step
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep === 3 ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                        {isEditMode ? "Updating Campaign..." : "Creating Campaign..."}
                      </>
                    ) : (
                      <>
                        <Check size={20} className="mr-3" />
                        {isEditMode ? "Update Campaign" : "Create Campaign"}
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center"
                  >
                    Continue
                    <ChevronRight size={20} className="ml-3" />
                  </button>
                )}
              </div>

              {/* Error Display */}
              {errors.submit && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-500 mr-3" size={20} />
                    <p className="text-red-700 font-medium">{errors.submit}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignCreationForm
