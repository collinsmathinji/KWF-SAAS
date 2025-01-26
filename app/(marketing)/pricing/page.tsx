"use client"
import React, { useState } from 'react';
import { Check, CreditCard, Smartphone } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { JSX } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  popular?: boolean;
  features: string[];
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
}

interface PaymentMethodSelection {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
}
const PricingAndBillingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodSelection | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const plans = [
    {
      id: 'starter',
      name: "Starter",
      price: 29,
      description: "Perfect for small organizations",
      features: [
        "Up to 1,000 contacts",
        "Basic contact fields",
        "Email support",
        "CSV import/export",
        "Basic analytics"
      ]
    },
    {
      id: 'professional',
      name: "Professional",
      price: 99,
      description: "Ideal for growing businesses",
      popular: true,
      features: [
        "Up to 10,000 contacts",
        "Custom fields",
        "Priority support",
        "Advanced analytics",
        "API access",
        "Team collaboration"
      ]
    },
    {
      id: 'enterprise',
      name: "Enterprise",
      price: 299,
      description: "For large organizations",
      features: [
        "Unlimited contacts",
        "Custom integrations",
        "24/7 support",
        "Advanced security",
        "Dedicated account manager",
        "Custom training"
      ]
    }
  ];

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: <Smartphone className="w-12 h-12 text-green-500" />,
      description: 'Mobile money payment'
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
    },
    {
      id: 'credit-card',
      name: 'Credit Card',
      icon: <CreditCard className="w-12 h-12 text-blue-700" />,
      description: 'Credit/Debit card payment'
    }
  ];

  
  const handlePlanSelection = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };


  const handlePaymentMethodSelection = (method: PaymentMethodSelection) => {
    setSelectedPaymentMethod(method);
  };

  const handlePayment = () => {
    // Implement payment logic based on selected plan and payment method
    console.log('Processing payment', { plan: selectedPlan, method: selectedPaymentMethod });
  };

  return (
    <PayPalScriptProvider options={{ clientId: "YOUR_PAYPAL_CLIENT_ID" }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
        <div className="container mx-auto px-6">
          {/* Pricing Section */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4 text-blue-900">Simple, Transparent Pricing</h1>
            <p className="text-gray-600">Choose the perfect plan for your organization's needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => handlePlanSelection(plan)}
                className={`bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer ${
                  selectedPlan?.id === plan.id ? 'ring-4 ring-blue-500' : 'hover:shadow-xl'
                } ${plan.popular ? 'border-2 border-blue-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2 text-blue-900">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-blue-800">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-blue-600 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method Selection */}
          <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-blue-900 mb-2">
                  Complete Your Purchase
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Select a payment method to subscribe to the {selectedPlan?.name} plan
                </DialogDescription>
              </DialogHeader>

              {/* Plan Summary */}
              <div className="bg-blue-50 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">{selectedPlan?.name} Plan</h3>
                  <p className="text-gray-600">{selectedPlan?.description}</p>
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  ${selectedPlan?.price}/month
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentMethodSelection(method)}
                    className={`w-full flex items-center p-4 rounded-lg border-2 transition-all duration-300 ${
                      selectedPaymentMethod?.id === method.id
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-white border-gray-200 hover:bg-blue-50'
                    }`}
                  >
                    <div className="mr-4">{method.icon}</div>
                    <div className="text-left flex-grow">
                      <h3 className="font-semibold text-blue-900">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    {selectedPaymentMethod?.id === method.id && (
                      <Check className="w-6 h-6 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Payment Buttons */}
              <div className="mt-6">
                {selectedPaymentMethod?.id === 'paypal' ? (
                  <PayPalButtons
                    style={{ layout: 'vertical' }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [{
                          amount: {
                            currency_code: 'USD',
                            value: selectedPlan ? selectedPlan.price.toString() : '0'
                          }
                        }]
                      });
                    }}
                    onApprove={(data, actions) => {
                        if (actions.order) {
                          return actions.order.capture().then((details) => {
                            alert('Transaction completed by ' + (details.payer?.name?.given_name ?? 'Unknown'));
                            handlePayment();
                          });
                        }
                        return Promise.resolve();
                      }}
                  />
                ) : (
                  <Button
                    onClick={handlePayment}
                    disabled={!selectedPaymentMethod}
                    className="w-full"
                    variant={selectedPaymentMethod ? 'default' : 'secondary'}
                  >
                    Pay ${selectedPlan?.price} with {selectedPaymentMethod?.name}
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default PricingAndBillingPage;