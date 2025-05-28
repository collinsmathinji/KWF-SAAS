"use client"

import { useEffect, useState } from "react"
import { fetchEvents } from "@/lib/event"
import EventForm from "./event-form"
import * as z from "zod"
import { Plus, CalendarDays, Search, ChevronLeft, ChevronRight, Building2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { EventsPage } from "./events-display"
import { useSession } from "next-auth/react"

// Form schemas
const invitationFormSchema = z.object({
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  recipients: z.array(z.string()).min(1, "Select at least one recipient"),
  sendDate: z.date().optional(),
  includeTicketInfo: z.boolean().default(true),
})

type InvitationFormValues = z.infer<typeof invitationFormSchema>

// Type definitions
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
  venueId?: string
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
    <div className="flex items-center justify-center mt-8 space-x-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-slate-300 hover:bg-slate-50"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium text-slate-700">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-slate-300 hover:bg-slate-50"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}

interface StageBadgeProps {
  stage: "Planning" | "Invitations" | "Registration" | "In Progress" | "Completed"
}

const StageBadge = ({ stage }: StageBadgeProps) => {
  const variants = {
    Planning: "bg-slate-100 text-slate-700 border-slate-200",
    Invitations: "bg-blue-50 text-blue-700 border-blue-200",
    Registration: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
    Completed: "bg-green-50 text-green-700 border-green-200",
  }

  return (
    <Badge variant="outline" className={`text-xs font-medium px-3 py-1 ${variants[stage]}`}>
      {stage}
    </Badge>
  )
}

export default function EventManagementPage({ organisationDetails }: any) {
  const [events, setEvents] = useState<Event[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isVenueDialogOpen, setIsVenueDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const ITEMS_PER_PAGE = 5
  const { data: session } = useSession()

  async function loadEvents() {
    try {
      if (!session?.user?.organizationId) {
        console.error("No organization ID found in session")
        setEvents([])
        return
      }
      const response: any = await fetchEvents(session.user.organizationId)
      
      // Transform the API response data to match the EventsPage component's expected format
      const transformedEvents = (response.data?.data || []).map((event: any) => {
        const eventDate = new Date(event.startDate)
        const now = new Date()
        
        // Determine event status based on date
        let status: "Upcoming" | "In Progress" | "Completed"
        if (eventDate < now) {
          status = "Completed"
        } else if (eventDate.getTime() - now.getTime() <= 24 * 60 * 60 * 1000) { // Within 24 hours
          status = "In Progress"
        } else {
          status = "Upcoming"
        }

        return {
          id: event.id,
          title: event.name,
          description: event.description,
          date: event.startDate,
          time: eventDate.toLocaleTimeString(),
          location: `${event.address}, ${event.city}, ${event.country}`,
          capacity: 100, // Default value, adjust as needed
          type: event.eventType || 'meeting',
          registeredAttendees: 0, // Default value, adjust as needed
          status,
          ticketPrice: event.isPaid ? `$${event.price}` : 'Free',
          ticketsSold: 0, // Default value, adjust as needed
          ticketingEnabled: event.isPaid
        }
      })

      setEvents(transformedEvents)
    } catch (error) {
      console.error("Failed to fetch events:", error)
      setEvents([])
    }
  }

  useEffect(() => {
    if (session?.user?.organizationId) {
      loadEvents()
    }
  }, [session?.user?.organizationId])

  const onClose = () => {
    setIsCreateDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <CalendarDays className="h-6 w-6 text-slate-700" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900">Event Management</h1>
                </div>
                <p className="text-slate-600 text-lg">
                  Organize, manage, and track all your corporate events with precision and efficiency
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsVenueDialogOpen(true)}
                  className="border-slate-300 hover:bg-slate-50 text-slate-700"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Venues
                </Button>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Event
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search events by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                />
              </div>
              <div className="flex gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[200px] border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                    <Filter className="h-4 w-4 mr-2 text-slate-500" />
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
            </div>
          </div>

          {/* Events Display Section */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Your Events</h2>
              <p className="text-slate-600 mt-1">
                {events.length} {events.length === 1 ? "event" : "events"} in your organization
              </p>
            </div>
            <div className="p-6">
              <EventsPage eventsData={events} />
            </div>
          </div>
        </div>

        {/* Create Event Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b border-slate-200">
              <DialogTitle className="text-2xl font-semibold text-slate-900">Create New Event</DialogTitle>
              <DialogDescription className="text-slate-600">
                Fill in the details below to create a new corporate event. All required fields must be completed.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <EventForm onClose={onClose} />
            </div>
          </DialogContent>
        </Dialog>

        {/* Venue Management Dialog */}
        <Dialog open={isVenueDialogOpen} onOpenChange={setIsVenueDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b border-slate-200">
              <DialogTitle className="text-2xl font-semibold text-slate-900">Venue Management</DialogTitle>
              <DialogDescription className="text-slate-600">
                Manage your organization's venues and event locations.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Venue Management</h3>
                <p className="text-slate-600">Venue management functionality will be implemented here.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
