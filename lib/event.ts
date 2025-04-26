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

export async function createEvent(eventData: EventData): Promise<any> {
  try {
    const response = await fetch("/api/event/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create event");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function fetchEvents(): Promise<EventData[]> {
  try {
    const response = await fetch("/api/event/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch events");
    }

    const responseData = await response.json();
    return responseData as EventData[];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}