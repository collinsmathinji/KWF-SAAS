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
  Check,
  AlertCircle,
  ArrowLeft,
  X,
  Upload,
  Plus,
  MapPin,
  Users,
  Building,
  Clock,
  CreditCard,
  DollarSign,
  Info,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { uploadOrganizationLogo } from "@/lib/organization"
import { createEvent } from "@/lib/event"
import { useSession } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"

const EVENT_TYPES = [
  { value: "hackathon", label: "Hackathon", icon: "💻" },
  { value: "conference", label: "Conference", icon: "🎤" },
  { value: "workshop", label: "Workshop", icon: "🛠️" },
  { value: "seminar", label: "Seminar", icon: "📚" },
  { value: "networking", label: "Networking", icon: "🤝" },
  { value: "training", label: "Training", icon: "📋" },
]

interface EventFormProps {
  onClose?: () => void
  initialData?: Partial<EventFormData>
  isEditMode?: boolean
}

interface EventFormData {
  name: string
  description: string
  startDate: Date | null
  isPaid: boolean
  price: number
  duration: number
  eventType: string
  theme: string
  hostOrganization: string
  coHost: string
  sponsor: string
  region: string
  subRegion: string
  nation: string
  city: string
  numberOfParticipants: number
  coverImage: string
  embededVideoUrl: string[]
  gallery: string[]
  ticketingEnabled: boolean
  ticketPrice: string
  registrationDeadline: Date | null
}

interface EventFormErrors {
  [key: string]: string
}

