"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Calendar,
  MapPin,
  Clock,
  Tag,
  Search,
  Filter,
  X,
  DollarSign,
  Users,
} from "lucide-react"
import { Calendar as EventCalendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  coverImage?: string
  category?: string
  stripePriceId?: string
  organizationId?: string
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const PublicEventsDisplay = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [eventsByDate, setEventsByDate] = useState<Record<string, Event[]>>({})
  const [showCheckout, setShowCheckout] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    guestFirstName: "",
    guestLastName: "",
    eventId: "",
    organizationId: "",
    quantity: 1,
    mode: "payment",
    guests: [],
    successUrl: `${process.env.NEXT_PUBLIC_API_URL || window.location.origin}/success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_API_URL || window.location.origin}/events`,
  })

  // Mock categories for the filter - you can replace these with actual categories from your backend
  const categories = ["Workshop", "Conference", "Meetup", "Webinar", "Training"]

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/event/list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filter: { isDeleted: false, status: "active" },
          }),
        })
        const result = await response.json()
        const eventsArray = result.data?.data || []
        setEvents(eventsArray)
        setFilteredEvents(eventsArray)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch events:", error)
        setEvents([])
        setFilteredEvents([])
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  useEffect(() => {
    // Group events by date (YYYY-MM-DD)
    const byDate: Record<string, Event[]> = {}
    events.forEach((event: Event) => {
      const dateKey = new Date(event.startDate).toISOString().split("T")[0]
      if (!byDate[dateKey]) byDate[dateKey] = []
      byDate[dateKey].push(event)
    })
    setEventsByDate(byDate)
  }, [events])

  // Filter events based on search term, category, and date
  useEffect(() => {
    let filtered = [...events]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term) ||
          event.venue.toLowerCase().includes(term) ||
          (event.city && event.city.toLowerCase().includes(term))
      )
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((event) => event.category === categoryFilter)
    }

    // Apply date filter
    if (selectedDate) {
      const dateKey = selectedDate.toISOString().split("T")[0]
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.startDate).toISOString().split("T")[0]
        return eventDate === dateKey
      })
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, categoryFilter, selectedDate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleQuantityChange = (value: string) => {
    const quantity = Number.parseInt(value)

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

  const handleEventRegistration = async (event: Event) => {
    if (event.isPaid) {
      setSelectedEvent(event)
      // Initialize form with default values
      setFormData({
        ...formData,
        eventId: event.id,
        organizationId: event.organizationId || "",
        quantity: 1,
        mode: "payment",
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${ window.location.origin}/events`,
        guests: [],
      })
      setShowCheckout(true)
    } else {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/event/register-free`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: event.id,
            email: formData.email,
            guestName: `${formData.guestFirstName} ${formData.guestLastName}`,
          }),
        })
        
        if (response.ok) {
          alert("Successfully registered for the event!")
        } else {
          alert("Failed to register for the event. Please try again.")
        }
      } catch (error) {
        console.error("Error registering for event:", error)
        alert("Failed to register for the event. Please try again.")
      }
    }
  }

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
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

        // Format checkout data
        const checkoutData = {
          priceId: selectedEvent.stripePriceId,
          successUrl: formData.successUrl,
          cancelUrl: formData.cancelUrl,
          mode: formData.mode,
          quantity: formData.quantity,
          eventId: selectedEvent.id,
          organizationId: Number.parseInt(formData.organizationId) || 64,
          guests: [primaryGuest, ...formData.guests],
        }

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
          window.location.href = data.sessionUrl
        } else {
          throw new Error("No checkout URL returned")
        }
      }
    } catch (error) {
      console.error("Error initiating checkout:", error)
      alert("Failed to initiate checkout. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-3" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg border border-blue-50">
                <Skeleton className="h-56 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-3">Upcoming Events</h1>
          <p className="text-blue-600 max-w-2xl mx-auto">
            Discover and register for our exciting events happening soon
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
              <Input
                placeholder="Search events..."
                className="pl-10 border-blue-200 focus:border-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-blue-500" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-blue-200 focus:border-blue-400">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant={selectedDate ? "default" : "outline"}
                onClick={() => setSelectedDate(selectedDate ? undefined : new Date())}
                className={selectedDate ? "bg-blue-600" : "border-blue-200 text-blue-700"}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? "Clear Date Filter" : "Filter by Date"}
              </Button>

              <div className="flex rounded-md overflow-hidden border border-blue-200">
                <Button
                  variant="ghost"
                  className={`rounded-none px-3 ${viewMode === "grid" ? "bg-blue-100 text-blue-700" : "text-blue-600"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  className={`rounded-none px-3 ${viewMode === "list" ? "bg-blue-100 text-blue-700" : "text-blue-600"}`}
                  onClick={() => setViewMode("list")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" x2="21" y1="6" y2="6" />
                    <line x1="3" x2="21" y1="12" y2="12" />
                    <line x1="3" x2="21" y1="18" y2="18" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View (when date filter is active) */}
        {selectedDate && (
          <div className="mb-10 flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl shadow-md">
            <div className="md:w-1/3">
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
                className="rounded-md border border-blue-200"
              />
            </div>

            <div className="md:w-2/3">
              <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Events on {selectedDate.toLocaleDateString()}
              </h2>

              {eventsByDate[selectedDate.toISOString().split("T")[0]] &&
              eventsByDate[selectedDate.toISOString().split("T")[0]].length > 0 ? (
                <div className="space-y-4">
                  {eventsByDate[selectedDate.toISOString().split("T")[0]].map((event) => (
                    <div
                      key={event.id}
                      className="border border-blue-100 rounded-lg p-4 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-blue-800 text-lg">{event.name}</h3>
                          <div className="text-sm text-blue-600 mt-1">
                            {formatDate(event.startDate)} - {formatDate(event.endDate)}
                          </div>
                          <div className="text-sm text-blue-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.venue}
                            {event.city ? `, ${event.city}` : ""}
                            {event.country ? `, ${event.country}` : ""}
                          </div>
                          {event.category && (
                            <Badge className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200">{event.category}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-blue-600">
                  No events scheduled for this date.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Events Display */}
        <div className="space-y-6">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6 w-full justify-start border-b pb-0 bg-transparent">
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none data-[state=active]:shadow-none bg-transparent"
              >
                Upcoming Events
              </TabsTrigger>
              <TabsTrigger
                value="featured"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none data-[state=active]:shadow-none bg-transparent"
              >
                Featured Events
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none data-[state=active]:shadow-none bg-transparent"
              >
                Past Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              {filteredEvents.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event: Event) => (
                      <div
                        key={event.id}
                        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] border border-blue-50"
                      >
                        <div className="relative h-56">
                          <Image
                            src={event.coverImage || "/placeholder.svg?height=400&width=600"}
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
                          {event.category && (
                            <div className="absolute bottom-4 left-4 bg-white/90 text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm flex items-center gap-1">
                              <Tag size={14} />
                              {event.category}
                            </div>
                          )}
                        </div>

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
                              <p className="text-sm truncate">
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

                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleEventRegistration(event)}
                          >
                            {event.isPaid ? `Register - $${event.price}` : "Register - Free"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEvents.map((event: Event) => (
                      <div
                        key={event.id}
                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-blue-50 flex flex-col md:flex-row"
                      >
                        <div className="relative md:w-1/4 h-48 md:h-auto">
                          <Image
                            src={event.coverImage || "/placeholder.svg?height=400&width=600"}
                            alt={event.name}
                            fill
                            className="object-cover"
                          />
                          {event.category && (
                            <div className="absolute bottom-4 left-4 bg-white/90 text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm flex items-center gap-1">
                              <Tag size={14} />
                              {event.category}
                            </div>
                          )}
                        </div>

                        <div className="p-6 flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold mb-2 text-blue-800">{event.name}</h3>
                            {event.isPaid ? (
                              <Badge className="bg-green-500">${event.price}</Badge>
                            ) : (
                              <Badge className="bg-blue-500">Free</Badge>
                            )}
                          </div>

                          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
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
                            <div className="flex items-center text-blue-700 col-span-2">
                              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                              <p className="text-sm">
                                <span className="font-medium">Location:</span> {event.venue}
                                {event.city && `, ${event.city}`}
                                {event.country && `, ${event.country}`}
                              </p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-blue-600 line-clamp-2">
                              {event.description || "No description available"}
                            </p>
                          </div>

                          <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleEventRegistration(event)}
                          >
                            {event.isPaid ? `Register - $${event.price}` : "Register - Free"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">No Events Found</h3>
                  <p className="text-blue-600">
                    {searchTerm || categoryFilter !== "all" || selectedDate
                      ? "Try adjusting your filters to see more events."
                      : "Check back later for upcoming events."}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured" className="mt-6">
              {/* Featured events content - similar structure as upcoming */}
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Featured Events Coming Soon</h3>
                <p className="text-blue-600">Stay tuned for our featured events.</p>
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {/* Past events content - similar structure as upcoming */}
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Past Events Archive</h3>
                <p className="text-blue-600">Browse through our past events.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {showCheckout && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
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
                    <p className="text-blue-600 text-sm mt-1">{formatDate(selectedEvent.startDate)}</p>
                    {selectedEvent.isPaid && (
                      <p className="text-green-600 font-semibold mt-1">
                        <DollarSign className="w-4 h-4 inline-block mr-1" />${selectedEvent.price}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleCheckout}>
                {/* Primary Guest Information */}
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6">
                  <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Primary Guest Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">First Name *</label>
                      <Input
                        type="text"
                        name="guestFirstName"
                        value={formData.guestFirstName}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">Last Name *</label>
                      <Input
                        type="text"
                        name="guestLastName"
                        value={formData.guestLastName}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-blue-700 mb-1">Email *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {selectedEvent.isPaid && (
                  <>
                    {/* Payment Configuration */}
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6">
                      <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Ticket Quantity & Payment
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">Quantity *</label>
                          <Select value={formData.quantity.toString()} onValueChange={handleQuantityChange}>
                            <SelectTrigger className="border-blue-200 focus:border-blue-500">
                              <SelectValue placeholder="Select quantity" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">Payment Mode *</label>
                          <Select
                            value={formData.mode}
                            onValueChange={(value) => setFormData({ ...formData, mode: value })}
                          >
                            <SelectTrigger className="border-blue-200 focus:border-blue-500">
                              <SelectValue placeholder="Select payment mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="payment">One-time Payment</SelectItem>
                              <SelectItem value="subscription">Subscription</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Additional Guests */}
                    {formData.quantity > 1 && (
                      <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6">
                        <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Additional Guests
                        </h3>
                        <div className="space-y-6">
                          {formData.guests.map((guest, index) => (
                            <div key={index} className="p-4 bg-white rounded-lg border border-blue-100">
                              <h4 className="font-medium text-blue-800 mb-3">Guest {index + 2}</h4>
                              <div className="grid grid-cols-1 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-blue-700 mb-1">Full Name *</label>
                                  <Input
                                    type="text"
                                    value={guest.name}
                                    onChange={(e) => handleGuestChange(index, "name", e.target.value)}
                                    required
                                    placeholder="Full Name"
                                    className="border-blue-200 focus:border-blue-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-blue-700 mb-1">Email *</label>
                                  <Input
                                    type="email"
                                    value={guest.email}
                                    onChange={(e) => handleGuestChange(index, "email", e.target.value)}
                                    required
                                    placeholder="Email Address"
                                    className="border-blue-200 focus:border-blue-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <Button
                  type="submit"
                  className={`w-full py-6 text-lg ${
                    selectedEvent.isPaid
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  } text-white`}
                >
                  {selectedEvent.isPaid ? "Proceed to Payment" : "Complete Registration"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicEventsDisplay 