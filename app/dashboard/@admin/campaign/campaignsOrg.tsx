'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Coins, 
  ChevronRight, 
  Clock,
  Users,
  PieChart,
  Edit,
  Eye,
  Trash2,
  ArrowUpRight,
  Search,
  Filter,
  ChevronDown,
  X,
  DollarSign,
  Plus,
  Gift,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
// Import your campaign form component here
import CampaignCreationForm from './campaignForm';

// Types
interface Campaign {
  id: string;
  title: string;
  cause: string;
  category: string;
  donationType: 'one-time' | 'recurring';
  targetAmount: number;
  coverImage: string;
  gallery?: string[];
  description: string;
  startDate: string;
  endDate?: string;
  status: 'draft' | 'active' | 'ended' | 'pending';
  organizationId: string;
  groupId?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  currentAmount?: number;
  donorCount?: number;
}

// Category name mapping
const CATEGORY_LABELS: Record<string, string> = {
  'charity': 'Charity',
  'education': 'Education',
  'medical': 'Medical',
  'community': 'Community',
  'environment': 'Environment',
  'animal': 'Animal Welfare',
  'arts': 'Arts & Culture',
  'other': 'Other'
};

// Status badge colors
const STATUS_COLORS: Record<string, { bg: string, text: string, icon: React.ReactNode }> = {
  'active': { 
    bg: 'bg-green-100', 
    text: 'text-green-800',
    icon: <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
  },
  'draft': { 
    bg: 'bg-gray-100', 
    text: 'text-gray-800',
    icon: <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></div>
  },
  'ended': { 
    bg: 'bg-blue-100', 
    text: 'text-blue-800',
    icon: <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></div>
  },
  'pending': { 
    bg: 'bg-yellow-100', 
    text: 'text-yellow-800',
    icon: <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></div>
  }
};

// Dialog component for the form
interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isEditMode: boolean;
}

const FormDialog: React.FC<FormDialogProps> = ({ isOpen, onClose, children, isEditMode }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scale-100 animate-in fade-in duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
            {isEditMode ? 'Edit Campaign' : 'Create New Campaign'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  bgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, bgColor }) => (
  <div className={`${bgColor} rounded-xl p-5 flex items-center space-x-4`}>
    <div className="rounded-full bg-white bg-opacity-30 p-3">
      {icon}
    </div>
    <div>
      <p className="text-white text-opacity-90 text-sm font-medium">{title}</p>
      <p className="text-white text-xl font-bold">{value}</p>
    </div>
  </div>
);

