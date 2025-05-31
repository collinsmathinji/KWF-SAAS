import { Permission } from "@/types/permissions"

export interface StaffRole {
  id: string
  roleName: string
  description: string
  permissions: Permission[]
  createdAt: string
  organizationId: number | null
}

export async function getStaffRoles(organizationId: string): Promise<StaffRole[]> {
  try {
    const response = await fetch("/api/staffRole/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: { organizationId },
        options: {
          select: ['id', 'roleName', 'description', 'permissions', 'createdAt', 'organizationId']
        }
      }),
    })
    
    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch staff roles")
    }
    
    // Store the data in localStorage if needed
    if (responseData.data) {
      localStorage.setItem('currentStaffRoles', JSON.stringify(responseData.data))
    }
    
    console.log("Staff roles fetched:", responseData)
    return responseData.data || []
  } catch (error) {
    console.error("Error fetching staff roles:", error)
    throw error
  }
}

export async function createStaffRole(data: Omit<StaffRole, 'id' | 'createdAt'>): Promise<StaffRole> {
  try {
    const response = await fetch("/api/staffRole/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    
    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create staff role")
    }
    
    if (!responseData.data) {
      throw new Error("No data received from server")
    }
    
    return responseData.data
  } catch (error) {
    console.error("Error creating staff role:", error)
    throw error
  }
}

export async function getAvailablePermissions(): Promise<Permission[]> {
  try {
    const response = await fetch("/api/staffRole/permissions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch permissions")
    }
    
    return responseData.data || []
  } catch (error) {
    console.error("Error fetching permissions:", error)
    throw error
  }
}

export async function deleteStaffRole(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/staffRole/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete staff role")
    }
    
    return { success: true }
  } catch (error) {
    console.error(`Error deleting staff role with ID ${id}:`, error)
    throw error
  }
} 