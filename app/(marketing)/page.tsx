import React from 'react';
import Link from 'next/link';
import { Users, Database, Settings, Shield, ArrowRight, Check } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-blue-600 text-white py-4">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">KWF SaaS</h1>
                    <nav>
                        <Link href="/login">
                            <a className="text-white hover:underline">Login</a>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white flex-grow">
                <div className="container mx-auto px-6 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-6">
                            Manage Your Organization's Contacts with Confidence
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Customizable, secure, and efficient contact management for organizations of all sizes
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/signup">
                                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                                    Start Free Trial
                                </button>
                            </Link>
                            <Link href="/features">
                                <button className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                                    Learn More
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose ContactHub?</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Users className="w-6 h-6" />,
                                title: "Custom Fields",
                                description: "Tailor contact information to your organization's specific needs"
                            },
                            {
                                icon: <Database className="w-6 h-6" />,
                                title: "Bulk Import/Export",
                                description: "Easily manage large contact databases with our powerful tools"
                            },
                            {
                                icon: <Settings className="w-6 h-6" />,
                                title: "Flexible Organization",
                                description: "Organize contacts your way with custom categories and tags"
                            },
                            {
                                icon: <Shield className="w-6 h-6" />,
                                title: "Secure Storage",
                                description: "Your data is protected with enterprise-grade security"
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-8">Ready to get started?</h2>
                    <Link href="/signup">
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center">
                            Start Your Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-blue-600 text-white py-4">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; 2023 KWF SaaS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;