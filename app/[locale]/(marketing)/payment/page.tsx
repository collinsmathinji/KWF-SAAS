"use client"
import React, { useState } from 'react';
import { CreditCard, Smartphone } from 'lucide-react';

const BillingPage = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const paymentMethods = [
    { 
      id: 'mpesa', 
      name: 'M-Pesa', 
      icon: <Smartphone className="w-12 h-12 text-green-500" />,
      description: 'Mobile money payment'
    },
    { 
      id: 'ipay', 
      name: 'iPay', 
      icon: <CreditCard className="w-12 h-12 text-blue-500" />,
      description: 'Online payment gateway'
    },
    { 
      id: 'visa', 
      name: 'Visa Card', 
      icon: <CreditCard className="w-12 h-12 text-blue-700" />,
      description: 'Credit/Debit card payment'
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#0070BA" className="w-12 h-12">
          <path d="M19.47 4.39c-.49-.54-1.12-.91-1.79-1.14-.67-.22-1.39-.28-2.09-.16L7.54 4.63c-1.06.19-2 .75-2.66 1.61-.66.87-1 1.94-.9 3.02l.45 4.93c.09.98.53 1.89 1.26 2.54A3.982 3.982 0 0 0 8.5 17h8.44c1.61 0 3.07-1.01 3.57-2.55l2.11-6.15c.38-1.11.19-2.32-.5-3.28-.69-.95-1.78-1.51-2.94-1.63zm-1.3 1.58c.37.31.61.75.66 1.23.05.48-.1.95-.41 1.31l-4.52 4.52h-4.1l-.31-3.41c-.04-.39.11-.78.41-1.04.29-.26.69-.37 1.08-.29l8.19 1.68z"/>
        </svg>
      ),
      description: 'Global online payments'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-blue-50 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Select Payment Method
        </h2>
        
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full flex items-center p-4 rounded-lg border-2 transition-all duration-300 ${
                selectedMethod === method.id 
                  ? 'bg-blue-200 border-blue-500' 
                  : 'bg-white border-gray-200 hover:bg-blue-100'
              }`}
            >
              <div className="mr-4">{method.icon}</div>
              <div className="text-left">
                <h3 className="font-semibold text-blue-900">{method.name}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </button>
          ))}
        </div>

        {selectedMethod && (
          <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Proceed to Payment
          </button>
        )}
      </div>
    </div>
  );
};

export default BillingPage;