// Define the type for the input data
interface GroupData {
  name: string;
  logo?: string; // Optional, as it might not always be provided
  description?: string; // Optional
  organizationId: number;
  groupTypeId: number;
  addedBy: number;
}

// Define the type for the response data
interface GroupResponse {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  organizationId: number;
  groupTypeId: number;
  isActive: boolean;
  message: string;
  isDeleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  addedBy:string;
}
 export async function getGroupTypes(): Promise<GroupData[]> {
   try {
     const response = await fetch("/api/groupType/list", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
     })
 
     const data = await response.json()
     
     if (!response.ok) {
       throw new Error(data.message || "Failed to fetch organizations")
     }
 
     return data
   } catch (error) {
     console.error("Error fetching organizations:", error)
     throw error
   }
 }
 export async function getGroups(organizationId: string): Promise<GroupData[]> {
    try {
      const response = await fetch("/api/group/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizationId }),
      })
  
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch groups")
      }
  
      return data
    } catch (error) {
      console.error("Error fetching groups:", error)
      throw error
    }
  }
export async function createGroup(data: GroupData): Promise<GroupResponse> {
  try {
    const response = await fetch("/api/group/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData: GroupResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData?.message || "Failed to create group");
    }

    console.log("Group created:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
}

export async function createGroupType(data: GroupData): Promise<GroupResponse> {
  try {
    const response = await fetch("/api/groupType/create", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const responseData: GroupResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create group type");
    }

    console.log("Group type created:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error creating group type:", error);
    throw error;
  }
}