import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Group {
  id: string
  name: string
  type: string
}

interface GroupsTableProps {
  group: Group | undefined
}

export function GroupsTable({ group }: GroupsTableProps) {
  if (!group) return null

  return (
    <div className="p-8">
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="whitespace-nowrap px-6 py-3 font-medium">Name</th>
                <th className="whitespace-nowrap px-6 py-3 font-medium">Email</th>
                <th className="whitespace-nowrap px-6 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="bg-card">
                <td className="whitespace-nowrap px-6 py-4">Jane Smith</td>
                <td className="whitespace-nowrap px-6 py-4">jane@example.com</td>
                <td className="whitespace-nowrap px-6 py-4">Team Lead</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </div>
  )
}

