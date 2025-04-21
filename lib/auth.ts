"use client"
import { checkUserType, storeAuthToken, storeUserType } from "./token"
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
    if (!response.ok) {
      throw new Error(data.message || "Login failed")
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
    console.error("Error logging in:", error)
    throw error
  }
}

