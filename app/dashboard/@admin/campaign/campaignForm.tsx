'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Coins, 
  FileText, 
  Image as ImageIcon, 
  ChevronRight, 
  ChevronLeft,
  Tag,
  Percent,
  CreditCard,
  Check,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Campaign categories
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

const CampaignCreationForm = () => {
  // Current form step
  const [currentStep, setCurrentStep] = useState(1);
  
  // Basic Information (Step 1)
  const [campaignName, setCampaignName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [category, setCategory] = useState('');
  
  // Campaign Details (Step 2)
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  
  // Payment Configuration (Step 3)
  const [stripeConnected, setStripeConnected] = useState(false);
  const [donationTiers, setDonationTiers] = useState([
    { amount: 25, label: 'Basic Supporter' },
    { amount: 50, label: 'Friend' },
    { amount: 100, label: 'Champion' },
  ]);
  const [minDonation, setMinDonation] = useState('5');
  const [enableRecurring, setEnableRecurring] = useState(true);
  
  // Form validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Form completion state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle donation tier updates
  const updateDonationTier = (index: number, field: 'amount' | 'label', value: string) => {
    const updatedTiers = [...donationTiers];
    if (field === 'amount') {
      updatedTiers[index].amount = parseInt(value) || 0;
    } else {
      updatedTiers[index].label = value;
    }
    setDonationTiers(updatedTiers);
  };

  const addDonationTier = () => {
    setDonationTiers([...donationTiers, { amount: 0, label: '' }]);
  };

  const removeDonationTier = (index: number) => {
    const updatedTiers = [...donationTiers];
    updatedTiers.splice(index, 1);
    setDonationTiers(updatedTiers);
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (step === 1) {
      if (!campaignName.trim()) newErrors.campaignName = 'Campaign name is required';
      if (!goalAmount) newErrors.goalAmount = 'Goal amount is required';
      if (parseFloat(goalAmount) <= 0) newErrors.goalAmount = 'Goal amount must be greater than zero';
      if (!category) newErrors.category = 'Category is required';
      
      // Validate dates only if both are provided (optional)
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
          newErrors.endDate = 'End date must be after start date';
        }
      }
    }
    
    if (step === 2) {
      if (!description.trim()) newErrors.description = 'Description is required';
      if (!story.trim()) newErrors.story = 'Campaign story is required';
      if (!coverImage && !coverImagePreview) newErrors.coverImage = 'Cover image is required';
    }
    
    if (step === 3) {
      if (!stripeConnected) newErrors.stripe = 'Stripe connection is required to accept donations';
      if (parseFloat(minDonation) < 1) newErrors.minDonation = 'Minimum donation must be at least $1';
      
      // Validate donation tiers
      const tierErrors: string[] = [];
      donationTiers.forEach((tier, index) => {
        if (tier.amount <= 0) tierErrors.push(`Tier ${index + 1}: Amount must be greater than zero`);
        if (!tier.label.trim()) tierErrors.push(`Tier ${index + 1}: Label is required`);
      });
      
      if (tierErrors.length > 0) {
        newErrors.tiers = tierErrors.join('; ');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle navigation between steps
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to create campaign
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success state
      setIsComplete(true);
    } catch (error) {
      console.error('Error creating campaign:', error);
      setErrors({ submit: 'There was an error creating your campaign. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock Stripe connection
  const connectStripe = async () => {
    // Simulate Stripe OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStripeConnected(true);
  };

  // Show success message after campaign creation
  if (isComplete) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <div className="text-center py-10">
          <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Campaign Created Successfully!</h2>
          <p className="text-gray-600 mb-8">
            Your campaign "{campaignName}" has been created and is now under review. 
            Once approved, it will be visible to potential donors.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/organization/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
            >
              Go to Dashboard
            </Link>
            <Link 
              href={`/campaigns/preview/${123}`} // Replace with actual campaign ID
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-lg"
            >
              Preview Campaign
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/organization/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-700 p-6 text-white">
            <h1 className="text-2xl font-bold">Create New Campaign</h1>
            <p className="text-blue-100">Complete all information to launch your fundraising campaign</p>
          </div>
          
          {/* Progress Steps */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <div className="ml-2 text-sm font-medium">Basic Info</div>
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <div className="ml-2 text-sm font-medium">Campaign Details</div>
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <div className="ml-2 text-sm font-medium">Payment Setup</div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-blue-800 mb-6">Basic Information</h2>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Campaign Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Enter campaign name"
                      className={`w-full p-3 border ${errors.campaignName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.campaignName && (
                      <p className="text-red-500 text-xs mt-1">{errors.campaignName}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Start Date <span className="text-gray-500">(optional)</span>
                      </label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-3.5 text-gray-500" />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        End Date <span className="text-gray-500">(optional for ongoing)</span>
                      </label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-3.5 text-gray-500" />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className={`w-full p-3 pl-10 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                      </div>
                      {errors.endDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Campaign Goal Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Coins size={16} className="absolute left-3 top-3.5 text-gray-500" />
                      <input
                        type="number"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                        placeholder="Enter goal amount"
                        min="1"
                        step="1"
                        className={`w-full p-3 pl-10 border ${errors.goalAmount ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    {errors.goalAmount && (
                      <p className="text-red-500 text-xs mt-1">{errors.goalAmount}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Campaign Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Tag size={16} className="absolute left-3 top-3.5 text-gray-500" />
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`w-full p-3 pl-10 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                      >
                        <option value="">Select a category</option>
                        {CAMPAIGN_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.category && (
                      <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Step 2: Campaign Details */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-blue-800 mb-6">Campaign Details</h2>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText size={16} className="absolute left-3 top-3.5 text-gray-500" />
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of your campaign (100-150 words)"
                        rows={3}
                        className={`w-full p-3 pl-10 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Campaign Story <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder="Tell potential donors about your campaign, its purpose, and its impact"
                      rows={6}
                      className={`w-full p-3 border ${errors.story ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.story && (
                      <p className="text-red-500 text-xs mt-1">{errors.story}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Campaign Cover Image <span className="text-red-500">*</span>
                    </label>
                    
                    <div className={`border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 text-center`}>
                      {coverImagePreview ? (
                        <div className="relative">
                          <div className="relative h-48 w-full mb-3">
                            <Image 
                              src={coverImagePreview}
                              alt="Cover preview"
                              fill
                              style={{ objectFit: 'contain' }}
                              className="rounded"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCoverImage(null);
                              setCoverImagePreview('');
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Remove and upload different image
                          </button>
                        </div>
                      ) : (
                        <div className="py-8">
                          <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500 mb-2">Upload your campaign cover image</p>
                          <p className="text-gray-400 text-sm mb-4">Recommended size: 1200 x 630 pixels</p>
                          <input
                            type="file"
                            id="coverImage"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label 
                            htmlFor="coverImage"
                            className="inline-block bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg px-4 py-2 cursor-pointer"
                          >
                            Select Image
                          </label>
                        </div>
                      )}
                    </div>
                    {errors.coverImage && (
                      <p className="text-red-500 text-xs mt-1">{errors.coverImage}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Payment Configuration */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-blue-800 mb-6">Payment Configuration</h2>
                  
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                      <CreditCard size={18} className="mr-2" />
                      Connect Stripe Account
                    </h3>
                    
                    {stripeConnected ? (
                      <div className="flex items-center text-green-600">
                        <Check size={18} className="mr-2" />
                        <span>Stripe account successfully connected</span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600 text-sm mb-3">
                          To receive donations, you need to connect your Stripe account. 
                          This allows secure payment processing for your campaign.
                        </p>
                        <button
                          type="button"
                          onClick={connectStripe}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
                        >
                          Connect with Stripe
                        </button>
                        {errors.stripe && (
                          <p className="text-red-500 text-xs mt-2">{errors.stripe}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Minimum Donation Amount ($)
                    </label>
                    <div className="relative">
                      <Percent size={16} className="absolute left-3 top-3.5 text-gray-500" />
                      <input
                        type="number"
                        value={minDonation}
                        onChange={(e) => setMinDonation(e.target.value)}
                        min="1"
                        step="1"
                        className={`w-full p-3 pl-10 border ${errors.minDonation ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    {errors.minDonation && (
                      <p className="text-red-500 text-xs mt-1">{errors.minDonation}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <input
                        id="enableRecurring"
                        type="checkbox"
                        checked={enableRecurring}
                        onChange={() => setEnableRecurring(!enableRecurring)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="enableRecurring" className="ml-2 text-gray-700">
                        Enable recurring donation options
                      </label>
                    </div>
                    
                    {enableRecurring && (
                      <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-600">
                        <p>Donors will be able to choose from monthly, quarterly, or annual recurring options.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Donation Tiers
                    </label>
                    
                    {errors.tiers && (
                      <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-3 text-sm">
                        <AlertCircle size={16} className="inline mr-1" />
                        {errors.tiers}
                      </div>
                    )}
                    
                    {donationTiers.map((tier, index) => (
                      <div key={index} className="flex flex-wrap items-center mb-3 gap-3">
                        <div className="w-24">
                          <input
                            type="number"
                            value={tier.amount}
                            onChange={(e) => updateDonationTier(index, 'amount', e.target.value)}
                            min="1"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="$"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={tier.label}
                            onChange={(e) => updateDonationTier(index, 'label', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tier name"
                          />
                        </div>
                        {donationTiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDonationTier(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {donationTiers.length < 5 && (
                      <button
                        type="button"
                        onClick={addDonationTier}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        + Add another tier
                      </button>
                    )}
                  </div>
                  
                  {errors.submit && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                      {errors.submit}
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-6 rounded-lg flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>Create Campaign</>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreationForm;