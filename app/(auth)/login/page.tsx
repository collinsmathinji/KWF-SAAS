import React from 'react';
import Link from 'next/link';
import { Mail, Lock, Users, Building, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    return (
        <div className="min-h-screen  lg:w-1/2 flex bg-gray-50">
          
            <div className="w-full  flex items-center justify-center p-8">
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

                        <Link href="/admin-dashboard"
                            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                        >
                            Sign in
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/packages">
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