"use client"

import { useState, useEffect } from "react"
import { format, isSameDay } from "date-fns"
import {MapPin, Users, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

// Expanded sample data - would come from backend in real application
const sampleEvents = [
  {
    id: 1,
    title: "Annual Conference 2024",
    description: "Join us for our annual conference featuring industry experts",
    date: "2024-03-15",
    time: "09:00",
    location: "Convention Center",
    capacity: 500,
    type: "Conference",
    registeredAttendees: 320,
    status: "Upcoming",
    coverImage: "/api/placeholder/800/400",
  },
  {
    id: 2,
    title: "Workshop: Leadership Skills",
    description: "Interactive workshop on developing leadership skills",
    date: "2024-03-20",
    time: "14:00",
    location: "Training Room A",
    capacity: 50,
    type: "Workshop",
    registeredAttendees: 45,
    status: "Upcoming",
    coverImage: "/api/placeholder/800/400",
  },
  {
    id: 3,
    title: "Tech Networking Mixer",
    description: "Network with professionals in the tech industry",
    date: "2024-02-19", // Today's date
    time: "18:00",
    location: "Innovation Hub",
    capacity: 100,
    type: "Networking",
    registeredAttendees: 75,
    status: "Upcoming",
    coverImage: "/api/placeholder/800/400",
  },
  {
    id: 4,
    title: "Product Launch Party",
    description: "Celebrate the launch of our new product line with demos and refreshments",
    date: "2024-02-19", // Today's date (duplicate intentionally for pagination demo)
    time: "19:30",
    location: "Main Auditorium",
    capacity: 200,
    type: "Networking",
    registeredAttendees: 180,
    status: "Upcoming",
    coverImage: "/api/placeholder/800/400",
  },
  {
    id: 5,
    title: "Developer Bootcamp",
    description: "Intensive three-day training for full-stack developers",
    date: "2024-03-01",
    time: "08:00",
    location: "Tech Campus",
    capacity: 40,
    type: "Workshop",
    registeredAttendees: 38,
    status: "Upcoming",
    coverImage: "/api/placeholder/800/400",
  },
  {
    id: 6,
    title: "Marketing Strategy Session",
    description: "Collaborative session to develop Q2 marketing strategy",
    date: "2024-02-19", // Today's date (for calendar pagination demo)
    time: "10:00",
    location: "Strategy Room",
    capacity: 20,
    type: "Workshop",
    registeredAttendees: 18,
    status: "Upcoming",
    coverImage: "/api/placeholder/800/400",
  },
  {
    id: 7,
    title: "Customer Success Webinar",
    description: "Learn best practices for improving customer retention",
    date: "2024-03-10",
    time: "11:00",
    location: "Virtual",
    capacity: 1000,
    type: "Seminar",
    registeredAttendees: 450,
    status: "Upcoming",
    coverImage: "/api/placeholder/800/400",
  },
]

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }:any) => {
  return (
    <div className="flex items-center justify-center mt-6 space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function EventsPage() {
  const [events] = useState(sampleEvents)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [filteredEvents, setFilteredEvents] = useState(sampleEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  
  // Pagination states
  const [currentGridPage, setCurrentGridPage] = useState(1)
  const [currentCalendarPage, setCurrentCalendarPage] = useState(1)
  const GRID_ITEMS_PER_PAGE = 3
  const CALENDAR_ITEMS_PER_PAGE = 2

  // Filter events based on selected date for calendar view
  useEffect(() => {
    const eventsOnSelectedDate = events.filter(event => 
      isSameDay(new Date(event.date), selectedDate)
    );
    setFilteredEvents(eventsOnSelectedDate);
    setCurrentCalendarPage(1); // Reset to first page when date changes
  }, [selectedDate, events]);

  // Apply search and type filters
  useEffect(() => {
    let filtered = [...events];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(event => 
        filterType === "upcoming" ? 
          new Date(event.date) >= new Date() : 
          new Date(event.date) < new Date()
      );
    }
    
    setFilteredEvents(filtered);
    setCurrentGridPage(1); // Reset to first page when filters change
    setCurrentCalendarPage(1);
  }, [searchTerm, filterType, events]);

  // Get paginated events for grid view
  const getPaginatedGridEvents = () => {
    const startIndex = (currentGridPage - 1) * GRID_ITEMS_PER_PAGE;
    const endIndex = startIndex + GRID_ITEMS_PER_PAGE;
    return (searchTerm || filterType !== "all" ? filteredEvents : events).slice(startIndex, endIndex);
  };

  // Get paginated events for calendar view
  const getPaginatedCalendarEvents = () => {
    const startIndex = (currentCalendarPage - 1) * CALENDAR_ITEMS_PER_PAGE;
    const endIndex = startIndex + CALENDAR_ITEMS_PER_PAGE;
    return filteredEvents.slice(startIndex, endIndex);
  };

  // Calculate total pages for grid view
  const totalGridPages = Math.ceil(
    (searchTerm || filterType !== "all" ? filteredEvents.length : events.length) / GRID_ITEMS_PER_PAGE
  );

  // Calculate total pages for calendar view
  const totalCalendarPages = Math.ceil(filteredEvents.length / CALENDAR_ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Events Calendar</h1>
          <p className="text-gray-600">Browse and view upcoming events</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search events..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select 
            defaultValue="all" 
            onValueChange={(value) => setFilterType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getPaginatedGridEvents().map((event) => (
              <Card key={event.id} className="overflow-hidden flex flex-col">
                <div className="relative h-48 w-full">
                  <img 
                    src={event.coverImage} 
                    alt={event.title} 
                    className="h-full w-full object-cover" 
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={event.status === "Upcoming" ? "default" : "secondary"}>
                      {event.status}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                  <div className="flex items-center text-sm">
                    <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {format(new Date(event.date), "PPP")} at {event.time}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {event.registeredAttendees} / {event.capacity} registered
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Grid Pagination */}
          {totalGridPages > 1 && (
            <Pagination
              currentPage={currentGridPage}
              totalPages={totalGridPages}
              onPageChange={setCurrentGridPage}
            />
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Event Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent 
                  mode="single" 
                  selected={selectedDate} 
                 
                  className="rounded-md border"
                  modifiers={{
                    hasEvent: (date) => events.some(event => 
                      isSameDay(new Date(event.date), date)
                    )
                  }}
                  modifiersClassNames={{
                    hasEvent: "bg-blue-50 dark:bg-blue-950 font-bold relative"
                  }}
                />
                <div className="mt-4 flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 mr-2"></div>
                  <span className="text-muted-foreground">Days with events</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  Events on {format(selectedDate, 'MMMM d, yyyy')}
                  {filteredEvents.length > 0 && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({filteredEvents.length} events)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {getPaginatedCalendarEvents().map(event => (
                      <Card key={event.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 h-40">
                            <img 
                              src={event.coverImage} 
                              alt={event.title} 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <div className="md:w-2/3 p-4">
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium text-lg">{event.title}</h3>
                              <Badge variant={event.status === "Upcoming" ? "default" : "secondary"}>
                                {event.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center">
                                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                                {event.time}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                {event.location}
                              </div>
                              <div className="flex items-center col-span-2">
                                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>
                                  {event.registeredAttendees} / {event.capacity} registered
                                </span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Button size="sm" variant="outline">View Details</Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    {/* Calendar Pagination */}
                    {totalCalendarPages > 1 && (
                      <Pagination
                        currentPage={currentCalendarPage}
                        totalPages={totalCalendarPages}
                        onPageChange={setCurrentCalendarPage}
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No events scheduled for this day
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}