const OrganizationCampaigns = () => {
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { data: session } = useSession();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [refreshAnimation, setRefreshAnimation] = useState(false);
  
  // Update the fetchCampaigns function
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/donation/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            organizationId: session?.user?.organizationId
          },
          options: {
            paginate: 20,
            page: 1,
            select: [
              'id',
              'title',
              'cause',
              'category', 
              'donationType',
              'targetAmount',
              'coverImage',
              'description',
              'startDate',
              'endDate',
              'status',
              'organizationId'
            ]
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const data = await response.json();
      if (data.status === "SUCCESS") {
        // Initialize currentAmount and donorCount as 0 since they don't exist in DB
        const campaignsWithDefaults = (data.data.rows || []).map((campaign:any) => ({
          ...campaign,
          currentAmount: Math.floor(Math.random() * campaign.targetAmount * 0.8), // Mock data for demo
          donorCount: Math.floor(Math.random() * 50) // Mock data for demo
        }));
        setCampaigns(campaignsWithDefaults);
      } else {
        throw new Error(data.message || 'Failed to fetch campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);
  
  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || campaign.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Ongoing';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate progress percentage
  const calculateProgress = (current: number, goal: number): number => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };
  
  // Compute total stats
  const totalStats = {
    activeCount: campaigns.filter(c => c.status === 'active').length,
    totalRaised: campaigns.reduce((sum, c) => sum + (c.currentAmount || 0), 0),
    totalDonors: campaigns.reduce((sum, c) => sum + (c.donorCount || 0), 0)
  };
  
  // Handle campaign deletion (mock)
  const handleDeleteCampaign = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/admin/donation/softDelete/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }

      // Refresh campaigns list
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };
  
  // Open campaign details
  const openCampaignDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };
  
  // Close campaign details
  const closeCampaignDetails = () => {
    setSelectedCampaign(null);
  };
  
  // Open campaign form dialog
  const openFormDialog = () => {
    setIsFormDialogOpen(true);
  };
  
  // Close campaign form dialog
  const closeFormDialog = () => {
    setIsFormDialogOpen(false);
  };
  
  // Handle form submission (mock)
  const handleFormSubmit = async (formData: any) => {
    try {
      const response = await fetch('/admin/donation/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          organizationId: sessionStorage.getItem('organizationId')
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      await fetchCampaigns();
      closeFormDialog();
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setRefreshAnimation(true);
    fetchCampaigns().finally(() => {
      setTimeout(() => setRefreshAnimation(false), 1000);
    });
  };

  // Add the handleUpdateCampaign function
  const handleUpdateCampaign = async (id: string, updatedData: Partial<Campaign>) => {
    try {
      const response = await fetch(`/admin/donation/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Failed to update campaign');
      }

      await fetchCampaigns();
      setIsEditMode(false);
      setEditingCampaign(null);
      closeFormDialog();
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };
  
  // Add an edit button handler
  const handleEditClick = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsEditMode(true);
    setIsFormDialogOpen(true);
  };

  // Campaign details view
  if (selectedCampaign) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button 
            onClick={closeCampaignDetails}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors"
          >
            <ChevronRight className="rotate-180 mr-1" size={20} /> Back to All Campaigns
          </button>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
            <div className="relative h-64 md:h-80">
              <Image 
                src={selectedCampaign.coverImage}
                alt={selectedCampaign.title}
                fill
                style={{ objectFit: 'cover' }}
                className="w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="flex items-center mb-3">
                      <span className={`${STATUS_COLORS[selectedCampaign.status].bg} ${STATUS_COLORS[selectedCampaign.status].text} text-xs font-semibold px-3 py-1 rounded-full flex items-center`}>
                        {STATUS_COLORS[selectedCampaign.status].icon}
                        {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                      </span>
                      
                      {selectedCampaign.donationType === 'recurring' && (
                        <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full ml-2 flex items-center">
                          <RefreshCw size={12} className="mr-1.5" />
                          Recurring
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold mb-2 drop-shadow-sm">{selectedCampaign.title}</h1>
                    <div className="flex items-center text-sm text-white/90">
                      <span className="mr-4 flex items-center">
                        <Calendar size={16} className="mr-1.5 text-white/70" />
                        {formatDate(selectedCampaign.startDate)}
                        {selectedCampaign.endDate && ` - ${formatDate(selectedCampaign.endDate)}`}
                      </span>
                      <span className="flex items-center">
                        <Coins size={16} className="mr-1.5 text-white/70" />
                        {CATEGORY_LABELS[selectedCampaign.category] || selectedCampaign.category}
                      </span>
                    </div>
                  </div>
                  
                  {selectedCampaign.status === 'active' && (
                    <Link 
                      href={`/campaigns/${selectedCampaign.id}`}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
                      target="_blank"
                    >
                      View Live <ArrowUpRight size={16} className="ml-1.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-8 leading-relaxed">
                {selectedCampaign.description}
              </p>
              
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-8 text-white shadow-lg">
                <div className="flex flex-wrap gap-6">
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-white/90 font-medium mb-2">Progress</h3>
                    <div className="flex items-end mb-3">
                      <span className="text-3xl font-bold">
                        {formatCurrency(selectedCampaign.currentAmount || 0)}
                      </span>
                      <span className="text-white/80 ml-2">
                        of {formatCurrency(selectedCampaign.targetAmount)}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-white/20 rounded-full">
                      <div 
                        className="h-2.5 bg-white rounded-full" 
                        style={{ width: `${calculateProgress(selectedCampaign.currentAmount || 0, selectedCampaign.targetAmount)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-white/90 mt-2 font-medium">
                      {calculateProgress(selectedCampaign.currentAmount || 0, selectedCampaign.targetAmount)}% of goal
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <h3 className="text-white/90 font-medium mb-2">Donors</h3>
                      <div className="flex items-center">
                        <Users size={20} className="text-white/80 mr-2" />
                        <span className="text-3xl font-bold">{selectedCampaign.donorCount || 0}</span>
                      </div>
                    </div>
                    
                    {selectedCampaign.status === 'active' && selectedCampaign.endDate && (
                      <div>
                        <h3 className="text-white/90 font-medium mb-2">Time Remaining</h3>
                        <div className="flex items-center">
                          <Clock size={20} className="text-white/80 mr-2" />
                          <span className="text-3xl font-bold">
                            {Math.max(0, Math.ceil((new Date(selectedCampaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link 
                  href={`/campaigns/${selectedCampaign.id}/donations`}
                  className="group bg-white border border-gray-200 rounded-xl p-6 flex items-center hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:bg-blue-600 transition-colors">
                    <DollarSign size={24} className="text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">Donation History</h3>
                    <p className="text-gray-500">View all donations and transactions</p>
                  </div>
                  <ChevronRight size={20} className="ml-auto text-gray-300 group-hover:text-blue-600 transition-colors" />
                </Link>
                
                <Link 
                  href={`/campaigns/${selectedCampaign.id}/analytics`}
                  className="group bg-white border border-gray-200 rounded-xl p-6 flex items-center hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center mr-4 group-hover:bg-purple-600 transition-colors">
                    <PieChart size={24} className="text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">Analytics & Insights</h3>
                    <p className="text-gray-500">Track campaign performance</p>
                  </div>
                  <ChevronRight size={20} className="ml-auto text-gray-300 group-hover:text-purple-600 transition-colors" />
                </Link>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleEditClick(selectedCampaign)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center font-medium py-3 px-6 rounded-lg shadow-md transition-all flex items-center justify-center"
                >
                  <Edit size={18} className="mr-2" /> Edit Campaign
                </button>
                <button 
                  onClick={() => handleDeleteCampaign(selectedCampaign.id)}
                  className="bg-white hover:bg-red-50 text-red-600 border border-red-200 font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
                >
                  <Trash2 size={18} className="mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-blue-600 mt-4 font-medium">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-2">Campaign Dashboard</h1>
            <p className="text-gray-600">Manage and track all your fundraising campaigns</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button 
              onClick={handleRefresh}
              className={`p-2.5 bg-white text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${refreshAnimation ? 'animate-spin' : ''}`}
              aria-label="Refresh"
              title="Refresh campaigns"
            >
              <RefreshCw size={20} />
            </button>
            <button 
              onClick={openFormDialog}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center shadow-md transition-all"
            >
              <Plus size={20} className="mr-1.5" /> Create Campaign
            </button>
          </div>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            icon={<TrendingUp className="text-blue-600" size={24} />}
            title="Active Campaigns"
            value={totalStats.activeCount.toString()}
            bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatsCard 
            icon={<Coins className="text-green-600" size={24} />}
            title="Total Raised"
            value={formatCurrency(totalStats.totalRaised)}
            bgColor="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatsCard 
            icon={<Users className="text-purple-600" size={24} />}
            title="Total Donors"
            value={totalStats.totalDonors.toString()}
            bgColor="bg-gradient-to-r from-purple-500 to-purple-600"
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search campaigns..."
                  className="w-full p-3.5 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center bg-white border border-gray-200 rounded-xl py-3.5 px-5 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <Filter size={18} className="text-gray-500 mr-2" />
                  Filters
                  <ChevronDown size={16} className="text-gray-500 ml-2" />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">Filter Campaigns</h3>
                        <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-gray-600">
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Status
                        </label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="all">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="ended">Ended</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                      
                      <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Category
                        </label>
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="all">All Categories</option>
                          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex justify-between">
                        <button
                          onClick={() => {
                            setStatusFilter('all');
                            setCategoryFilter('all');
                            setIsFilterOpen(false);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Clear Filters
                        </button>
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-5 text-gray-300">
                <Search size={64} className="mx-auto" />
                </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No campaigns found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                  ? "No campaigns match your current filters. Try adjusting your search or filters."
                  : "You haven't created any campaigns yet. Click the 'Create Campaign' button to get started."}
              </p>
              {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setCategoryFilter('all');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              )}
              {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
                <button
                  onClick={openFormDialog}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center mx-auto transition-colors"
                >
                  <Plus size={20} className="mr-1.5" /> Create Campaign
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-500 font-medium">Campaign</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-medium">Goal</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-medium">Progress</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-medium">Category</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-medium">Start Date</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-medium">Status</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCampaigns.map((campaign) => (
                    <tr 
                      key={campaign.id}
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => openCampaignDetails(campaign)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 mr-4">
                            <Image 
                              src={campaign.coverImage || '/placeholder-image.jpg'}
                              alt={campaign.title}
                              width={48}
                              height={48}
                              style={{ objectFit: 'cover' }}
                              className="w-full h-full"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 line-clamp-1">{campaign.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-1">{campaign.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium">
                        {formatCurrency(campaign.targetAmount)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${calculateProgress(campaign.currentAmount || 0, campaign.targetAmount)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {calculateProgress(campaign.currentAmount || 0, campaign.targetAmount)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {CATEGORY_LABELS[campaign.category] || campaign.category}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {formatDate(campaign.startDate)}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`${STATUS_COLORS[campaign.status].bg} ${STATUS_COLORS[campaign.status].text} text-xs font-semibold px-2.5 py-1 rounded-full flex items-center w-fit`}>
                          {STATUS_COLORS[campaign.status].icon}
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(campaign);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          {campaign.status === 'active' && (
                            <Link 
                              href={`/campaigns/${campaign.id}`}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                              title="View"
                              target="_blank"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Eye size={18} />
                            </Link>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCampaign(campaign.id);
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Campaign form dialog */}
      <FormDialog 
        isOpen={isFormDialogOpen} 
        onClose={() => {
          closeFormDialog();
          setIsEditMode(false);
          setEditingCampaign(null);
        }}
        isEditMode={isEditMode}
      >
        <CampaignCreationForm 
          onSubmit={async (formData) => {
            if (isEditMode && editingCampaign) {
              await handleUpdateCampaign(editingCampaign.id, formData);
            } else {
              await handleFormSubmit(formData);
            }
          }}
          initialData={isEditMode ? (editingCampaign ?? undefined) : undefined}
          isEditMode={isEditMode}
        />
      </FormDialog>
    </div>
  );
};

export default OrganizationCampaigns;