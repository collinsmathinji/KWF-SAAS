"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { WorkspaceMember, MemberRole } from "@/types/workspace"

interface MemberListProps {
  members: WorkspaceMember[]
  onUpdateRole: (memberId: string, role: MemberRole) => void
  onRemoveMember: (memberId: string) => void
  currentUserRole: MemberRole
}

export function MemberList({ members, onUpdateRole, onRemoveMember, currentUserRole }: MemberListProps) {
  const canManageMembers = currentUserRole === "admin"

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={`/api/avatar/${member.userId}`} />
              <AvatarFallback>{member.userId.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{member.userId}</p>
              <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
            </div>
          </div>
          {canManageMembers && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">Manage</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onUpdateRole(member.id, "admin")}>Make Admin</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateRole(member.id, "member")}>Make Member</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateRole(member.id, "guest")}>Make Guest</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => onRemoveMember(member.id)}>
                  Remove Member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}
    </div>
  )
}

