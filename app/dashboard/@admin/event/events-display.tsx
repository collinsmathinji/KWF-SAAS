import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Tag, Users } from "lucide-react";

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

export default function EventsPage({ eventsData }: any) {
  // Extract events from the correct data structure
  const [events, setEvents] = useState<Event[]>(eventsData?.data || []);
  const [paginator, setPaginator] = useState<Paginator>(eventsData?.paginator || {
    itemCount: 0,
    perPage: 12,
    pageCount: 1,
    currentPage: 1
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(paginator.currentPage);
  const eventsPerPage = 12; // 3x4 grid = 12 events per page for larger cards
  
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
        perPage: 12,
        pageCount: 1,
        currentPage: 1
      });
      setCurrentPage(eventsData.paginator?.currentPage || 1);
    }
  }, [eventsData]);

  // Get a vibrant background color based on event type
  const getEventTypeColor = (eventType: string) => {
    const types: Record<string, string> = {
      "Conference": "bg-blue-500",
      "Workshop": "bg-purple-500",
      "Seminar": "bg-green-500",
      "Webinar": "bg-teal-500",
      "Exhibition": "bg-amber-500",
      "Networking": "bg-rose-500",
    };
    
    return types[eventType] || "bg-gray-500";
  };

  // Simple loading state for SSR
  if (!mounted) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <h1 className="text-4xl font-bold mb-6">Events</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Upcoming Events</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover and participate in the most exciting events happening around the world</p>
      </div>
      
      {events.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-16 text-center">
          <p className="text-xl text-gray-600">No events found. Please check back later.</p>
        </div>
      ) : (
        <>
          {/* Grid with 3 columns on large screens for larger cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.id} className="flex flex-col h-full shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border-0">
                {/* Colorful banner based on event type */}
                <div className={`h-3 w-full ${getEventTypeColor(event.eventType)}`}></div>
                
                <CardHeader className="pb-4 pt-6">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-bold text-gray-800">{event.name}</CardTitle>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.isPaid ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                      {event.isPaid ? `Paid • ${event.price}` : 'Free'}
                    </span>
                  </div>
                  
                  <CardDescription className="text-base mt-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    <span>
                      {format(new Date(event.startDate), "MMM d, yyyy")}
                      {event.endDate && ` - ${format(new Date(event.endDate), "MMM d, yyyy")}`}
                    </span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow pb-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {event.eventType && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {event.eventType}
                      </span>
                    )}
                    {event.theme && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {event.theme}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-base text-gray-700 line-clamp-3 mb-6">{event.description}</p>
                  
                  <div className="text-sm text-gray-600 space-y-2 mt-4">
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {event.city}, {event.nation}
                    </p>
                    <p className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      Hosted by: {event.hostOrganization}
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 pb-6">
                  <Button 
                    className="w-full text-base py-6 bg-blue-600 hover:bg-blue-700 text-white" 
                    size="lg"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Pagination controls - only show if we have more than one page */}
          {paginator.pageCount > 1 && (
            <div className="mt-16 flex flex-col md:flex-row justify-between items-center px-2 space-y-6 md:space-y-0">
              <div className="text-base text-gray-600">
                Showing {((currentPage - 1) * paginator.perPage) + 1}-
                {Math.min(currentPage * paginator.perPage, paginator.itemCount)} of {paginator.itemCount} events
              </div>
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={goToPreviousPage} 
                  disabled={currentPage === 1}
                  className="flex items-center border-2 border-gray-300 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" /> Previous
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={goToNextPage} 
                  disabled={currentPage === totalPages}
                  className="flex items-center border-2 border-gray-300 hover:bg-gray-100"
                >
                  Next <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Page indicator - only show if we have more than one page */}
          {paginator.pageCount > 1 && (
            <div className="flex justify-center mt-6">
              <p className="text-base text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}