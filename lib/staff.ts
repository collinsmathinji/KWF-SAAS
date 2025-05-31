export interface Staff {
  id: string
  name: string
  email: string
  staffRoleId: string
  hasPortalAccess: boolean
  isActive: boolean
  createdAt: string
  organizationId: number | null
}

export async function getStaff(organizationId: string): Promise<Staff[]> {
  try {
    const response = await fetch("/api/staff/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: { organizationId },
        options: {
          select: ['id', 'name', 'email', 'staffRoleId', 'hasPortalAccess', 'isActive', 'createdAt', 'organizationId']
        }
      }),
    })
    
    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch staff")
    }
    
    return responseData.data || []
  } catch (error) {
    console.error("Error fetching staff:", error)
    throw error
  }
}

export async function createStaff(data: Omit<Staff, 'id' | 'createdAt'>): Promise<Staff> {
  try {
    const response = await fetch("/api/staff/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    
    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create staff")
    }
    
    return responseData.data
  } catch (error) {
    console.error("Error creating staff:", error)
    throw error
  }
}

export async function deleteStaff(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/staff/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete staff")
    }
    
    return { success: true }
  } catch (error) {
    console.error(`Error deleting staff with ID ${id}:`, error)
    throw error
  }
} 