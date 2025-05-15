"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  format, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  parseISO, 
  isToday as isDateToday,
  startOfMonth,
  endOfMonth
} from "date-fns"
import {
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Users,
  Tag,
  Info,
  List,
  CalendarPlus2Icon as CalendarIcon2,
  Filter,
  Search,
  CalendarDays,
  Plus,
} from "lucide-react"
import { fetchEvents } from "@/lib/event"
import { cn } from "@/lib/utils"

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

  // Fetch events from the API
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true)

        if (!session?.user?.organizationId) {
          setError("Please log in to view events")
          setLoading(false)
          return
        }

        const fetchedEvents = await fetchEvents(session.user.organizationId)
        
        // Handle different API response structures
        let eventsData: CalendarEvent[] = []
        if (fetchedEvents?.data?.data) {
          eventsData = fetchedEvents.data.data
        } else if (Array.isArray(fetchedEvents?.data)) {
          eventsData = fetchedEvents.data
        } else if (Array.isArray(fetchedEvents)) {
          eventsData = fetchedEvents
        }

        setEvents(eventsData)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch events:", error)
        setError("Failed to load events. Please try again later.")
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      loadEvents()
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
    // Redirect to the event registration page or open modal
    window.location.href = `/events/register/${eventId}`
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  // Get all events for list view
  const getAllEvents = () => {
    return [...events].sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })
  }

  // Get upcoming events (only future events) for list view
  const getUpcomingEvents = () => {
    const now = new Date()
    return [...events]
      .filter(event => new Date(event.startDate) >= now)
      .sort((a, b) => {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      });
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  // Get events for the current month
  const getCurrentMonthEvents = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= start && eventDate <= end;
    });
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[600px] w-full rounded-md" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 m-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <Info className="w-5 h-5 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Error loading events</CardTitle>
          </div>
          <CardDescription className="text-red-700">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="mt-2 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Event Calendar</h2>
          <p className="text-slate-500 mt-1">Manage and view your upcoming events</p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 gap-2 bg-white shadow-sm border-blue-200"
            onClick={goToToday}
          >
            <CalendarDays className="h-4 w-4 text-blue-600" />
            <span>Today</span>
          </Button>

          <Button 
            variant="default" 
            size="sm"
            className="h-9 gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="calendar" value={viewMode} onValueChange={(v) => setViewMode(v as "calendar" | "list")} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <TabsList className="h-10">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon2 className="h-4 w-4" />
              <span>Calendar View</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>List View</span>
            </TabsTrigger>
          </TabsList>

          {viewMode === "list" && (
            <div className="flex items-center gap-2">
              <Button 
                variant={listFilter === "upcoming" ? "default" : "outline"} 
                size="sm"
                className={cn(
                  "h-8 text-sm",
                  listFilter === "upcoming" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-200"
                )}
                onClick={() => setListFilter("upcoming")}
              >
                Upcoming Events
              </Button>
              <Button 
                variant={listFilter === "all" ? "default" : "outline"} 
                size="sm"
                className={cn(
                  "h-8 text-sm",
                  listFilter === "all" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-200"
                )}
                onClick={() => setListFilter("all")}
              >
                All Events
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="calendar" className="m-0 p-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Calendar */}
            <Card className="border shadow-sm lg:col-span-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    {format(currentMonth, "MMMM yyyy")}
                  </CardTitle>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" onClick={handlePreviousMonth} className="h-8 w-8 p-0 rounded-full">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleNextMonth} className="h-8 w-8 p-0 rounded-full">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="rounded-md border border-gray-100 shadow-sm">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    className="rounded-md border-0"
                    modifiers={{
                      hasEvents: (date) => {
                        const dateKey = date.toISOString().split("T")[0]
                        return !!eventsByDate[dateKey] && eventsByDate[dateKey].length > 0
                      },
                      today: (date) => isDateToday(date),
                    }}
                    modifiersClassNames={{
                      hasEvents: "relative bg-blue-50 text-blue-900 font-medium",
                      selected:
                        "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                      today: "border border-blue-300 font-bold",
                    }}
                    components={{
                      DayContent: (props) => {
                        const dateKey = props.date.toISOString().split("T")[0]
                        const hasEvents = !!eventsByDate[dateKey] && eventsByDate[dateKey].length > 0
                        const isSelected = selectedDate && isSameDay(props.date, selectedDate)
                        const isCurrentMonth = isSameMonth(props.date, currentMonth)
                        const isTodayDate = isDateToday(props.date)

                        return (
                          <div className="relative w-full h-full flex items-center justify-center">
                            <div
                              className={cn(
                                "flex items-center justify-center w-9 h-9 rounded-full transition-colors",
                                isSelected ? "bg-blue-600 text-white" : "",
                                !isCurrentMonth ? "text-gray-300" : "",
                                hasEvents && !isSelected ? "text-blue-900" : "",
                                isTodayDate && !isSelected ? "border border-blue-300 font-bold" : ""
                              )}
                            >
                              {props.date.getDate()}
                            </div>
                            {hasEvents && (
                              <div className="absolute bottom-1 flex gap-0.5 justify-center">
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                {eventsByDate[dateKey].length > 1 && (
                                  <>
                                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                    {eventsByDate[dateKey].length > 2 && (
                                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      },
                    }}
                  />
                </div>

                {/* Legend */}
                <div className="mt-4 flex items-center justify-center text-xs text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-50 border border-blue-200 rounded-full mr-1"></div>
                    <span>Has events</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 border border-blue-300 rounded-full mr-1"></div>
                    <span>Today</span>
                  </div>
                </div>

                {/* Monthly Statistics */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">This Month</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-md bg-blue-50 border border-blue-100">
                      <div className="text-lg font-bold text-blue-700">{getCurrentMonthEvents().length}</div>
                      <div className="text-xs text-blue-600">Total Events</div>
                    </div>
                    <div className="p-3 rounded-md bg-green-50 border border-green-100">
                      <div className="text-lg font-bold text-green-700">
                        {getCurrentMonthEvents().filter(e => e.isPaid).length}
                      </div>
                      <div className="text-xs text-green-600">Paid Events</div>
                    </div>
                    <div className="p-3 rounded-md bg-purple-50 border border-purple-100">
                      <div className="text-lg font-bold text-purple-700">
                        {getCurrentMonthEvents().filter(e => !e.isPaid).length}
                      </div>
                      <div className="text-xs text-purple-600">Free Events</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Events */}
            <Card className="border shadow-sm lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                    Events for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Selected Date"}
                  </CardTitle>
                  {selectedDate && eventsByDate[selectedDate.toISOString().split("T")[0]]?.length > 0 && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {eventsByDate[selectedDate.toISOString().split("T")[0]].length} event(s)
                    </Badge>
                  )}
                </div>
                {selectedDate && isDateToday(selectedDate) && (
                  <CardDescription className="text-blue-600 font-medium flex items-center gap-1">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    Today
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-2">
                {selectedDate && (
                  <div className="min-h-[400px]">
                    {eventsByDate[selectedDate.toISOString().split("T")[0]]?.length > 0 ? (
                      <div className="space-y-3">
                        {eventsByDate[selectedDate.toISOString().split("T")[0]].map((event) => (
                          <div 
                            key={event.id} 
                            className="p-4 rounded-md border border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-medium text-slate-800 text-lg">{event.name}</h3>
                              <Badge
                                variant={event.isPaid ? "default" : "secondary"}
                                className={event.isPaid 
                                  ? "bg-green-100 text-green-800 border-green-200 font-medium" 
                                  : "bg-gray-100 text-gray-700 border-gray-200 font-medium"}
                              >
                                {event.isPaid ? `$${event.price}` : "Free"}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-slate-600 mb-3">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span>
                                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <span>
                                  {event.venue}
                                  {event.city && `, ${event.city}`}
                                </span>
                              </div>

                              {event.category && (
                                <div className="flex items-center gap-2">
                                  <Tag className="w-4 h-4 text-blue-600" />
                                  <span>{event.category}</span>
                                </div>
                              )}

                              {event.attendees !== undefined && (
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-blue-600" />
                                  <span>{event.attendees} attendees</span>
                                </div>
                              )}
                            </div>

                            {event.description && (
                              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{event.description}</p>
                            )}

                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => handleRegister(event.id)}
                              >
                                Register
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                          <CalendarIcon className="w-10 h-10 text-gray-300" />
                        </div>
                        <p className="text-slate-700 font-medium text-lg">No events scheduled for this date</p>
                        <p className="text-slate-500 text-sm mt-1 max-w-md">Try selecting a different date or check out the list view to see all upcoming events</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          onClick={goToToday}
                        >
                          Go to Today
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="m-0 p-0">
          <Card className="border shadow-sm">
            <CardHeader className="pb-2 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-medium">
                    {listFilter === "upcoming" ? "Upcoming Events" : "All Events"}
                  </CardTitle>
                  <CardDescription>
                    {listFilter === "upcoming" 
                      ? "Showing future events in chronological order" 
                      : "Showing all scheduled events in chronological order"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 h-7 px-3">
                    {listFilter === "upcoming" ? getUpcomingEvents().length : events.length} events
                  </Badge>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filter</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Search className="h-3.5 w-3.5" />
                    <span>Search</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="min-h-[500px]">
                {(listFilter === "upcoming" ? getUpcomingEvents() : getAllEvents()).length > 0 ? (
                  <div className="rounded-md border border-gray-200 overflow-hidden bg-white">
                    {(listFilter === "upcoming" ? getUpcomingEvents() : getAllEvents()).map((event, index) => {
                      const eventDate = parseISO(event.startDate)
                      const isTodayDate = isDateToday(eventDate)
                      const isSelected = selectedDate && isSameDay(eventDate, selectedDate)

                      return (
                        <div
                          key={event.id}
                          className={cn(
                            "py-4 px-4 hover:bg-gray-50 transition-colors border-b last:border-b-0",
                            isTodayDate && "bg-blue-50 hover:bg-blue-100",
                            isSelected && "bg-blue-100 hover:bg-blue-100"
                          )}
                          onClick={() => {
                            setSelectedDate(eventDate);
                            setCurrentMonth(eventDate);
                            setViewMode("calendar");
                          }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="hidden sm:flex flex-col items-center justify-center min-w-[60px] text-center bg-white rounded-md border border-gray-200 shadow-sm p-1">
                                <span className="text-xs font-medium text-blue-600 uppercase">{format(eventDate, "MMM")}</span>
                                <span className="text-2xl font-bold text-gray-800 leading-none">{format(eventDate, "dd")}</span>
                                <span className="text-xs text-gray-500">{format(eventDate, "yyyy")}</span>
                              </div>
                              <div>
                                <h3 className="font-medium text-slate-800 text-lg">{event.name}</h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                  <div className="flex items-center gap-1 text-sm text-slate-600">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <span>{formatTime(event.startDate)}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-slate-600">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    <span>{event.venue}</span>
                                  </div>
                                  {event.category && (
                                    <div className="flex items-center gap-1 text-sm text-slate-600">
                                      <Tag className="w-4 h-4 text-blue-600" />
                                      <span>{event.category}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge
                                variant={event.isPaid ? "default" : "secondary"}
                                className={cn(
                                  "text-xs h-6",
                                  event.isPaid
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-gray-100 text-gray-800 border-gray-200",
                                )}
                              >
                                {event.isPaid ? `$${event.price}` : "Free"}
                              </Badge>
                              <Button
                                size="sm"
                                className="text-sm bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRegister(event.id);
                                }}
                              >
                                Register
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                      <CalendarIcon className="w-12 h-12 text-gray-300" />
                    </div>
                    <p className="text-slate-700 font-medium text-xl">No events scheduled</p>
                    <p className="text-slate-500 text-sm mt-2 max-w-lg">
                      There are no {listFilter === "upcoming" ? "upcoming" : ""} events scheduled at this time. Create your first event to get started.
                    </p>
                    <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                      Create Event
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            {(listFilter === "upcoming" ? getUpcomingEvents() : getAllEvents()).length > 10 && (
              <CardFooter className="flex justify-between pt-4 pb-2 border-t">
                <Button variant="outline" size="sm" className="text-sm text-slate-600" disabled>
                  Previous
                </Button>
                <div className="flex items-center">
                  <span className="text-sm text-slate-600">Page 1 of 2</span>
                </div>
                <Button variant="outline" size="sm" className="text-sm text-slate-600">
                  Next
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}