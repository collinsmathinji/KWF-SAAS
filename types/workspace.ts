export type MemberRole = "admin" | "member" | "guest"

export type WorkspaceVisibility = "public" | "private"

export interface Workspace {
  id: string
  name: string
  description?: string
  visibility: WorkspaceVisibility
  createdAt: Date
  updatedAt: Date
  ownerId: string
}

export interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  role: MemberRole
  joinedAt: Date
}

export interface Group {
  id: string
  workspaceId: string
  name: string
  description?: string
  visibility: WorkspaceVisibility
  createdAt: Date
  updatedAt: Date
}

export interface GroupMember {
  id: string
  groupId: string
  userId: string
  role: MemberRole
  joinedAt: Date
}

