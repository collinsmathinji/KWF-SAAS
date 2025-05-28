"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday as isDateToday,
  startOfMonth,
  endOfMonth,
} from "date-fns"
import {
  MapPin,
  CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Users,
  Tag,
  Info,
  List,
  CalendarDays,
  Plus,
  DollarSign,
  Heart,
  TrendingUp,
  Activity,
  Gift,
  Sparkles,
} from "lucide-react"
import { fetchEvents } from "@/lib/event"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface CalendarEvent {
  id: string
  name: string
  startDate: string
  endDate: string
  venue: string
  address?: string
  city?: string
  country?: string
  description?: string
  isPaid: boolean
  price?: number
  category?: string
  attendees?: number
  type: "event" | "donation"
  targetAmount?: number
  currentAmount?: number
  donorCount?: number
}

export function EventCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [eventsByDate, setEventsByDate] = useState<Record<string, CalendarEvent[]>>({})
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [listFilter, setListFilter] = useState<"upcoming" | "all">("upcoming")
  const { data: session, status } = useSession()
  const router = useRouter()

  // Fetch events and donations from the API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        if (!session?.user?.organizationId) {
          setError("Please log in to view events")
          setLoading(false)
          return
        }

        // Fetch events
        const fetchedEvents = await fetchEvents(session.user.organizationId)
        let eventsData: CalendarEvent[] = []
        if (fetchedEvents?.data?.data) {
          eventsData = fetchedEvents.data.data.map((event: any) => ({
            ...event,
            type: "event",
          }))
        } else if (Array.isArray(fetchedEvents?.data)) {
          eventsData = fetchedEvents.data.map((event: any) => ({
            ...event,
            type: "event",
          }))
        } else if (Array.isArray(fetchedEvents)) {
          eventsData = fetchedEvents.map((event: any) => ({
            ...event,
            type: "event",
          }))
        }

        // Fetch donations
        const donationsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/donation/list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filter: {
              isDeleted: false,
              status: "active",
            },
            options: {
              limit: 100,
              offset: 0,
              order: [["createdAt", "DESC"]],
            },
          }),
        })

        if (donationsResponse.ok) {
          const donationsData = await donationsResponse.json()
          if (donationsData.status === "SUCCESS") {
            const donationEvents = (donationsData.data.rows || []).map((donation: any) => ({
              id: donation.id,
              name: donation.title,
              startDate: donation.startDate,
              endDate: donation.endDate,
              description: donation.description,
              type: "donation",
              targetAmount: donation.targetAmount,
              currentAmount: donation.currentAmount || 0,
              donorCount: donation.donorCount || 0,
              category: donation.category,
              venue: "Online",
              isPaid: true,
              price: donation.minDonation,
            }))
            eventsData = [...eventsData, ...donationEvents]
          }
        }

        setEvents(eventsData)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setError("Failed to load events and donations. Please try again later.")
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      loadData()
    } else if (status === "unauthenticated") {
      setError("Please log in to view events")
      setLoading(false)
    }
  }, [session?.user?.organizationId, status])

  // Group events by date
  useEffect(() => {
    const groupedEvents: Record<string, CalendarEvent[]> = {}
    events.forEach((event) => {
      const dateKey = new Date(event.startDate).toISOString().split("T")[0]
      if (!groupedEvents[dateKey]) {
        groupedEvents[dateKey] = []
      }
      groupedEvents[dateKey].push(event)
    })
    setEventsByDate(groupedEvents)
  }, [events])

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a")
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy")
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleRegister = (eventId: string) => {
    window.location.href = `/events/register/${eventId}`
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const getAllEvents = () => {
    return [...events].sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })
  }

  const getUpcomingEvents = () => {
    const now = new Date()
    return [...events]
      .filter((event) => new Date(event.startDate) >= now)
      .sort((a, b) => {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      })
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  const getCurrentMonthEvents = () => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)

    return events.filter((event) => {
      const eventDate = new Date(event.startDate)
      return eventDate >= start && eventDate <= end
    })
  }

  const handleCreateEvent = () => {
    router.push("/dashboard/events/create")
  }

  const handleCreateDonation = () => {
    router.push("/dashboard/donations/create")
  }

  const handleViewAllEvents = () => {
    router.push("/dashboard/events")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-[500px] w-full rounded-xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Info className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-800">Unable to Load Events</CardTitle>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Event Calendar
            </h1>
            <p className="text-slate-600 text-lg">Manage your events and donation campaigns</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-11 px-6 bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
              onClick={goToToday}
            >
              <CalendarDays className="h-4 w-4 text-blue-600 mr-2" />
              <span className="font-medium">Today</span>
            </Button>

            <Button className="h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="h-4 w-4 mr-2" />
              <span className="font-medium">Create Event</span>
            </Button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    {format(currentMonth, "MMMM yyyy")}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePreviousMonth}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNextMonth}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    className="w-full"
                    modifiers={{
                      hasEvents: (date) => {
                        const dateKey = date.toISOString().split("T")[0]
                        return !!eventsByDate[dateKey] && eventsByDate[dateKey].length > 0
                      },
                      today: (date) => isDateToday(date),
                    }}
                    modifiersClassNames={{
                      hasEvents:
                        "bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-900 font-medium border border-blue-200",
                      selected:
                        "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700",
                      today: "border-2 border-amber-400 bg-amber-50 font-bold text-amber-900",
                    }}
                    components={{
                      DayContent: ({ date }) => {
                        const dateKey = date.toISOString().split("T")[0]
                        const hasEvents = !!eventsByDate[dateKey] && eventsByDate[dateKey].length > 0
                        const eventsCount = hasEvents ? eventsByDate[dateKey].length : 0
                        const isSelected = selectedDate && isSameDay(date, selectedDate)
                        const isCurrentMonth = isSameMonth(date, currentMonth)
                        const isTodayDate = isDateToday(date)

                        return (
                          <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
                            <div
                              className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                                isSelected ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" : "",
                                !isCurrentMonth ? "text-gray-300" : "",
                                hasEvents && !isSelected ? "text-blue-900 font-semibold" : "",
                                isTodayDate && !isSelected
                                  ? "border-2 border-amber-400 bg-amber-50 font-bold text-amber-900"
                                  : "",
                              )}
                            >
                              {date.getDate()}
                            </div>
                            {hasEvents && (
                              <div className="absolute bottom-1 flex gap-0.5 justify-center">
                                {Array.from({ length: Math.min(3, eventsCount) }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white" : "bg-blue-500")}
                                  />
                                ))}
                                {eventsCount > 3 && (
                                  <div
                                    className={cn(
                                      "text-xs font-bold ml-1",
                                      isSelected ? "text-white" : "text-blue-600",
                                    )}
                                  >
                                    +{eventsCount - 3}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      },
                    }}
                  />
                </div>

                {/* Enhanced Legend */}
                <div className="flex items-center justify-center gap-6 mt-6 p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded"></div>
                    <span className="text-slate-600 font-medium">Has Events</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded"></div>
                    <span className="text-slate-600 font-medium">Selected</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 border-2 border-amber-400 bg-amber-50 rounded"></div>
                    <span className="text-slate-600 font-medium">Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Monthly Statistics */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-800">{getCurrentMonthEvents().length}</div>
                    <div className="text-xs text-blue-600">Events</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Paid</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-800">
                      {getCurrentMonthEvents().filter((e) => e.type === "event" && e.isPaid).length}
                    </div>
                    <div className="text-xs text-emerald-600">Events</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Gift className="h-5 w-5 text-purple-600" />
                      <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">Free</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-800">
                      {getCurrentMonthEvents().filter((e) => e.type === "event" && !e.isPaid).length}
                    </div>
                    <div className="text-xs text-purple-600">Events</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Heart className="h-5 w-5 text-amber-600" />
                      <span className="text-xs font-medium text-amber-700 uppercase tracking-wide">Donations</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-800">
                      {getCurrentMonthEvents().filter((e) => e.type === "donation").length}
                    </div>
                    <div className="text-xs text-amber-600">Campaigns</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  onClick={handleCreateEvent}
                >
                  <Plus className="h-4 w-4 mr-3" />
                  Create New Event
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-amber-200 text-amber-700 hover:bg-amber-50"
                  onClick={handleCreateDonation}
                >
                  <Heart className="h-4 w-4 mr-3" />
                  Start Donation Campaign
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleViewAllEvents}
                >
                  <List className="h-4 w-4 mr-3" />
                  View All Events
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Selected Date Events */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                Events for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Selected Date"}
              </CardTitle>
              {selectedDate && eventsByDate[selectedDate.toISOString().split("T")[0]]?.length > 0 && (
                <Badge className="bg-white/20 text-white border-white/30 font-medium">
                  {eventsByDate[selectedDate.toISOString().split("T")[0]].length} event(s)
                </Badge>
              )}
            </div>
            {selectedDate && isDateToday(selectedDate) && (
              <CardDescription className="text-amber-200 font-medium flex items-center gap-2 mt-2">
                <div className="h-2 w-2 bg-amber-300 rounded-full animate-pulse"></div>
                Today's Events
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-6">
            {selectedDate && (
              <div className="min-h-[400px]">
                {eventsByDate[selectedDate.toISOString().split("T")[0]]?.length > 0 ? (
                  <div className="space-y-4">
                    {eventsByDate[selectedDate.toISOString().split("T")[0]].map((event) => (
                      <div
                        key={event.id}
                        className="group p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-slate-800 text-xl group-hover:text-blue-700 transition-colors">
                            {event.name}
                          </h3>
                          <div className="flex gap-2">
                            {event.type === "donation" ? (
                              <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 font-medium">
                                <Heart className="w-3 h-3 mr-1" />
                                Donation Campaign
                              </Badge>
                            ) : (
                              <Badge
                                className={
                                  event.isPaid
                                    ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200 font-medium"
                                    : "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200 font-medium"
                                }
                              >
                                {event.isPaid ? `$${event.price}` : "Free"}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-3 text-slate-600">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <Clock className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium">
                              {formatTime(event.startDate)} - {formatTime(event.endDate)}
                            </span>
                          </div>

                          {event.type === "event" && (
                            <div className="flex items-center gap-3 text-slate-600">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <MapPin className="w-4 h-4 text-blue-600" />
                              </div>
                              <span>
                                {event.venue}
                                {event.city && `, ${event.city}`}
                              </span>
                            </div>
                          )}

                          {event.type === "donation" && (
                            <>
                              <div className="flex items-center gap-3 text-slate-600">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                  <DollarSign className="w-4 h-4 text-amber-600" />
                                </div>
                                <span>
                                  Progress: ${event.currentAmount?.toLocaleString()} / $
                                  {event.targetAmount?.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-slate-600">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                  <Users className="w-4 h-4 text-amber-600" />
                                </div>
                                <span>{event.donorCount} donors</span>
                              </div>
                              {/* Progress Bar */}
                              <div className="mt-3">
                                <div className="flex justify-between text-sm text-slate-600 mb-1">
                                  <span>Progress</span>
                                  <span>
                                    {Math.round(((event.currentAmount || 0) / (event.targetAmount || 1)) * 100)}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${Math.min(((event.currentAmount || 0) / (event.targetAmount || 1)) * 100, 100)}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </>
                          )}

                          {event.category && (
                            <div className="flex items-center gap-3 text-slate-600">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <Tag className="w-4 h-4 text-blue-600" />
                              </div>
                              <span>{event.category}</span>
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed">{event.description}</p>
                        )}

                        <div className="flex justify-end">
                          {event.type === "donation" ? (
                            <Button
                              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                              onClick={() => (window.location.href = `/donations/${event.id}`)}
                            >
                              <Heart className="w-4 h-4 mr-2" />
                              Donate Now
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                              onClick={() => handleRegister(event.id)}
                            >
                              Register
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-full mb-6 border border-slate-200">
                      <CalendarIcon className="w-16 h-16 text-slate-400" />
                    </div>
                    <h3 className="text-slate-800 font-semibold text-2xl mb-2">No events scheduled</h3>
                    <p className="text-slate-500 text-lg max-w-md leading-relaxed">
                      There are no events or donation campaigns scheduled for this date. Why not create one?
                    </p>
                    <Button 
                      className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={handleCreateEvent}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
