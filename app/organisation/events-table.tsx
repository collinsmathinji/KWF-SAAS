import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Event {
  id: string
  title: string
  date: string
  location: string
}

interface EventsTableProps {
  events: Event[]
}

export function EventsTable({ events }: EventsTableProps) {
  return (
    <div className="p-8">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="whitespace-nowrap px-6 py-3 font-medium">Event Name</th>
                <th className="whitespace-nowrap px-6 py-3 font-medium">Date</th>
                <th className="whitespace-nowrap px-6 py-3 font-medium">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {events.map((event) => (
                <tr key={event.id} className="bg-card">
                  <td className="whitespace-nowrap px-6 py-4">{event.title}</td>
                  <td className="whitespace-nowrap px-6 py-4">{event.date}</td>
                  <td className="whitespace-nowrap px-6 py-4">{event.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </div>
  )
}

