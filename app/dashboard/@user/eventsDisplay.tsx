"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchEvents } from "@/lib/event";
import { useSession } from "next-auth/react"

interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  venue: string;
  address: string;
  city: string;
  description: string;
  isPaid: boolean;
  price: number;
  stripeProductId?: string;
  stripePriceId?: string;
  coverImage?: string;
  organizationId: number;
}

interface CheckoutFormData {
  email: string;
  guestFirstName: string;
  guestLastName: string;
  eventId: string;
}

const EventsDisplay: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    guestFirstName: '',
    guestLastName: '',
    eventId: '',
  });
  
  const router = useRouter();
  
  useEffect(() => {
    // Make sure session is loaded before accessing it
    if (status === "authenticated" && session?.user) {
      setOrganizationId(session.user.organizationId);
    }
  }, [status, session]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetchEvents(organizationId || undefined);
        console.log("Fetched events:", response.data);
        setEvents(response.data?.data || []); // Ensure events is always an array
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setError("Failed to load events. Please try again later.");
        setEvents([]); // Fallback to an empty array in case of an error
        setLoading(false);
      }
    }
  
    if (organizationId !== null) {
      loadEvents();
    }
  }, [organizationId]); 

  const handleRegister = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      ...formData,
      eventId: event.id,
    });
    setShowCheckout(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedEvent) return;
    
    try {
      // For paid events, create Stripe checkout session
      if (selectedEvent.isPaid && selectedEvent.stripePriceId) {
        const guestName = `${formData.guestFirstName} ${formData.guestLastName}`;
        
        const response = await fetch("http://localhost:5000/checkout/create-checkout-session", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              priceId: selectedEvent.stripePriceId,
              email: formData.email,
              customerName: guestName,
              eventId: selectedEvent.id,
              mode: 'payment', // Important: specify this is a one-time payment, not a subscription
              quantity: 1,
              successUrl: `${window.location.origin}/success?event=${selectedEvent.id}`,
              cancelUrl: `${window.location.origin}/events`
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create checkout session');
          }
      
          const data = await response.json();
          
          if (data.sessionUrl) {
            // Optional: Register with pending status before redirecting to payment
            await fetch('/api/events/pre-register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                eventId: selectedEvent.id,
                email: formData.email,
                guestName,
                paymentStatus: 'pending'
              }),
            });
            
            // Redirect to Stripe checkout
            window.location.href = data.sessionUrl;
          } else {
            throw new Error('No session URL returned');
          }
      } else {
        // For free events, register directly
        const response = await fetch('/api/events/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId: selectedEvent.id,
            email: formData.email,
            guestName: `${formData.guestFirstName} ${formData.guestLastName}`,
            paymentStatus: 'registered' // Already registered for free events
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Registration failed');
        }
        
        alert('Registration successful!');
        setShowCheckout(false);
        // Reset form after successful registration
        setFormData({
          email: '',
          guestFirstName: '',
          guestLastName: '',
          eventId: '',
        });
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-red-800">Error loading events</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h1>
      
      {/* Checkout Modal */}
      {showCheckout && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedEvent.isPaid ? 'Payment & Registration' : 'Event Registration'}
              </h2>
              <button 
                onClick={() => setShowCheckout(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <p className="mb-4">
              <span className="font-medium">Event:</span> {selectedEvent.name}
              {selectedEvent.isPaid && (
                <span className="block text-green-600 font-medium mt-1">
                  Price: ${selectedEvent.price}
                </span>
              )}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="guestFirstName"
                  value={formData.guestFirstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="guestLastName"
                  value={formData.guestLastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  selectedEvent.isPaid 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {selectedEvent.isPaid ? 'Proceed to Payment' : 'Complete Registration'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              {event.coverImage ? (
                <div className="relative h-48">
                  <Image 
                    src={event.coverImage} 
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 truncate">{event.name}</h3>
                
                <div className="mb-3 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Start:</span> {formatDate(event.startDate)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">End:</span> {formatDate(event.endDate)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Venue:</span> {event.venue}
                  </p>
                  {event.city && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Location:</span> {event.city}
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {event.description || 'No description available'}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  {event.isPaid ? (
                    <>
                      <span className="font-semibold text-green-600">${event.price}</span>
                      <button
                        onClick={() => handleRegister(event)}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium"
                      >
                        Pay & Register
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-blue-600">Free</span>
                      <button
                        onClick={() => handleRegister(event)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsDisplay;