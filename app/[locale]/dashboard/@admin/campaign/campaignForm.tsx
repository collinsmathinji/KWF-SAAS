'use client';

import React, { useState, useEffect } from 'react';
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
  ArrowLeft,
  X,
  Upload,
  Plus
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { uploadOrganizationLogo } from '@/lib/organization';
import { useSession } from 'next-auth/react';

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

// Update the component props interface
interface CampaignCreationFormProps {
  initialData?: {
    title?: string;
    cause?: string;
    category?: string;
    donationType?: string;
    targetAmount?: number;
    coverImage?: string | null;
    gallery?: string[];
    description?: string;
    startDate?: string;
    endDate?: string;
    groupId?: string;
    status?: string;
    donorCount?: number;
    currentAmount?: number;
  };
  onSubmit?: (data: any) => Promise<void>;
  isEditMode?: boolean;
}

const CampaignCreationForm: React.FC<CampaignCreationFormProps> = ({ 
  initialData, 
  onSubmit,
  isEditMode = false 
}) => {
  const { data: session } = useSession();
  
  // Current form step
  const [currentStep, setCurrentStep] = useState(1);
  
  // Update state initialization to use initialData if provided
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    cause: initialData?.cause || '',
    category: initialData?.category || '',
    donationType: initialData?.donationType || 'one-time',
    targetAmount: initialData?.targetAmount?.toString() || '',
    coverImage: initialData?.coverImage || null,
    gallery: initialData?.gallery || [],
    description: initialData?.description || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    groupId: initialData?.groupId || '',
  });
  
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
  
  // Add new state for Stripe status
  const [hasStripeAccount, setHasStripeAccount] = useState(false);
  const [isLoadingStripe, setIsLoadingStripe] = useState(true);
  const [stripeError, setStripeError] = useState<string | null>(null);

  // Update the checkStripeConnection function
  const checkStripeConnection = async () => {
    try {
      const response = await fetch('/api/organization/stripe/accountStatus', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      // Update this condition to check the actual response structure
      setHasStripeAccount(
        data.status === "SUCCESS" && 
        data.data.isFullyVerified && 
        data.data.chargesEnabled && 
        data.data.payoutsEnabled
      );
    } catch (error) {
      setStripeError('Failed to check Stripe connection status');
      console.error('Error checking Stripe status:', error);
    } finally {
      setIsLoadingStripe(false);
    }
  };

  // Check Stripe connection status on component mount
  useEffect(() => {
    checkStripeConnection();
  }, []);

  useEffect(() => {
    // Check for returned Stripe state
    const searchParams = new URLSearchParams(window.location.search);
    const stripeSuccess = searchParams.get('stripe_success');
    
    if (stripeSuccess === 'true') {
      // Restore saved form data from session storage
      const savedData = sessionStorage.getItem('pendingCampaignData');
      if (savedData) {
        setFormData(JSON.parse(savedData));
        sessionStorage.removeItem('pendingCampaignData');
      }
      setHasStripeAccount(true);
    }
  }, []);

  // Add debugging logs
  useEffect(() => {
    console.log('Stripe Account Status:', { hasStripeAccount, isLoadingStripe });
  }, [hasStripeAccount, isLoadingStripe]);

  // Handle Stripe connection
  const handleStripeConnect = async () => {
    try {
      const response = await fetch('/api/organization/stripe/createAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.url) {
        // Store form data in session storage instead of localStorage
        sessionStorage.setItem('pendingCampaignData', JSON.stringify(formData));
        window.location.href = data.url;
      }
    } catch (error) {
      setStripeError('Failed to initiate Stripe connection');
      console.error('Error connecting to Stripe:', error);
    }
  };

  // Update the stripe connection check condition
  if (!isLoadingStripe && !hasStripeAccount) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <div className="text-center py-10">
          <div className="bg-yellow-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Your Stripe Account
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            To create a campaign and receive donations, you need to connect your Stripe account first. This ensures secure payment processing for your donations.
          </p>
          <button
            onClick={handleStripeConnect}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Connect Stripe Account
          </button>
          {stripeError && (
            <p className="mt-4 text-red-600 text-sm">{stripeError}</p>
          )}
        </div>
      </div>
    );
  }

  // Show loading state while checking Stripe status
  if (isLoadingStripe) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Removed direct assignment of File to coverImage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageUpload = async (file: File) => {
    try {
      const fileUrl = await uploadOrganizationLogo(file);
      setFormData((prev:any)=> ({
        ...prev,
        coverImage: fileUrl
      }));
    } catch (error) {
      console.error('Error uploading cover image:', error);
      setErrors(prev => ({
        ...prev,
        coverImage: 'Failed to upload cover image'
      }));
    }
  };

  const handleGalleryUpload = async (files: FileList) => {
    try {
      const uploadPromises = Array.from(files).map(file => uploadOrganizationLogo(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData((prev:any)=> ({
        ...prev,
        gallery: [...prev.gallery, ...uploadedUrls]
      }));
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      setErrors(prev => ({
        ...prev,
        gallery: 'Failed to upload one or more gallery images'
      }));
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

  // Update the validateStep function
const validateStep = (step: number): boolean => {
  const newErrors: {[key: string]: string} = {};
  
  if (step === 1) {
    if (!formData.title.trim()) newErrors.title = 'Campaign name is required';
    if (!formData.targetAmount) newErrors.targetAmount = 'Goal amount is required';
    if (parseFloat(formData.targetAmount) <= 0) newErrors.targetAmount = 'Goal amount must be greater than zero';
    if (!formData.category) newErrors.category = 'Category is required';
    
    // Validate dates only if both are provided (optional)
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
  }
  
  if (step === 2) {
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.cause.trim()) newErrors.cause = 'Campaign story is required';
    if (!formData.coverImage) newErrors.coverImage = 'Cover image is required';
  }
  
  if (step === 3) {
    if (parseFloat(minDonation) < 1) {
      newErrors.minDonation = 'Minimum donation must be at least $1';
    }
    
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
  const goToNextStep = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started'); // Debug log
    
    if (!validateStep(currentStep)) {
      console.log('Validation failed', errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formDataToSubmit = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        gallery: formData.gallery.length ? formData.gallery : undefined,
        status: isEditMode ? initialData?.status : 'draft',
        donationType: formData.donationType,
        organizationId: session?.user?.organizationId,
        donorCount: isEditMode ? initialData?.donorCount : 0,
        currentAmount: isEditMode ? initialData?.currentAmount : 0,
        // Add payment configuration
        minDonation: parseFloat(minDonation),
        donationTiers: donationTiers,
        enableRecurring: enableRecurring
      };

      console.log('Submitting data:', formDataToSubmit); // Debug log

     
        // Update to use the correct API endpoint
        const response = await fetch('/api/donation/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formDataToSubmit)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create campaign');
        }

        const result = await response.json();
        console.log('Success response:', result); // Debug log
        
        setIsComplete(true);
        
        if (result.data?.id) {
          sessionStorage.setItem('lastCreatedCampaignId', result.data.id);
        }
      
    } catch (error) {
      console.error('Error submitting campaign:', error);
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Failed to create campaign'
      }));
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

  // Update success message
  if (isComplete) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <div className="text-center py-10">
          <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Campaign {isEditMode ? 'Updated' : 'Created'} Successfully!
          </h2>
          <p className="text-gray-600 mb-8">
            Your campaign "{formData.title}" has been {isEditMode ? 'updated' : 'created'}.
            {!isEditMode && ' It is now under review and will be visible to potential donors once approved.'}
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
            >
              Go to Dashboard
            </Link>
            <Link 
              href={`/api/donation/${sessionStorage.getItem('lastCreatedCampaignId')}`}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-lg"
            >
              {isEditMode ? 'View Campaign' : 'Preview Campaign'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Add session check
  if (!session) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <div className="text-center py-10">
          <p className="text-gray-600">Please sign in to create a campaign</p>
        </div>
      </div>
    );
  }

  const CoverImageUpload = () => (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        Campaign Cover Image <span className="text-red-500">*</span>
      </label>
      <div className={`border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4`}>
        {formData.coverImage ? (
          <div className="relative">
            <Image
              src={formData.coverImage}
              alt="Cover preview"
              width={400}
              height={200}
              className="rounded-lg object-cover mx-auto"
            />
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, coverImage: null }))}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCoverImageUpload(file);
              }}
              className="hidden"
            />
            <label
              htmlFor="coverImage"
              className="cursor-pointer flex flex-col items-center justify-center py-6"
            >
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload cover image</span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
            </label>
          </div>
        )}
      </div>
      {errors.coverImage && (
        <p className="text-red-500 text-xs mt-1">{errors.coverImage}</p>
      )}
    </div>
  );

  const GalleryUpload = () => (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        Gallery Images <span className="text-gray-500">(optional)</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {formData.gallery.map((imageUrl, index) => (
          <div key={index} className="relative">
            <Image
              src={imageUrl}
              alt={`Gallery image ${index + 1}`}
              width={200}
              height={200}
              className="rounded-lg object-cover w-full h-32"
            />
            <button
              type="button"
              onClick={() => {
                const newGallery = formData.gallery.filter((_, i) => i !== index);
                setFormData(prev => ({ ...prev, gallery: newGallery }));
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <input
        type="file"
        id="gallery"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files?.length) {
            handleGalleryUpload(e.target.files);
          }
        }}
        className="hidden"
      />
      <label
        htmlFor="gallery"
        className="inline-flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg px-4 py-2 cursor-pointer"
      >
        <Plus size={16} className="mr-2" />
        Add Gallery Images
      </label>
      {errors.gallery && (
        <p className="text-red-500 text-xs mt-1">{errors.gallery}</p>
      )}
    </div>
  );

  // Update form title
  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-700 p-6 text-white">
            <h1 className="text-2xl font-bold">
              {isEditMode ? 'Edit Campaign' : 'Create New Campaign'}
            </h1>
            <p className="text-blue-100">
              {isEditMode 
                ? 'Update your campaign information' 
                : 'Complete all information to launch your fundraising campaign'}
            </p>
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
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter campaign name"
                      className={`w-full p-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1">{errors.title}</p>
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
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
                        value={formData.targetAmount}
                        onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                        placeholder="Enter goal amount"
                        min="1"
                        step="1"
                        className={`w-full p-3 pl-10 border ${errors.targetAmount ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    {errors.targetAmount && (
                      <p className="text-red-500 text-xs mt-1">{errors.targetAmount}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Campaign Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Tag size={16} className="absolute left-3 top-3.5 text-gray-500" />
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Donation Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="one-time"
                          checked={formData.donationType === 'one-time'}
                          onChange={(e) => setFormData({...formData, donationType: e.target.value})}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2">One-time</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="recurring"
                          checked={formData.donationType === 'recurring'}
                          onChange={(e) => setFormData({...formData, donationType: e.target.value})}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2">Recurring</span>
                      </label>
                    </div>
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
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                      value={formData.cause}
                      onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                      placeholder="Tell potential donors about your campaign, its purpose, and its impact"
                      rows={6}
                      className={`w-full p-3 border ${errors.cause ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.cause && (
                      <p className="text-red-500 text-xs mt-1">{errors.cause}</p>
                    )}
                  </div>
                  
                  <CoverImageUpload />

                  <GalleryUpload />
                </div>
              )}

              {/* Step 3: Payment Configuration */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-blue-800 mb-6">Payment Configuration</h2>
                  
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                      <CreditCard size={18} className="mr-2" />
                      Stripe Status
                    </h3>
                    
                    {hasStripeAccount ? (
                      <div className="flex items-center text-green-600">
                        <Check size={18} className="mr-2" />
                        <span>Your Stripe account is connected and ready to accept donations</span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600 text-sm mb-3">
                          To receive donations, you need to connect your Stripe account. 
                          This allows secure payment processing for your campaign.
                        </p>
                        <button
                          type="button"
                          onClick={handleStripeConnect}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
                        >
                          Connect with Stripe
                        </button>
                        {stripeError && (
                          <p className="text-red-500 text-xs mt-2">{stripeError}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Only show these options if Stripe is connected */}
                  {hasStripeAccount && (
                    <>
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
                      
                      {/* Rest of the payment configuration options */}
                      {/* ... Donation tiers, recurring options, etc ... */}
                    </>
                  )}
                </div>
              )}
              
              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    type="button" // Explicitly set type="button"
                    onClick={goToPreviousStep}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                )}
                
                {currentStep === 3 ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-6 rounded-lg flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Creating Campaign...
                      </>
                    ) : (
                      'Create Campaign'
                    )}
                  </button>
                ) : (
                  <button
                    type="button" // Explicitly set type="button"
                    onClick={(e) => goToNextStep(e)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>

              {/* Add error message display */}
              {errors.submit && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreationForm;