"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function AddMemberForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would typically make an API call to add the member
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated API call
      toast({
        title: "Success",
        description: `Invitation sent to ${email}`,
      })
      setEmail("")
      setRole("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="py-6 bg-blue-50  flex items-center justify-center">
      <Card className="w-full max-w-lg border-blue-100 bg-white shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-blue-900">Add Team Member</CardTitle>
          <CardDescription className="text-blue-600">
            Invite a new member to join your organization. They&apos;ll receive an email invitation valid for 72 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-900">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="member@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-blue-900">
                Role
              </Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger
                  id="role"
                  disabled={isLoading}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                >
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-blue-600">
                {role === "owner" && "Full access to all resources and settings"}
                {role === "admin" && "Can manage team members and most settings"}
                {role === "member" && "Can view and edit most resources"}
                {role === "viewer" && "Can only view resources"}
              </p>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !email || !role}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

