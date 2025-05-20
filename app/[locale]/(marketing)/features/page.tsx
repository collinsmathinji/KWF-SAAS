import React from 'react';
import { Users, Database,  Shield, LineChart, Filter, Clock } from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Custom Contact Fields",
      description: "Create and manage custom fields specific to your organization's needs. Track the exact information that matters to you.",
      details: ["Unlimited custom fields", "Field type options", "Required/Optional settings", "Conditional logic"]
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Management",
      description: "Powerful tools to handle your contact database with ease and efficiency.",
      details: ["Bulk import/export", "Data validation", "Duplicate detection", "Version history"]
    },
    {
      icon: <Filter className="w-6 h-6" />,
      title: "Smart Organization",
      description: "Organize contacts your way with flexible categorization and filtering options.",
      details: ["Custom categories", "Smart tags", "Advanced search", "Dynamic lists"]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security & Privacy",
      description: "Enterprise-grade security to keep your contact data safe and compliant.",
      details: ["End-to-end encryption", "Role-based access", "Audit logs", "GDPR compliance"]
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Analytics & Reporting",
      description: "Gain insights from your contact data with comprehensive analytics tools.",
      details: ["Custom reports", "Data visualization", "Export capabilities", "Trend analysis"]
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Automation",
      description: "Save time with powerful automation features for contact management.",
      details: ["Automated updates", "Scheduled exports", "Data enrichment", "Integration workflows"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              Powerful Features for Modern Contact Management
            </h1>
            <p className="text-xl text-blue-100">
              Everything you need to manage your organizations contacts efficiently
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-gray-600">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to experience these features?</h2>
            <p className="text-gray-600 mb-8">
              Start your free trial today and discover how our features can transform your contact management
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;