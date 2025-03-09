"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type ActivityItem = {
  id: string
  user: {
    name: string
    avatar?: string
    email: string
  }
  action: string
  target: string
  date: string
  status?: "success" | "warning" | "error" | "info"
}

const activities: ActivityItem[] = [
  {
    id: "1",
    user: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      email: "john@example.com",
    },
    action: "created",
    target: "New Organization",
    date: "2 hours ago",
    status: "success",
  },
  {
    id: "2",
    user: {
      name: "Emily Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      email: "emily@example.com",
    },
    action: "upgraded",
    target: "Subscription Plan",
    date: "5 hours ago",
    status: "info",
  },
  {
    id: "3",
    user: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      email: "michael@example.com",
    },
    action: "invited",
    target: "5 new team members",
    date: "Yesterday",
    status: "info",
  },
  {
    id: "4",
    user: {
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      email: "sarah@example.com",
    },
    action: "reported",
    target: "API downtime issue",
    date: "Yesterday",
    status: "error",
  },
  {
    id: "5",
    user: {
      name: "David Lee",
      avatar: "/placeholder.svg?height=32&width=32",
      email: "david@example.com",
    },
    action: "completed",
    target: "Onboarding process",
    date: "3 days ago",
    status: "success",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-4 rounded-lg border p-3 transition-all hover:bg-slate-50 animate-slide-in"
          style={{ animationDelay: `${Number.parseInt(activity.id) * 100}ms` }}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {activity.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.date}</p>
          </div>
          <Badge
            variant="outline"
            className={`
              ${activity.status === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : ""}
              ${activity.status === "warning" ? "border-amber-200 bg-amber-50 text-amber-700" : ""}
              ${activity.status === "error" ? "border-red-200 bg-red-50 text-red-700" : ""}
              ${activity.status === "info" ? "border-blue-200 bg-blue-50 text-blue-700" : ""}
            `}
          >
            {activity.status}
          </Badge>
        </div>
      ))}
    </div>
  )
}

