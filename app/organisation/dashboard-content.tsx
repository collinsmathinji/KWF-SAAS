import React from 'react';
import { Activity, DollarSign, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MemberDashboardProps {
  member: {
    id: string;
    name: string;
    type: string;
    joinDate: string;
    projectsCompleted: number;
    currentProjects: number;
    monthlyContribution: number;
    groupMemberships: {
      groupName: string;
      role: string;
      projectsInvolved: number;
    }[];
    recentActivity: {
      date: string;
      action: string;
      project: string;
    }[];
  };
}

const MemberDashboard = ({ member }: MemberDashboardProps) => {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold">Member Dashboard - {member.name}</h2>
        <p className="text-muted-foreground">Member Type: {member.type}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Member Since</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{member.joinDate}</div>
              <Clock className="h-4 w-4 text-blue-100" />
            </div>
            <p className="text-xs text-blue-100">Active member</p>
          </CardContent>
        </Card>

        {/* <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Monthly Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">${member.monthlyContribution}</div>
              <DollarSign className="h-4 w-4 text-blue-100" />
            </div>
            <p className="text-xs text-blue-100">Current plan</p>
          </CardContent>
        </Card> */}

        <Card className="bg-gradient-to-br from-blue-700 to-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Group Memberships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{member.groupMemberships.length}</div>
              <Users className="h-4 w-4 text-blue-100" />
            </div>
            <p className="text-xs text-blue-100">Active groups</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-800 to-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Current Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{member.currentProjects}</div>
              <Activity className="h-4 w-4 text-blue-100" />
            </div>
            <p className="text-xs text-blue-100">In progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Group Memberships</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Projects</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {member.groupMemberships.map((membership, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{membership.groupName}</TableCell>
                    <TableCell>{membership.role}</TableCell>
                    <TableCell>{membership.projectsInvolved}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Project</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {member.recentActivity.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{activity.date}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>{activity.project}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;