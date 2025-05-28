export interface memberType {
  name: string | null
  description: string | null
  organizationId: number | null
}

export interface member {
  OrganizationId: any |null
  firstName:string,
  lastName: string,
  username: string,
  email: string | null
  // mobileNo: number | null
  phoneNumber: string,
  membershipTypeId: string,
  isPortalAccess: boolean | null
}

export async function getMembers(organizationId: string): Promise<member[]> {
  try {
    const response = await fetch("/api/member/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: { organizationId },
        options: {
          select: ['id', 'firstName', 'lastName', 'email', 'membershipTypeId', 'isActive', 'createdAt']
        }
      }),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch members")
    }
    
    return data.data || []
  } catch (error) {
    console.error("Error fetching members:", error)
    throw error
  }
}

export async function createMemberType(data: memberType): Promise<memberType> {
  try {
    const response = await fetch("/api/membershipType/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    
    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create memberType")
    }
    
    if (!responseData.data) {
      throw new Error("No data received from server")
    }
    
    return responseData.data
  } catch (error) {
    console.error("Error creating memberType:", error)
    throw error
  }
}

export async function createMember(data: member): Promise<member> {
  try {
    const response = await fetch("/api/member/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    
    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create member")
    }
    
    console.log("member created:", responseData)
    return responseData
  } catch (error) {
    console.error("Error creating member:", error)
    throw error
  }
}

export async function fetchMemberType(organizationId: string): Promise<memberType[]> {
  try {
    const response = await fetch("/api/membershipType/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: { organizationId },
        options: {
          select: ['id', 'name', 'description', 'organizationId']
        }
      }),
    })
    
    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch memberTypes")
    }
    
    // Store the data in localStorage if needed
    if (responseData.data) {
      localStorage.setItem('currentMemberType', JSON.stringify(responseData.data));
    }
    
    console.log("memberTypes fetched:", responseData)
    return responseData.data || []
  } catch (error) {
    console.error("Error fetching memberTypes:", error)
    throw error
  }
}

export async function deleteMemberById(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/member/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete Member")
    }
    
    console.log("Member deleted:", id)
    return { success: true }
  } catch (error) {
    console.error(`Error deleting Member with ID ${id}:`, error)
    throw error
  }
}