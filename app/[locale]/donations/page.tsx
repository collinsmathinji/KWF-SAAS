"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image"
import {
  DollarSign,
  Users,
  Clock,
  Heart,
  Search,
  Zap,
  ChevronRight,
  X,
  ArrowRight,
  Sparkles,
  Globe,
  Leaf,
  BookOpen,
  Home,
  HeartHandshake,
  Stethoscope,
} from "lucide-react"
import { toast } from "react-hot-toast";

interface Donation {
  id: string
  title: string
  cause: string
  category: string
  donationType: "one-time" | "recurring"
  targetAmount: number
  currentAmount: number
  coverImage: string
  description: string
  startDate: string
  endDate?: string
  donorCount: number
  organizationName: string
  organizationId: string // Add this field
  minDonation: number
  donationTiers: Array<{
    amount: number
    label: string
  }>
  enableRecurring: boolean
}

interface DonationListParams {
  groupId?: string
  memberId?: string
  isPaid?: boolean
  limit?: number
  offset?: number
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "charity":
      return <HeartHandshake className="h-4 w-4" />
    case "education":
      return <BookOpen className="h-4 w-4" />
    case "medical":
      return <Stethoscope className="h-4 w-4" />
    case "community":
      return <Home className="h-4 w-4" />
    case "environment":
      return <Leaf className="h-4 w-4" />
    default:
      return <Globe className="h-4 w-4" />
  }
}

export default function PublicDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [selectedTier, setSelectedTier] = useState<{ amount: number; label: string } | null>(null)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [donorName, setDonorName] = useState("")
  const [donorEmail, setDonorEmail] = useState("")

  useEffect(() => {
    fetchDonations({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    })
  }, [currentPage, pageSize])

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const fetchDonations = async (params?: DonationListParams) => {
    try {
      setLoading(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/donation/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: {
            isDeleted: false,
            status: "active",
          },
          options: {
            limit: params?.limit || 20,
            offset: params?.offset || 0,
            order: [["createdAt", "DESC"]],
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch donations")
      }

      const data = await response.json()
      if (data.status === "SUCCESS") {
        setDonations(data.data.rows || [])
        setTotalCount(data.data.count || 0)
      } else {
        throw new Error(data.message || "Failed to fetch donations")
      }
    } catch (error) {
      console.error("Error fetching donations:", error)
      setError("Failed to load donations. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleDonateClick = (donation: Donation) => {
    setSelectedDonation(donation)
    setIsModalOpen(true)
  }

  const handleCheckout = async () => {
    if (!selectedDonation) return;

    const donationAmount = Number(customAmount) || selectedTier?.amount || 0;
    if (donationAmount < selectedDonation.minDonation) {
      toast.error(`Minimum donation amount is $${selectedDonation.minDonation}`);
      return;
    }

    setIsCheckoutLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/create-donation-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donationId: selectedDonation.id,
          organizationId: selectedDonation.organizationId, // Make sure this is available in your Donation interface
          mode: "payment",
          donationAmount: donationAmount,
          successUrl: `${window.location.origin}/donations/thank-you`,
          cancelUrl: `${window.location.origin}/donations`,
          guests: [
            {
              name: donorName || "Anonymous Donor", // You might want to get this from a form
              email: donorEmail || "anonymous@example.com" // You might want to get this from a form
            }
          ],
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error:any) {
      console.error("Error creating checkout session:", error);
      toast.error(error.message || "Failed to create checkout session");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedDonation(null)
    setSelectedTier(null)
    setCustomAmount("")
  }

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || donation.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          <p className="text-blue-600 font-medium">Loading donations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => fetchDonations()} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container flex h-16 max-w-screen-2xl items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                KWF_SAAS
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
            <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="/events" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Events
            </Link>
            <Link
              href="/donations"
              className="text-sm font-medium text-blue-600 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600 after:rounded-full"
            >
              Donations
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center justify-end gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm shadow-md hover:shadow-lg transition-all duration-300"
              size="sm"
            >
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-screen-2xl py-8 mx-auto px-4">
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-16 sm:py-24 mb-12 shadow-xl">
          <div className="absolute inset-0 -z-10 opacity-20">
            <svg className="h-full w-full" viewBox="0 0 1097 845" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1097 0H0V845H1097V0Z" fill="url(#paint0_radial)" />
              <defs>
                <radialGradient
                  id="paint0_radial"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(548.5 422.5) rotate(90) scale(422.5 548.5)"
                >
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-4">Make a Difference Today</h1>
              <div className="flex justify-center mb-6">
                <div className="h-1 w-24 bg-white/50 rounded-full"></div>
              </div>
              <p className="text-lg leading-8 text-white/90">
                Support meaningful causes and join our community of donors making positive change happen. Every
                contribution, no matter the size, creates ripples of impact.
              </p>
              <div className="mt-10 flex items-center justify-center gap-6">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  Browse Causes
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Find a Cause to Support</h2>
          <div className="grid gap-4 md:grid-cols-[1fr,auto] md:gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, description, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus-visible:ring-blue-500"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-12 border-gray-200 min-w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="charity">Charity</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Causes */}
        <div className="mb-12">
          

          {/* Donations Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center max-w-7xl mx-auto">
            {filteredDonations.map((donation) => (
              <Card
                key={donation.id}
                className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-full flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={donation.coverImage || "/placeholder.svg"}
                    alt={donation.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-white/90 text-gray-800 hover:bg-white/80 backdrop-blur-sm">
                      {getCategoryIcon(donation.category)}
                      <span className="ml-1">{donation.category}</span>
                    </Badge>

                    {donation.donationType === "recurring" && (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Recurring
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{donation.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{donation.description}</p>

                  <div className="mb-4 mt-auto">
                    <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                      <span className="font-medium">${donation.currentAmount} raised</span>
                      <span className="font-medium">${donation.targetAmount} goal</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min((donation.currentAmount / donation.targetAmount) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                      <span>{((donation.currentAmount / donation.targetAmount) * 100).toFixed(1)}% Complete</span>
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {donation.donorCount} Donors
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button
                    onClick={() => handleDonateClick(donation)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Donate Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalCount > pageSize && (
          <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of{" "}
                {totalCount}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="border-gray-200 text-gray-700"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage * pageSize >= totalCount}
                className="border-gray-200 text-gray-700"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container max-w-screen-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white p-1.5 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-xl font-bold">KWF_SAAS</span>
              </div>
              <p className="text-gray-400 text-sm">Empowering communities through technology and generosity.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Subscribe</h3>
              <p className="text-gray-400 text-sm mb-4">Stay updated with our latest news and announcements.</p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none bg-gray-800 border-gray-700 focus-visible:ring-blue-500"
                />
                <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700">Subscribe</Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} KWF_SAAS. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Donation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedDonation?.title}</DialogTitle>
            <DialogDescription>Choose a donation amount or enter a custom amount below.</DialogDescription>
          </DialogHeader>

          {selectedDonation && selectedDonation.donationTiers && (
            <div className="grid grid-cols-2 gap-4">
              {selectedDonation.donationTiers.map((tier) => (
                <button
                  key={tier.label}
                  onClick={() => {
                    setSelectedTier(tier)
                    setCustomAmount("")
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedTier?.amount === tier.amount
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">${tier.amount}</div>
                  <div className="text-sm text-gray-600">{tier.label}</div>
                </button>
              ))}
            </div>
          )}

          {selectedDonation && (
            <div className="space-y-4 py-4">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="number"
                  min={selectedDonation.minDonation}
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedTier(null)
                  }}
                  placeholder={`Custom amount (min $${selectedDonation.minDonation})`}
                  className="pl-9"
                />
              </div>

              {selectedDonation.donationType === "recurring" && (
                <div className="flex items-center p-3 rounded-lg bg-purple-50 border border-purple-100">
                  <Sparkles className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                  <p className="text-sm text-purple-800">
                    This is a recurring donation. You'll be charged the selected amount on a monthly basis until you
                    cancel.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="mt-1"
                onChange={(e) => setDonorName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="mt-1"
                onChange={(e) => setDonorEmail(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={handleCheckout}
              disabled={isCheckoutLoading || (!selectedTier && !customAmount)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isCheckoutLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <DollarSign className="w-4 h-4 mr-2" />
              )}
              {isCheckoutLoading ? "Processing..." : "Proceed to Payment"}
            </Button>
            <Button variant="outline" onClick={closeModal} className="w-full">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
