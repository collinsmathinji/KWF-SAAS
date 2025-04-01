"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';

import { Button } from "@/components/ui/button"

import { useRouter } from 'next/navigation';
interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const AdminSignupPage = () => {
    const [formData, setFormData] = useState<SignupForm>({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const router = useRouter()
    const [errors, setErrors] = useState<Partial<SignupForm>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showVerificationMessage] = useState(false);

    const validateForm = () => {
        const newErrors: Partial<SignupForm> = {};
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name as keyof SignupForm]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        router.push('/setup')
        // try {
        //     // Here you would typically make an API call to create the user
        //     // await createAdminUser(formData);
            
        //     // Show verification message
        //     setShowVerificationMessage(true);
        // } catch (error) {
        //     console.error('Signup error:', error);
        //     setErrors({
        //         email: 'An error occurred during signup. Please try again.'
        //     });
        // } finally {
        //     setIsSubmitting(false);
        // }
    };

    if (showVerificationMessage) {
        return (
            <div className="min-h-screen lg:w-1/2 flex bg-gray-50">
                <div className="w-full flex items-center justify-center p-8">
                    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
                        <div className="mb-6">
                            <Mail className="w-12 h-12 text-blue-600 mx-auto" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Verify your email
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We have sent a verification link to<br />
                            <span className="font-medium">{formData.email}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            Please check your email and click the verification link to activate your admin account.
                            Once verified, you will be able to log in.
                        </p>
                        <Link href="/login" className="mt-6 inline-block text-blue-600 hover:text-blue-500">
                            Return to login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen lg:w-1/2 flex bg-gray-50">
            <div className="w-full flex items-center justify-center p-8">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Admin Account</h2>
                        <p className="text-gray-600">Enter your details to create your admin account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 block">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                                    placeholder="name@company.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 block">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                                    placeholder="Create a strong password"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 block">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                                    placeholder="Confirm your password"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <Button 
                            type="submit"
                            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating account...' : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login">
                            <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                                Sign in
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminSignupPage;