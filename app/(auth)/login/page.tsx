"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useSession } from "next-auth/react"
export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/dashboard"
   const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    
    // Validate form
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }
    
    try {
      setIsLoading(true)
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false, 
      })
      if(result?.ok){
        console.log("login isonboard",session)
        localStorage.setItem("userId",session?.user.id)
      localStorage.setItem('isOnboarded',session?.user.isOnboarded);
      }
      if (result?.error) {
        setError(result.error)
        return
      }

      // Fetch user data to get the isOnboarded status;
 
        

      
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        router.push(from)
      }, 3000)
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

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
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-blue-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
              OM
            </div>
          </div>
          
          {/* Success Toast */}
          {showToast && (
            <div className="absolute top-4 left-0 right-0 mx-auto w-5/6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <div>
                <p className="font-bold">Login Successful</p>
                <p className="text-sm">Welcome back {formData.email}! Redirecting to dashboard...</p>
              </div>
            </div>
          )}
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-800">KWF_SAAS</h1>
            <p className="text-blue-600 mt-2">Sign in to your account</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-800 font-medium">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="string"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-blue-800 font-medium">Password</Label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-blue-100 text-center">
            <p className="text-blue-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-blue-800 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}