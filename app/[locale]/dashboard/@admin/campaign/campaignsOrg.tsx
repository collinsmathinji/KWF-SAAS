"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Calendar,
  Coins,
  ChevronRight,
  Clock,
  Users,
  PieChart,
  Edit,
  Eye,
  Trash2,
  ArrowUpRight,
  Search,
  Filter,
  ChevronDown,
  X,
  DollarSign,
  Plus,
  Gift,
  TrendingUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import CampaignCreationForm from "./campaignForm"

// Types
interface Campaign {
  id: string
  title: string
  cause: string
  category: string
  donationType: "one-time" | "recurring"
  targetAmount: number
  coverImage: string
  gallery?: string[]
  description: string
  startDate: string
  endDate?: string
  status: "draft" | "active" | "ended" | "pending"
  organizationId: string
  groupId?: string
  stripeProductId?: string
  stripePriceId?: string
  currentAmount?: number
  donorCount?: number
}

// Category name mapping
const CATEGORY_LABELS: Record<string, string> = {
  charity: "Charity & Welfare",
  education: "Education",
  medical: "Medical & Health",
  community: "Community Development",
  environment: "Environment",
  animal: "Animal Welfare",
  arts: "Arts & Culture",
  other: "Other",
}

// Status badge colors - Updated to gray/blue palette
const STATUS_COLORS: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  active: {
    bg: "bg-blue-50 border border-blue-200",
    text: "text-blue-700",
    icon: <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>,
  },
  draft: {
    bg: "bg-gray-50 border border-gray-200",
    text: "text-gray-700",
    icon: <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>,
  },
  ended: {
    bg: "bg-slate-50 border border-slate-200",
    text: "text-slate-700",
    icon: <div className="w-2 h-2 rounded-full bg-slate-500 mr-2"></div>,
  },
  pending: {
    bg: "bg-blue-50 border border-blue-200",
    text: "text-blue-600",
    icon: <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>,
  },
}

// Dialog component for the form
interface FormDialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  isEditMode: boolean
}

