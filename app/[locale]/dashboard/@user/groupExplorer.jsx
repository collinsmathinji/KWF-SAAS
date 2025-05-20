"use client"

import { useState, useEffect } from "react"
import { 
  ChevronDown, 
  ChevronRight, 
  Lock, 
  Globe, 
  Users, 
  PlusCircle, 
  Search, 
  FolderClosed,
  Plus,
  ChevronLeft,
  MoreHorizontal,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getGroups } from "@/lib/group"

// Mock current user ID for demonstration
const CURRENT_USER_ID = "user123"; 

// Map group types to icons and descriptions
const groupTypeInfo = {
  'private': {
    icon: Lock,
    color: "text-amber-500",
    bg: "bg-amber-50",
    label: "Private",
    description: "Only members can see and join"
  },
  'public_open': {
    icon: Globe,
    color: "text-green-500",
    bg: "bg-green-50",
    label: "Public Open",
    description: "Anyone can see and join"
  },
  'public_closed': {
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "Public Closed",
    description: "Anyone can see, but needs approval to join"
  }
};

// ===== Component: GroupTypeIcon =====
const GroupTypeIcon = ({ type, size = "sm" }) => {
  const { icon: Icon, color, bg } = groupTypeInfo[type] || groupTypeInfo.private;
  const sizes = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8"
  };

  return <Icon className={cn(sizes[size], color)} />;
};

