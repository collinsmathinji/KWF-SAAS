"use client"
export interface EventData {
  name: string;
  startDate: string; // ISO date string
  isPaid: boolean;
  price?: number;
  duration: number;
  eventType: string;
  theme: string;
  hostOrganization: string;
  coHost?: string;
  sponsor?: string;
  region: string;
  subRegion?: string;
  nation: string;
  city: string;
  description: string;
}
import { useSession } from "next-auth/react"
export async function createEvent(eventData: EventData): Promise<any> {
  try {
    const response = await fetch("/api/event/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // If the response contains a message, use it, otherwise use a default message
      const errorMessage = responseData.message || responseData.error || "Failed to create event";
      throw new Error(errorMessage);
    }

    return {
      success: true,
      data: responseData.data,
      message: responseData.message || "Event created successfully"
    };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export const fetchEvents = async (organizationId?: string) => {
  const response = await fetch('/api/event/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        organizationId: organizationId
      },
      options: {
        sort: { createdAt: -1 },
        select: [
          'id',
          'name',
          'startDate',
          'endDate',
          'venue',
          'address',
          'city',
          'country',
          'description',
          'isPaid',
          'price',
          'coverImage',
          'organizationId',
          'stripeProductId',
          'stripePriceId'
        ]
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  return response.json();
};