const FormDialog: React.FC<FormDialogProps> = ({ isOpen, onClose, children, isEditMode }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex justify-between items-center p-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Campaign" : "Create New Campaign"}
            </h2>
            <p className="text-gray-600 mt-1">
              {isEditMode ? "Update your campaign details" : "Set up a new fundraising campaign"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl p-2.5 transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}

// Stats Card Component - Updated with gray/blue palette
interface StatsCardProps {
  icon: React.ReactNode
  title: string
  value: string
  subtitle?: string
  bgColor: string
  iconBg: string
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, subtitle, bgColor, iconBg }) => (
  <div className={`${bgColor} rounded-2xl p-6 border border-white/10 shadow-lg backdrop-blur-sm`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-white/90 text-sm font-medium mb-2">{title}</p>
        <p className="text-white text-3xl font-bold mb-1">{value}</p>
        {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
      </div>
      <div className={`${iconBg} rounded-xl p-3 ml-4`}>{icon}</div>
    </div>
  </div>
)

const OrganizationCampaigns = () => {
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { data: session } = useSession()
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [refreshAnimation, setRefreshAnimation] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update the fetchCampaigns function
  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!session?.user?.organizationId) {
        throw new Error("Organization ID not found")
      }

      const response = await fetch("/api/donation/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            organizationId: session.user.organizationId,
          },
          options: {
            paginate: 20,
            page: 1,
            select: [
              "id",
              "title",
              "cause",
              "category",
              "donationType",
              "targetAmount",
              "coverImage",
              "description",
              "startDate",
              "endDate",
              "status",
              "organizationId",
            ],
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.status === "SUCCESS") {
        // Initialize currentAmount and donorCount with realistic mock data
        const campaignsWithDefaults = (data.data.rows || []).map((campaign: any) => ({
          ...campaign,
          currentAmount:0,
          donorCount: 0,
        }))
        setCampaigns(campaignsWithDefaults)
      } else {
        throw new Error(data.message || "Failed to fetch campaigns")
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error)
      setError(error instanceof Error ? error.message : "Failed to load campaigns")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.organizationId) {
      fetchCampaigns()
    }
  }, [session])

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    const matchesCategory = categoryFilter === "all" || campaign.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Ongoing"

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate progress percentage
  const calculateProgress = (current: number, goal: number): number => {
    return Math.min(Math.round((current / goal) * 100), 100)
  }

  // Compute total stats
  const totalStats = {
    activeCount: campaigns.filter((c) => c.status === "active").length,
    totalRaised: campaigns.reduce((sum, c) => sum + (c.currentAmount || 0), 0),
    totalDonors: campaigns.reduce((sum, c) => sum + (c.donorCount || 0), 0),
    totalGoal: campaigns.reduce((sum, c) => sum + c.targetAmount, 0),
  }

  // Handle campaign deletion
  const handleDeleteCampaign = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/donation/softDelete/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete campaign")
      }

      await fetchCampaigns()
    } catch (error) {
      console.error("Error deleting campaign:", error)
      setError("Failed to delete campaign")
    }
  }

  // Open campaign details
  const openCampaignDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
  }

  // Close campaign details
  const closeCampaignDetails = () => {
    setSelectedCampaign(null)
  }

  // Open campaign form dialog
  const openFormDialog = () => {
    setIsFormDialogOpen(true)
  }

  // Close campaign form dialog
  const closeFormDialog = () => {
    setIsFormDialogOpen(false)
    setIsEditMode(false)
    setEditingCampaign(null)
  }

  // Handle form submission
  const handleFormSubmit = async (formData: any) => {
    try {
      const response = await fetch("/api/donation/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          organizationId: session?.user?.organizationId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create campaign")
      }

      await fetchCampaigns()
      closeFormDialog()
    } catch (error) {
      console.error("Error creating campaign:", error)
      setError("Failed to create campaign")
    }
  }

  // Handle refresh button click
  const handleRefresh = () => {
    setRefreshAnimation(true)
    fetchCampaigns().finally(() => {
      setTimeout(() => setRefreshAnimation(false), 1000)
    })
  }

  // Handle update campaign
  const handleUpdateCampaign = async (id: string, updatedData: Partial<Campaign>) => {
    try {
      const response = await fetch(`/api/donation/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error("Failed to update campaign")
      }

      await fetchCampaigns()
      closeFormDialog()
    } catch (error) {
      console.error("Error updating campaign:", error)
      setError("Failed to update campaign")
    }
  }

  // Handle edit click
  const handleEditClick = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setIsEditMode(true)
    setIsFormDialogOpen(true)
  }

  // Campaign details view
  if (selectedCampaign) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <button
            onClick={closeCampaignDetails}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 font-medium transition-colors group"
          >
            <ChevronRight className="rotate-180 mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Campaign Dashboard
          </button>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="relative h-80">
              <Image
                src={selectedCampaign.coverImage || "/placeholder.svg?height=320&width=800"}
                alt={selectedCampaign.title}
                fill
                style={{ objectFit: "cover" }}
                className="w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex justify-between items-end">
                  <div className="flex-1">
                    <div className="flex items-center mb-4 space-x-3">
                      <span
                        className={`${STATUS_COLORS[selectedCampaign.status].bg} ${STATUS_COLORS[selectedCampaign.status].text} text-sm font-semibold px-4 py-2 rounded-full flex items-center backdrop-blur-sm`}
                      >
                        {STATUS_COLORS[selectedCampaign.status].icon}
                        {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                      </span>

                      {selectedCampaign.donationType === "recurring" && (
                        <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center">
                          <RefreshCw size={14} className="mr-2" />
                          Recurring Donations
                        </span>
                      )}
                    </div>
                    <h1 className="text-4xl font-bold mb-3 drop-shadow-lg">{selectedCampaign.title}</h1>
                    <div className="flex items-center text-white/90 space-x-6">
                      <span className="flex items-center">
                        <Calendar size={18} className="mr-2" />
                        {formatDate(selectedCampaign.startDate)}
                        {selectedCampaign.endDate && ` - ${formatDate(selectedCampaign.endDate)}`}
                      </span>
                      <span className="flex items-center">
                        <Coins size={18} className="mr-2" />
                        {CATEGORY_LABELS[selectedCampaign.category] || selectedCampaign.category}
                      </span>
                    </div>
                  </div>

                  {selectedCampaign.status === "active" && (
                    <Link
                      href={`/campaigns/${selectedCampaign.id}`}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl flex items-center transition-all duration-200 shadow-lg"
                      target="_blank"
                    >
                      View Live Campaign <ArrowUpRight size={18} className="ml-2" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="prose prose-gray max-w-none mb-10">
                <p className="text-lg text-gray-700 leading-relaxed">{selectedCampaign.description}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-8 mb-10 text-white shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-white/90 font-semibold mb-4 text-lg">Fundraising Progress</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-4xl font-bold">{formatCurrency(selectedCampaign.currentAmount || 0)}</span>
                      <span className="text-white/80 ml-3 text-lg">
                        of {formatCurrency(selectedCampaign.targetAmount)} goal
                      </span>
                    </div>
                    <div className="h-3 w-full bg-white/20 rounded-full mb-3">
                      <div
                        className="h-3 bg-white rounded-full transition-all duration-500"
                        style={{
                          width: `${calculateProgress(selectedCampaign.currentAmount || 0, selectedCampaign.targetAmount)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-white/90 font-medium">
                      {calculateProgress(selectedCampaign.currentAmount || 0, selectedCampaign.targetAmount)}% of goal
                      reached
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <Users size={24} className="text-white/80" />
                      </div>
                      <div className="text-3xl font-bold mb-1">{selectedCampaign.donorCount || 0}</div>
                      <div className="text-white/80 font-medium">Total Donors</div>
                    </div>

                    {selectedCampaign.status === "active" && selectedCampaign.endDate && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-3">
                          <Clock size={24} className="text-white/80" />
                        </div>
                        <div className="text-3xl font-bold mb-1">
                          {Math.max(
                            0,
                            Math.ceil(
                              (new Date(selectedCampaign.endDate).getTime() - new Date().getTime()) /
                                (1000 * 60 * 60 * 24),
                            ),
                          )}
                        </div>
                        <div className="text-white/80 font-medium">Days Left</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <Link
                  href={`/campaigns/${selectedCampaign.id}/donations`}
                  className="group bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl p-6 flex items-center transition-all duration-200 hover:shadow-lg"
                >
                  <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center mr-5 group-hover:bg-blue-600 transition-colors">
                    <DollarSign size={28} className="text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      Donation History
                    </h3>
                    <p className="text-gray-600">View all donations and transaction details</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </Link>

                <Link
                  href={`/campaigns/${selectedCampaign.id}/analytics`}
                  className="group bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl p-6 flex items-center transition-all duration-200 hover:shadow-lg"
                >
                  <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mr-5 group-hover:bg-gray-600 transition-colors">
                    <PieChart size={28} className="text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                      Analytics & Insights
                    </h3>
                    <p className="text-gray-600">Track performance and donor insights</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleEditClick(selectedCampaign)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center"
                >
                  <Edit size={20} className="mr-3" /> Edit Campaign Details
                </button>
                <button
                  onClick={() => handleDeleteCampaign(selectedCampaign.id)}
                  className="bg-white hover:bg-gray-50 text-gray-600 border-2 border-gray-200 hover:border-gray-300 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
                >
                  <Trash2 size={20} className="mr-3" /> Delete Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-6 font-medium text-lg">Loading your campaigns...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Campaigns</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Campaign Management</h1>
            <p className="text-xl text-gray-600">Monitor and manage all your fundraising campaigns</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              className={`p-3 bg-white text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm ${refreshAnimation ? "animate-spin" : ""}`}
              aria-label="Refresh campaigns"
              title="Refresh campaigns"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={openFormDialog}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl flex items-center shadow-lg transition-all duration-200"
            >
              <Plus size={20} className="mr-2" /> Create New Campaign
            </button>
          </div>
        </div>

        {/* Enhanced Stats overview - Updated colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            icon={<TrendingUp className="text-white" size={24} />}
            title="Active Campaigns"
            value={totalStats.activeCount.toString()}
            subtitle={`${campaigns.length} total campaigns`}
            bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
            iconBg="bg-white/20"
          />
          <StatsCard
            icon={<DollarSign className="text-white" size={24} />}
            title="Total Raised"
            value={formatCurrency(totalStats.totalRaised)}
            subtitle={`${((totalStats.totalRaised / totalStats.totalGoal) * 100).toFixed(1)}% of total goal`}
            bgColor="bg-gradient-to-br from-gray-600 to-gray-700"
            iconBg="bg-white/20"
          />
          <StatsCard
            icon={<Users className="text-white" size={24} />}
            title="Total Donors"
            value={totalStats.totalDonors.toString()}
            subtitle="Unique contributors"
            bgColor="bg-gradient-to-br from-blue-600 to-blue-700"
            iconBg="bg-white/20"
          />
          <StatsCard
            icon={<Gift className="text-white" size={24} />}
            title="Average Donation"
            value={totalStats.totalDonors > 0 ? formatCurrency(totalStats.totalRaised / totalStats.totalDonors) : "$0"}
            subtitle="Per donor contribution"
            bgColor="bg-gradient-to-br from-gray-700 to-gray-800"
            iconBg="bg-white/20"
          />
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search campaigns by title or description..."
                  className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center bg-gray-50 border border-gray-200 rounded-xl py-4 px-6 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium text-gray-700"
                >
                  <Filter size={20} className="text-gray-500 mr-3" />
                  Filter & Sort
                  <ChevronDown size={18} className="text-gray-500 ml-3" />
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-20">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 text-lg">Filter Campaigns</h3>
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Status Filter */}
                      <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-3">Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="all">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="ended">Ended</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <label className="block text-gray-700 font-medium mb-3">Category</label>
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="all">All Categories</option>
                          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Campaign List */}
          <div className="p-8">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No campaigns found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-200 cursor-pointer border border-gray-200"
                    onClick={() => openCampaignDetails(campaign)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span
                          className={`${STATUS_COLORS[campaign.status].bg} ${STATUS_COLORS[campaign.status].text} text-sm font-semibold px-4 py-2 rounded-full inline-flex items-center`}
                        >
                          {STATUS_COLORS[campaign.status].icon}
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditClick(campaign)
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCampaign(campaign.id)
                          }}
                          className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">{campaign.title}</h3>

                    <div className="flex items-center text-gray-600 space-x-4 mb-4">
                      <span className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        {formatDate(campaign.startDate)}
                      </span>
                      <span className="flex items-center">
                        <Coins size={16} className="mr-2" />
                        {CATEGORY_LABELS[campaign.category] || campaign.category}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline mb-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatCurrency(campaign.currentAmount || 0)}
                        </span>
                        <span className="text-gray-600 ml-2">of {formatCurrency(campaign.targetAmount)}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${calculateProgress(campaign.currentAmount || 0, campaign.targetAmount)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span className="flex items-center">
                        <Users size={16} className="mr-2" />
                        {campaign.donorCount || 0} donors
                      </span>
                      {campaign.status === "active" && campaign.endDate && (
                        <span className="flex items-center">
                          <Clock size={16} className="mr-2" />
                          {Math.max(
                            0,
                            Math.ceil(
                              (new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                            ),
                          )}{" "}
                          days left
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campaign Form Dialog */}
      <FormDialog isOpen={isFormDialogOpen} onClose={closeFormDialog} isEditMode={isEditMode}>
        <CampaignCreationForm
          onSubmit={isEditMode ? (data) => handleUpdateCampaign(editingCampaign!.id, data) : handleFormSubmit}
          initialData={editingCampaign || undefined}
        />
      </FormDialog>
    </div>
  )
}

export default OrganizationCampaigns