"use client"

import { useState } from "react"
import { WorkspaceSettings } from "@/components/workspace-settings"
import { MemberList } from "@/components/member-list"
import { WorkspaceCreateDialog } from "@/components/workspace-create-dialog"
import type { Workspace, WorkspaceMember, WorkspaceVisibility } from "@/types/workspace"

interface WorkspacePageClientProps {
  initialWorkspace: Workspace
  initialMembers: WorkspaceMember[]
}

export function WorkspacePageClient({ initialWorkspace, initialMembers }: WorkspacePageClientProps) {
  const [workspace, setWorkspace] = useState(initialWorkspace)
  const [members, setMembers] = useState(initialMembers)

  const handleCreateWorkspace = async (data: {
    name: string
    description: string
    visibility: WorkspaceVisibility
  }) => {
    // Here you would typically make an API call to create the workspace
    console.log("Creating workspace:", data)
  }

  const handleUpdateWorkspace = async (data: Partial<Workspace>) => {
    // Here you would typically make an API call to update the workspace
    setWorkspace({ ...workspace, ...data })
  }

  const handleUpdateRole = async (memberId: string, role: WorkspaceMember["role"]) => {
    // Here you would typically make an API call to update the member's role
    setMembers(members.map((member) => (member.id === memberId ? { ...member, role } : member)))
  }

  const handleRemoveMember = async (memberId: string) => {
    // Here you would typically make an API call to remove the member
    setMembers(members.filter((member) => member.id !== memberId))
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workspace Settings</h1>
        <WorkspaceCreateDialog onSubmit={handleCreateWorkspace} />
      </div>

      <div className="grid gap-8">
        <WorkspaceSettings workspace={workspace} onUpdate={handleUpdateWorkspace} />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Members</h2>
          <MemberList
            members={members}
            onUpdateRole={handleUpdateRole}
            onRemoveMember={handleRemoveMember}
            currentUserRole="admin"
          />
        </div>
      </div>
    </div>
  )
}

