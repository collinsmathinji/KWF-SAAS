import React from 'react';
import Link from 'next/link';
import { Mail, Lock, Users, Building, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Branding/Features */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-12 flex-col justify-between">
                <div>
                    <h1 className="text-5xl font-extrabold mb-4 animate-fade-in">ContactHub</h1>
                    <p className="text-blue-100 text-lg">Your Ultimate Contact Management Solution</p>
                </div>
                
                <div className="space-y-8">
                    <div className="flex items-start space-x-4 animate-slide-in">
                        <div className="p-3 bg-blue-500 rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">Customizable Contact Fields</h3>
                            <p className="text-blue-100 text-sm">Tailor your contact management to your organization's specific needs</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 animate-slide-in">
                        <div className="p-3 bg-blue-500 rounded-lg">
                            <Building className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">Multi-Organization Support</h3>
                            <p className="text-blue-100 text-sm">Perfect for businesses of all types and sizes</p>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-blue-100">
                    Trusted by hundreds of organizations worldwide
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
                        <p className="text-gray-600">Enter your credentials to access your account</p>
                    </div>

                    <form className="space-y-6">
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="email"
                                    className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="password"
                                    className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <Link href="/forgot-password">
                                <span className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                                    Forgot password?
                                </span>
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                        >
                            Sign in
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/signup">
                            <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                                Start your free trial
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;