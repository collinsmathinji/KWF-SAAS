"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Mail, Lock, ArrowRight, CheckCircle } from "lucide-react"
import { signup } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

interface SignupForm {
  email: string
  password: string
  confirmPassword: string
  token?: string
}

const AdminSignupPage = () => {
  const [formData, setFormData] = useState<SignupForm>({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errors, setErrors] = useState<Partial<SignupForm>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Extract token from URL when component mounts
  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      setFormData((prev) => ({
        ...prev,
        token,
      }))
    }
  }, [searchParams])

  const validateForm = () => {
    const newErrors: Partial<SignupForm> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.token) {
      toast({
        title: "Warning",
        description: "No invitation token found. You may not have access to sign up.",
        variant: "destructive",
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name as keyof SignupForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await signup({name:formData.email, password: formData.password, token: formData.token})
      toast({
        title: "Success",
        description: "Signup successful! Please check your email for verification.",
        variant: "default",
      })
      router.push("/login")
      console.log("Signup successful")
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Marketing content component
  const MarketingSection = () => (
    <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-8">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold mb-6">Welcome to Admin Dashboard</h1>
        <p className="text-xl mb-8">Powerful tools to manage your business all in one place</p>

        <div className="space-y-4">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 mr-3" />
            <span>Comprehensive analytics and reporting</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 mr-3" />
            <span>User management and permissions</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 mr-3" />
            <span>Content management system</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 mr-3" />
            <span>Automated workflows and notifications</span>
          </div>
        </div>

        <div className="mt-12">
          <p className="font-medium text-lg">Join thousands of businesses using our platform</p>
          <div className="flex mt-4 space-x-4">
            <div className="w-8 h-8 bg-white rounded-full"></div>
            <div className="w-8 h-8 bg-white rounded-full"></div>
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen">
      <MarketingSection />
      <div className="w-full lg:w-1/2 flex bg-gray-50">
        <div className="w-full flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Admin Account</h2>
              <p className="text-gray-600">Enter your details to create your admin account</p>
              {formData.token && (
                <div className="mt-2 text-sm text-green-600 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Invitation token detected
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Email address</label>
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
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Password</label>
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
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Confirm Password</label>
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
                {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
              </div>

              <Button
                type="submit"
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Creating account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              Already have an account?{" "}
              <Link href="/login">
                <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">Sign in</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSignupPage
