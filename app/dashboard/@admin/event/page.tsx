"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import {
  MapPin,
  Users,
  Plus,
  CalendarDays,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Ticket,
  CheckCircle,
  ThumbsUp,
  MessageSquare,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Form schemas
const eventFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.date(),
  time: z.string(),
  location: z.string().min(2, "Location must be at least 2 characters"),
  venueId: z.string().optional(),
  capacity: z.string().min(1, "Capacity is required"),
  type: z.string(),
  coverImage: z.string().min(1, "Cover image is required"),
  ticketPrice: z.string().optional(),
  ticketingEnabled: z.boolean().default(false),
  registrationDeadline: z.date().optional(),
})

const invitationFormSchema = z.object({
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  recipients: z.array(z.string()).min(1, "Select at least one recipient"),
  sendDate: z.date().optional(),
  includeTicketInfo: z.boolean().default(true),
})

type EventFormValues = z.infer<typeof eventFormSchema>
type InvitationFormValues = z.infer<typeof invitationFormSchema>

// Type definitions for sample data
interface Venue {
  id: string
  name: string
  address: string
  capacity: number
  pricePerDay: number
  amenities: string[]
}

interface Contact {
  id: string
  name: string
  email: string
  organization: string
  status: "active" | "inactive"
  lastAttended: string
}

interface Attendee {
  id: string
  checkedIn: boolean
  ticketType: string
  ticketId: string
}

interface Task {
  id: string
  title: string
  status: "pending" | "in-progress" | "completed"
}

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  venueId?: string // Make venueId optional
  capacity: number
  type: string
  registeredAttendees: number
  status: "Upcoming" | "In Progress" | "Completed"
  coverImage: string
  ticketPrice: string
  ticketsSold: number
  ticketingEnabled: boolean
  registrationDeadline: string | null
  attendees: Attendee[]
  tasks: Task[]
}

type EventStage = "Planning" | "Invitations" | "Registration" | "In Progress" | "Completed"


// Sample data with proper types
const sampleVenues: Venue[] = [
  {
    id: "v1",
    name: "Grand Conference Center",
    address: "123 Main St",
    capacity: 1000,
    pricePerDay: 5000,
    amenities: ["AV Equipment", "Catering", "WiFi"],
  },
  {
    id: "v2",
    name: "Downtown Business Hub",
    address: "456 Market St",
    capacity: 250,
    pricePerDay: 2500,
    amenities: ["WiFi", "Projector"],
  },
  {
    id: "v3",
    name: "Riverside Meeting Space",
    address: "789 Water Ave",
    capacity: 100,
    pricePerDay: 1200,
    amenities: ["White Board", "Coffee Service"],
  },
  {
    id: "v4",
    name: "Tech Campus Auditorium",
    address: "101 Innovation Way",
    capacity: 500,
    pricePerDay: 3500,
    amenities: ["Full AV Setup", "Recording Equipment"],
  },
  {
    id: "v5",
    name: "Boutique Event Room",
    address: "202 Artisan Blvd",
    capacity: 50,
    pricePerDay: 800,
    amenities: ["Intimate Setting", "Catering Available"],
  },
]

const sampleContacts: Contact[] = [
  {
    id: "c1",
    name: "Alex Johnson",
    email: "alex@example.com",
    organization: "TechCorp",
    status: "active",
    lastAttended: "2024-01-15",
  },
  {
    id: "c2",
    name: "Jamie Smith",
    email: "jamie@example.com",
    organization: "Marketing Solutions",
    status: "active",
    lastAttended: "2024-02-01",
  },
  {
    id: "c3",
    name: "Dana Williams",
    email: "dana@example.com",
    organization: "Design Studio",
    status: "inactive",
    lastAttended: "2023-11-10",
  },
  {
    id: "c4",
    name: "Jordan Taylor",
    email: "jordan@example.com",
    organization: "Finance Partners",
    status: "active",
    lastAttended: "2024-01-22",
  },
  {
    id: "c5",
    name: "Casey Brown",
    email: "casey@example.com",
    organization: "Education Inc",
    status: "active",
    lastAttended: "2024-02-05",
  },
  {
    id: "c6",
    name: "Morgan Lee",
    email: "morgan@example.com",
    organization: "Healthcare Group",
    status: "active",
    lastAttended: "2023-12-15",
  },
  {
    id: "c7",
    name: "Riley Garcia",
    email: "riley@example.com",
    organization: "Nonprofit Alliance",
    status: "inactive",
    lastAttended: "2023-10-20",
  },
]

