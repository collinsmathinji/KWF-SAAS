"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Users } from "lucide-react"
import StaffRoleList from "../staff-role-list"
import StaffForm from "../staff-form"
import type { Staff } from "@/lib/staff"

export default function StaffPage() {
  const [showStaffDialog, setShowStaffDialog] = useState(false)
  const [staffMembers, setStaffMembers] = useState<Staff[]>([])

  const handleStaffCreated = (newStaff: Staff) => {
    setStaffMembers(prev => [...prev, newStaff])
    setShowStaffDialog(false)
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-gray-500">Manage your organization's staff members and roles</p>
        </div>
        <Button onClick={() => setShowStaffDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Staff Roles Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <StaffRoleList />
      </div>

      {/* Staff Creation Dialog */}
      <Dialog open={showStaffDialog} onOpenChange={setShowStaffDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Add New Staff Member
            </DialogTitle>
          </DialogHeader>
          <StaffForm
            onClose={() => setShowStaffDialog(false)}
            onStaffCreated={handleStaffCreated}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 