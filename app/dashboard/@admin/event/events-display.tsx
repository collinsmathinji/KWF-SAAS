import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define proper TypeScript interfaces
interface Event {
  id: string | number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  city: string;
  nation: string;
  hostOrganization: string;
  isPaid: boolean;
  price: string;
  eventType: string;
  theme: string;
  region: string;
  subRegion: string;
  // Include other fields as needed
}

interface Paginator {
  itemCount: number;
  perPage: number;
  pageCount: number;
  currentPage: number;
}

interface EventsResponse {
  data: Event[];
  paginator: Paginator;
}

export default function EventsPage({ eventsData }: { eventsData: EventsResponse }) {
  // Extract events from the correct data structure
  const [events, setEvents] = useState<Event[]>(eventsData?.data || []);
  const [paginator, setPaginator] = useState<Paginator>(eventsData?.paginator || {
    itemCount: 0,
    perPage: 20,
    pageCount: 1,
    currentPage: 1
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(paginator.currentPage);
  const eventsPerPage = 20; // 4x5 grid = 20 events per page
  
  // Calculate pagination values
  const totalPages = paginator.pageCount;
  
  // Handle page changes
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
      // In a real app, you'd fetch the next page of events here
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
      // In a real app, you'd fetch the previous page of events here
    }
  };

  // Server-side rendering hydration fix
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial data processing when props change
  useEffect(() => {
    if (eventsData) {
      setEvents(eventsData.data || []);
      setPaginator(eventsData.paginator || {
        itemCount: 0,
        perPage: 20,
        pageCount: 1,
        currentPage: 1
      });
      setCurrentPage(eventsData.paginator?.currentPage || 1);
    }
  }, [eventsData]);

  // Simple loading state for SSR
  if (!mounted) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">Events</h1>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Upcoming Events</h1>
      
      {events.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-lg text-gray-600">No events found.</p>
        </div>
      ) : (
        <>
          {/* Grid with 4 columns on large screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {format(new Date(event.startDate), "MMM d, yyyy")}
                    {event.endDate && ` - ${format(new Date(event.endDate), "MMM d, yyyy")}`}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <div className="flex items-center mb-2 text-xs font-medium">
                    <span className={`px-2 py-1 rounded-full ${event.isPaid ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                      {event.isPaid ? `Paid • ${event.price}` : 'Free'}
                    </span>
                    {event.eventType && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {event.eventType}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm line-clamp-3 mb-2">{event.description}</p>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    <p className="flex items-center">
                      <span className="inline-block w-3 h-3 mr-1 rounded-full bg-gray-200"></span>
                      {event.city}, {event.nation}
                    </p>
                    {event.theme && (
                      <p className="mt-1">Theme: {event.theme}</p>
                    )}
                    <p className="mt-1">Hosted by: {event.hostOrganization}</p>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full hover:bg-blue-50">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Pagination controls - only show if we have more than one page */}
          {paginator.pageCount > 1 && (
            <div className="flex justify-between items-center mt-8 px-2">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * paginator.perPage) + 1}-
                {Math.min(currentPage * paginator.perPage, paginator.itemCount)} of {paginator.itemCount} events
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={goToPreviousPage} 
                  disabled={currentPage === 1}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={goToNextPage} 
                  disabled={currentPage === totalPages}
                  className="flex items-center"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Page indicator - only show if we have more than one page */}
          {paginator.pageCount > 1 && (
            <div className="flex justify-center mt-4">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}