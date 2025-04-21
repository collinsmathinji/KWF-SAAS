"use client"

export interface OrganizationType {
  id: string
  stripeAccountId: string
 stripeCustomerId: string
  name: string
  logoUrl: File | null
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
  state: string
  country: string
}

export interface CreateOrganizationData {
  name: string
  organizationEmail: string
  organizationPhone: string
  address: string
  city: string
  zipCode: string
  state: string
  country: string
  organizationLogo?: File
}

export interface UpdateOrganizationData {
  id: string
  name?: string
  organizationEmail?: string
  organizationPhone?: string
  address?: string
  city?: string
  zipCode?: string
  state?: string
  country?: string
  logoUrl?: string
}

export async function uploadOrganizationLogo(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch("http://localhost:5000/admin/uploads/single", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload organization logo");
  }

  const data = await response.json();
  return data.fileUrl;
}

export async function createOrganization(data: CreateOrganizationData): Promise<OrganizationType> {
  try {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'organizationLogo' && value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, String(value))
        }
      }
    })

    const response = await fetch("/api/organizations", {
      method: "POST",
      body: formData,
    })

    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create organization")
    }

    console.log("Organization created:", responseData)
    return responseData
  } catch (error) {
    console.error("Error creating organization:", error)
    throw error
  }
}

// Get all organizations
export async function getOrganizations(): Promise<OrganizationType[]> {
  try {
    const response = await fetch("/api/organizations", {
      method: "GET",
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

// Get organization by ID
export async function getOrganizationById(id: string): Promise<OrganizationType> {
  try {
    const response = await fetch(`/api/organizations/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch organization")
    }

    return data
  } catch (error) {
    console.error(`Error fetching organization with ID ${id}:`, error)
    throw error
  }
}

export async function updateOnBoarding(dataToSubmit: OrganizationType): Promise<OrganizationType> {
  const organizationId = localStorage.getItem("organizationId");
  const userId = localStorage.getItem("userId");
  
  if (!organizationId) throw new Error("Organization ID not found");
  
  const response = await fetch(`/api/organization/update/${organizationId}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToSubmit),
  });
  if (response.status === 200) {
    const editedData = await fetch(`/api/user/update/${userId}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isOnboarded: true,
      }),
    });
    
    if (!editedData.ok) {
      throw new Error("Failed to update user");
    }
  }
  
  if (!response.ok) {
    throw new Error("Failed to update organization");
  }
  
  return response.json();
}

  

// Delete an organization
export async function deleteOrganization(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/organizations/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete organization")
    }

    console.log("Organization deleted:", id)
    return { success: true }
  } catch (error) {
    console.error(`Error deleting organization with ID ${id}:`, error)
    throw error
  }
}