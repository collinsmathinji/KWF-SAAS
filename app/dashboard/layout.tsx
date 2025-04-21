"use client"

import type React from "react"

import { checkUserType } from "@/lib/token"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { EyeIcon, UserIcon } from "lucide-react"
import OrganizationManagement from "@/app/setup/page"

export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode
  admin: React.ReactNode
}) {
  const [viewAs, setViewAs] = useState<"admin" | "user" | null>(null)
  const [actualUserType, setActualUserType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOnBoarded, setIsOnBoarded] = useState<boolean | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const result = await checkUserType()
        setActualUserType(result?.userType ?? null)

        const onboarded = localStorage.getItem("isOnBoarded")
        setIsOnBoarded(onboarded === "true")

        // Initialize viewAs to match actual user type
        if (!viewAs) {
          setViewAs(result?.userType === "admin" ? "admin" : "user")
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error checking user type:", error)
        setIsLoading(false)
      }
    }

    checkUser()
  }, [viewAs])

  const toggleView = () => {
    setViewAs(viewAs === "admin" ? "user" : "admin")
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const isAdmin = actualUserType === "admin"

  const showContent = () => {
    if (!isAdmin) return user

    // If admin and not onboarded, always show setup page
    if (viewAs === "admin" && isOnBoarded === false) {
      return <OrganizationManagement />
    }

    return viewAs === "admin" ? admin : user
  }

  return (
    <div className="relative">
      {isAdmin && isOnBoarded && (
        <Button
          onClick={toggleView}
          variant="outline"
          size="sm"
          className="fixed top-4 right-4 z-50 flex items-center gap-2"
        >
          {viewAs === "admin" ? (
            <>
              <UserIcon className="h-4 w-4" />
              View as User
            </>
          ) : (
            <>
              <EyeIcon className="h-4 w-4" />
              Back to Admin
            </>
          )}
        </Button>
      )}
      {showContent()}
    </div>
  )
}
