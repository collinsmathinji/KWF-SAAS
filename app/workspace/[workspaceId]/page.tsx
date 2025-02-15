import { WorkspacePageClient } from "@/components/workspace-page-client"

// This would typically come from your database
const mockWorkspace = {
  id: "1",
  name: "My Team",
  description: "Our team workspace",
  visibility: "private" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  ownerId: "user1",
}

const mockMembers = [
  {
    id: "1",
    workspaceId: "1",
    userId: "user1",
    role: "admin" as const,
    joinedAt: new Date(),
  },
  {
    id: "2",
    workspaceId: "1",
    userId: "user2",
    role: "member" as const,
    joinedAt: new Date(),
  },
]

export default function WorkspacePage() {
  // In a real app, you would fetch this data from your database
  return <WorkspacePageClient initialWorkspace={mockWorkspace} initialMembers={mockMembers} />
}

