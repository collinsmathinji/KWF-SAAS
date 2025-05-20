"use client"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, X, Eye, EyeOff } from "lucide-react"
import { useSession } from "next-auth/react"

// Simple Error Banner Component that matches the screenshot design
const ErrorDisplay = ({ error, setError }:any) => {
  const [visible, setVisible] = useState(true);

  if (!error || !visible) return null;

  // Instead of mapping to generic messages, use the actual error message
  let errorMessage = error;
  
  // Only map in cases where we want to improve cryptic error messages
  if (error === "CredentialsSignin") {
    errorMessage = "Invalid email or password. Please try again.";
  }

  return (
    <div className="bg-red-100 border border-red-200 rounded-md mb-6 overflow-hidden">
      <div className="bg-red-500 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Login Failed</span>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(() => setError(""), 300);
          }}
          className="text-white hover:text-red-100"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="px-4 py-2 text-red-700">
        <p>{errorMessage}</p>
      </div>
    </div>
  );
};

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/dashboard"
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  
  const handleChange = (e:any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  // Add useEffect to handle browser-only code
  useEffect(() => {
    // This effect will only run in the browser
    if (status === "authenticated" && session?.user) {
      // Now we can safely use localStorage
      if (session.user.id) {
        localStorage.setItem("userId", session.user.id.toString());
      }
      if (session.user.isOnboarded !== undefined) {
        localStorage.setItem('isOnboarded', session.user.isOnboarded.toString());
      }
    }
  }, [session, status]);

  // Check for error from URL params (for redirects with error)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "CredentialsSignin") {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(errorParam);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e:any) => {
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
      
      if (result?.error) {
        // Check if the error is a JSON string containing message property
        try {
          const errorObj = JSON.parse(result.error);
          if (errorObj && errorObj.message) {
            setError(errorObj.message);
          } else {
            setError(result.error);
          }
        } catch (e) {
          // If not JSON, use the error string directly
          setError(result.error);
        }
        return;
      }
      
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        router.push(from)
      }, 3000)
    } catch (err:any) {
      console.error("Login error:", err)
      // Try to extract the backend error message
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An error occurred during login");
      }
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
  
  // Success Toast Component
  const SuccessToast = ({ email }:any) => {
    if (!showToast) return null;
    
    return (
      <div className="absolute top-4 left-0 right-0 mx-auto w-5/6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center animate-fade-in-down">
        <CheckCircle className="h-5 w-5 mr-2" />
        <div>
          <p className="font-bold">Login Successful</p>
          <p className="text-sm">Welcome back {email}! Redirecting to dashboard...</p>
        </div>
      </div>
    );
  };
  
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
          <SuccessToast email={formData.email} />
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-800">KWF_SAAS</h1>
            <p className="text-blue-600 mt-2">Sign in to your account</p>
          </div>
          
          {/* Improved Error Display */}
          <ErrorDisplay error={error} setError={setError} />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-800 font-medium">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 ${error && !formData.email ? 'border-red-300' : ''}`}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-blue-800 font-medium">Password</Label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 ${error && !formData.password ? 'border-red-300' : ''}`}
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : "Sign In"}
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}