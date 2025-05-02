'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Tag, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Coins,
  PlusCircle,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Campaign categories - same as in creation form for consistency
const CAMPAIGN_CATEGORIES = [
  { value: 'charity', label: 'Charity' },
  { value: 'education', label: 'Education' },
  { value: 'medical', label: 'Medical' },
  { value: 'community', label: 'Community' },
  { value: 'environment', label: 'Environment' },
  { value: 'animal', label: 'Animal Welfare' },
  { value: 'arts', label: 'Arts & Culture' },
  { value: 'other', label: 'Other' }
];

// Sort options
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'endingSoon', label: 'Ending Soon' },
  { value: 'mostFunded', label: 'Most Funded' },
  { value: 'leastFunded', label: 'Needs Support' }
];

// Mock campaign data - in a real app, this would come from an API
const MOCK_CAMPAIGNS = [
  {
    id: '1',
    name: 'Save Local Wildlife Reserve',
    description: 'Help us protect endangered species in our local wildlife reserve by funding conservation efforts and habitat restoration.',
    category: 'environment',
    goalAmount: 50000,
    currentAmount: 32450,
    startDate: '2025-04-01',
    endDate: '2025-06-15',
    imageUrl: '/api/placeholder/800/400',
    organization: 'Green Earth Foundation',
    location: 'Portland, OR'
  },
  {
    id: '2',
    name: 'Community Art Center Renovation',
    description: 'We\'re renovating our community art center to provide a better space for local artists and art education programs.',
    category: 'arts',
    goalAmount: 75000,
    currentAmount: 45750,
    startDate: '2025-03-15',
    endDate: '2025-07-30',
    imageUrl: '/api/placeholder/800/400',
    organization: 'Arts for All',
    location: 'Chicago, IL'
  },
  {
    id: '3',
    name: 'Medical Support for Children',
    description: 'Providing essential medical care and support for children with chronic illnesses from low-income families.',
    category: 'medical',
    goalAmount: 100000,
    currentAmount: 87600,
    startDate: '2025-02-20',
    endDate: '2025-05-20',
    imageUrl: '/api/placeholder/800/400',
    organization: 'Children\'s Health Foundation',
    location: 'Boston, MA'
  },
  {
    id: '4',
    name: 'Digital Education for Rural Schools',
    description: 'Bringing digital learning tools and internet access to underserved rural schools to bridge the education gap.',
    category: 'education',
    goalAmount: 30000,
    currentAmount: 12450,
    startDate: '2025-04-10',
    endDate: '2025-08-10',
    imageUrl: '/api/placeholder/800/400',
    organization: 'Education Forward',
    location: 'Various Rural Communities'
  },
  {
    id: '5',
    name: 'Homeless Shelter Expansion',
    description: 'Help us expand our shelter capacity to serve more homeless individuals in our community, especially during winter months.',
    category: 'charity',
    goalAmount: 120000,
    currentAmount: 35000,
    startDate: '2025-03-01',
    endDate: '2025-09-01',
    imageUrl: '/api/placeholder/800/400',
    organization: 'Safe Haven',
    location: 'Seattle, WA'
  },
  {
    id: '6',
    name: 'Animal Rescue Center',
    description: 'Supporting our no-kill animal shelter to provide care, medical treatment, and adoption services for abandoned pets.',
    category: 'animal',
    goalAmount: 45000,
    currentAmount: 31200,
    startDate: '2025-04-05',
    endDate: '2025-06-30',
    imageUrl: '/api/placeholder/800/400',
    organization: 'Pet Rescue Alliance',
    location: 'Austin, TX'
  }
];

