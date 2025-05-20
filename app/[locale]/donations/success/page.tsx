'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function DonationSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [donation, setDonation] = useState<any>(null);

  useEffect(() => {
    const fetchDonationDetails = async () => {
      if (!sessionId) return;

      try {
        const response = await fetch(`/api/verify-donation?session_id=${sessionId}`);
        const data = await response.json();
        setDonation(data.donation);
      } catch (error) {
        console.error('Error fetching donation details:', error);
      }
    };

    fetchDonationDetails();
  }, [sessionId]);

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