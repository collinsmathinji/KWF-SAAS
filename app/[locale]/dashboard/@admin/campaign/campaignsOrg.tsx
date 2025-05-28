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

// Status badge colors
const STATUS_COLORS: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  active: {
    bg: "bg-emerald-50 border border-emerald-200",
    text: "text-emerald-700",
    icon: <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>,
  },
  draft: {
    bg: "bg-slate-50 border border-slate-200",
    text: "text-slate-700",
    icon: <div className="w-2 h-2 rounded-full bg-slate-400 mr-2"></div>,
  },
  ended: {
    bg: "bg-blue-50 border border-blue-200",
    text: "text-blue-700",
    icon: <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>,
  },
  pending: {
    bg: "bg-amber-50 border border-amber-200",
    text: "text-amber-700",
    icon: <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>,
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-8 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isEditMode ? "Edit Campaign" : "Create New Campaign"}
            </h2>
            <p className="text-slate-600 mt-1">
              {isEditMode ? "Update your campaign details" : "Set up a new fundraising campaign"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl p-2.5 transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}

// Stats Card Component
interface StatsCardProps {
  icon: React.ReactNode
  title: string
  value: string
  subtitle?: string
  bgColor: string
  iconBg: string
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, subtitle, bgColor, iconBg }) => (
  <div className={`${bgColor} rounded-2xl p-6 border border-white/20 shadow-lg`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
        <p className="text-white text-3xl font-bold mb-1">{value}</p>
        {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
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
          currentAmount: Math.floor(Math.random() * campaign.targetAmount * 0.8),
          donorCount: Math.floor(Math.random() * 50) + 1,
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
      const response = await fetch(`/admin/donation/softDelete/${id}`, {
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
      const response = await fetch("/admin/donation/create", {
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
      const response = await fetch(`/admin/donation/update/${id}`, {
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
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <button
            onClick={closeCampaignDetails}
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 font-medium transition-colors group"
          >
            <ChevronRight className="rotate-180 mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Campaign Dashboard
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
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
              <div className="prose prose-slate max-w-none mb-10">
                <p className="text-lg text-slate-700 leading-relaxed">{selectedCampaign.description}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 mb-10 text-white shadow-xl">
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
                  className="group bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-6 flex items-center transition-all duration-200 hover:shadow-lg"
                >
                  <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center mr-5 group-hover:bg-emerald-600 transition-colors">
                    <DollarSign size={28} className="text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      Donation History
                    </h3>
                    <p className="text-slate-600">View all donations and transaction details</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </Link>

                <Link
                  href={`/campaigns/${selectedCampaign.id}/analytics`}
                  className="group bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-6 flex items-center transition-all duration-200 hover:shadow-lg"
                >
                  <div className="h-16 w-16 rounded-2xl bg-purple-100 flex items-center justify-center mr-5 group-hover:bg-purple-600 transition-colors">
                    <PieChart size={28} className="text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                      Analytics & Insights
                    </h3>
                    <p className="text-slate-600">Track performance and donor insights</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleEditClick(selectedCampaign)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center"
                >
                  <Edit size={20} className="mr-3" /> Edit Campaign Details
                </button>
                <button
                  onClick={() => handleDeleteCampaign(selectedCampaign.id)}
                  className="bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 hover:border-red-300 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 mt-6 font-medium text-lg">Loading your campaigns...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Campaigns</h2>
          <p className="text-slate-600 mb-6">{error}</p>
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
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Campaign Management</h1>
            <p className="text-xl text-slate-600">Monitor and manage all your fundraising campaigns</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              className={`p-3 bg-white text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all duration-200 shadow-sm ${refreshAnimation ? "animate-spin" : ""}`}
              aria-label="Refresh campaigns"
              title="Refresh campaigns"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={openFormDialog}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center shadow-lg transition-all duration-200"
            >
              <Plus size={20} className="mr-2" /> Create New Campaign
            </button>
          </div>
        </div>

        {/* Enhanced Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            icon={<TrendingUp className="text-white" size={24} />}
            title="Active Campaigns"
            value={totalStats.activeCount.toString()}
            subtitle={`${campaigns.length} total campaigns`}
            bgColor="bg-gradient-to-br from-emerald-500 to-emerald-600"
            iconBg="bg-white/20"
          />
          <StatsCard
            icon={<DollarSign className="text-white" size={24} />}
            title="Total Raised"
            value={formatCurrency(totalStats.totalRaised)}
            subtitle={`${((totalStats.totalRaised / totalStats.totalGoal) * 100).toFixed(1)}% of total goal`}
            bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
            iconBg="bg-white/20"
          />
          <StatsCard
            icon={<Users className="text-white" size={24} />}
            title="Total Donors"
            value={totalStats.totalDonors.toString()}
            subtitle="Unique contributors"
            bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
            iconBg="bg-white/20"
          />
          <StatsCard
            icon={<Gift className="text-white" size={24} />}
            title="Average Donation"
            value={totalStats.totalDonors > 0 ? formatCurrency(totalStats.totalRaised / totalStats.totalDonors) : "$0"}
            subtitle="Per donor contribution"
            bgColor="bg-gradient-to-br from-indigo-500 to-indigo-600"
            iconBg="bg-white/20"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="p-8 border-b border-slate-100">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search size={20} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search campaigns by title or description..."
                  className="w-full p-4 pl-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-900 placeholder-slate-500"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium text-slate-700"
                >
                  <Filter size={20} className="text-slate-500 mr-3" />
                  Filter & Sort
                  <ChevronDown size={18} className="text-slate-500 ml-3" />
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-20">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 text-lg">Filter Campaigns</h3>
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-3">Campaign Status</label>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="ended">Ended</option>
                            <option value="pending">Pending</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-3">Campaign Category</label>
                          <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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

                      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setStatusFilter("all")
                            setCategoryFilter("all")
                            setSearchTerm("")
                          }}
                          className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
                        >
                          Clear All Filters
                        </button>
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6 text-slate-300">
                <Search size={80} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-3">No campaigns found</h3>
              <p className="text-slate-500 mb-8 max-w-lg mx-auto text-lg">
                {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                  ? "No campaigns match your current search criteria. Try adjusting your filters or search terms."
                  : "You haven't created any campaigns yet. Start your first fundraising campaign to begin making an impact."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                      setCategoryFilter("all")
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
                <button
                  onClick={openFormDialog}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-200"
                >
                  <Plus size={20} className="mr-2" /> Create Your First Campaign
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-5 px-8 text-slate-600 font-semibold text-sm uppercase tracking-wider">
                      Campaign Details
                    </th>
                    <th className="text-left py-5 px-8 text-slate-600 font-semibold text-sm uppercase tracking-wider">
                      Target Goal
                    </th>
                    <th className="text-left py-5 px-8 text-slate-600 font-semibold text-sm uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="text-left py-5 px-8 text-slate-600 font-semibold text-sm uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left py-5 px-8 text-slate-600 font-semibold text-sm uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="text-left py-5 px-8 text-slate-600 font-semibold text-sm uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-5 px-8 text-slate-600 font-semibold text-sm uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCampaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="hover:bg-slate-50 cursor-pointer transition-colors duration-150"
                      onClick={() => openCampaignDetails(campaign)}
                    >
                      <td className="py-6 px-8">
                        <div className="flex items-center">
                          <div className="h-16 w-16 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0 mr-5 shadow-sm">
                            <Image
                              src={campaign.coverImage || "/placeholder.svg?height=64&width=64"}
                              alt={campaign.title}
                              width={64}
                              height={64}
                              style={{ objectFit: "cover" }}
                              className="w-full h-full"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-slate-900 text-lg mb-1 truncate">{campaign.title}</h3>
                            <p className="text-slate-600 text-sm line-clamp-2">{campaign.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-8 font-bold text-slate-900 text-lg">
                        {formatCurrency(campaign.targetAmount)}
                      </td>
                      <td className="py-6 px-8">
                        <div className="flex items-center">
                          <div className="w-32 bg-slate-200 rounded-full h-2.5 mr-4">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                              style={{
                                width: `${calculateProgress(campaign.currentAmount || 0, campaign.targetAmount)}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-slate-700 min-w-[3rem]">
                            {calculateProgress(campaign.currentAmount || 0, campaign.targetAmount)}%
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {formatCurrency(campaign.currentAmount || 0)} raised
                        </div>
                      </td>
                      <td className="py-6 px-8 text-slate-600 font-medium">
                        {CATEGORY_LABELS[campaign.category] || campaign.category}
                      </td>
                      <td className="py-6 px-8 text-slate-600 font-medium">{formatDate(campaign.startDate)}</td>
                      <td className="py-6 px-8">
                        <span
                          className={`${STATUS_COLORS[campaign.status].bg} ${STATUS_COLORS[campaign.status].text} text-sm font-semibold px-3 py-1.5 rounded-full flex items-center w-fit`}
                        >
                          {STATUS_COLORS[campaign.status].icon}
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-6 px-8">
                        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditClick(campaign)
                            }}
                            className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                            title="Edit campaign"
                          >
                            <Edit size={18} />
                          </button>
                          {campaign.status === "active" && (
                            <Link
                              href={`/campaigns/${campaign.id}`}
                              className="p-2.5 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors"
                              title="View live campaign"
                              target="_blank"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Eye size={18} />
                            </Link>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteCampaign(campaign.id)
                            }}
                            className="p-2.5 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                            title="Delete campaign"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Campaign form dialog */}
      <FormDialog isOpen={isFormDialogOpen} onClose={closeFormDialog} isEditMode={isEditMode}>
        <CampaignCreationForm
          onSubmit={async (formData) => {
            if (isEditMode && editingCampaign) {
              await handleUpdateCampaign(editingCampaign.id, formData)
            } else {
              await handleFormSubmit(formData)
            }
          }}
          initialData={isEditMode ? (editingCampaign ?? undefined) : undefined}
          isEditMode={isEditMode}
        />
      </FormDialog>
    </div>
  )
}

export default OrganizationCampaigns
