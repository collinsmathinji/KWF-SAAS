"use client"

import { useState, useEffect } from "react"
import { format, isSameDay, addDays } from "date-fns"
import {
  MapPin,
  Users,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Star,
  ArrowUpRight,
  Bell,
  Filter,
  Tag,
  Bookmark,
  Share2,
  Heart,
  Plus,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Expanded sample data - would come from backend in real application
const sampleEvents = [
  {
    id: 1,
    title: "Annual Conference 2024",
    description:
      "Join us for our annual conference featuring industry experts and thought leaders. Network with peers and gain valuable insights.",
    date: "2024-03-15",
    time: "09:00",
    endTime: "17:00",
    location: "Convention Center",
    capacity: 500,
    type: "Conference",
    registeredAttendees: 320,
    status: "Upcoming",
    coverImage: "/placeholder.svg?height=400&width=800",
    featured: true,
    categories: ["Leadership", "Industry"],
    speakers: [
      { name: "Jane Smith", role: "CEO", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "John Doe", role: "CTO", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    title: "Workshop: Leadership Skills",
    description:
      "Interactive workshop on developing leadership skills for the modern workplace. Practical exercises and actionable takeaways.",
    date: "2024-03-20",
    time: "14:00",
    endTime: "17:00",
    location: "Training Room A",
    capacity: 50,
    type: "Workshop",
    registeredAttendees: 45,
    status: "Upcoming",
    coverImage: "/placeholder.svg?height=400&width=800",
    featured: false,
    categories: ["Leadership", "Skills"],
    speakers: [{ name: "Alex Johnson", role: "Leadership Coach", avatar: "/placeholder.svg?height=40&width=40" }],
    rating: 4.6,
    reviews: 38,
  },
  {
    id: 3,
    title: "Tech Networking Mixer",
    description:
      "Network with professionals in the tech industry. Expand your connections and discover new opportunities.",
    date: new Date().toISOString().split("T")[0], // Today's date
    time: "18:00",
    endTime: "21:00",
    location: "Innovation Hub",
    capacity: 100,
    type: "Networking",
    registeredAttendees: 75,
    status: "Upcoming",
    coverImage: "/placeholder.svg?height=400&width=800",
    featured: true,
    categories: ["Networking", "Tech"],
    speakers: [],
    rating: 4.5,
    reviews: 62,
  },
  {
    id: 4,
    title: "Product Launch Party",
    description:
      "Celebrate the launch of our new product line with demos and refreshments. Be the first to experience our latest innovations.",
    date: new Date().toISOString().split("T")[0], // Today's date
    time: "19:30",
    endTime: "22:30",
    location: "Main Auditorium",
    capacity: 200,
    type: "Networking",
    registeredAttendees: 180,
    status: "Upcoming",
    coverImage: "/placeholder.svg?height=400&width=800",
    featured: false,
    categories: ["Product", "Launch"],
    speakers: [{ name: "Sarah Williams", role: "Product Manager", avatar: "/placeholder.svg?height=40&width=40" }],
    rating: 4.7,
    reviews: 45,
  },
  {
    id: 5,
    title: "Developer Bootcamp",
    description: "Intensive three-day training for full-stack developers. Hands-on projects and expert guidance.",
    date: "2024-03-01",
    time: "08:00",
    endTime: "17:00",
    location: "Tech Campus",
    capacity: 40,
    type: "Workshop",
    registeredAttendees: 38,
    status: "Upcoming",
    coverImage: "/placeholder.svg?height=400&width=800",
    featured: true,
    categories: ["Development", "Training"],
    speakers: [
      { name: "Michael Chen", role: "Lead Developer", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Lisa Park", role: "UX Designer", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    rating: 4.9,
    reviews: 28,
  },
  {
    id: 6,
    title: "Marketing Strategy Session",
    description:
      "Collaborative session to develop Q2 marketing strategy. Bring your ideas and contribute to our success.",
    date: new Date().toISOString().split("T")[0], // Today's date
    time: "10:00",
    endTime: "12:00",
    location: "Strategy Room",
    capacity: 20,
    type: "Workshop",
    registeredAttendees: 18,
    status: "Upcoming",
    coverImage: "/placeholder.svg?height=400&width=800",
    featured: false,
    categories: ["Marketing", "Strategy"],
    speakers: [{ name: "Robert Taylor", role: "Marketing Director", avatar: "/placeholder.svg?height=40&width=40" }],
    rating: 4.4,
    reviews: 15,
  },
  {
    id: 7,
    title: "Customer Success Webinar",
    description:
      "Learn best practices for improving customer retention. Real-world case studies and actionable strategies.",
    date: "2024-03-10",
    time: "11:00",
    endTime: "12:30",
    location: "Virtual",
    capacity: 1000,
    type: "Seminar",
    registeredAttendees: 450,
    status: "Upcoming",
    coverImage: "/placeholder.svg?height=400&width=800",
    featured: false,
    categories: ["Customer Success", "Webinar"],
    speakers: [
      { name: "Emily Rodriguez", role: "Customer Success Lead", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    rating: 4.6,
    reviews: 87,
  },
]

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
  return (
    <div className="flex items-center justify-center mt-6 space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
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
        className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Featured event component
const FeaturedEvent = ({ event }: { event: any }) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg mb-8">
      <div className="relative">
        <img src={event.coverImage || "/placeholder.svg"} alt={event.title} className="h-64 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
          <Badge className="absolute top-4 right-4 bg-amber-500 hover:bg-amber-600 text-white border-none">
            Featured Event
          </Badge>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <p className="text-white/80 line-clamp-2">{event.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {event.categories.map((category: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-white/10 text-white border-white/20">
                  {category}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-white/70" />
                <span className="text-sm">{format(new Date(event.date), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-white/70" />
                <span className="text-sm">{event.location}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex -space-x-2">
                {event.speakers.map((speaker: any, index: number) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Avatar className="border-2 border-white h-8 w-8">
                        <AvatarImage src={speaker.avatar} alt={speaker.name} />
                        <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{speaker.name}</p>
                      <p className="text-xs text-muted-foreground">{speaker.role}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {event.speakers.length > 0 && (
                  <span className="text-xs ml-2 flex items-center">
                    {event.speakers.length} speaker{event.speakers.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <Button className="bg-white text-blue-700 hover:bg-blue-50">Register Now</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function EventsTable() {
  const [events] = useState(sampleEvents)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [filteredEvents, setFilteredEvents] = useState(sampleEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  // Get unique categories from events
  const categories = Array.from(new Set(events.flatMap((event) => event.categories || [])))

  // Get featured events
  const featuredEvents = events.filter((event) => event.featured)

  // Pagination states
  const [currentGridPage, setCurrentGridPage] = useState(1)
  const [currentCalendarPage, setCurrentCalendarPage] = useState(1)
  const GRID_ITEMS_PER_PAGE = 3
  const CALENDAR_ITEMS_PER_PAGE = 2

  // Filter events based on selected date for calendar view
  useEffect(() => {
    const eventsOnSelectedDate = events.filter((event) => isSameDay(new Date(event.date), selectedDate))
    setFilteredEvents(eventsOnSelectedDate)
    setCurrentCalendarPage(1) // Reset to first page when date changes
  }, [selectedDate, events])

  // Apply search and type filters
  useEffect(() => {
    let filtered = [...events]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((event) => event.type.toLowerCase() === filterType.toLowerCase())
    }

    // Apply category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((event) => event.categories && event.categories.includes(filterCategory))
    }

    setFilteredEvents(filtered)
    setCurrentGridPage(1) // Reset to first page when filters change
    setCurrentCalendarPage(1)
  }, [searchTerm, filterType, filterCategory, events])

  // Get paginated events for grid view
  const getPaginatedGridEvents = () => {
    const startIndex = (currentGridPage - 1) * GRID_ITEMS_PER_PAGE
    const endIndex = startIndex + GRID_ITEMS_PER_PAGE
    return (searchTerm || filterType !== "all" || filterCategory !== "all" ? filteredEvents : events).slice(
      startIndex,
      endIndex,
    )
  }

  // Get paginated events for calendar view
  const getPaginatedCalendarEvents = () => {
    const startIndex = (currentCalendarPage - 1) * CALENDAR_ITEMS_PER_PAGE
    const endIndex = startIndex + CALENDAR_ITEMS_PER_PAGE
    return filteredEvents.slice(startIndex, endIndex)
  }

  // Calculate total pages for grid view
  const totalGridPages = Math.ceil(
    (searchTerm || filterType !== "all" || filterCategory !== "all" ? filteredEvents.length : events.length) /
      GRID_ITEMS_PER_PAGE,
  )

  // Calculate total pages for calendar view
  const totalCalendarPages = Math.ceil(filteredEvents.length / CALENDAR_ITEMS_PER_PAGE)

  // Get upcoming events for the next 7 days
  const getUpcomingEvents = () => {
    const today = new Date()
    const nextWeek = addDays(today, 7)

    return events
      .filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate >= today && eventDate <= nextWeek
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3)
  }

  const upcomingEvents = getUpcomingEvents()

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Events Calendar</h1>
          <p className="text-gray-600">Discover and join exciting events in your organization</p>
        </div>
       
      </div>

      {featuredEvents.length > 0 && (
        <TooltipProvider>
          <FeaturedEvent event={featuredEvents[0]} />
        </TooltipProvider>
      )}

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-10 border-blue-200 focus:border-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all" onValueChange={(value) => setFilterType(value)}>
              <SelectTrigger className="w-[150px] border-blue-200">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Event type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="seminar">Seminar</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all" onValueChange={(value) => setFilterCategory(value)}>
              <SelectTrigger className="w-[180px] border-blue-200">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList className="bg-blue-50 p-1">
          <TabsTrigger value="grid" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            Grid View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            Upcoming
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getPaginatedGridEvents().map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden flex flex-col border-none shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <img
                    src={event.coverImage || "/placeholder.svg"}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge
                      variant={event.status === "Upcoming" ? "default" : "secondary"}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {event.status}
                    </Badge>
                    {event.featured && (
                      <Badge variant="outline" className="bg-amber-500 text-white border-none">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-2 left-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-black/20 text-white hover:bg-black/30 rounded-full"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem>
                          <Heart className="h-4 w-4 mr-2" />
                          Add to favorites
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save for later
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-medium ml-1">{event.rating}</span>
                      <span className="text-xs text-muted-foreground ml-1">({event.reviews})</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{event.description}</p>
                </CardHeader>
                <CardContent className="space-y-3 flex-grow p-4 pt-0">
                  <div className="flex flex-wrap gap-1 mt-2">
                    {event.categories &&
                      event.categories.map((category: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {category}
                        </Badge>
                      ))}
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarDays className="h-4 w-4 mr-2 text-blue-600" />
                    <span>{format(new Date(event.date), "EEE, MMM d")}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    <span>
                      {event.time} - {event.endTime}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex flex-col text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-600" />
                        <span>
                          {event.registeredAttendees} / {event.capacity}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((event.registeredAttendees / event.capacity) * 100)}% full
                      </span>
                    </div>
                    <Progress
                      value={(event.registeredAttendees / event.capacity) * 100}
                      className="h-1"
                     
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Register Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Grid Pagination */}
          {totalGridPages > 1 && (
            <Pagination currentPage={currentGridPage} totalPages={totalGridPages} onPageChange={setCurrentGridPage} />
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 border-none shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <CardTitle>Event Calendar</CardTitle>
                <CardDescription className="text-blue-100">Select a date to view events</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border border-blue-200"
                  modifiers={{
                    hasEvent: (date) => events.some((event) => isSameDay(new Date(event.date), date)),
                  }}
                  modifiersClassNames={{
                    hasEvent: "bg-blue-100 text-blue-900 font-bold relative",
                  }}
                  classNames={{
                    day_selected:
                      "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                    day_today: "bg-amber-100 text-amber-900",
                  }}
                />
                <div className="mt-4 flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200 mr-2"></div>
                  <span className="text-muted-foreground">Days with events</span>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-3">Upcoming This Week</h3>
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-md bg-blue-100 text-blue-800 flex flex-col items-center justify-center text-center">
                          <span className="text-xs font-medium">{format(new Date(event.date), "MMM")}</span>
                          <span className="text-lg font-bold leading-none">{format(new Date(event.date), "d")}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{event.title}</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{event.time}</span>
                            <MapPin className="h-3 w-3 mx-1" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="flex-shrink-0 h-8 w-8 p-0 rounded-full">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-none shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle>Events on {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
                  {filteredEvents.length > 0 && (
                    <Badge variant="outline" className="bg-white/20 text-white border-white/10">
                      {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-blue-100">
                  {isSameDay(selectedDate, new Date()) ? "Today's schedule" : "Selected day schedule"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {filteredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {getPaginatedCalendarEvents().map((event) => (
                      <Card key={event.id} className="overflow-hidden border border-blue-100">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 h-40">
                            <img
                              src={event.coverImage || "/placeholder.svg"}
                              alt={event.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="md:w-2/3 p-4">
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium text-lg">{event.title}</h3>
                              <Badge
                                variant={event.status === "Upcoming" ? "default" : "secondary"}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                {event.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                                {event.time} - {event.endTime}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                                {event.location}
                              </div>
                              <div className="flex items-center col-span-2">
                                <Users className="h-4 w-4 mr-2 text-blue-600" />
                                <span>
                                  {event.registeredAttendees} / {event.capacity} registered
                                </span>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                              <div className="flex -space-x-2">
                                {event.speakers &&
                                  event.speakers.map((speaker: any, index: number) => (
                                    <Tooltip key={index}>
                                      <TooltipTrigger asChild>
                                        <Avatar className="border-2 border-white h-8 w-8">
                                          <AvatarImage src={speaker.avatar} alt={speaker.name} />
                                          <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="font-medium">{speaker.name}</p>
                                        <p className="text-xs text-muted-foreground">{speaker.role}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  ))}
                              </div>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Register
                              </Button>
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
                  <div className="text-center py-12 px-4">
                    <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No events scheduled</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      There are no events scheduled for this day. Select another date or create a new event.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription className="text-blue-100">Events happening in the next 30 days</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                {events
                  .filter((event) => new Date(event.date) >= new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map((event, index) => (
                    <div
                      key={event.id}
                      className="flex flex-col md:flex-row gap-4 pb-6 border-b last:border-0 last:pb-0"
                    >
                      <div className="md:w-1/4 flex flex-col">
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-blue-700">{format(new Date(event.date), "d")}</div>
                          <div className="text-sm font-medium text-blue-600">
                            {format(new Date(event.date), "MMMM yyyy")}
                          </div>
                          <div className="text-xs text-blue-500 mt-1">{format(new Date(event.date), "EEEE")}</div>
                          <div className="mt-2 text-xs bg-blue-100 text-blue-800 rounded-full py-1 px-2 inline-block">
                            {event.time} - {event.endTime}
                          </div>
                        </div>
                        <div className="mt-2 flex justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <Bell className="h-3 w-3 mr-1" />
                            Remind me
                          </Button>
                        </div>
                      </div>
                      <div className="md:w-3/4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold">{event.title}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                              {event.type && (
                                <>
                                  <span className="text-muted-foreground">•</span>
                                  <span>{event.type}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="text-sm mr-2">
                              <div className="font-medium">
                                {event.registeredAttendees}/{event.capacity}
                              </div>
                              <div className="text-xs text-muted-foreground">Registered</div>
                            </div>
                            <Progress
                              value={(event.registeredAttendees / event.capacity) * 100}
                              className="h-2 w-20"
                            
                            />
                          </div>
                        </div>
                        <p className="mt-2 text-muted-foreground">{event.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {event.categories &&
                            event.categories.map((category: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {category}
                              </Badge>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="flex -space-x-2 mr-2">
                              {event.speakers &&
                                event.speakers.slice(0, 3).map((speaker: any, idx: number) => (
                                  <Avatar key={idx} className="border-2 border-white h-8 w-8">
                                    <AvatarImage src={speaker.avatar} alt={speaker.name} />
                                    <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                            </div>
                            {event.speakers && event.speakers.length > 0 && (
                              <span className="text-sm text-muted-foreground">
                                {event.speakers.length} speaker{event.speakers.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                          <Button className="bg-blue-600 hover:bg-blue-700">Register Now</Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-8 text-center">
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  View All Upcoming Events
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

