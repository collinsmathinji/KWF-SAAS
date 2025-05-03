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
      const response:any = await fetchEvents();
      
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
const onClose=()=>{
  setIsCreateDialogOpen(false)
}
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
          <EventForm onClose={onClose}/>
        </DialogContent>
      </Dialog>
    </div>
  );
}

