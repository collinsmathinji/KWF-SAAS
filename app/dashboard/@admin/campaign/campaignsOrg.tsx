'use client';

import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Import your campaign form component here
import CampaignCreationForm from './campaignForm';

// Types
interface Campaign {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'draft' | 'ended' | 'pending';
  startDate: string;
  endDate?: string;
  goalAmount: number;
  currentAmount: number;
  coverImage: string;
  donorCount: number;
}

// Sample campaigns data
const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Save Local Wildlife',
    description: 'Help us protect and preserve the local wildlife in our community parks and reserves.',
    category: 'environment',
    status: 'active',
    startDate: '2025-03-15',
    endDate: '2025-06-15',
    goalAmount: 15000,
    currentAmount: 9750,
    coverImage: '/api/placeholder/800/400',
    donorCount: 128
  },
  {
    id: 'camp-2',
    name: 'Community Library Upgrade',
    description: 'Support our initiative to upgrade the local library with new books and digital resources.',
    category: 'education',
    status: 'active',
    startDate: '2025-04-01',
    endDate: '2025-07-01',
    goalAmount: 10000,
    currentAmount: 3200,
    coverImage: '/api/placeholder/800/400',
    donorCount: 42
  },
  {
    id: 'camp-3',
    name: 'Annual Charity Gala',
    description: 'Our annual fundraising gala to support multiple local causes and community projects.',
    category: 'charity',
    status: 'draft',
    startDate: '2025-06-20',
    goalAmount: 25000,
    currentAmount: 0,
    coverImage: '/api/placeholder/800/400', 
    donorCount: 0
  },
  {
    id: 'camp-4',
    name: 'School Music Program',
    description: 'Help fund instruments and equipment for underprivileged schools in our district.',
    category: 'education',
    status: 'ended',
    startDate: '2024-09-01',
    endDate: '2025-02-01',
    goalAmount: 8000,
    currentAmount: 9200,
    coverImage: '/api/placeholder/800/400',
    donorCount: 89
  },
  {
    id: 'camp-5',
    name: 'Emergency Relief Fund',
    description: 'Support for families affected by recent natural disasters in our region.',
    category: 'charity',
    status: 'pending',
    startDate: '2025-05-01',
    goalAmount: 50000,
    currentAmount: 0,
    coverImage: '/api/placeholder/800/400',
    donorCount: 0
  }
];

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
const STATUS_COLORS: Record<string, { bg: string, text: string }> = {
  'active': { bg: 'bg-green-100', text: 'text-green-800' },
  'draft': { bg: 'bg-gray-100', text: 'text-gray-800' },
  'ended': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800' }
};

