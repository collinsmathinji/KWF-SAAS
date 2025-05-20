
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Tag, Users, Clock, Globe } from "lucide-react";

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
    const types: Record<string, { bg: string, text: string, border: string }> = {
      "Conference": { bg: "bg-blue-500", text: "text-blue-600", border: "border-blue-500" },
      "Workshop": { bg: "bg-purple-500", text: "text-purple-600", border: "border-purple-500" },
      "Seminar": { bg: "bg-green-500", text: "text-green-600", border: "border-green-500" },
      "Webinar": { bg: "bg-teal-500", text: "text-teal-600", border: "border-teal-500" },
      "Exhibition": { bg: "bg-amber-500", text: "text-amber-600", border: "border-amber-500" },
      "Networking": { bg: "bg-rose-500", text: "text-rose-600", border: "border-rose-500" },
    };
    
    return types[eventType] || { bg: "bg-gray-500", text: "text-gray-600", border: "border-gray-500" };
  };

  // Calculate event duration
  const getEventDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 1 ? `${diffDays} days` : "1 day";
  };

  // Simple loading state for SSR
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto p-6 max-w-7xl">
          <h1 className="text-4xl font-bold mb-6">Events</h1>
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  const colorScheme = getEventTypeColor(events[0]?.eventType || "Conference");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Upcoming Events
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover and participate in the most exciting events happening around the world
          </p>
          
          {/* Stats Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-3xl font-bold text-blue-600">{paginator.itemCount}</p>
              <p className="text-gray-600">Total Events</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-3xl font-bold text-purple-600">{events.filter(e => e.isPaid).length}</p>
              <p className="text-gray-600">Paid Events</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-3xl font-bold text-green-600">{events.filter(e => !e.isPaid).length}</p>
              <p className="text-gray-600">Free Events</p>
            </div>
          </div>
        </div>
        
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No events found. Please check back later.</p>
          </div>
        ) : (
          <>
            {/* Enhanced Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const colors = getEventTypeColor(event.eventType);
                return (
                  <Card key={event.id} className="group flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-white hover:-translate-y-1">
                    {/* Colorful banner with gradient */}
                    <div className="relative h-2 w-full overflow-hidden">
                      <div className={`absolute inset-0 ${colors.bg}`}></div>
                      <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30`}></div>
                    </div>
                    
                    <CardHeader className="pb-4 pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">{event.name}</CardTitle>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.isPaid ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-700'} shadow-sm`}>
                          {event.isPaid ? `${event.price}` : 'FREE'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <CardDescription className="text-sm flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                          <span>
                            {format(new Date(event.startDate), "MMM d, yyyy")}
                            {event.endDate && event.startDate !== event.endDate && ` - ${format(new Date(event.endDate), "MMM d, yyyy")}`}
                          </span>
                        </CardDescription>
                        
                        {event.endDate && (
                          <div className="text-sm flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-purple-500" />
                            <span>{getEventDuration(event.startDate, event.endDate)}</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-grow pb-6">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {event.eventType && (
                          <span className={`px-3 py-1 ${colors.border} border rounded-full text-sm font-medium flex items-center ${colors.text}`}>
                            <Tag className="h-3 w-3 mr-1" />
                            {event.eventType}
                          </span>
                        )}
                        {event.theme && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            {event.theme}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-base text-gray-700 line-clamp-3 mb-6 leading-relaxed">{event.description}</p>
                      
                      <div className="text-sm text-gray-600 space-y-3 mt-auto">
                        <p className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-red-500" />
                          <span className="font-medium text-gray-700">{event.city}, {event.nation}</span>
                        </p>
                        <p className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-indigo-500" />
                          <span>{event.hostOrganization}</span>
                        </p>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0 pb-6 px-6">
                      <Button 
                        className={`w-full text-base py-6 ${colors.bg} hover:opacity-90 text-white font-semibold transition-all group-hover:scale-105 shadow-lg`}
                        size="lg"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            
            {/* Enhanced Pagination */}
            {paginator.pageCount > 1 && (
              <div className="mt-20 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                  <div className="text-base text-gray-700 font-medium">
                    Showing <span className="text-blue-600 font-bold">{((currentPage - 1) * paginator.perPage) + 1}</span>-
                    <span className="text-blue-600 font-bold">{Math.min(currentPage * paginator.perPage, paginator.itemCount)}</span> of {" "}
                    <span className="text-purple-600 font-bold">{paginator.itemCount}</span> events
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={goToPreviousPage} 
                      disabled={currentPage === 1}
                      className="flex items-center border-2 hover:bg-blue-50 hover:border-blue-400 transition-all disabled:opacity-50 px-6"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" /> Previous
                    </Button>
                    
                    <div className="hidden md:flex items-center gap-2">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = currentPage <= 3 ? i + 1 : 
                                       currentPage >= totalPages - 2 ? totalPages - 4 + i : 
                                       currentPage - 2 + i;
                        if (pageNum > 0 && pageNum <= totalPages) {
                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === currentPage ? "default" : "outline"}
                              size="lg"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-12 ${pageNum === currentPage ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-50'}`}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                        return null;
                      })}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={goToNextPage} 
                      disabled={currentPage === totalPages}
                      className="flex items-center border-2 hover:bg-blue-50 hover:border-blue-400 transition-all disabled:opacity-50 px-6"
                    >
                      Next <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </div>
                
                {/* Page indicator for mobile */}
                <div className="flex justify-center mt-6 md:hidden">
                  <p className="text-base text-gray-600 font-medium">
                    Page <span className="text-blue-600 font-bold">{currentPage}</span> of <span className="text-purple-600 font-bold">{totalPages}</span>
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}