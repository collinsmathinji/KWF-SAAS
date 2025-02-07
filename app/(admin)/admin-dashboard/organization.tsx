import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Shield, Trash2, Edit } from "lucide-react";

export default function GroupMemberManagement() {
  // Interfaces
  interface MemberType {
    id: number;
    name: string;
    permissions: string[];
  }

  interface Group {
    id: number;
    name: string;
    description: string;
    memberTypeId: number;
  }

  // State
  const [memberTypes, setMemberTypes] = useState<MemberType[]>([
    { id: 1, name: 'Admin', permissions: ['full_access', 'manage_users'] },
    { id: 2, name: 'Member', permissions: ['view', 'edit'] }
  ]);

  const [groups, setGroups] = useState<Group[]>([
    { id: 1, name: 'Marketing Team', description: 'Marketing department group', memberTypeId: 2 },
    { id: 2, name: 'Development Team', description: 'Development department group', memberTypeId: 2 }
  ]);

  const [newMemberType, setNewMemberType] = useState<Omit<MemberType, 'id'>>({
    name: '',
    permissions: []
  });

  const [newGroup, setNewGroup] = useState<Omit<Group, 'id'>>({
    name: '',
    description: '',
    memberTypeId: 0
  });

  // Handlers
  const handleCreateMemberType = () => {
    if (!newMemberType.name) return;
    
    const memberType: MemberType = {
      id: memberTypes.length + 1,
      ...newMemberType
    };
    setMemberTypes([...memberTypes, memberType]);
    setNewMemberType({ name: '', permissions: [] });
  };

  const handleCreateGroup = () => {
    if (!newGroup.name) return;
    
    const group: Group = {
      id: groups.length + 1,
      ...newGroup
    };
    setGroups([...groups, group]);
    setNewGroup({ name: '', description: '', memberTypeId: 0 });
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Organization Structure</h1>
        <p className="text-gray-600">Manage member types and groups</p>
      </div>

      <Tabs defaultValue="member-types">
        <TabsList className="mb-4">
          <TabsTrigger value="member-types" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" /> Member Types
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center">
            <Users className="mr-2 h-4 w-4" /> Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="member-types">
          <Card>
            <CardHeader>
              <CardTitle>Member Types</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mb-4">
                    <Plus className="mr-2" /> Create Member Type
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Member Type</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Member Type Name"
                      value={newMemberType.name}
                      onChange={(e) => setNewMemberType({ ...newMemberType, name: e.target.value })}
                    />
                    <Button onClick={handleCreateMemberType}>Create</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="space-y-4">
                {memberTypes.map((type) => (
                  <div key={type.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold">{type.name}</h3>
                      <div>
                        <Button variant="ghost" size="sm" className="mr-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Permissions: {type.permissions.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mb-4">
                    <Plus className="mr-2" /> Create Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Group Name"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    />
                    <Input
                      placeholder="Description"
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    />
                    <Button onClick={handleCreateGroup}>Create</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="space-y-4">
                {groups.map((group) => (
                  <div key={group.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{group.name}</h3>
                        <p className="text-sm text-gray-600">{group.description}</p>
                      </div>
                      <div>
                        <Button variant="ghost" size="sm" className="mr-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}