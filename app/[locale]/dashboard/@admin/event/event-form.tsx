"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, DollarSign, FileText, Upload, ImageIcon, X, Plus, MapPin } from "lucide-react"
import { format } from "date-fns"
import type { LucideIcon } from "lucide-react"

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

interface FormFieldProps {
  label: string
  error?: string
  children: React.ReactNode
  required?: boolean
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
  className?: string
}

interface CardProps {
  children: React.ReactNode
  title: string
  icon: LucideIcon
}

interface SimpleCalendarProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  onClose: () => void
  minDate?: Date | null
}

interface EventFormProps {
  onClose?: () => void
}

// Mock form validation (enhanced for ticketing)
const validateForm = (values: EventFormData): EventFormErrors => {
  const errors: EventFormErrors = {}
  if (!values.name || values.name.length < 2) errors.name = "Name must be at least 2 characters"
  if (!values.description || values.description.length < 10)
    errors.description = "Description must be at least 10 characters"
  if (!values.startDate) errors.startDate = "Start date is required"
  if (!values.eventType) errors.eventType = "Event type is required"
  if (!values.theme || values.theme.length < 2) errors.theme = "Theme must be at least 2 characters"
  if (!values.hostOrganization || values.hostOrganization.length < 2)
    errors.hostOrganization = "Host organization is required"
  if (!values.region || values.region.length < 2) errors.region = "Region is required"
  if (!values.subRegion || values.subRegion.length < 2) errors.subRegion = "Sub-region is required"
  if (!values.nation || values.nation.length < 2) errors.nation = "Nation is required"
  if (!values.city || values.city.length < 2) errors.city = "City is required"
  if (!values.numberOfParticipants || values.numberOfParticipants < 1)
    errors.numberOfParticipants = "Number of participants must be at least 1"

  // Ticketing validation
  if (values.ticketingEnabled && values.ticketPrice && isNaN(Number(values.ticketPrice))) {
    errors.ticketPrice = "Ticket price must be a valid number"
  }
  if (values.ticketingEnabled && values.ticketPrice && Number(values.ticketPrice) < 0) {
    errors.ticketPrice = "Ticket price cannot be negative"
  }
  if (values.registrationDeadline && values.startDate && values.registrationDeadline >= values.startDate) {
    errors.registrationDeadline = "Registration deadline must be before event start date"
  }

  return errors
}

const EVENT_TYPES = [
  { value: "hackathon", label: "Hackathon" },
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "seminar", label: "Seminar" },
  { value: "networking", label: "Networking" },
  { value: "training", label: "Training" },
]

// Simple Calendar Component
const SimpleCalendar = ({ selectedDate, onDateSelect, onClose, minDate = null }: SimpleCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const days = []

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const isToday = date.toDateString() === today.toDateString()
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
    const isPast = date < today && !isToday
    const isBeforeMinDate = minDate && date < minDate && !isToday
    const isDisabled = isPast || isBeforeMinDate

    days.push(
      <button
        key={day}
        type="button"
        onClick={() => {
          if (!isDisabled) {
            onDateSelect(date)
            onClose()
          }
        }}
        disabled={isDisabled || undefined}
        className={`w-8 h-8 text-sm rounded-md transition-colors ${
          isDisabled
            ? "text-gray-300 cursor-not-allowed"
            : isSelected
              ? "bg-blue-600 text-white font-semibold"
              : isToday
                ? "bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200"
                : "text-gray-700 hover:bg-blue-50"
        }`}
      >
        {day}
      </button>,
    )
  }

  return (
    <div className="bg-white border border-blue-200 rounded-lg shadow-lg p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth(new Date(year, month - 1))}
          className="p-1 hover:bg-blue-50 rounded text-blue-600"
        >
          ←
        </button>
        <h3 className="font-semibold text-blue-900">
          {monthNames[month]} {year}
        </h3>
        <button
          type="button"
          onClick={() => setCurrentMonth(new Date(year, month + 1))}
          className="p-1 hover:bg-blue-50 rounded text-blue-600"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="w-8 h-8 text-xs font-medium text-blue-600 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  )
}

