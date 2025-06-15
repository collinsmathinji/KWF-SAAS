// app/dashboard/layout.tsx
"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon, UserIcon } from "lucide-react";
import OrganizationManagement from "@/app/[locale]/setup/page";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function DashboardLayout({
  user,
  admin,
}: {
  user: React.ReactNode;
  admin: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  
  const [viewAs, setViewAs] = useState<"admin" | "user" | null>(null);
  const [actualUserType, setActualUserType] = useState<string | null>(null);
  const [isOnBoarded, setIsOnBoarded] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Current session status:", status);
    console.log("Current session data:", session);
    
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (status === "authenticated" && session?.user) {
      const userType = session.user.userType;
      const board=localStorage.getItem('isOnboarded')
      const onboardingStatus = board
      
      console.log("User type from session:", userType);
      console.log("Onboarding status from session:", onboardingStatus);
      
      // Set user type based on the value
      let userTypeValue: "admin" | "user" | null = null;
      if (userType === '1' || userType === 'STAFF') {
        userTypeValue = "admin";
      } else if (userType === '2') {
        userTypeValue = "user";
      }
      
      setActualUserType(userTypeValue);
      setIsOnBoarded(onboardingStatus);

      // Initialize viewAs to match actual user type
      if (userTypeValue) {
        setViewAs(userTypeValue);
      }

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [session, status]);

  const toggleView = () => {
    setViewAs(viewAs === "admin" ? "user" : "admin");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div className="flex items-center justify-center h-screen">Please sign in to access this page</div>;
  }

  const isAdmin = actualUserType === "admin";

  const showContent = () => {
    if (!isAdmin) return user;

    // If admin and not onboarded, always show setup page
    if (isAdmin && isOnBoarded==='false') {
      return <OrganizationManagement />;
    }

    return viewAs === "admin" ? admin : user;
  };

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        {isAdmin && isOnBoarded==="true" && (
          <Button
            onClick={toggleView}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
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
      </div>
      {showContent()}
    </div>
  );
}