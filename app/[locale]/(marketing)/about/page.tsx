import React from 'react';
import { Users, Globe, Heart, Trophy } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "10,000+",
      label: "Organizations"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      value: "50+",
      label: "Countries"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      value: "99%",
      label: "Satisfaction Rate"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      value: "5+",
      label: "Years of Excellence"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              Our Mission is to Simplify Contact Management
            </h1>
            <p className="text-xl text-blue-100">
              Helping organizations worldwide manage their contacts efficiently and securely
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;