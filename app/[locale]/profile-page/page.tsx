"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Mail, Phone } from "lucide-react"

export default function UserProfile() {
  // Mock user data
  const user = {
    name: "John Doe",
    title: "Senior Software Engineer",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    location: "New York, NY",
    joinDate: "January 15, 2022",
    avatarUrl: "/placeholder.svg?height=200&width=200",
    bio: "Passionate software engineer with 10+ years of experience in building scalable and reliable systems.",
    skills: ["JavaScript", "React", "Node.js", "SQL", "AWS"],
  }

  return (
    <div className="p-6">
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
          <CardDescription className="text-muted-foreground">{user.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">{user.bio}</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined: {user.joinDate}</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.skills.map((skill) => (
                <Button key={skill} variant="secondary" size="sm">
                  {skill}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

