"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { fetchEvents } from "@/lib/event";
import EventForm from './event-form'
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
import EventsPage from "./events-display";
// Form schemas

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

export default function EventManagementPage({ organisationDetails }: any) {
  const [events, setEvents] = useState<Event[]>([]); // Initialize as an empty array
  // const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  // const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  // const [isVenueDialogOpen, setIsVenueDialogOpen] = useState(false);
  // const [isSendThankYouOpen, setIsSendThankYouOpen] = useState(false);
  // const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const ITEMS_PER_PAGE = 5;

  async function loadEvents() {
    try {
      const response = await fetchEvents();
      console.log("Fetched events:", response.data);
      setEvents(response.data || []); // Ensure events is always an array
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEvents([]); // Fallback to an empty array in case of an error
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  // Filter events based on search term and status
  // const filteredEvents = events.filter((event) => {
  //   const matchesSearch =
  //     event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     event.description.toLowerCase().includes(searchTerm.toLowerCase());

  //   if (filterStatus === "all") return matchesSearch;
  //   return matchesSearch && event.status.toLowerCase() === filterStatus.toLowerCase();
  // });

  // Calculate pagination
  // const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  // const paginatedEvents = filteredEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
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
        <EventsPage eventsData={events} />
{/* 
        {paginatedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedEvents.map((event:any) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{format(new Date(event.date), "PPP")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>No events found.</p>
        )} */}

        {/* {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )} */}
      </div>

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Fill in the details below to create a new event</DialogDescription>
          </DialogHeader>
          <EventForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}