// ===== Component: RequestAccessDialog =====
const RequestAccessDialog = ({ group, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(group.id, reason);
    onClose();
  };
  
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Request access to {group.name}</DialogTitle>
        <DialogDescription>
          The group owner will review your request
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="text-sm font-medium mb-1 block">
            Why do you want to join this group?
          </label>
          <textarea 
            className="w-full p-2 border rounded-md min-h-24"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Briefly explain why you'd like to join..."
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Send Request
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

// ===== Component: CreateGroupDialog =====
const CreateGroupDialog = ({ onClose, onSubmit }) => {
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    groupType: "public_open"
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(groupData);
    onClose();
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogDescription>
          Create a group for collaboration
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="text-sm font-medium mb-1 block">
            Group Name
          </label>
          <Input
            name="name"
            value={groupData.name}
            onChange={handleChange}
            placeholder="Enter group name"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">
            Description
          </label>
          <textarea
            className="w-full p-2 border rounded-md min-h-24"
            name="description"
            value={groupData.description}
            onChange={handleChange}
            placeholder="What is this group about?"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">
            Group Type
          </label>
          <div className="space-y-2">
            {Object.entries(groupTypeInfo).map(([type, info]) => {
              const { icon: Icon, color, label, description } = info;
              return (
                <div 
                  key={type} 
                  className={cn(
                    "flex items-start border rounded-md p-3 cursor-pointer hover:bg-gray-50",
                    groupData.groupType === type ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  )}
                  onClick={() => handleChange({ target: { name: "groupType", value: type } })}
                >
                  <div className={cn("mt-0.5", info.bg, "p-1 rounded-md")}>
                    <Icon className={cn("h-4 w-4", color)} />
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">{label}</div>
                    <div className="text-sm text-gray-500">{description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Group
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

// ===== Component: GroupCard =====
const GroupCard = ({ group, onJoin, onRequestAccess, onSelect }) => {
  const { icon: GroupIcon, color, bg } = groupTypeInfo[group.groupType] || groupTypeInfo.private;
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  const canJoinDirectly = group.groupType === 'public_open';
  const canRequestAccess = group.groupType === 'public_closed';
  const isMember = group.members?.includes(CURRENT_USER_ID);

  return (
    <div 
      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
      onClick={(e) => {
        if (e.target.tagName !== 'BUTTON') {
          onSelect?.(group);
        }
      }}
    >
      <div className="h-24 bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center">
        {group.logo ? (
          <img src={group.logo} alt={group.name} className="h-16 w-16 object-contain" />
        ) : (
          <div className={cn("h-16 w-16 rounded-full flex items-center justify-center", bg)}>
            <GroupIcon className={cn("h-8 w-8", color)} />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg truncate">{group.name}</h3>
          <Badge variant="outline" className={cn("text-xs", bg, color)}>
            {groupTypeInfo[group.groupType].label}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10">
          {group.description || "No description available"}
        </p>
        <div className="mt-3 flex items-center text-xs text-gray-500">
          <Users className="h-3 w-3 mr-1" />
          <span>{group.members?.length || 0} members</span>
        </div>
        <div className="mt-4">
          {isMember ? (
            <Button className="w-full" variant="outline" onClick={() => onSelect?.(group)}>
              Open
            </Button>
          ) : canJoinDirectly ? (
            <Button className="w-full" onClick={() => onJoin?.(group.id)}>
              Join Group
            </Button>
          ) : canRequestAccess ? (
            <>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setShowRequestDialog(true)}
              >
                Request Access
              </Button>
              <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
                <RequestAccessDialog 
                  group={group} 
                  onClose={() => setShowRequestDialog(false)} 
                  onSubmit={onRequestAccess}
                />
              </Dialog>
            </>
          ) : (
            <Button className="w-full" variant="outline" disabled>
              <Lock className="h-3 w-3 mr-2" /> Private
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// ===== Component: GroupListItem =====
const GroupListItem = ({ group, onJoin, onRequestAccess, onSelect }) => {
  const { icon: GroupIcon, color, label } = groupTypeInfo[group.groupType];
  const isMember = group.members?.includes(CURRENT_USER_ID);
  const canJoin = group.groupType === 'public_open';
  const canRequest = group.groupType === 'public_closed';
  
  return (
    <tr 
      className="hover:bg-gray-50 cursor-pointer"
      onClick={() => onSelect?.(group)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center", groupTypeInfo[group.groupType].bg)}>
            <GroupIcon className={cn("h-5 w-5", color)} />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{group.name}</div>
            <div className="text-sm text-gray-500 line-clamp-1">{group.description}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant="outline" className={cn(color, "bg-opacity-10")}>
          {label}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {group.members?.length || 0}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isMember ? (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Joined
          </Badge>
        ) : group.groupType === 'private' ? (
          <Badge variant="outline" className="bg-gray-100 text-gray-700">
            Private
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Available
          </Badge>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end">
          {isMember ? (
            <Button variant="outline" size="sm" onClick={(e) => {
              e.stopPropagation();
              onSelect?.(group);
            }}>
              Open
            </Button>
          ) : canJoin ? (
            <Button size="sm" onClick={(e) => {
              e.stopPropagation();
              onJoin?.(group.id);
            }}>
              Join
            </Button>
          ) : canRequest ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Request
                </Button>
              </DialogTrigger>
              <RequestAccessDialog 
                group={group} 
                onClose={() => {}} 
                onSubmit={onRequestAccess}
              />
            </Dialog>
          ) : (
            <Button variant="ghost" size="sm" disabled>
              <Lock className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

// ===== Component: GroupTreeItem =====
const GroupTreeItem = ({ group, level = 0, isActive, onClick }) => {
  const { icon: GroupIcon, color } = groupTypeInfo[group.groupType] || groupTypeInfo.private;
  const [isExpanded, setIsExpanded] = useState(false);
  
  const canSee = group.groupType !== 'private' || group.members?.includes(CURRENT_USER_ID);
  if (!canSee) return null;
  
  const canAccess = group.groupType === 'public_open' || group.members?.includes(CURRENT_USER_ID);
  const hasSubgroups = group.subgroups && group.subgroups.length > 0;

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div>
      <div 
        className={cn(
          "flex items-center py-1 px-2 rounded-md my-0.5 cursor-pointer group",
          isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100",
          !canAccess && "opacity-70"
        )}
        style={{ paddingLeft: `${(level * 12) + 8}px` }}
        onClick={canAccess ? () => onClick?.(group) : undefined}
      >
        {hasSubgroups ? (
          <button 
            className="mr-1 p-0.5 hover:bg-gray-200 rounded"
            onClick={handleToggle}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}
        
        <GroupIcon className={cn("h-4 w-4 mr-2", color)} />
        
        <span className="truncate flex-grow text-sm">{group.name}</span>
        
        {!canAccess && (
          <Tooltip>
            <TooltipTrigger>
              <Lock className="h-3 w-3 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              {group.groupType === 'public_closed' 
                ? "Request access to join" 
                : "Private group - requires invitation"}
            </TooltipContent>
          </Tooltip>
        )}
        
        {isActive && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="invisible group-hover:visible ml-2 p-0.5 rounded-md hover:bg-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                Add subgroup
              </DropdownMenuItem>
              <DropdownMenuItem>
                Share group
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                Leave group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      {isExpanded && hasSubgroups && (
        <div>
          {group.subgroups.map(subgroup => (
            <GroupTreeItem
              key={subgroup.id}
              group={subgroup}
              level={level + 1}
              isActive={isActive && subgroup.id === group.id}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ===== Component: Sidebar =====
const Sidebar = ({ 
  groups, 
  selectedGroup, 
  onSelectGroup, 
  onCreateGroup, 
  onSearch, 
  searchQuery 
}) => {
  // Group groups by type
  const groupedGroups = {
    joined: groups.filter(group => group.members.includes(CURRENT_USER_ID)),
    publicOpen: groups.filter(group => 
      group.groupType === 'public_open' && !group.members.includes(CURRENT_USER_ID)
    ),
    publicClosed: groups.filter(group => 
      group.groupType === 'public_closed' && !group.members.includes(CURRENT_USER_ID)
    )
  };
  
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  
  const handleCreateGroup = (groupData) => {
    onCreateGroup?.(groupData);
    setCreateGroupOpen(false);
  };
  
  return (
    <div className="w-64 border-r bg-white p-4 flex flex-col h-full">
      <div className="mb-4">
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full"
          leftIcon={<Search className="h-4 w-4 text-gray-400" />}
        />
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-xs text-gray-500">MY GROUPS</h3>
        <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <CreateGroupDialog 
            onClose={() => setCreateGroupOpen(false)} 
            onSubmit={handleCreateGroup}
          />
        </Dialog>
      </div>
      
      <div className="overflow-y-auto flex-grow mb-4">
        {groupedGroups.joined.length > 0 ? (
          groupedGroups.joined.map(group => (
            <GroupTreeItem
              key={group.id}
              group={group}
              isActive={selectedGroup?.id === group.id}
              onClick={onSelectGroup}
            />
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500 italic px-2 mb-4">No groups joined yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-blue-500"
              onClick={() => setCreateGroupOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Create new group
            </Button>
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <h3 className="font-medium text-xs text-gray-500">DISCOVER</h3>
      </div>
      
      <div className="overflow-y-auto">
        {/* Public Open Groups Section */}
        <div className="mb-2">
          <div className="flex items-center py-1 px-2 text-sm text-gray-600">
            <Globe className="h-4 w-4 mr-2 text-green-500" />
            <span className="text-xs">Open Groups</span>
          </div>
          
          {groupedGroups.publicOpen.length > 0 ? (
            groupedGroups.publicOpen.slice(0, 3).map(group => (
              <GroupTreeItem
                key={group.id}
                group={group}
                isActive={selectedGroup?.id === group.id}
                onClick={onSelectGroup}
              />
            ))
          ) : (
            <p className="text-xs text-gray-500 italic px-7">No open groups available</p>
          )}
          
          {groupedGroups.publicOpen.length > 3 && (
            <div className="px-7 py-1">
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs flex items-center text-gray-500"
                onClick={() => onSearch?.("", "discover")}
              >
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Public Closed Groups Section */}
        <div>
          <div className="flex items-center py-1 px-2 text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-xs">Request to Join</span>
          </div>
          
          {groupedGroups.publicClosed.length > 0 ? (
            groupedGroups.publicClosed.slice(0, 3).map(group => (
              <GroupTreeItem
                key={group.id}
                group={group}
                isActive={selectedGroup?.id === group.id}
                onClick={onSelectGroup}
              />
            ))
          ) : (
            <p className="text-xs text-gray-500 italic px-7">No closed groups available</p>
          )}
          
          {groupedGroups.publicClosed.length > 3 && (
            <div className="px-7 py-1">
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs flex items-center text-gray-500"
                onClick={() => onSearch?.("", "discover")}
              >
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===== Component: GroupDetail =====
const GroupDetail = ({ group, onBack, onJoin, onRequestAccess }) => {
  const { icon: GroupIcon, color, label } = groupTypeInfo[group.groupType];
  const isMember = group.members?.includes(CURRENT_USER_ID);
  const canJoin = group.groupType === 'public_open';
  const canRequest = group.groupType === 'public_closed';
  
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            className="mr-4 p-2 hover:bg-gray-200 rounded-md"
            onClick={onBack}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <Badge variant="outline" className={cn("ml-3", color)}>
            <GroupIcon className="h-3 w-3 mr-1" />
            {label}
          </Badge>
        </div>
        
        <div className="flex items-center">
          {!isMember && canJoin && (
            <Button onClick={() => onJoin?.(group.id)}>
              Join Group
            </Button>
          )}
          
          {!isMember && canRequest && (
            <>
              <Button 
                variant="outline"
                onClick={() => setShowRequestDialog(true)}
              >
                Request Access
              </Button>
              <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
                <RequestAccessDialog 
                  group={group} 
                  onClose={() => setShowRequestDialog(false)} 
                  onSubmit={onRequestAccess}
                />
              </Dialog>
            </>
          )}
          
          {isMember && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  Share group
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Add members
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">
                  Leave group
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <p className="text-gray-700">
            {group.description || "No description available for this group."}
          </p>
        </div>
        
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium mb-4">Members</h3>
          <div className="flex flex-wrap gap-2">
            {group.members?.length > 0 ? (
              group.members.map((memberId, index) => (
                <div key={memberId} className="flex items-center bg-gray-50 rounded-full px-3 py-1">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback>{`U${index + 1}`}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">User {index + 1}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No members in this group yet</p>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Group Content</h3>
          {isMember || group.groupType === 'public_open' ? (
            <div className="bg-gray-50 p-6 rounded-lg border text-center">
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center flex-col">
                <FolderClosed className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-600 mb-2">No content yet</p>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add content
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg border text-center">
              <Lock className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 mb-4">You don't have access to view this group's content</p>
              {canRequest && (
                <Button variant="outline" onClick={() => setShowRequestDialog(true)}>
                  Request Access
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===== Component: GroupEmptyState =====
const GroupEmptyState = ({ filter, searchQuery, onCreateGroup }) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow">
      <FolderClosed className="h-12 w-12 mx-auto text-gray-400 mb-3" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">No groups found</h3>
      <p className="text-gray-500 mb-6">
        {searchQuery 
          ? "No groups match your search criteria" 
          : filter === "joined" 
            ? "You haven't joined any groups yet" 
            : "No groups available to discover"}
      </p>
      <Button onClick={onCreateGroup}>
        <Plus className="h-4 w-4 mr-2" /> Create New Group
      </Button>
    </div>
  );
};

// ===== Component: GroupsExplorer =====
export default function GroupsExplorer() {
  const [view, setView] = useState("grid"); // grid or list
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // all, joined, discover
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  
  // Fetch groups data
  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        // Ensure we get an array of groups
        const fetchedGroups = await getGroups();
        console.log("groupArray",fetchedGroups)
        const groupsArray =fetchedGroups.data.data
        
        setGroups(groupsArray);
        applyFilters(groupsArray, searchQuery, activeFilter);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        setGroups([]); // Set empty array on error
        setFilteredGroups([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGroups();
  }, []);
  
  // Apply filters when search query or filter changes
  const applyFilters = (groupsToFilter, query, filter) => {
    // Ensure we're working with an array
    if (!Array.isArray(groupsToFilter)) {
      console.error("groupsToFilter is not an array:", groupsToFilter);
      setFilteredGroups([]);
      return;
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    let filtered = [...groupsToFilter];
    
    // Apply search query filter
    if (normalizedQuery) {
      filtered = filtered.filter(group => 
        (group.name && group.name.toLowerCase().includes(normalizedQuery)) || 
        (group.description && group.description.toLowerCase().includes(normalizedQuery))
      );
    }
    
    // Apply category filter with null/undefined checks
    switch (filter) {
      case "joined":
        filtered = filtered.filter(group => 
          group.members && Array.isArray(group.members) && group.members.includes(CURRENT_USER_ID)
        );
        break;
      case "discover":
        filtered = filtered.filter(group => 
          (group.members && Array.isArray(group.members) && !group.members.includes(CURRENT_USER_ID)) && 
          (group.groupType === 'public_open' || group.groupType === 'public_closed')
        );
        break;
      // "all" shows everything, no additional filtering needed
    }
    
    setFilteredGroups(filtered);
  };
  
  // Update filters when search or filter changes
  useEffect(() => {
    applyFilters(groups, searchQuery, activeFilter);
  }, [searchQuery, activeFilter, groups]);
  
  // Handle joining a group
  const handleJoinGroup = (groupId) => {
    if (!Array.isArray(groups)) {
      console.error("Groups is not an array:", groups);
      return;
    }
    
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        // Ensure group.members is an array before spreading
        const currentMembers = Array.isArray(group.members) ? group.members : [];
        return {
          ...group,
          members: [...currentMembers, CURRENT_USER_ID]
        };
      }
      return group;
    });
    
    setGroups(updatedGroups);
    
    // Show notification or feedback
    alert(`You've successfully joined the group!`);
  };
  
  // Handle requesting access to a group
  const handleRequestAccess = (groupId, reason) => {
    // In a real app, this would send the request to an API
    console.log(`Access requested for group ${groupId}. Reason: ${reason}`);
    
    // Show notification or feedback
    alert(`Your request has been sent to the group admin.`);
  };
  
  // Handle creating a new group
  const handleCreateGroup = (groupData) => {
    // Ensure groups is treated as an array
    const groupsArray = Array.isArray(groups) ? groups : [];
    
    const newGroup = {
      id: `group${groupsArray.length + 1}`,
      ...groupData,
      members: [CURRENT_USER_ID],
      subgroups: []
    };
    
    const updatedGroups = [...groupsArray, newGroup];
    setGroups(updatedGroups);
    setSelectedGroup(newGroup);
    setCreateGroupOpen(false);
    
    // Show notification or feedback
    alert(`Group "${groupData.name}" has been created!`);
  };
  
  // Handle search
  const handleSearch = (query, newFilter = activeFilter) => {
    setSearchQuery(query);
    if (newFilter !== activeFilter) {
      setActiveFilter(newFilter);
    }
  };
  
  // Show back to list from group detail
  const handleBackToList = () => {
    setSelectedGroup(null);
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading groups...</p>
        </div>
      </div>
    );
  }

  // Render group detail view if a group is selected
  if (selectedGroup) {
    return (
      <div className="flex h-screen">
        <Sidebar 
          groups={groups}
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
          onCreateGroup={handleCreateGroup}
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
        <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
          <GroupDetail 
            group={selectedGroup}
            onBack={handleBackToList}
            onJoin={handleJoinGroup}
            onRequestAccess={handleRequestAccess}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen">
      <Sidebar 
        groups={groups}
        selectedGroup={selectedGroup}
        onSelectGroup={setSelectedGroup}
        onCreateGroup={handleCreateGroup}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
      <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {activeFilter === "joined" 
                ? "My Groups" 
                : activeFilter === "discover" 
                  ? "Discover Groups" 
                  : "All Groups"}
            </h1>
            <p className="text-gray-500">
              {filteredGroups.length} {filteredGroups.length === 1 ? 'group' : 'groups'} {searchQuery && `matching "${searchQuery}"`}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-md p-1">
              <button 
                className={cn(
                  "px-3 py-1 rounded-md",
                  view === "grid" ? "bg-white shadow-sm" : "text-gray-500"
                )}
                onClick={() => setView("grid")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grid">
                  <rect width="6" height="6" x="3" y="3" rx="1" />
                  <rect width="6" height="6" x="15" y="3" rx="1" />
                  <rect width="6" height="6" x="3" y="15" rx="1" />
                  <rect width="6" height="6" x="15" y="15" rx="1" />
                </svg>
              </button>
              <button 
                className={cn(
                  "px-3 py-1 rounded-md",
                  view === "list" ? "bg-white shadow-sm" : "text-gray-500"
                )}
                onClick={() => setView("list")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list">
                  <line x1="8" x2="21" y1="6" y2="6" />
                  <line x1="8" x2="21" y1="12" y2="12" />
                  <line x1="8" x2="21" y1="18" y2="18" />
                  <line x1="3" x2="3.01" y1="6" y2="6" />
                  <line x1="3" x2="3.01" y1="12" y2="12" />
                  <line x1="3" x2="3.01" y1="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="relative">
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="min-w-64"
              />
              {searchQuery && (
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => handleSearch("")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> New Group
                </Button>
              </DialogTrigger>
              <CreateGroupDialog 
                onClose={() => setCreateGroupOpen(false)} 
                onSubmit={handleCreateGroup}
              />
            </Dialog>
          </div>
        </div>
        
        <div className="flex space-x-1 mb-6">
          <Button 
            variant={activeFilter === "all" ? "default" : "ghost"} 
            size="sm"
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === "joined" ? "default" : "ghost"} 
            size="sm"
            onClick={() => setActiveFilter("joined")}
          >
            My Groups
          </Button>
          <Button 
            variant={activeFilter === "discover" ? "default" : "ghost"} 
            size="sm"
            onClick={() => setActiveFilter("discover")}
          >
            Discover
          </Button>
        </div>
        
        {Array.isArray(filteredGroups) && filteredGroups.length > 0 ? (
          view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onJoin={handleJoinGroup}
                  onRequestAccess={handleRequestAccess}
                  onSelect={setSelectedGroup}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Group
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Members
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGroups.map(group => (
                    <GroupListItem
                      key={group.id}
                      group={group}
                      onJoin={handleJoinGroup}
                      onRequestAccess={handleRequestAccess}
                      onSelect={setSelectedGroup}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <GroupEmptyState 
            filter={activeFilter}
            searchQuery={searchQuery}
            onCreateGroup={() => setCreateGroupOpen(true)}
          />
        )}
      </div>
    </div>
  );
}