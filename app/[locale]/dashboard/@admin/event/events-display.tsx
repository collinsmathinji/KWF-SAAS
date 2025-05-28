"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  type: string
  registeredAttendees: number
  status: "Upcoming" | "In Progress" | "Completed"
  ticketPrice: string
  ticketsSold: number
  ticketingEnabled: boolean
}

interface EventsPageProps {
  eventsData: Event[]
}

const getStatusBadge = (status: string) => {
  const variants = {
    Upcoming: "bg-blue-50 text-blue-700 border-blue-200",
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
    Completed: "bg-green-50 text-green-700 border-green-200",
  }

  return (
    <Badge variant="outline" className={variants[status as keyof typeof variants] || variants.Upcoming}>
      {status}
    </Badge>
  )
}

const getTypeColor = (type: string) => {
  const colors = {
    conference: "bg-purple-100 text-purple-800",
    workshop: "bg-blue-100 text-blue-800",
    seminar: "bg-green-100 text-green-800",
    networking: "bg-orange-100 text-orange-800",
    training: "bg-indigo-100 text-indigo-800",
    meeting: "bg-gray-100 text-gray-800",
  }

  return colors[type.toLowerCase() as keyof typeof colors] || colors.meeting
}

export function EventsPage({ eventsData = [] }: EventsPageProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Ensure eventsData is always an array
  const events = Array.isArray(eventsData) ? eventsData : []

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarDays className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Events Found</h3>
        <p className="text-slate-600 mb-6">
          Get started by creating your first event to manage and track your organization's activities.
        </p>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white">Create Your First Event</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {events.map((event) => {
        const attendanceRate = event.capacity ? (event.registeredAttendees / event.capacity) * 100 : 0

        return (
          <Card key={event.id} className="border-slate-200 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl font-semibold text-slate-900">{event.title}</CardTitle>
                    {getStatusBadge(event.status)}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{event.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="cursor-pointer">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Event
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-700 font-medium">{format(new Date(event.date), "MMM dd, yyyy")}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-700 font-medium">{event.time}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-700 font-medium truncate">{event.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                </div>
              </div>

              {/* Attendance Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-700 font-medium">Attendance</span>
                  </div>
                  <span className="text-slate-600">
                    {event.registeredAttendees} / {event.capacity} registered
                  </span>
                </div>
                <Progress value={attendanceRate} className="h-2" />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{attendanceRate.toFixed(1)}% capacity</span>
                  {event.ticketingEnabled && <span>{event.ticketsSold} tickets sold</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50 text-slate-700">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>

                {event.status === "Upcoming" && (
                  <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50 text-slate-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Event
                  </Button>
                )}

                {event.status === "In Progress" && (
                  <Button variant="outline" size="sm" className="border-green-300 hover:bg-green-50 text-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Check-in
                  </Button>
                )}

                {event.status === "Completed" && (
                  <Button variant="outline" size="sm" className="border-blue-300 hover:bg-blue-50 text-blue-700">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
