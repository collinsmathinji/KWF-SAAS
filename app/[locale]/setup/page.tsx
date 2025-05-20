"use client"
import { useState } from "react"
import DashboardPage from "../dashboard/@admin/page"
import OrganizationSetup from "../setup/setup"



const OrganizationManagement = () => {
  const [showSetup, setShowSetup] = useState(true) // Start with setup dialog visible
  return (
    <div className="relative">
      {/* Main Dashboard */}
      <div className={`h-screen `}>
        <DashboardPage />
      </div>

      {/* Setup Dialog */}
      {showSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <OrganizationSetup
            persistent={true} // Add the persistent prop
          />
        </div>
      )}
    </div>
  )
}

export default OrganizationManagement
