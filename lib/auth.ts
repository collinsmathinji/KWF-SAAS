"use client"
import { checkUserType, storeAuthToken, storeUserType } from "./token"
import { getOrganizationById } from "./organization"
import { fetchMemberType } from "./members"
export interface SignupData {
  name: string
  password: string
  token?: string
}

export interface LoginData {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    email: string
    [key: string]: any
  }
}
export async function signup({ name, password,token }: SignupData): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/completeSignUp", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password,token }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Signup failed")
    }

    if (data.data.token) {
      await storeAuthToken(data.data.token)
    }
    if(data.data.userType) {
      console.log('User type:', data.data.userType)
      await storeUserType(data.data.userType)
    }
    return data
  } catch (error) {
    console.error("Error signing up:", error)
    throw error
  }
}

export async function login({ username, password }: LoginData): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({  username, password }),
    })

    const data = await response.json()
   console.log('Login response:', data)
   console.log('isOnboarded:', data.data.isOnboarded)
   localStorage.setItem("isOnBoarded", data.data.isOnboarded)
   localStorage.setItem("organizationId", data.data.organizationId)
   localStorage.setItem("userId", data.data.id)
    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }
try{
    if (data.data.token) {
      await storeAuthToken(data.data.token)
    }
    if(data.data.userType) {
      console.log('User type:', data.data.userType)
      await storeUserType(data.data.userType)
    }else{
      console.log('User type not found in response')
    }
    if(data.data.organizationId) {
      console.log('Organization ID:', data.data.organizationId)
      await  getOrganizationById(data.data.organizationId)
      await fetchMemberType (data.data.organizationId)
    }else{
      console.log('Organization ID not found in response')
    }
}catch(error){
  console.error("Error storing token or user type:", error) 
}
    return data
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}


