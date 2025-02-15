"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Workspace, WorkspaceVisibility } from "@/types/workspace"

interface WorkspaceSettingsProps {
  workspace: Workspace
  onUpdate: (data: Partial<Workspace>) => void
}

export function WorkspaceSettings({ workspace, onUpdate }: WorkspaceSettingsProps) {
  const [visibility, setVisibility] = useState<WorkspaceVisibility>(workspace.visibility)

  const handleVisibilityChange = (newVisibility: WorkspaceVisibility) => {
    setVisibility(newVisibility)
    onUpdate({ visibility: newVisibility })
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="groups">Groups</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Workspace Settings</CardTitle>
            <CardDescription>Manage your workspace settings and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Workspace Name</Label>
              <Input id="name" defaultValue={workspace.name} onChange={(e) => onUpdate({ name: e.target.value })} />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Visibility</Label>
              <RadioGroup value={visibility} onValueChange={handleVisibilityChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">Private - Only invited members can join</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public">Public - Anyone in your organization can join</Label>
                </div>
              </RadioGroup>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-destructive">Danger Zone</Label>
              <Button variant="destructive">Delete Workspace</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

