"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
}

export default function AdminSignupPage() {
    const [formData, setFormData] = useState<SignupForm>({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
    });
    const router = useRouter();
    const searchParams = useSearchParams();
    const [errors, setErrors] = useState<Partial<SignupForm> & { general?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showVerificationMessage, setShowVerificationMessage] = useState(false);
    const [subscriptionVerified, setSubscriptionVerified] = useState(false);
    const [isVerifyingSubscription, setIsVerifyingSubscription] = useState(false);
    const [emailLocked, setEmailLocked] = useState(false);
    const [currentStep, setCurrentStep] = useState<'verify' | 'create'>('verify');
    
    const supabase = createClientComponentClient<Database>();

    // Get subscription ID from URL parameters
    const subscriptionId = searchParams.get('subscription_id');
    const customerId = searchParams.get('customer_id');
    const emailParam = searchParams.get('email');
    
    // Pre-fill email if provided in URL
    useEffect(() => {
        if (emailParam) {
            setFormData(prev => ({
                ...prev,
                email: emailParam
            }));
            setEmailLocked(true);
            
            // Auto-verify subscription if email is provided
            if (subscriptionId || customerId) {
                verifySubscription(emailParam);
            }
        }
    }, [emailParam, subscriptionId, customerId]);

    const validateForm = () => {
        const newErrors: Partial<SignupForm> = {};
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (currentStep === 'create') {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            }
            
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // If email is locked, don't allow changes
        if (name === 'email' && emailLocked) {
            return;
        }
        
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
        
        // Clear subscription verification when email changes
        if (name === 'email' && subscriptionVerified) {
            setSubscriptionVerified(false);
        }
    };
    
    // Function to verify subscription
    const verifySubscription = async (emailToVerify = formData.email) => {
        if (!emailToVerify) {
            setErrors(prev => ({
                ...prev,
                email: 'Email is required to verify subscription'
            }));
            return;
        }
        
        if (!subscriptionId && !customerId) {
            setErrors({
                general: 'No subscription information found. Please subscribe first.'
            });
            return;
        }
        
        setIsVerifyingSubscription(true);
        setErrors({});
        
        try {
            // Call API to verify subscription with email check
            const response = await fetch('/api/verify-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    subscriptionId,
                    customerId,
                    email: emailToVerify
                }),
            });

            const data = await response.json();

            if (response.ok && data.active) {
                setSubscriptionVerified(true);
                // Lock the email field if verification succeeds
                setEmailLocked(true);
                setCurrentStep('create');
            } else {
                setErrors({ 
                    general: data.message || 'Could not verify subscription for this email address.'
                });
            }
        } catch (error) {
            console.error('Error verifying subscription:', error);
            setErrors({ 
                general: 'Failed to verify subscription. Please try again.'
            });
        } finally {
            setIsVerifyingSubscription(false);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        // Verify subscription if not already verified
        if (!subscriptionVerified) {
            await verifySubscription();
            return;
        }
        
        setIsSubmitting(true);
        setErrors({});
        
        try {
            // Local signup implementation using fetch
            const signupResponse = await fetch('/api/auth/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    metadata: {
                        subscription_id: subscriptionId,
                        customer_id: customerId,
                        is_admin: true,
                        full_name: formData.fullName
                    }
                }),
            });
            
            const signupData = await signupResponse.json();
            
            if (!signupResponse.ok) {
                throw new Error(signupData.message || 'Failed to create account');
            }
            
            // If successful, create profile in database
            if (signupData.user && signupData.user.id) {
                const userId = signupData.user.id;
                
                // Create profile record
                const profileResponse = await fetch('/api/profiles/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: userId,
                        email: formData.email,
                        full_name: formData.fullName || null,
                        is_admin: true,
                        created_at: new Date().toISOString()
                    }),
                });
                
                if (!profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    console.error('Profile creation error:', profileData);
                    // Continue even if profile creation fails - we can handle this separately
                }
                
                // Store subscription info
                const subscriptionResponse = await fetch('/api/subscriptions/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        subscription_id: subscriptionId || null,
                        customer_id: customerId || '',
                        email: formData.email,
                        status: 'active',
                        created_at: new Date().toISOString()
                    }),
                });
                
                if (!subscriptionResponse.ok) {
                    const subscriptionData = await subscriptionResponse.json();
                    console.error('Subscription record creation error:', subscriptionData);
                    // Continue even if subscription record creation fails
                }
            }
            
            // Show verification message
            setShowVerificationMessage(true);
            
        } catch (error: any) {
            console.error('Signup error:', error);
            setErrors({
                general: error.message || 'An error occurred during signup. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showVerificationMessage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Admin Account</h2>
                    <p className="text-gray-600">
                        {currentStep === 'verify' 
                            ? 'First, verify your subscription' 
                            : 'Enter your details to create your admin account'}
                    </p>
                </div>

                {errors.general && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {errors.general}
                        </AlertDescription>
                    </Alert>
                )}

                {subscriptionVerified && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-green-700 font-medium">Subscription verified!</p>
                            <p className="text-xs text-green-600">You can now create your admin account.</p>
                        </div>
                    </div>
                )}

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
                                className={`pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ${emailLocked ? 'bg-gray-100' : ''}`}
                                placeholder="name@company.com"
                                readOnly={emailLocked}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                        )}
                    </div>

                    {currentStep === 'create' && (
                        <>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 block">
                                    Full Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                                    placeholder="Your full name"
                                />
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
                        </>
                    )}

                    {currentStep === 'verify' ? (
                        <Button 
                            type="button"
                            onClick={() => verifySubscription()}
                            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                            disabled={isVerifyingSubscription || !formData.email}
                        >
                            {isVerifyingSubscription ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Verify Subscription
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button 
                            type="submit"
                            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </Button>
                    )}
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login">
                            <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                                Sign in
                            </span>
                        </Link>
                    </p>
                    
                    {!subscriptionId && !customerId && (
                        <p className="text-gray-600 mt-2">
                            Don't have a subscription?{' '}
                            <Link href="/pricing">
                                <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                                    View pricing
                                </span>
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
