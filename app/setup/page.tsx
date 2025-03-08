"use client"
import React, { useState } from 'react';
import DashboardPage from '../(admin)/admin-dashboard/page';
import OrganizationSetup from '../setup/setup';

interface Organization {
  id: string;
  name: string;
  email: string;
  phone: string;
  logo?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  whiteLabel: boolean;
}

const OrganizationManagement = () => {
  const [showSetup, setShowSetup] = useState(true);  // Start with setup dialog visible
  const [organization, setOrganization] = useState<Organization | null>(null);
  
  const handleSetupComplete = (orgData: any) => {
    console.log(organization)
    setOrganization(orgData);
    setShowSetup(false);
  };
  
  return (
    <div className="relative">
      {/* Main Dashboard */}
      <div className={`h-screen `}>
        <DashboardPage />
      </div>
      
      {/* Setup Dialog */}
      {showSetup && (
        <div  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <OrganizationSetup
            onComplete={handleSetupComplete}
            onClose={() => {}} // Empty function to prevent closing behavior
            persistent={true} // Add the persistent prop
          />
        </div>
      )}
    </div>
  );
};

export default OrganizationManagement;