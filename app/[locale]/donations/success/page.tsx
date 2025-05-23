'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

function DonationSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [donation, setDonation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonationDetails = async () => {
      if (!sessionId) return;

      try {
        const response = await fetch(`/api/verify-donation?session_id=${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to verify donation');
        }
        const data = await response.json();
        setDonation(data.donation);
      } catch (error) {
        console.error('Error fetching donation details:', error);
        setError('Failed to verify your donation. Please contact support.');
      }
    };

    fetchDonationDetails();
  }, [sessionId]);

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Verification Error
          </h1>
          <p className="text-gray-600 mb-8">
            {error}
          </p>
          <Link
            href="/donations"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
          >
            Return to Donations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Thank You for Your Donation!
        </h1>
        <p className="text-gray-600 mb-8">
          Your contribution makes a real difference. We've sent you a confirmation email with the details of your donation.
        </p>
        <Link
          href="/donations"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
        >
          View More Causes
        </Link>
      </div>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="animate-pulse">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8" />
            <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    }>
      <DonationSuccessContent />
    </Suspense>
  );
}