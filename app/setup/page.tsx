"use client"
import React, { useState } from 'react';
import OrganizationDashboard from '../member-portal/page';
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

  const handleSetupComplete = (orgData: Organization) => {
    console.log(organization)
    setOrganization(orgData);
    setShowSetup(false);
  };

  return (
    <div className="relative">
      {/* Main Dashboard */}
      <div className={`h-screen ${showSetup ? 'pointer-events-none' : ''}`}>
        <OrganizationDashboard />
      </div>

      {/* Setup Dialog */}
      {showSetup && (
        <div className="absolute inset-0">
          <OrganizationSetup 
            onComplete={handleSetupComplete}
            onClose={() => setShowSetup(false)}
          />
        </div>
      )}
    </div>
  );
};

export default OrganizationManagement;