"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { fetchEvents } from "@/lib/event"
import { useSession } from "next-auth/react"
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Users,
  ChevronRight,
  X,
  Info,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react"
import { Calendar as EventCalendar } from "@/components/ui/calendar"

interface Event {
  id: string
  name: string
  startDate: string
  endDate: string
  venue: string
  address: string
  city: string
  country?: string
  description: string
  isPaid: boolean
  price: number
  stripeProductId?: string
  stripePriceId?: string
  coverImage?: string
  organizationId: string
}

interface Guest {
  name: string
  email: string
}

interface CheckoutFormData {
  email: string
  guestFirstName: string
  guestLastName: string
  eventId: string
  organizationId: string
  quantity: number
  mode: string
  guests: Guest[]
  successUrl: string
  cancelUrl: string
}

const EventsDisplay: React.FC = () => {
  const [events, setEvents] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    guestFirstName: "",
    guestLastName: "",
    eventId: "",
    organizationId: "",
    quantity: 1,
    mode: "payment",
    guests: [],
    successUrl: "",
    cancelUrl: "",
  })

  const router = useRouter()

  const [showShareModal, setShowShareModal] = useState<boolean>(false)
  const [shareEvent, setShareEvent] = useState<Event | null>(null)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [eventsByDate, setEventsByDate] = useState<Record<string, Event[]>>({})

  useEffect(() => {
    async function loadEvents() {
      try {
        const events = await fetchEvents(session?.user?.organizationId as string | undefined);
        setEvents(events || []) // Ensure events is always an array
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch events:", error)
        setError("Failed to load events. Please try again later.")
        setEvents([]) // Fallback to an empty array in case of an error
        setLoading(false)
      }
    }

    if (session?.user?.organizationId) {
      loadEvents()
    } else {
      setLoading(false)
    }
  }, [session?.user?.organizationId])

  useEffect(() => {
    // Group events by date (YYYY-MM-DD)
    const byDate: Record<string, Event[]> = {}
    if (Array.isArray(events)) {
      events.forEach((event: Event) => {
        const dateKey = new Date(event.startDate).toISOString().split("T")[0]
        if (!byDate[dateKey]) byDate[dateKey] = []
        byDate[dateKey].push(event)
      })
    }
    setEventsByDate(byDate)
  }, [events])

  const handleRegister = (event: Event) => {
    setSelectedEvent(event)
    // Initialize form with default values
    setFormData({
      ...formData,
      eventId: event.id,
      organizationId: event.organizationId || organizationId || "",
      quantity: 1,
      mode: "payment",
      successUrl: `${process.env.NEXT_PUBLIC_API_URL}/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_API_URL}/events`,
      guests: [],
    })
    setShowCheckout(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const quantity = Number.parseInt(e.target.value)

    // Update quantity and resize guests array
    const newGuests = [...formData.guests]

    // If increasing quantity, add empty guest objects
    if (quantity > newGuests.length) {
      for (let i = newGuests.length; i < quantity - 1; i++) {
        newGuests.push({ name: "", email: "" })
      }
    }
    // If decreasing quantity, remove extra guests
    else if (quantity < newGuests.length + 1) {
      newGuests.splice(quantity - 1)
    }

    setFormData({
      ...formData,
      quantity,
      guests: newGuests,
    })
  }

  const handleGuestChange = (index: number, field: keyof Guest, value: string) => {
    const updatedGuests = [...formData.guests]
    updatedGuests[index] = { ...updatedGuests[index], [field]: value }

    setFormData({
      ...formData,
      guests: updatedGuests,
    })
  }

  const handleShare = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation()
    setShareEvent(event)
    setShowShareModal(true)
  }

  const shareToSocial = (platform: string) => {
    if (!shareEvent) return

    const eventUrl = `${window.location.origin}/events/${shareEvent.id}`
    const title = shareEvent.name
    const text = `Check out this event: ${title}`

    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(eventUrl)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${eventUrl}`)}`
        break
      default:
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
    }

    setShowShareModal(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedEvent) return

    try {
      // For paid events, create Stripe checkout session
      if (selectedEvent.isPaid && selectedEvent.stripePriceId) {
        // Create primary guest (ticket purchaser)
        const primaryGuest = {
          name: `${formData.guestFirstName} ${formData.guestLastName}`,
          email: formData.email,
        }

        // Format checkout data with the correct event ID
        const checkoutData = {
          priceId: selectedEvent.stripePriceId,
          successUrl: formData.successUrl,
          cancelUrl: formData.cancelUrl,
          mode: formData.mode,
          quantity: formData.quantity,
          eventId: selectedEvent.id, // Ensure we're using the correct event ID from selectedEvent
          organizationId: Number.parseInt(formData.organizationId) || 64,
          guests: [primaryGuest, ...formData.guests],
        }

        console.log("Sending checkout data:", checkoutData)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/create-event-checkout-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(checkoutData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create checkout session")
        }

        const data = await response.json()

        if (data.sessionUrl) {
          // Remove pre-registration code - as requested
          // Directly redirect to Stripe checkout
          window.location.href = data.sessionUrl
        } else {
          throw new Error("No session URL returned")
        }
      } else {
        // For free events, register directly
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/events/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: selectedEvent.id,
            email: formData.email,
            guestName: `${formData.guestFirstName} ${formData.guestLastName}`,
            paymentStatus: "registered", // Already registered for free events
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Registration failed")
        }

        alert("Registration successful!")
        setShowCheckout(false)
        // Reset form after successful registration
        setFormData({
          email: "",
          guestFirstName: "",
          guestLastName: "",
          eventId: "",
          organizationId: organizationId || "",
          quantity: 1,
          mode: "payment",
          guests: [],
          successUrl: "",
          cancelUrl: "",
        })
      }
    } catch (err: any) {
      console.error("Registration error:", err)
      alert(`Error: ${err.message}`)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-red-50 p-8 rounded-xl shadow-lg border border-red-100 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-2 rounded-full">
              <Info className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800">Error loading events</h3>
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-3">Upcoming Events</h1>
          <p className="text-blue-600 max-w-2xl mx-auto">
            Discover and register for our exciting events happening soon
          </p>
        </div>

        {/* Calendar View */}
        <div className="mb-10 flex flex-col items-center">
          <EventCalendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              hasEvent: (date: Date) => {
                const key = date.toISOString().split("T")[0]
                return !!eventsByDate[key]
              },
            }}
            modifiersClassNames={{
              hasEvent: "bg-blue-200 text-blue-900 font-bold border border-blue-400",
            }}
          />
          {/* List events for selected date */}
          {selectedDate && eventsByDate[selectedDate.toISOString().split("T")[0]] && (
            <div className="w-full max-w-xl mt-6 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Events on {selectedDate.toLocaleDateString()}
              </h2>
              <ul className="space-y-4">
                {eventsByDate[selectedDate.toISOString().split("T")[0]].map((event) => (
                  <li key={event.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-800">{event.name}</span>
                      <button
                        onClick={() => handleRegister(event)}
                        className="ml-4 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-700 text-sm"
                      >
                        {event.isPaid ? "Pay & Register" : "Register"}
                      </button>
                    </div>
                    <div className="text-sm text-blue-600">{formatDate(event.startDate)} - {formatDate(event.endDate)}</div>
                    <div className="text-xs text-blue-500">{event.venue}{event.city ? `, ${event.city}` : ""}{event.country ? `, ${event.country}` : ""}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Checkout Modal */}
        {showCheckout && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 border-b border-blue-100 pb-4">
                <h2 className="text-2xl font-bold text-blue-800">
                  {selectedEvent.isPaid ? "Payment & Registration" : "Event Registration"}
                </h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-800 text-lg">{selectedEvent.name}</h3>
                    {selectedEvent.isPaid && (
                      <p className="text-green-600 font-semibold mt-1">
                        <DollarSign className="w-4 h-4 inline-block mr-1" />${selectedEvent.price}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Primary Guest Information */}
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Primary Guest Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        name="guestFirstName"
                        value={formData.guestFirstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="guestLastName"
                        value={formData.guestLastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-blue-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {selectedEvent.isPaid && (
                  <>
                    {/* Payment Configuration */}
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                      <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Ticket Quantity & Payment
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">Quantity *</label>
                          <select
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleQuantityChange}
                            required
                            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">Payment Mode *</label>
                          <select
                            name="mode"
                            value={formData.mode}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="payment">One-time Payment</option>
                            <option value="subscription">Subscription</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-blue-700 mb-1">Organization ID *</label>
                          <input
                            type="text"
                            name="organizationId"
                            value={formData.organizationId}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">Success URL *</label>
                          <input
                            type="text"
                            name="successUrl"
                            value={formData.successUrl}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">Cancel URL *</label>
                          <input
                            type="text"
                            name="cancelUrl"
                            value={formData.cancelUrl}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Guests */}
                    {formData.quantity > 1 && (
                      <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Additional Guests
                        </h3>
                        {formData.guests.map((guest, index) => (
                          <div
                            key={index}
                            className="border-t border-blue-200 pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0"
                          >
                            <h4 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
                              <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center text-blue-700 font-bold">
                                {index + 1}
                              </div>
                              Guest Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-blue-700 mb-1">Full Name *</label>
                                <input
                                  type="text"
                                  value={guest.name}
                                  onChange={(e) => handleGuestChange(index, "name", e.target.value)}
                                  required
                                  placeholder="Full Name"
                                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-blue-700 mb-1">Email *</label>
                                <input
                                  type="email"
                                  value={guest.email}
                                  onChange={(e) => handleGuestChange(index, "email", e.target.value)}
                                  required
                                  placeholder="Email Address"
                                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  className={`w-full py-3 px-6 rounded-lg text-white font-bold text-lg transition-all transform hover:scale-[1.02] ${
                    selectedEvent.isPaid
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                  }`}
                >
                  {selectedEvent.isPaid ? "Proceed to Payment" : "Complete Registration"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && shareEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full">
              <div className="flex justify-between items-center mb-6 border-b border-blue-100 pb-4">
                <h2 className="text-2xl font-bold text-blue-800">Share Event</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="mb-6 text-blue-700">Share "{shareEvent.name}" with your network:</p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => shareToSocial("facebook")}
                  className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  <span>Facebook</span>
                </button>

                <button
                  onClick={() => shareToSocial("twitter")}
                  className="flex items-center justify-center gap-2 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  <span>Twitter</span>
                </button>

                <button
                  onClick={() => shareToSocial("linkedin")}
                  className="flex items-center justify-center gap-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </button>

                <button
                  onClick={() => shareToSocial("email")}
                  className="flex items-center justify-center gap-2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {Array.isArray(events) ? events.map((event: any) => (
          <div
            key={event.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] border border-blue-50"
          >
            {event.coverImage ? (
              <div className="relative h-56">
                <Image
                  src={event.coverImage || "/placeholder.svg"}
                  alt={event.name}
                  fill
                  className="object-cover"
                />
                {event.isPaid && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    ${event.price}
                  </div>
                )}
                {!event.isPaid && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Free
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 h-56 flex items-center justify-center relative">
                <Calendar className="w-16 h-16 text-blue-300" />
                {event.isPaid && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    ${event.price}
                  </div>
                )}
                {!event.isPaid && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Free
                  </div>
                )}
              </div>
            )}

            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 text-blue-800 truncate">{event.name}</h3>

              <div className="mb-4 space-y-2">
                <div className="flex items-center text-blue-700">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <p className="text-sm">
                    <span className="font-medium">Start:</span> {formatDate(event.startDate)}
                  </p>
                </div>
                <div className="flex items-center text-blue-700">
                  <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                  <p className="text-sm">
                    <span className="font-medium">End:</span> {formatDate(event.endDate)}
                  </p>
                </div>
                <div className="flex items-center text-blue-700">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <p className="text-sm">
                    <span className="font-medium">Location:</span> {event.venue}
                    {event.city && `, ${event.city}`}
                    {event.country && `, ${event.country}`}
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-sm text-blue-600 line-clamp-3">
                  {event.description || "No description available"}
                </p>
              </div>

              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={(e) => handleShare(event, e)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Share</span>
                </button>
                {event.isPaid && <span className="font-semibold text-green-600">${event.price}</span>}
              </div>

              <button
                onClick={() => handleRegister(event)}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-bold transition-all ${
                  event.isPaid
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                }`}
              >
                {event.isPaid ? "Pay & Register" : "Register Now"}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )) : null}
      </div>
    </div>
  )
}

export default EventsDisplay
