export interface memberType {
    name: string | null
    description: string | null
    organizationId: number | null
  }
  export interface member {
    name: string | null
    email: string | null
    mobileNo: number | null
    givePortalAccess: boolean | null
  }
 export async function getMemberss(): Promise<member[]> {
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
export async function createMemberType(data: memberType): Promise<memberType> {
  try {
 

    const response = await fetch("/api/membershipType/create", {
      method: "POST",
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create memberType")
    }

    console.log("memberType created:", responseData)
    return responseData
  } catch (error) {
    console.error("Error creating memberType:", error)
    throw error
  }
}
export async function createMember(data: member): Promise<member> {
  try {
 

    const response = await fetch("/api /member/create", {
      method: "POST",
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create memberType")
    }

    console.log("memberType created:", responseData)
    return responseData
  } catch (error) {
    console.error("Error creating memberType:", error)
    throw error
  }
}
export async function fetchMemberType(data: memberType): Promise<memberType> {
    try {
   
  
      const response = await fetch("/api/membershipType/list", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
      })
  
      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create memberType")
      }
     localStorage.setItem('currentMemberType', JSON.stringify(responseData.data.data));
      console.log("memberType created:", responseData)
      return responseData
    } catch (error) {
      console.error("Error creating memberType:", error)
      throw error
    }
  }