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

// Update an organization
export async function updateOrganization(data: UpdateOrganizationData): Promise<OrganizationType> {
    try {
      const { id, ...updateData } = data
      let logoUrl = null

      if (updateData.organizationLogo instanceof File) {
        const imageFormData = new FormData()
        imageFormData.append("file", updateData.organizationLogo)
  
        const uploadResponse = await fetch("http://localhost:5000/admin/uploads/single", {
          method: "POST",
          body: imageFormData,
        })
  
        if (!uploadResponse.ok) {
          throw new Error("Failed to upload organization logo")
        }
        const uploadData = await uploadResponse.json()
        logoUrl = uploadData.url
        delete updateData.organizationLogo
      }
      const organizationFormData = new FormData()
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          organizationFormData.append(key, String(value))
        }
      })
      if (logoUrl) {
        organizationFormData.append("organizationLogo", logoUrl)
      }
  
      // Send the organization data to your API
      const response = await fetch(`/api/organization/update/${id}`, {
        method: "PUT",
        body: organizationFormData,
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