const CampaignExplorer = () => {
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter toggle for mobile view
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchTerm('');
    setSortBy('newest');
  };

  // Load and filter campaigns
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      let filteredCampaigns = [...MOCK_CAMPAIGNS];
      
      // Apply search filter
      if (searchTerm) {
        filteredCampaigns = filteredCampaigns.filter(campaign => 
          campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.organization.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply category filter
      if (selectedCategories.length > 0) {
        filteredCampaigns = filteredCampaigns.filter(campaign => 
          selectedCategories.includes(campaign.category)
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'newest':
          filteredCampaigns.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
          break;
        case 'endingSoon':
          filteredCampaigns.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
          break;
        case 'mostFunded':
          filteredCampaigns.sort((a, b) => (b.currentAmount / b.goalAmount) - (a.currentAmount / a.goalAmount));
          break;
        case 'leastFunded':
          filteredCampaigns.sort((a, b) => (a.currentAmount / a.goalAmount) - (b.currentAmount / b.goalAmount));
          break;
        default:
          break;
      }
      
      setCampaigns(filteredCampaigns);
      setLoading(false);
    }, 500); // Simulated loading delay
  }, [searchTerm, selectedCategories, sortBy]);

  // Calculate days remaining for a campaign
  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Explore Campaigns</h1>
            <p className="text-gray-600">Discover causes that need your support</p>
          </div>
          
          <Link href="/campaigns/create" className="mt-4 md:mt-0 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg">
            <PlusCircle size={18} className="mr-2" />
            Create Campaign
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            {/* Search bar */}
            <div className="relative mb-6">
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns, organizations, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Filter toggle for mobile */}
            <button
              onClick={toggleFilters}
              className="md:hidden w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-4"
            >
              <div className="flex items-center">
                <Filter size={18} className="text-blue-600 mr-2" />
                <span className="font-medium">Filters</span>
                {selectedCategories.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {selectedCategories.length}
                  </span>
                )}
              </div>
              {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            <div className={`md:flex gap-6 ${showFilters ? 'block' : 'hidden md:flex'}`}>
              {/* Category filters */}
              <div className="md:flex-1 mb-4 md:mb-0">
                <div className="flex items-center mb-3">
                  <Tag size={16} className="text-blue-600 mr-2" />
                  <h3 className="font-medium">Categories</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CAMPAIGN_CATEGORIES.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleCategoryChange(category.value)}
                      className={`text-sm px-3 py-1.5 rounded-full ${
                        selectedCategories.includes(category.value)
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sort options */}
              <div className="md:w-64">
                <div className="flex items-center mb-3">
                  <Clock size={16} className="text-blue-600 mr-2" />
                  <h3 className="font-medium">Sort By</h3>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2.5 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Active filters display */}
            {(selectedCategories.length > 0 || searchTerm) && (
              <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Active filters:</span>
                
                {selectedCategories.map((cat) => (
                  <div key={cat} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center">
                    {CAMPAIGN_CATEGORIES.find(c => c.value === cat)?.label}
                    <button
                      onClick={() => handleCategoryChange(cat)}
                      className="ml-1.5 hover:text-blue-900"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                
                {searchTerm && (
                  <div className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center">
                    Search: {searchTerm}
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1.5 hover:text-blue-900"
                    >
                      &times;
                    </button>
                  </div>
                )}
                
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Campaign listing */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find any campaigns matching your search criteria.
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg"
            >
              Clear filters and try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const progress = Math.round((campaign.currentAmount / campaign.goalAmount) * 100);
              const daysRemaining = getDaysRemaining(campaign.endDate);
              
              return (
                <Link href={`/campaigns/${campaign.id}`} key={campaign.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="relative h-48">
                    <Image
                      src={campaign.imageUrl}
                      alt={campaign.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-500 bg-opacity-90 text-white text-xs px-2.5 py-1 rounded-full">
                        {CAMPAIGN_CATEGORIES.find(cat => cat.value === campaign.category)?.label}
                      </span>
                    </div>
                    <button className="absolute top-3 right-3 bg-white bg-opacity-80 p-1.5 rounded-full hover:bg-opacity-100">
                      <Heart size={18} className="text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-blue-800 mb-2 line-clamp-2">
                      {campaign.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {campaign.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{formatCurrency(campaign.currentAmount)} raised</span>
                        <span className="text-gray-500">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Coins size={16} className="mr-1.5" />
                        <span>Goal: {formatCurrency(campaign.goalAmount)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1.5" />
                        <span>{daysRemaining} days left</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                      {campaign.organization} • {campaign.location}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        
        {/* Pagination - simplified for demo */}
        {!loading && campaigns.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex">
              <button type="button" className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              <button type="button" className="px-3 py-1 border-t border-b border-gray-300 bg-blue-600 text-white">1</button>
              <button type="button" className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">2</button>
              <button type="button" className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">3</button>
              <button type="button" className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignExplorer;