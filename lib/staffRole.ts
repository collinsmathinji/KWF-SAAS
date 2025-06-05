import { Permission } from "@/src/types/permissions"

export interface StaffRole {
  id: number
  organizationId: number
  roleName: string
  description: string
  isDeleted: boolean
  createdBy: string
  createdByUserType: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string | null
  permissions?: Permission[]
  scope?: {
    field: string
    value: string
  }
}

interface PaginatedResponse<T> {
  status: string
  message: string
  data: {
    data: T[]
    paginator: {
      itemCount: number
      perPage: number
      pageCount: number
      currentPage: number
    }
  }
}

export async function getStaffRoles(organizationId: number): Promise<StaffRole[]> {
  try {
    const response = await fetch("/api/staffRole/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       query: { organizationId },
        page: 1,
        perPage: 25
      })
    })
    
    const responseData: PaginatedResponse<StaffRole> = await response.json()
    
    if (!response.ok || responseData.status !== "SUCCESS") {
      throw new Error(responseData.message || "Failed to fetch staff roles")
    }
    
    // Transform the data to match our interface
    const roles = responseData.data.data.map(role => ({
      ...role,
      permissions: role.permissions || [],
      updatedAt: role.updatedAt || null,
      updatedBy: role.updatedBy || null
    }))

    return roles
  } catch (error) {
    console.error("Error fetching staff roles:", error)
    throw error
  }
}

export async function createStaffRole(data: {
  roleName: string
  description: string
  permissions: Permission[]
  organizationId: number
  isDeleted: boolean
  createdBy: string
  createdByUserType: string
  scope?: {
    field: string
    value: string
  }
}): Promise<StaffRole> {
  try {
    const response = await fetch("/api/staffRole/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    
    const responseData: PaginatedResponse<StaffRole> = await response.json()
    
    if (!response.ok || responseData.status !== "SUCCESS") {
      throw new Error(responseData.message || "Failed to create staff role")
    }
    
    if (!responseData.data.data[0]) {
      throw new Error("No data received from server")
    }
    
    // Transform the response data to match our interface
    const role: StaffRole = {
      ...responseData.data.data[0],
      permissions: responseData.data.data[0].permissions || [],
      updatedAt: responseData.data.data[0].updatedAt || null,
      updatedBy: responseData.data.data[0].updatedBy || null
    }
    
    return role
  } catch (error) {
    console.error("Error creating staff role:", error)
    throw error
  }
}

export async function getAvailablePermissions(): Promise<Permission[]> {
  try {
    const response = await fetch("/api/staffRolePermission/available", {
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