export default function EventForm({ onClose = () => {}, initialData, isEditMode = false }: EventFormProps) {
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoadingStripe, setIsLoadingStripe] = useState(true)
  const [hasStripeAccount, setHasStripeAccount] = useState(false)
  const [stripeError, setStripeError] = useState<string | null>(null)
  const [formData, setFormData] = useState<EventFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate) : null,
    isPaid: initialData?.isPaid || false,
    price: initialData?.price || 0,
    duration: initialData?.duration || 1,
    eventType: initialData?.eventType || "",
    theme: initialData?.theme || "",
    hostOrganization: initialData?.hostOrganization || "",
    coHost: initialData?.coHost || "",
    sponsor: initialData?.sponsor || "",
    region: initialData?.region || "",
    subRegion: initialData?.subRegion || "",
    nation: initialData?.nation || "",
    city: initialData?.city || "",
    numberOfParticipants: initialData?.numberOfParticipants || 50,
    coverImage: initialData?.coverImage || "",
    embededVideoUrl: initialData?.embededVideoUrl || [],
    gallery: initialData?.gallery || [],
    ticketingEnabled: initialData?.ticketingEnabled || false,
    ticketPrice: initialData?.ticketPrice || "",
    registrationDeadline: initialData?.registrationDeadline ? new Date(initialData.registrationDeadline) : null,
  })

  const [errors, setErrors] = useState<EventFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)

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
      if (data.onboardingUrl) {
        sessionStorage.setItem("pendingEventData", JSON.stringify(formData))
        window.location.href = data.onboardingUrl
      }
    } catch (error) {
      setStripeError("Failed to initiate Stripe connection")
      console.error("Error connecting to Stripe:", error)
    }
  }

  useEffect(() => {
    // Check for returned Stripe state
    const searchParams = new URLSearchParams(window.location.search)
    const stripeSuccess = searchParams.get("stripe_success")

    if (stripeSuccess === "true") {
      // Restore saved form data from session storage
      const savedData = sessionStorage.getItem("pendingEventData")
      if (savedData) {
        setFormData(JSON.parse(savedData))
        sessionStorage.removeItem("pendingEventData")
      }
      setHasStripeAccount(true)
    }

    checkStripeConnection()
  }, [])

  // Stripe connection required screen
  if (!isLoadingStripe && !hasStripeAccount && formData.ticketingEnabled) {
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
                    <p className="text-slate-600 text-sm">Accept payments from anywhere</p>
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
                      <li>• Return here to finish creating your event</li>
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
  if (isLoadingStripe && formData.ticketingEnabled) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Checking payment setup...</p>
        </div>
      </div>
    )
  }

  const updateFormField = (name: keyof EventFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    updateFormField(name as keyof EventFormData, value)
  }

  const handleDateChange = (name: keyof EventFormData, date: Date | null) => {
    updateFormField(name, date)
  }

  const handleCheckboxChange = (name: keyof EventFormData, checked: boolean) => {
    updateFormField(name, checked)
  }

  const handleGalleryChange = (name: keyof EventFormData, value: string[]) => {
    updateFormField(name, value)
  }

  const handleCoverImageUpload = async (file: File) => {
    try {
      setUploadingImage(true)
      const fileUrl = await uploadOrganizationLogo(file)
      updateFormField("coverImage", fileUrl)
      toast({
        title: "Success",
        description: "Cover image uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading cover image:", error)
      setErrors((prev) => ({ ...prev, coverImage: "Failed to upload cover image" }))
      toast({
        title: "Error",
        description: "Failed to upload cover image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleGalleryUpload = async (files: FileList) => {
    try {
      setUploadingGallery(true)
      const uploadPromises = Array.from(files).map((file) => uploadOrganizationLogo(file))
      const uploadedUrls = await Promise.all(uploadPromises)
      const currentGallery = formData.gallery || []
      handleGalleryChange("gallery", [...currentGallery, ...uploadedUrls])
      toast({
        title: "Success",
        description: "Gallery images uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading gallery images:", error)
      setErrors((prev) => ({ ...prev, gallery: "Failed to upload one or more gallery images" }))
      toast({
        title: "Error",
        description: "Failed to upload gallery images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingGallery(false)
    }
  }

  // Navigation between steps
  const goToNextStep = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      return
    }

    // Check for Stripe account if enabling ticketing
    if (currentStep === 1 && formData.ticketingEnabled) {
      if (isLoadingStripe) {
        toast({
          title: "Please wait",
          description: "Checking payment setup...",
        })
        return
      }
      
      if (!hasStripeAccount) {
        toast({
          title: "Stripe Account Required",
          description: "You need to connect a Stripe account to enable ticketing.",
          variant: "destructive",
        })
        return
      }
    }

    setCurrentStep(currentStep + 1)
    window.scrollTo(0, 0)
  }

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  // Form validation
  const validateStep = (step: number): boolean => {
    const newErrors: EventFormErrors = {}

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Event name is required"
      if (formData.name.length > 100) newErrors.name = "Event name must be less than 100 characters"
      if (!formData.eventType) newErrors.eventType = "Event type is required"
      if (!formData.theme.trim()) newErrors.theme = "Theme is required"
      if (!formData.startDate) newErrors.startDate = "Start date is required"
      if (formData.ticketingEnabled) {
        if (!hasStripeAccount) {
          newErrors.ticketingEnabled = "You must connect a Stripe account to enable ticketing"
          return false
        }
        if (!formData.ticketPrice) {
          newErrors.ticketPrice = "Ticket price is required when ticketing is enabled"
        }
      }
    }

    if (step === 2) {
      if (!formData.description.trim()) newErrors.description = "Description is required"
      if (formData.description.length < 50) newErrors.description = "Description must be at least 50 characters"
      if (!formData.coverImage) newErrors.coverImage = "Cover image is required"
    }

    if (step === 3) {
      if (!formData.region.trim()) newErrors.region = "Region is required"
      if (!formData.subRegion.trim()) newErrors.subRegion = "Sub-region is required"
      if (!formData.nation.trim()) newErrors.nation = "Nation is required"
      if (!formData.city.trim()) newErrors.city = "City is required"
      if (!formData.hostOrganization.trim()) newErrors.hostOrganization = "Host organization is required"
    }

    setErrors(newErrors)

    // If there are any errors, show a toast notification
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join(", ")
      toast({
        title: "Validation Error",
        description: errorMessages,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      return
    }

    if (!session?.user?.organizationId) {
      toast({
        title: "Error",
        description: "Organization ID not found. Please try again.",
        variant: "destructive",
      })
      return
    }

    // Validate required fields
    const requiredFields = {
      name: "Event name",
      description: "Description",
      startDate: "Start date",
      eventType: "Event type",
      theme: "Theme",
      region: "Region",
      subRegion: "Sub region",
      nation: "Nation",
      city: "City",
      hostOrganization: "Host organization",
      coverImage: "Cover image"
    }

    const missingFields = Object.entries(requiredFields).filter(([key]) => !formData[key as keyof EventFormData])
    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(([_, label]) => label).join(", ")
      toast({
        title: "Missing Required Fields",
        description: `Please fill in the following fields: ${missingFieldNames}`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const eventData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate ? formData.startDate.toISOString() : new Date().toISOString(),
        isPaid: formData.ticketingEnabled && Number(formData.ticketPrice) > 0,
        price: formData.ticketingEnabled ? Number(formData.ticketPrice) : 0,
        duration: Number(formData.duration),
        eventType: formData.eventType,
        theme: formData.theme.trim(),
        hostOrganization: formData.hostOrganization.trim(),
        coHost: formData.coHost.trim(),
        sponsor: formData.sponsor.trim(),
        region: formData.region.trim(),
        subRegion: formData.subRegion.trim(),
        nation: formData.nation.trim(),
        city: formData.city.trim(),
        coverImage: formData.coverImage,
        organizationId: session.user.organizationId,
        gallery: formData.gallery,
        numberOfParticipants: Number(formData.numberOfParticipants) || 50,
        registrationDeadline: formData.registrationDeadline ? formData.registrationDeadline.toISOString() : null
      }

      const response = await createEvent(eventData)
      
      // Show success message from the response
      toast({
        title: "Success",
        description: response.message,
        variant: "default",
      })

      // If there's additional information in the response, show it
      if (response.data?.additionalInfo) {
        toast({
          title: "Additional Information",
          description: response.data.additionalInfo,
          variant: "default",
        })
      }

      onClose()
    } catch (error) {
      console.error("Failed to create event:", error)

      // Show error message from the response
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create event. Please try again.",
        variant: "destructive",
      })

      // If it's a validation error from the backend, highlight the fields
      if (error instanceof Error && error.message.includes("validation")) {
        try {
          const validationErrors = JSON.parse(error.message)
          setErrors(validationErrors)
        } catch {
          // If not parseable as JSON, it's a regular error message
          console.error("Validation error parsing failed")
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white rounded-t-2xl">
          <h1 className="text-3xl font-bold mb-2">{isEditMode ? "Edit Event" : "Create New Event"}</h1>
          <p className="text-blue-100 text-lg">
            {isEditMode ? "Update your event information" : "Set up your event in just a few steps"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white px-8 pt-8 rounded-b-2xl shadow-sm">
          <div className="flex items-center justify-between mb-10">
            {[
              { step: 1, title: "Basic Information", icon: FileText },
              { step: 2, title: "Event Details", icon: ImageIcon },
              { step: 3, title: "Location & Organization", icon: MapPin },
            ].map(({ step, title, icon: Icon }) => (
              <div
                key={step}
                className={`flex items-center ${step !== 3 ? "flex-1" : ""} ${
                  step !== 1 ? "ml-4" : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="ml-4">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    Step {step}
                  </p>
                  <h3
                    className={`text-base font-semibold ${
                      currentStep >= step ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {title}
                  </h3>
                </div>
                {step !== 3 && (
                  <div
                    className={`flex-1 h-0.5 ml-4 ${
                      currentStep > step ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Form content will be added in the next edit */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Basic Information</h2>
                  <p className="text-slate-600">Tell us about your event and set up the essential details</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="lg:col-span-2">
                    <label className="block text-slate-700 text-sm font-semibold mb-3">
                      Event Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter a compelling event name"
                      className={`w-full p-4 border-2 ${
                        errors.name ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                      } rounded-xl focus:outline-none transition-colors text-lg`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {errors.name}
                      </p>
                    )}
                    <p className="text-slate-500 text-sm mt-2">{formData.name.length}/100 characters</p>
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-3">
                      Event Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Tag size={20} className="absolute left-4 top-4 text-slate-400" />
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        className={`w-full p-4 pl-12 border-2 ${
                          errors.eventType ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                        } rounded-xl focus:outline-none transition-colors text-lg bg-white`}
                      >
                        <option value="">Select event type</option>
                        {EVENT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.eventType && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {errors.eventType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-3">
                      Theme <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="theme"
                      value={formData.theme}
                      onChange={handleInputChange}
                      placeholder="Enter event theme"
                      className={`w-full p-4 border-2 ${
                        errors.theme ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                      } rounded-xl focus:outline-none transition-colors text-lg`}
                    />
                    {errors.theme && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {errors.theme}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-3">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar size={20} className="absolute left-4 top-4 text-slate-400" />
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : ""}
                        onChange={(e) => handleDateChange("startDate", e.target.value ? new Date(e.target.value) : null)}
                        className={`w-full p-4 pl-12 border-2 ${
                          errors.startDate ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                        } rounded-xl focus:outline-none transition-colors text-lg`}
                      />
                    </div>
                    {errors.startDate && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-3">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full p-4 border-2 ${
                        errors.duration ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                      } rounded-xl focus:outline-none transition-colors text-lg`}
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <div className="flex flex-row items-center justify-between rounded-lg border border-slate-200 p-4">
                      <div className="space-y-0.5">
                        <label className="text-base font-medium text-slate-900">Enable Ticketing</label>
                        <p className="text-slate-600 text-sm">Allow attendees to purchase tickets for this event</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={formData.ticketingEnabled}
                          onChange={(e) => handleCheckboxChange("ticketingEnabled", e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {formData.ticketingEnabled && (
                      <div className="mt-4">
                        <label className="block text-slate-700 text-sm font-semibold mb-3">
                          Ticket Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-4 text-slate-400">$</span>
                          <input
                            type="number"
                            name="ticketPrice"
                            value={formData.ticketPrice}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className={`w-full p-4 pl-8 border-2 ${
                              errors.ticketPrice ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors text-lg`}
                          />
                        </div>
                        {errors.ticketPrice && (
                          <p className="text-red-500 text-sm mt-2 flex items-center">
                            <AlertCircle size={16} className="mr-1" />
                            {errors.ticketPrice}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-end mt-8 pt-8 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={(e) => goToNextStep(e)}
                    className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next Step
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Event Details */}
            {currentStep === 2 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Event Details</h2>
                  <p className="text-slate-600">Share more information about your event and add media</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-3">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Write a detailed description of your event (minimum 50 characters)"
                      rows={6}
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
                      Cover Image <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`border-2 border-dashed ${
                        errors.coverImage ? "border-red-300 bg-red-50" : "border-slate-300 hover:border-blue-400"
                      } rounded-2xl p-6 transition-colors`}
                    >
                      {formData.coverImage ? (
                        <div className="relative">
                          <img
                            src={formData.coverImage}
                            alt="Cover preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => updateFormField("coverImage", "")}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
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
                          <label htmlFor="coverImage" className="cursor-pointer inline-flex flex-col items-center">
                            <div className="bg-blue-100 rounded-full p-4 mb-4">
                              <Upload className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-900 mb-1">
                              {uploadingImage ? "Uploading..." : "Upload Cover Image"}
                            </span>
                            <span className="text-xs text-slate-500">PNG, JPG up to 5MB</span>
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

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-3">Gallery Images</label>
                    {formData.gallery && formData.gallery.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {formData.gallery.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Gallery image ${index + 1}`}
                              className="rounded-lg object-cover w-full h-32"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newGallery = [...formData.gallery]
                                newGallery.splice(index, 1)
                                handleGalleryChange("gallery", newGallery)
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div>
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
                    </div>
                    {errors.gallery && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {errors.gallery}
                      </p>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-8 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="inline-flex items-center px-6 py-3 text-base font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Previous Step
                  </button>
                  <button
                    type="button"
                    onClick={(e) => goToNextStep(e)}
                    className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next Step
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Location & Organization */}
            {currentStep === 3 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Location & Organization</h2>
                  <p className="text-slate-600">Provide location details and organizing information</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-3">
                      Region <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      placeholder="Enter region"
                      className={`w-full p-4 border-2 ${
                        errors.region ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                      } rounded-xl focus:outline-none transition-colors`}
                    />
                    {errors.region && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {errors.region}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-3">
                      Sub Region <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subRegion"
                      value={formData.subRegion}
                      onChange={handleInputChange}
                      placeholder="Enter sub region"
                      className={`w-full p-4 border-2 ${
                        errors.subRegion ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                      } rounded-xl focus:outline-none transition-colors`}
                    />
                    {errors.subRegion && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {errors.subRegion}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-3">
                      Nation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nation"
                      value={formData.nation}
                      onChange={handleInputChange}
                      placeholder="Enter nation"
                      className={`w-full p-4 border-2 ${
                        errors.nation ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                      } rounded-xl focus:outline-none transition-colors`}
                    />
                    {errors.nation && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {errors.nation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-3">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      className={`w-full p-4 border-2 ${
                        errors.city ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                      } rounded-xl focus:outline-none transition-colors`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-slate-700 text-sm font-semibold mb-3">
                      Host Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="hostOrganization"
                      value={formData.hostOrganization}
                      onChange={handleInputChange}
                      placeholder="Enter host organization"
                      className={`w-full p-4 border-2 ${
                        errors.hostOrganization ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                      } rounded-xl focus:outline-none transition-colors`}
                    />
                    {errors.hostOrganization && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {errors.hostOrganization}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-3">Co-Host</label>
                    <input
                      type="text"
                      name="coHost"
                      value={formData.coHost}
                      onChange={handleInputChange}
                      placeholder="Enter co-host (optional)"
                      className="w-full p-4 border-2 border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-3">Sponsor</label>
                    <input
                      type="text"
                      name="sponsor"
                      value={formData.sponsor}
                      onChange={handleInputChange}
                      placeholder="Enter sponsor (optional)"
                      className="w-full p-4 border-2 border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-8 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="inline-flex items-center px-6 py-3 text-base font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Previous Step
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating Event...
                      </>
                    ) : (
                      <>
                        Create Event
                        <Check className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
