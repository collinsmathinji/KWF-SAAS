"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function MembershipTypePage({ }: { params: { id: string } }) {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-3xl font-bold">Edit Membership Type</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membership Details</CardTitle>
          <CardDescription>Update the membership type information and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Premium" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              defaultValue="Premium membership with additional benefits and features"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Monthly Price</Label>
            <Input id="price" type="number" defaultValue="99.99" />
          </div>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Member Statistics</CardTitle>
          <CardDescription>Overview of members with this membership type</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Members</p>
            <p className="text-2xl font-bold">156</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Active Members</p>
            <p className="text-2xl font-bold">142</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Monthly Growth</p>
            <p className="text-2xl font-bold">+12%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

