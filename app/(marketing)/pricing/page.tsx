import React from 'react';
import { Check } from 'lucide-react';

const PricingPage = () => {
  const plans = [
    {
      name: "Starter",
      price: "29",
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
      name: "Professional",
      price: "99",
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
      name: "Enterprise",
      price: "299",
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

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-600">Choose the perfect plan for your organization's needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl shadow-sm ${
                plan.popular ? 'ring-2 ring-blue-600 relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-blue-600 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Secure payment methods</p>
          <div className="flex justify-center items-center gap-6">
            <div className="text-gray-400">PayPal</div>
            <div className="text-gray-400">M-Pesa</div>
            <div className="text-gray-400">iPay</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;