// Expanded sample data for our events
const sampleEvents = [
  {
    id: 1,
    title: "Annual Conference 2024",
    description: "Join us for our annual conference featuring industry experts",
    date: "2024-03-15",
    time: "09:00",
    location: "Convention Center",
    venueId: "v1",
    capacity: 500,
    type: "Conference",
    registeredAttendees: 320,
    status: "Upcoming",
    coverImage: "/api/placeholder/800/400",
    ticketPrice: "149.99",
    ticketsSold: 320,
    ticketingEnabled: true,
    registrationDeadline: "2024-03-10",
    attendees: [
      { id: "c1", checkedIn: true, ticketType: "VIP", ticketId: "TK001" },
      { id: "c2", checkedIn: false, ticketType: "Standard", ticketId: "TK002" },
      { id: "c4", checkedIn: true, ticketType: "Standard", ticketId: "TK003" },
    ],
    tasks: [
      { id: "t1", title: "Confirm speakers", status: "completed" },
      { id: "t2", title: "Order catering", status: "in-progress" },
      { id: "t3", title: "Send reminder emails", status: "pending" },
    ],
  },
  {
    id: 2,
    title: "Workshop: Leadership Skills",
    description: "Interactive workshop on developing leadership skills",
    date: "2024-03-20",
    time: "14:00",
    location: "Training Room A",
    venueId: "v3",
    capacity: 50,
    type: "Workshop",
    registeredAttendees: 45,
    status: "Upcoming",
    coverImage: "/api/placeholder/800/400",
    ticketPrice: "49.99",
    ticketsSold: 45,
    ticketingEnabled: true,
    registrationDeadline: "2024-03-15",
    attendees: [
      { id: "c5", checkedIn: false, ticketType: "Standard", ticketId: "TK004" },
      { id: "c6", checkedIn: false, ticketType: "Standard", ticketId: "TK005" },
    ],
    tasks: [
      { id: "t4", title: "Print workbooks", status: "completed" },
      { id: "t5", title: "Prepare workshop materials", status: "completed" },
      { id: "t6", title: "Test AV equipment", status: "pending" },
    ],
  },
  {
    id: 3,
    title: "Tech Networking Mixer",
    description: "Network with professionals in the tech industry",
    date: "2024-02-19", // Today's date
    time: "18:00",
    location: "Innovation Hub",
    venueId: "v4",
    capacity: 100,
    type: "Networking",
    registeredAttendees: 75,
    status: "In Progress",
    coverImage: "/api/placeholder/800/400",
    ticketPrice: "0",
    ticketsSold: 75,
    ticketingEnabled: false,
    registrationDeadline: "2024-02-18",
    attendees: [
      { id: "c1", checkedIn: true, ticketType: "Free", ticketId: "TK006" },
      { id: "c4", checkedIn: true, ticketType: "Free", ticketId: "TK007" },
      { id: "c7", checkedIn: false, ticketType: "Free", ticketId: "TK008" },
    ],
    tasks: [
      { id: "t7", title: "Set up check-in desk", status: "completed" },
      { id: "t8", title: "Arrange name tags", status: "completed" },
      { id: "t9", title: "Coordinate with caterer", status: "completed" },
    ],
  },
  {
    id: 4,
    title: "Product Launch Party",
    description: "Celebrate the launch of our new product line with demos and refreshments",
    date: "2024-02-25",
    time: "19:30",
    location: "Main Auditorium",
    venueId: "v4",
    capacity: 200,
    type: "Launch",
    registeredAttendees: 180,
    status: "Upcoming",
    coverImage: "/api/placeholder/800/400",
    ticketPrice: "0",
    ticketsSold: 180,
    ticketingEnabled: false,
    registrationDeadline: "2024-02-23",
    attendees: [],
    tasks: [
      { id: "t10", title: "Prepare product demos", status: "in-progress" },
      { id: "t11", title: "Create presentation slides", status: "in-progress" },
      { id: "t12", title: "Send VIP invitations", status: "completed" },
    ],
  },
]

