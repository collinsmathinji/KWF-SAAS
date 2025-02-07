import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MemberType {
  id: string
  name: string
  level: string
}

interface MemberTypesTableProps {
  memberType: MemberType | undefined
}

export function MemberTypesTable({ memberType }: MemberTypesTableProps) {
  if (!memberType) return null

  return (
    <div className="p-8">
      <CardHeader>
        <CardTitle>{memberType.name} Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="whitespace-nowrap px-6 py-3 font-medium">Name</th>
                <th className="whitespace-nowrap px-6 py-3 font-medium">Email</th>
                <th className="whitespace-nowrap px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="bg-card">
                <td className="whitespace-nowrap px-6 py-4">John Doe</td>
                <td className="whitespace-nowrap px-6 py-4">john@example.com</td>
                <td className="whitespace-nowrap px-6 py-4">Active</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </div>
  )
}
