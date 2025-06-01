export interface Staff {
  id: number
  firstName: string
  lastName?: string
  email: string
  staffRoleId: number
  organizationId: number
  hasPortalAccess: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string | null
  createdBy: string
  createdByUserType: string
  updatedBy: string | null
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

export async function getStaff(organizationId: number): Promise<Staff[]> {
  try {
    const response = await fetch("/api/staff/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId,
        page: 1,
        perPage: 25
      }),
    })
    
    const responseData: PaginatedResponse<Staff> = await response.json()
    
    if (!response.ok || responseData.status !== "SUCCESS") {
      throw new Error(responseData.message || "Failed to fetch staff")
    }
    
    // Transform the data to match our interface
    const staff = responseData.data.data.map(member => ({
      ...member,
      updatedAt: member.updatedAt || null,
      updatedBy: member.updatedBy || null
    }))

    return staff
  } catch (error) {
    console.error("Error fetching staff:", error)
    throw error
  }
}

export async function createStaff(data: Omit<Staff, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>): Promise<Staff> {
  try {
    const response = await fetch("/api/staff/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()

    // Check for validation errors first
    if (response.status === 422) {
      throw new Error(responseData.message || "Validation error occurred")
    }

    // Check for other error responses
    if (!response.ok || responseData.status !== "SUCCESS") {
      throw new Error(responseData.message || "Failed to create staff member")
    }

    // Safely access the data
    if (!responseData.data?.data?.[0]) {
      throw new Error("Invalid response format from server")
    }

    const staffData = responseData.data.data[0]

    // Transform the response data to match our interface
    const staff: Staff = {
      ...staffData,
      id: staffData.id,
      firstName: staffData.firstName,
      lastName: staffData.lastName || null,
      email: staffData.email,
      staffRoleId: staffData.staffRoleId,
      organizationId: staffData.organizationId,
      hasPortalAccess: staffData.hasPortalAccess,
      isActive: staffData.isActive,
      createdAt: staffData.createdAt,
      createdBy: staffData.createdBy,
      createdByUserType: staffData.createdByUserType,
      updatedAt: staffData.updatedAt || null,
      updatedBy: staffData.updatedBy || null
    }

    return staff
  } catch (error) {
    // Enhance error handling
    if (error instanceof Error) {
      throw error
    }
    throw new Error("An unexpected error occurred while creating staff member")
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
    
    const responseData: PaginatedResponse<any> = await response.json()
    
    if (!response.ok || responseData.status !== "SUCCESS") {
      throw new Error(responseData.message || "Failed to delete staff")
    }
    
    return { success: true }
  } catch (error) {
    console.error(`Error deleting staff with ID ${id}:`, error)
    throw error
  }
} 