// Dialog component for the form
const FormDialog = ({ isOpen, onClose, children }:any) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-blue-800">Create New Campaign</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const OrganizationCampaigns: React.FC = () => {
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // State for campaign detail view
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  
  // State for campaign creation dialog
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  
  // Filter campaigns
  const filteredCampaigns = SAMPLE_CAMPAIGNS.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
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
  
  // Handle campaign deletion (mock)
  const handleDeleteCampaign = (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      // In a real app, this would call an API to delete the campaign
      console.log(`Deleting campaign ${id}`);
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
  const handleFormSubmit = (formData:any) => {
    // In a real app, this would call an API to create the campaign
    console.log('Form submitted:', formData);
    closeFormDialog();
  };

  // Campaign details view
  if (selectedCampaign) {
    return (
      <div className="min-h-screen bg-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button 
            onClick={closeCampaignDetails}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            ← Back to All Campaigns
          </button>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-56 md:h-64">
              <Image 
                src={selectedCampaign.coverImage}
                alt={selectedCampaign.name}
                fill
                style={{ objectFit: 'cover' }}
                className="w-full"
              />
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                <span className={`${STATUS_COLORS[selectedCampaign.status].bg} ${STATUS_COLORS[selectedCampaign.status].text} text-xs font-medium px-2.5 py-1 rounded-full`}>
                  {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-blue-800 mb-2">{selectedCampaign.name}</h1>
                <div className="flex space-x-2">
                  <Link 
                    href={`/campaigns/edit/${selectedCampaign.id}`}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium p-2 rounded-lg"
                  >
                    <Edit size={18} />
                  </Link>
                  {selectedCampaign.status === 'active' && (
                    <Link 
                      href={`/campaigns/${selectedCampaign.id}`}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium p-2 rounded-lg"
                      target="_blank"
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                  )}
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span className="mr-4 flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {formatDate(selectedCampaign.startDate)}
                  {selectedCampaign.endDate && ` - ${formatDate(selectedCampaign.endDate)}`}
                </span>
                <span className="flex items-center">
                  <Coins size={16} className="mr-1" />
                  {CATEGORY_LABELS[selectedCampaign.category] || selectedCampaign.category}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">
                {selectedCampaign.description}
              </p>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="flex flex-wrap gap-6">
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-blue-800 font-medium mb-1">Progress</h3>
                    <div className="flex items-end mb-2">
                      <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(selectedCampaign.currentAmount)}
                      </span>
                      <span className="text-gray-500 ml-1">
                        of {formatCurrency(selectedCampaign.goalAmount)}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-blue-100 rounded-full">
                      <div 
                        className="h-2 bg-blue-600 rounded-full" 
                        style={{ width: `${calculateProgress(selectedCampaign.currentAmount, selectedCampaign.goalAmount)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {calculateProgress(selectedCampaign.currentAmount, selectedCampaign.goalAmount)}% of goal
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-blue-800 font-medium mb-1">Donors</h3>
                    <div className="flex items-center">
                      <Users size={18} className="text-blue-600 mr-2" />
                      <span className="text-2xl font-bold text-blue-600">{selectedCampaign.donorCount}</span>
                    </div>
                  </div>
                  
                  {selectedCampaign.status === 'active' && (
                    <div>
                      <h3 className="text-blue-800 font-medium mb-1">Time Remaining</h3>
                      <div className="flex items-center">
                        <Clock size={18} className="text-blue-600 mr-2" />
                        <span className="text-2xl font-bold text-blue-600">
                          {selectedCampaign.endDate ? 
                            Math.max(0, Math.ceil((new Date(selectedCampaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 
                            '∞'} days
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Link 
                  href={`/campaigns/${selectedCampaign.id}/donations`}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center hover:border-blue-300 hover:shadow transition"
                >
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <DollarSign size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Donation History</h3>
                    <p className="text-sm text-gray-500">View all donations and transactions</p>
                  </div>
                </Link>
                
                <Link 
                  href={`/campaigns/${selectedCampaign.id}/analytics`}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center hover:border-blue-300 hover:shadow transition"
                >
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <PieChart size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Analytics & Insights</h3>
                    <p className="text-sm text-gray-500">Track campaign performance</p>
                  </div>
                </Link>
              </div>
              
              <div className="flex space-x-3">
                <Link 
                  href={`/campaigns/edit/${selectedCampaign.id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-lg"
                >
                  Edit Campaign
                </Link>
                <button 
                  onClick={() => handleDeleteCampaign(selectedCampaign.id)}
                  className="bg-white hover:bg-red-50 text-red-600 border border-red-200 font-medium py-2 px-4 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-800 mb-4 sm:mb-0">Your Campaigns</h1>
          <button 
            onClick={openFormDialog}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
          >
            <Plus size={18} className="mr-1" /> Create New Campaign
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search campaigns..."
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center bg-white border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Filter size={18} className="text-gray-500 mr-2" />
                  Filters
                  <ChevronDown size={16} className="text-gray-500 ml-2" />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Filters</h3>
                        <button onClick={() => setIsFilterOpen(false)}>
                          <X size={16} className="text-gray-500" />
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Status
                        </label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="ended">Ended</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Category
                        </label>
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Categories</option>
                          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <button
                        onClick={() => {
                          setStatusFilter('all');
                          setCategoryFilter('all');
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-4 text-gray-400">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No campaigns found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' ? 
                  'Try adjusting your search or filters to find what you are looking for.' : 
                  'You haven\'t created any campaigns yet. Get started by creating your first campaign.'}
              </p>
              {!(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') && (
                <div className="mt-6">
                  <button 
                    onClick={openFormDialog}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
                  >
                    Create New Campaign
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <div 
                    key={campaign.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openCampaignDetails(campaign)}
                  >
                    <div className="relative h-40">
                      <Image 
                        src={campaign.coverImage}
                        alt={campaign.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`${STATUS_COLORS[campaign.status].bg} ${STATUS_COLORS[campaign.status].text} text-xs font-medium px-2.5 py-1 rounded-full`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">{campaign.name}</h3>
                          <div className="text-xs text-gray-500 mb-3">{CATEGORY_LABELS[campaign.category] || campaign.category}</div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-700 mb-3 flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(campaign.startDate)}
                        {campaign.endDate && (
                          <>
                            <span className="px-1">-</span>
                            {formatDate(campaign.endDate)}
                          </>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-700 mb-1 flex justify-between">
                          <span className="font-medium">{formatCurrency(campaign.currentAmount)}</span>
                          <span className="text-gray-500">{formatCurrency(campaign.goalAmount)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${calculateProgress(campaign.currentAmount, campaign.goalAmount)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-right mt-1 text-gray-500">
                          {calculateProgress(campaign.currentAmount, campaign.goalAmount)}% Complete
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-1 border-t pt-3" onClick={(e) => e.stopPropagation()}>
                        <Link 
                          href={`/campaigns/edit/${campaign.id}`}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openCampaignDetails(campaign);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Eye size={16} />
                        </button>
                        {campaign.status === 'active' && (
                          <Link 
                            href={`/campaigns/${campaign.id}`}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ArrowUpRight size={16} />
                          </Link>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCampaign(campaign.id);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Campaign creation dialog */}
      <FormDialog isOpen={isFormDialogOpen} onClose={closeFormDialog}>
        {/* Replace this with your actual form component */}
        <CampaignCreationForm />
      </FormDialog>
    </div>
  );
}

export default OrganizationCampaigns;