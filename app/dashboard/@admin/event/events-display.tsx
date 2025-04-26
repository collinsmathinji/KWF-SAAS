import { useEffect, useState } from "react";
import { fetchEvents } from "@/lib/event";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function EventManagementPage() {
  const [events, setEvents] = useState<any[]>([]); // State to store events
  const [isLoading, setIsLoading] = useState(true); // State to handle loading

  // Fetch events on component mount
  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetchEvents();
        console.log("Fetched events:", response.data);
        setEvents(response.data); // Store events in state
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
    loadEvents();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Events</h1>
      {isLoading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Card key={event.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>
                  {format(new Date(event.startDate), "PPP")} - {event.city}, {event.nation}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{event.description}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Hosted by: {event.hostOrganization}
                </p>
              </CardContent>
              <Button variant="outline" className="mt-4">
                View Details
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}