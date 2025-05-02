'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Target, Users, Heart, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


interface Donor {
  name: string;
  amount: number;
  date: string;
  isAnonymous: boolean;
  message?: string;
}

interface CampaignDetailsProps {
  id: string;
}

const CampaignDetails= () => {
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  
  // Mock campaign data - in production this would be fetched from API
  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => {
      setCampaign({
        id: '1',
        name: 'Help Build a New Community Center',
        organization: 'Community First Foundation',
        category: 'Community Development',
        startDate: '2025-04-15',
        endDate: '2025-07-15',
        goalAmount: 50000,
        currentAmount: 28750,
        description: 'We\'re raising funds to build a new community center that will serve as a hub for educational programs, social services, and recreational activities for our local community.',
        story: 'Our community has been in need of a central gathering place for many years. This new center will provide spaces for after-school programs, senior activities, job training, and much more. Your donation will directly impact thousands of lives for generations to come.',
        coverImage: '/api/placeholder/800/400', // Using placeholder image
        donorCount: 142,
        recentDonors: [
          { name: 'Sarah J.', amount: 250, date: '2025-04-28', isAnonymous: false, message: 'Excited to see this project come to life!' },
          { name: 'Anonymous', amount: 1000, date: '2025-04-27', isAnonymous: true },
          { name: 'Michael T.', amount: 50, date: '2025-04-26', isAnonymous: false },
        ]
      });
      setLoading(false);
    }, 1000);
  },[]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto bg-red-100 text-red-700 p-4 rounded-lg">
        Error loading campaign: {error}
      </div>
    </div>
  );

  if (!campaign) return null;

  const progressPercentage = Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100);
  
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-blue-700 text-white p-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/campaigns" className="inline-flex items-center text-blue-100 hover:text-white mb-4">
            <ArrowLeft size={16} className="mr-1" /> Back to campaigns
          </Link>
          <h1 className="text-3xl font-bold">{campaign.name}</h1>
          <p className="text-blue-100">by {campaign.organization}</p>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign details - 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="relative h-72 w-full">
                <Image 
                  src={campaign.coverImage} 
                  alt={campaign.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-blue-600">
                  <span className="inline-flex items-center">
                    <Clock size={16} className="mr-1" />
                    {new Date(campaign.endDate) > new Date() ? 
                      `Ends ${new Date(campaign.endDate).toLocaleDateString()}` : 
                      'Campaign ended'}
                  </span>
                  <span className="inline-flex items-center">
                    <Target size={16} className="mr-1" />
                    Goal: ${campaign.goalAmount.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center">
                    <Users size={16} className="mr-1" />
                    {campaign.donorCount} donors
                  </span>
                </div>
                
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">About This Campaign</h2>
                  <p className="text-gray-700">{campaign.description}</p>
                  
                  <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Our Story</h3>
                  <p className="text-gray-700">{campaign.story}</p>
                </div>
              </div>
            </div>
            
            {/* Recent donors section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
              <h2 className="text-xl font-bold text-blue-800 mb-4">Recent Donors</h2>
              <div className="divide-y divide-gray-100">
                {campaign.recentDonors.map((donor: Donor, index: number) => (
                  <div key={index} className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{donor.isAnonymous ? 'Anonymous' : donor.name}</p>
                        {donor.message && <p className="text-gray-500 text-sm mt-1">{donor.message}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-700">${donor.amount}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(donor.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Donation sidebar - 1/3 width on large screens */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 sticky top-6">
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Progress</span>
                  <span className="font-bold">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="font-medium text-blue-700">
                    ${campaign.currentAmount.toLocaleString()} raised
                  </span>
                  <span className="text-gray-600">
                    Goal: ${campaign.goalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {showDonationForm ? (
                <div>
                  
                  </div>
                // <DonationForm 
                //   campaignId={campaign.id}
                //   campaignName={campaign.name}
                //   onCancel={() => setShowDonationForm(false)}
                // />
              ) : (
                <>
                  <button
                    onClick={() => setShowDonationForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
                  >
                    <Heart size={18} className="mr-2" /> Donate Now
                  </button>
                  
                  <div className="mt-6">
                    <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg flex items-center justify-center">
                      <Share2 size={18} className="mr-2" /> Share Campaign
                    </button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <p className="font-medium mb-2">Why donate to this campaign?</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>100% of donations go directly to the project</li>
                      <li>Tax-deductible contribution</li>
                      <li>Regular updates on campaign progress</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;