export default function EventForm({ onClose = () => {} }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    startDate: null,
    isPaid: false,
    price: 0,
    duration: 1,
    eventType: "",
    theme: "",
    hostOrganization: "",
    coHost: "",
    sponsor: "",
    region: "",
    subRegion: "",
    nation: "",
    city: "",
    numberOfParticipants: 50,
    coverImage: "",
    embededVideoUrl: [],
    gallery: [],
    ticketingEnabled: false,
    ticketPrice: "",
    registrationDeadline: null,
  })

  const [errors, setErrors] = useState<EventFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showDeadlineCalendar, setShowDeadlineCalendar] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)

  const handleInputChange = <K extends keyof EventFormData>(name: K, value: EventFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "ticketingEnabled" && {
        isPaid: Boolean(value && prev.ticketPrice && Number(prev.ticketPrice) > 0),
      }),
      ...(name === "ticketPrice" && {
        isPaid: Boolean(prev.ticketingEnabled && value && Number(value) > 0),
      }),
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Mock file upload function
  const mockUploadFile = (file: File): Promise<string> => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file))
      }, 1000)
    })
  }

  const handleCoverImageUpload = async (file: File) => {
    try {
      setUploadingImage(true)
      const fileUrl = await mockUploadFile(file)
      handleInputChange("coverImage", fileUrl)
    } catch (error) {
      console.error("Error uploading cover image:", error)
      setErrors((prev) => ({ ...prev, coverImage: "Failed to upload cover image" }))
    } finally {
      setUploadingImage(false)
    }
  }

  const handleGalleryUpload = async (files: FileList) => {
    try {
      setUploadingGallery(true)
      const uploadPromises = Array.from(files).map((file: File) => mockUploadFile(file))
      const uploadedUrls = await Promise.all(uploadPromises)
      const currentGallery = formData.gallery || []
      handleInputChange("gallery", [...currentGallery, ...uploadedUrls])
    } catch (error) {
      console.error("Error uploading gallery images:", error)
      setErrors((prev) => ({ ...prev, gallery: "Failed to upload one or more gallery images" }))
    } finally {
      setUploadingGallery(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validateForm(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    try {
      console.log("Event data:", formData)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      onClose()
    } catch (error) {
      console.error("Failed to create event:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const FormField = ({ label, error, children, required = false }: FormFieldProps) => (
    <div className="space-y-2">
      <label className="text-blue-900 font-medium text-sm">
        {label} {required && <span className="text-blue-500">*</span>}
      </label>
      {children}
      {error && <p className="text-blue-600 text-xs">{error}</p>}
    </div>
  )

  const Input = ({ className = "", ...props }: InputProps) => (
    <input
      className={`w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  )

  const Textarea = ({ className = "", ...props }: TextareaProps) => (
    <textarea
      className={`w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  )

  const Select = ({ className = "", children, ...props }: SelectProps) => (
    <select
      className={`w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    >
      {children}
    </select>
  )

  const Card = ({ children, title, icon: Icon }: CardProps) => (
    <div className="bg-white border border-blue-100 rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-blue-50">
        <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
          <Icon className="h-5 w-5 text-blue-600" />
          {title}
        </h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Create New Event</h1>
          <p className="text-blue-600">Fill out the details below to create your event</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <Card title="Basic Information" icon={FileText}>
              <div className="space-y-4">
                <FormField label="Event Name" error={errors.name} required>
                  <Input
                    placeholder="Enter event name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </FormField>

                <FormField label="Description" error={errors.description} required>
                  <Textarea
                    placeholder="Describe your event"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </FormField>

                <FormField label="Event Type" error={errors.eventType} required>
                  <Select value={formData.eventType} onChange={(e) => handleInputChange("eventType", e.target.value)}>
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Theme" error={errors.theme} required>
                  <Input
                    placeholder="Enter event theme"
                    value={formData.theme}
                    onChange={(e) => handleInputChange("theme", e.target.value)}
                  />
                </FormField>
              </div>
            </Card>

            {/* Date & Duration */}
            <Card title="Date & Duration" icon={Calendar}>
              <div className="space-y-4">
                <FormField label="Start Date" error={errors.startDate} required>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                    >
                      <span className={formData.startDate ? "text-blue-900" : "text-blue-400"}>
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                      </span>
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </button>

                    {showCalendar && (
                      <div className="absolute z-50 mt-2">
                        <SimpleCalendar
                          selectedDate={formData.startDate}
                          onDateSelect={(date) => handleInputChange("startDate", date)}
                          onClose={() => setShowCalendar(false)}
                        />
                      </div>
                    )}
                  </div>
                </FormField>

                <FormField label="Duration (days)" error={errors.duration}>
                  <Input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", Number(e.target.value))}
                  />
                </FormField>

                <FormField label="Number of Participants" error={errors.numberOfParticipants}>
                  <Input
                    type="number"
                    min="1"
                    value={formData.numberOfParticipants}
                    onChange={(e) => handleInputChange("numberOfParticipants", Number(e.target.value))}
                  />
                </FormField>
              </div>
            </Card>
          </div>

          {/* Ticketing & Registration */}
          <Card title="Ticketing & Registration" icon={DollarSign}>
            <div className="space-y-4">
              <div className="flex flex-row items-center justify-between rounded-lg border border-blue-200 p-4">
                <div className="space-y-0.5">
                  <label className="text-base font-medium text-blue-900">Enable Ticketing</label>
                  <p className="text-blue-600 text-sm">Allow attendees to purchase tickets for this event</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.ticketingEnabled}
                    onChange={(e) => handleInputChange("ticketingEnabled", e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {formData.ticketingEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Ticket Price" error={errors.ticketPrice}>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.ticketPrice}
                      onChange={(e) => handleInputChange("ticketPrice", e.target.value)}
                    />
                    <p className="text-blue-500 text-xs">Leave empty or set to 0 for free events</p>
                  </FormField>

                  <FormField label="Registration Deadline" error={errors.registrationDeadline}>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowDeadlineCalendar(!showDeadlineCalendar)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                      >
                        <span className={formData.registrationDeadline ? "text-blue-900" : "text-blue-400"}>
                          {formData.registrationDeadline
                            ? format(formData.registrationDeadline, "PPP")
                            : "Pick deadline date"}
                        </span>
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </button>

                      {showDeadlineCalendar && (
                        <div className="absolute z-50 mt-2">
                          <SimpleCalendar
                            selectedDate={formData.registrationDeadline}
                            onDateSelect={(date) => handleInputChange("registrationDeadline", date)}
                            onClose={() => setShowDeadlineCalendar(false)}
                            minDate={new Date()}
                          />
                        </div>
                      )}
                    </div>
                  </FormField>
                </div>
              )}
            </div>
          </Card>

          {/* Location Information */}
          <Card title="Location Information" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Region" error={errors.region} required>
                <Input
                  placeholder="Enter region"
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                />
              </FormField>

              <FormField label="Sub Region" error={errors.subRegion} required>
                <Input
                  placeholder="Enter sub region"
                  value={formData.subRegion}
                  onChange={(e) => handleInputChange("subRegion", e.target.value)}
                />
              </FormField>

              <FormField label="Nation" error={errors.nation} required>
                <Input
                  placeholder="Enter nation"
                  value={formData.nation}
                  onChange={(e) => handleInputChange("nation", e.target.value)}
                />
              </FormField>

              <FormField label="City" error={errors.city} required>
                <Input
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </FormField>
            </div>
          </Card>

          {/* Organization Information */}
          <Card title="Organization Information" icon={FileText}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Host Organization" error={errors.hostOrganization} required>
                <Input
                  placeholder="Enter host organization"
                  value={formData.hostOrganization}
                  onChange={(e) => handleInputChange("hostOrganization", e.target.value)}
                />
              </FormField>

              <FormField label="Co-Host" error={errors.coHost}>
                <Input
                  placeholder="Enter co-host (optional)"
                  value={formData.coHost}
                  onChange={(e) => handleInputChange("coHost", e.target.value)}
                />
              </FormField>

              <FormField label="Sponsor" error={errors.sponsor}>
                <Input
                  placeholder="Enter sponsor (optional)"
                  value={formData.sponsor}
                  onChange={(e) => handleInputChange("sponsor", e.target.value)}
                />
              </FormField>
            </div>
          </Card>

          {/* Media Section */}
          <Card title="Media" icon={ImageIcon}>
            <div className="space-y-6">
              {/* Cover Image Upload */}
              <FormField label="Cover Image" error={errors.coverImage}>
                <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                  {formData.coverImage ? (
                    <div className="relative">
                      <img
                        src={formData.coverImage || "/placeholder.svg"}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange("coverImage", "")}
                        className="absolute top-2 right-2 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors"
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
                        <span className="text-sm font-medium text-blue-900 mb-1">
                          {uploadingImage ? "Uploading..." : "Upload Cover Image"}
                        </span>
                        <span className="text-xs text-blue-500">PNG, JPG up to 5MB</span>
                      </label>
                    </div>
                  )}
                </div>
              </FormField>

              {/* Gallery Upload */}
              <FormField label="Gallery Images" error={errors.gallery}>
                {formData.gallery && formData.gallery.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {formData.gallery.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl || "/placeholder.svg"}
                          alt={`Gallery image ${index + 1}`}
                          className="rounded-lg object-cover w-full h-32"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newGallery = [...formData.gallery]
                            newGallery.splice(index, 1)
                            handleInputChange("gallery", newGallery)
                          }}
                          className="absolute top-2 right-2 bg-blue-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
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
                    className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                  >
                    <Plus size={18} className="mr-2" />
                    {uploadingGallery ? "Uploading..." : "Add Gallery Images"}
                  </label>
                </div>
              </FormField>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-blue-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
