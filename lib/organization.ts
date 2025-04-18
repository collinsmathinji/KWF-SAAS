"use client"

// Define types
export interface OrganizationType {
  id: string
  connectAccountId: string
  customerId: string
  name: string
  organizationLogo: File | null
  logoPreview: string
  organizationEmail: string
  organizationPhone: string
  address: string
  city: string
  zipCode: string
  state: string
  country: string
  email: string
  phone: string
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
  organizationLogo?: File
}

// Create a new organization
export async function createOrganization(data: CreateOrganizationData): Promise<OrganizationType> {
  try {
    // Create FormData for handling file upload
    const formData = new FormData()
    
    // Add all fields to FormData
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
      // Don't set Content-Type header when using FormData
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

// Update an organization
export async function updateOrganization(data: UpdateOrganizationData): Promise<OrganizationType> {
  try {
    const { id, ...updateData } = data
    
    // Create FormData for handling file upload
    const formData = new FormData()
    
    // Add all fields to FormData
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'organizationLogo' && value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, String(value))
        }
      }
    })

    const response = await fetch(`/api/organization/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({formData }),
    })


    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update organization")
    }

    console.log("Organization updated:", responseData)
    return responseData
  } catch (error) {
    console.error("Error updating organization:", error)
    throw error
  }
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