// Email templates
const emailTemplates = [
  {
    id: "et1",
    name: "Event Invitation",
    subject: "You're Invited: {{eventTitle}}",
    content:
      "Dear {{recipientName}},\n\nWe're excited to invite you to {{eventTitle}} on {{eventDate}} at {{eventTime}}. This event will be held at {{eventLocation}}.\n\n{{eventDescription}}\n\nWe hope to see you there!\n\nRegards,\nThe Events Team",
  },
  {
    id: "et2",
    name: "Reminder",
    subject: "Reminder: {{eventTitle}} is Coming Up!",
    content:
      "Dear {{recipientName}},\n\nThis is a friendly reminder that {{eventTitle}} is coming up on {{eventDate}} at {{eventTime}}.\n\nWe're looking forward to seeing you there!\n\nRegards,\nThe Events Team",
  },
  {
    id: "et3",
    name: "Thank You",
    subject: "Thank You for Attending {{eventTitle}}",
    content:
      "Dear {{recipientName}},\n\nThank you for attending {{eventTitle}}. We hope you found it valuable and enjoyable.\n\nWe'd appreciate your feedback to help us improve future events.\n\nRegards,\nThe Events Team",
  },
]

// Component for pagination with proper types
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex items-center justify-center mt-6 space-x-2">
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
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

// Stage badge component with proper types
interface StageBadgeProps {
  stage: "Planning" | "Invitations" | "Registration" | "In Progress" | "Completed"
}

const StageBadge = ({ stage }: StageBadgeProps) => {
  const variants = {
    Planning: "bg-purple-100 text-purple-800",
    Invitations: "bg-blue-100 text-blue-800",
    Registration: "bg-emerald-100 text-emerald-800",
    "In Progress": "bg-amber-100 text-amber-800",
    Completed: "bg-slate-100 text-slate-800",
  }

  return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${variants[stage]}`}>{stage}</span>
}

export default function EventManagementPage({organisationDetails}: any) {
  const [events, setEvents] = useState<Event[]>(sampleEvents as Event[]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isVenueDialogOpen, setIsVenueDialogOpen] = useState(false)
  const [isSendThankYouOpen, setIsSendThankYouOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)
console.log(selectedVenue)
  const ITEMS_PER_PAGE = 5

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      time: "09:00",
      location: "",
      capacity: "",
      type: "Conference",
      coverImage: "/api/placeholder/800/400",
      ticketPrice: "0",
      ticketingEnabled: false,
    },
  })

  const invitationForm = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationFormSchema),
    defaultValues: {
      subject: "",
      message: "",
      recipients: [],
      sendDate: new Date(),
      includeTicketInfo: true,
    },
  })

  // Filter events based on search term and status
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    return matchesSearch && event.status.toLowerCase() === filterStatus.toLowerCase()
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE)
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Handler for creating a new event
  function onSubmit(data: EventFormValues) {
    // Get venue details if selected
    let locationText = data.location
    const venueId = data.venueId

    if (venueId) {
      const venue = sampleVenues.find((v) => v.id === venueId)
      if (venue) {
        locationText = venue.name + " - " + venue.address
      }
    }

    // Create new event with proper typing
    const newEvent: Event = {
      id: events.length + 1,
      title: data.title,
      description: data.description,
      date: format(data.date, "yyyy-MM-dd"),
      time: data.time,
      location: locationText,
      venueId: venueId, // Now optional
      capacity: Number.parseInt(data.capacity),
      type: data.type,
      registeredAttendees: 0,
      status: "Upcoming",
      coverImage: data.coverImage,
      ticketPrice: data.ticketPrice || "0",
      ticketsSold: 0,
      ticketingEnabled: data.ticketingEnabled,
      attendees: [],
      tasks: [
        { id: `t-${Date.now()}-1`, title: "Define event goals", status: "pending" },
        { id: `t-${Date.now()}-2`, title: "Create marketing materials", status: "pending" },
        { id: `t-${Date.now()}-3`, title: "Set up registration", status: "pending" },
      ],
      registrationDeadline: data.registrationDeadline ? format(data.registrationDeadline, "yyyy-MM-dd") : null,
    }

    setEvents([...events, newEvent])
    setIsCreateDialogOpen(false)
    form.reset()
  }

  // Handler for sending invitations
  function onSubmitInvitation(data: InvitationFormValues) {
    if (!selectedEvent || !isEvent(selectedEvent)) return

    // Rest of the function remains the same
    console.log("Sending invitations:", data)

    const updatedEvents = events.map((event) => {
      if (event.id === selectedEvent.id) {
        const newAttendees = data.recipients.map((recipientId) => {
          const contact = sampleContacts.find((c) => c.id === recipientId)
          return {
            id: recipientId,
            checkedIn: false,
            ticketType: event.ticketingEnabled ? "Standard" : "Free",
            ticketId: `TK${Math.floor(1000 + Math.random() * 9000)}`,
          }
        })
        return {
          ...event,
          attendees: [...event.attendees, ...newAttendees],
        }
      }
      return event
    })

    setEvents(updatedEvents)
    setSelectedEvent(updatedEvents.find((e) => e.id === selectedEvent.id) ?? null)
    setIsInviteDialogOpen(false)
    invitationForm.reset()
    setShowConfirmation(true)
  }

  // Handler for sending thank you emails
  function sendThankYouEmails() {
    // In a real application, you would send emails here
    console.log("Sending thank you emails to attendees who checked in")

    setIsSendThankYouOpen(false)
    setShowConfirmation(true)
  }

  // Handler for checking in attendees
  function toggleAttendeeCheckIn(attendeeId: string): void {
    if (!selectedEvent) return

    const updatedEvents = events.map((event) => {
      if (event.id === selectedEvent.id) {
        const updatedAttendees = event.attendees.map((attendee) => {
          if (attendee.id === attendeeId) {
            return { ...attendee, checkedIn: !attendee.checkedIn }
          }
          return attendee
        })

        return { ...event, attendees: updatedAttendees }
      }
      return event
    })

    setEvents(updatedEvents)
    setSelectedEvent(updatedEvents.find((e) => e.id === selectedEvent.id) ?? null)
  }

  // Calculate event stage based on date and status
  function getEventStage(event: Event): EventStage {
    const today = new Date()
    const eventDate = new Date(event.date)

    if (event.status === "Completed") return "Completed"
    if (event.attendees.length === 0) return "Planning"
    if (eventDate < today && event.attendees.some((a) => a.checkedIn)) return "In Progress"
    if (event.attendees.length > 0) return "Registration"
    return "Invitations"
  }

  // Calculate event completion percentage
  function getEventCompletionPercentage(event: Event): number {
    const totalTasks = event.tasks.length
    const completedTasks = event.tasks.filter((t) => t.status === "completed").length
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  }

  // Update task status
  function updateTaskStatus(taskId: string, newStatus: Task["status"]): void {
    if (!selectedEvent) return

    const updatedEvents = events.map((event) => {
      if (event.id === selectedEvent.id) {
        const updatedTasks = event.tasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, status: newStatus }
          }
          return task
        })

        return { ...event, tasks: updatedTasks }
      }
      return event
    })

    setEvents(updatedEvents)
    setSelectedEvent(updatedEvents.find((e) => e.id === selectedEvent.id) ?? null)
  }

  // Load venue details when selecting a venue
  function handleVenueSelect(venueId: string): void {
    const venue = sampleVenues.find((v) => v.id === venueId)
    setSelectedVenue(venue ?? null)
    form.setValue("location", venue ? venue.name : "")
    form.setValue("capacity", venue ? venue.capacity.toString() : "")
  }

  // Type guard function
  function isEvent(value: any): value is Event {
    return value !== null && typeof value === "object" && "id" in value
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {selectedEvent ? (
        // Event detail view
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">{selectedEvent.title}</h1>
                <div className="flex gap-2 items-center">
                  <Badge variant={selectedEvent.status === "Upcoming" ? "default" : "secondary"}>
                    {selectedEvent.status}
                  </Badge>
                  <StageBadge stage={getEventStage(selectedEvent)} />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsInviteDialogOpen(true)}
                disabled={selectedEvent.status === "Completed"}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Invitations
              </Button>
              <Button disabled={selectedEvent.status === "Completed"}>
                <Layers className="h-4 w-4 mr-2" />
                Manage Event
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="col-span-3 md:col-span-2 overflow-hidden">
              <div className="h-48 w-full relative">
                <img
                  src={selectedEvent.coverImage || "/placeholder.svg"}
                  alt={selectedEvent.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Event Details</CardTitle>
                  <CardDescription className="mt-2">{selectedEvent.description}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Event Progress</p>
                  <div className="w-32 mt-1">
                    <Progress value={getEventCompletionPercentage(selectedEvent)} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getEventCompletionPercentage(selectedEvent)}% Complete
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {format(new Date(selectedEvent.date), "PPP")} at {selectedEvent.time}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {selectedEvent.registeredAttendees} / {selectedEvent.capacity} registered
                      </span>
                    </div>
                    {selectedEvent.ticketingEnabled && (
                      <div className="flex items-center">
                        <Ticket className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Tickets: ${selectedEvent.ticketPrice} each</span>
                      </div>
                    )}
                    {selectedEvent.registrationDeadline && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          Registration deadline: {format(new Date(selectedEvent.registrationDeadline), "PPP")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Key Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-3">
                        <p className="text-xs text-muted-foreground">Registration Rate</p>
                        <p className="text-lg font-bold">
                          {Math.round((selectedEvent.registeredAttendees / selectedEvent.capacity) * 100)}%
                        </p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-xs text-muted-foreground">Check-in Rate</p>
                        <p className="text-lg font-bold">
                          {selectedEvent.attendees.length > 0
                            ? Math.round(
                                (selectedEvent.attendees.filter((a) => a.checkedIn).length /
                                  selectedEvent.attendees.length) *
                                  100,
                              )
                            : 0}
                          %
                        </p>
                      </Card>
                      {selectedEvent.ticketingEnabled && (
                        <>
                          <Card className="p-3">
                            <p className="text-xs text-muted-foreground">Tickets Sold</p>
                            <p className="text-lg font-bold">{selectedEvent.ticketsSold}</p>
                          </Card>
                          <Card className="p-3">
                            <p className="text-xs text-muted-foreground">Revenue</p>
                            <p className="text-lg font-bold">
                              $
                              {(
                                Number.parseFloat(selectedEvent.ticketPrice) * selectedEvent.ticketsSold
                              ).toLocaleString()}
                            </p>
                          </Card>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3 md:col-span-1">
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedEvent.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={() =>
                          updateTaskStatus(task.id, task.status === "completed" ? "pending" : "completed")
                        }
                      />
                      <span className={task.status === "completed" ? "line-through text-muted-foreground" : ""}>
                        {task.title}
                      </span>
                    </div>
                    <Select defaultValue={task.status} onValueChange={(value:any) => updateTaskStatus(task.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Task
                </Button>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="attendees" className="space-y-4">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
              <TabsTrigger value="ticketing">Ticketing</TabsTrigger>
              <TabsTrigger value="logistics">Logistics</TabsTrigger>
            </TabsList>

            <TabsContent value="attendees" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Registered Attendees</CardTitle>
                    <CardDescription>Manage attendees and check-in status</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsSendThankYouOpen(true)}>
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Send Thank You
                    </Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Attendee
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Ticket Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEvent.attendees.map((attendee) => {
                        const contact = sampleContacts.find((c) => c.id === attendee.id)
                        if (!contact) return null

                        return (
                          <TableRow key={attendee.id}>
                            <TableCell className="font-medium">{contact.name}</TableCell>
                            <TableCell>{contact.organization}</TableCell>
                            <TableCell>{attendee.ticketType}</TableCell>
                            <TableCell>
                              <Badge variant={attendee.checkedIn ? "default" : "secondary"}>
                                {attendee.checkedIn ? "Checked In" : "Not Checked In"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => toggleAttendeeCheckIn(attendee.id)}>
                                <CheckCircle
                                  className={cn(
                                    "h-4 w-4 mr-2",
                                    attendee.checkedIn ? "text-green-500" : "text-gray-400",
                                  )}
                                />
                                {attendee.checkedIn ? "Undo Check-in" : "Check-in"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Communication History</CardTitle>
                  <CardDescription>Track all communications related to this event</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {emailTemplates.map((template, index) => (
                      <AccordionItem key={template.id} value={template.id}>
                        <AccordionTrigger>{template.name}</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Subject:</p>
                            <p className="text-sm text-muted-foreground">{template.subject}</p>
                            <p className="text-sm font-medium mt-4">Content:</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{template.content}</p>
                            <Button className="mt-4" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Use Template
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ticketing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Management</CardTitle>
                  <CardDescription>
                    {selectedEvent.ticketingEnabled
                      ? "Manage ticket sales and types"
                      : "Ticketing is not enabled for this event"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedEvent.ticketingEnabled ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4">
                          <h3 className="font-medium mb-2">Tickets Sold</h3>
                          <div className="text-2xl font-bold">{selectedEvent.ticketsSold}</div>
                          <p className="text-sm text-muted-foreground">of {selectedEvent.capacity} available</p>
                        </Card>
                        <Card className="p-4">
                          <h3 className="font-medium mb-2">Revenue</h3>
                          <div className="text-2xl font-bold">
                            $
                            {(
                              Number.parseFloat(selectedEvent.ticketPrice) * selectedEvent.ticketsSold
                            ).toLocaleString()}
                          </div>
                          <p className="text-sm text-muted-foreground">at ${selectedEvent.ticketPrice} per ticket</p>
                        </Card>
                        <Card className="p-4">
                          <h3 className="font-medium mb-2">Time Remaining</h3>
                          <div className="text-2xl font-bold">
                            {selectedEvent.registrationDeadline
                              ? format(new Date(selectedEvent.registrationDeadline), "d")
                              : "N/A"}
                          </div>
                          <p className="text-sm text-muted-foreground">days until registration closes</p>
                        </Card>
                      </div>

                      <div>
                        <h3 className="font-medium mb-4">Ticket Types</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Type</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Sold</TableHead>
                              <TableHead>Available</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Standard</TableCell>
                              <TableCell>${selectedEvent.ticketPrice}</TableCell>
                              <TableCell>{selectedEvent.ticketsSold}</TableCell>
                              <TableCell>{selectedEvent.capacity - selectedEvent.ticketsSold}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Button>Enable Ticketing</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logistics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Venue & Equipment</CardTitle>
                  <CardDescription>Manage venue details and equipment requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-4">Venue Details</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Capacity</p>
                          <p className="text-sm text-muted-foreground">{selectedEvent.capacity} people</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Amenities</p>
                          <div className="flex gap-2 mt-2">
                            {selectedEvent.venueId &&
                              sampleVenues
                                .find((v) => v.id === selectedEvent.venueId)
                                ?.amenities.map((amenity) => (
                                  <Badge key={amenity} variant="secondary">
                                    {amenity}
                                  </Badge>
                                ))}
                          </div>
                        </div>
                      </div>
                      <Button className="mt-6" variant="outline" onClick={() => setIsVenueDialogOpen(true)}>
                        Change Venue
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-medium mb-4">Equipment Checklist</h3>
                      <div className="space-y-2">
                        {["Microphones", "Projector", "Chairs", "Tables", "Name Tags"].map((item, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <Checkbox id={`equipment-${i}`} />
                            <label
                              htmlFor={`equipment-${i}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {item}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        // Event list view
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-blue-900 mb-2">Events</h1>
              <p className="text-muted-foreground">Manage and track all your events in one place</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsVenueDialogOpen(true)}>
                <MapPin className="h-4 w-4 mr-2" />
                Venues
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedEvents.map((event) => (
              <Card key={event.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="relative" onClick={() => setSelectedEvent(event)}>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge variant={event.status === "Upcoming" ? "default" : "secondary"}>{event.status}</Badge>
                  </div>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
                    {format(new Date(event.date), "PPP")} at {event.time}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    {event.registeredAttendees} / {event.capacity} registered
                  </div>
                  <Progress value={getEventCompletionPercentage(event)} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {getEventCompletionPercentage(event)}% tasks completed
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" onClick={() => setSelectedEvent(event)}>
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </div>
      )}

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Fill in the details below to create a new event</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Annual Conference 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter event description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarDays className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="venueId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <Select onValueChange={handleVenueSelect} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a venue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sampleVenues.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            {venue.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Conference">Conference</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Seminar">Seminar</SelectItem>
                        <SelectItem value="Networking">Networking</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ticketingEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enable Ticketing</FormLabel>
                      <FormDescription>Allow attendees to purchase tickets for this event</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("ticketingEnabled") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ticketPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="registrationDeadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Deadline</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <CalendarDays className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : "Select deadline"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <DialogFooter>
                <Button type="submit">Create Event</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Send Invitations Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Invitations</DialogTitle>
            <DialogDescription>Select recipients and customize your invitation message</DialogDescription>
          </DialogHeader>
          <Form {...invitationForm}>
            <form onSubmit={invitationForm.handleSubmit(onSubmitInvitation)} className="space-y-4">
              <FormField
                control={invitationForm.control}
                name="recipients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipients</FormLabel>
                    <div className="border rounded-md p-4 space-y-2">
                      {sampleContacts.map((contact) => (
                        <div key={contact.id} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value?.includes(contact.id)}
                            onCheckedChange={(checked: any) => {
                              const newValue = checked
                                ? [...(field.value || []), contact.id]
                                : field.value?.filter((id) => id !== contact.id) || []
                              field.onChange(newValue)
                            }}
                          />
                          <label className="text-sm">
                            {contact.name} - {contact.organization}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={invitationForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Event Invitation: Annual Conference 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={invitationForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your invitation message..." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={invitationForm.control}
                name="includeTicketInfo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Ticket Information</FormLabel>
                      <FormDescription>Add ticket pricing and purchase instructions to the invitation</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Send Invitations</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Venue Selection Dialog */}
      <Dialog open={isVenueDialogOpen} onOpenChange={setIsVenueDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Venue Directory</DialogTitle>
            <DialogDescription>Browse and select from our partner venues</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleVenues.map((venue) => (
              <Card key={venue.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{venue.name}</CardTitle>
                  <CardDescription>{venue.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      Capacity: {venue.capacity}
                    </div>
                    <div className="flex items-center">
                      <Ticket className="h-4 w-4 mr-2 text-muted-foreground" />${venue.pricePerDay} per day
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {venue.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      handleVenueSelect(venue.id)
                      setIsVenueDialogOpen(false)
                    }}
                  >
                    Select Venue
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Thank You Dialog */}
      <AlertDialog open={isSendThankYouOpen} onOpenChange={setIsSendThankYouOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Thank You Emails</AlertDialogTitle>
            <AlertDialogDescription>
              This will send thank you emails to all attendees who checked in to the event. Are you sure you want to
              continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={sendThankYouEmails}>Send Emails</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>Your action has been completed successfully.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowConfirmation(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

