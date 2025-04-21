"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  BanknoteIcon as Bank,
  BarChart3,
  ArrowRight,
  DollarSign,
  Wallet,
  Building2,
  RefreshCcw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

// Types for our data
interface AccountBalance {
  available: number
  pending: number
  currency: string
}

interface Transaction {
  id: string
  amount: number
  status: string
  created: number
  customer: {
    name: string
    email: string
  }
  currency: string
  type: "payment" | "payout" | "refund"
}

export default function ConnectPage() {
  const [loading, setLoading] = useState(true)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accountStatus, setAccountStatus] = useState<{
    connected: boolean
    accountId?: string
    payoutsEnabled?: boolean
    chargesEnabled?: boolean
  }>({
    connected: false,
  })
  const [balance, setBalance] = useState<AccountBalance | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("code")
    const success = urlParams.get("success")
    const refresh = urlParams.get("refresh")

    if (code) {
      handleStripeCallback(code)
    } else if (success === "true") {
      // Handle successful account creation
      checkAccountStatus()
      // Clean up URL
      window.history.replaceState({}, document.title, "/dashboard/connect")
    } else if (refresh === "true") {
      // User canceled or needs to refresh the onboarding process
      // You might want to show a specific message here
      setError("Account setup was not completed. Please try again.")
      window.history.replaceState({}, document.title, "/dashboard/connect")
    } else {
      checkAccountStatus()
    }
  }, [])

  const checkAccountStatus = async () => {
    try {
      // In a real app, this would fetch from your API
      // const response = await fetch('/api/stripe/account-status')
      // const data = await response.json()

      // For demo purposes, we'll simulate a connected account
      const mockConnected = true

      if (mockConnected) {
        setAccountStatus({
          connected: true,
          accountId: "acct_1234567890",
          payoutsEnabled: true,
          chargesEnabled: true,
        })

        // If connected, fetch balance and transactions
        fetchAccountBalance()
        fetchRecentTransactions()
      } else {
        setAccountStatus({ connected: false })
      }

      setLoading(false)
    } catch (err) {
      setError("Failed to check account status")
      setLoading(false)
    }
  }

  const fetchAccountBalance = async () => {
    setBalanceLoading(true)
    try {
      // In a real app, this would fetch from your API
      // const response = await fetch('/api/stripe/balance')
      // const data = await response.json()

      // Mock data for demo
      setTimeout(() => {
        setBalance({
          available: 4250.75,
          pending: 1200.5,
          currency: "usd",
        })
        setBalanceLoading(false)
      }, 800)
    } catch (err) {
      setError("Failed to fetch account balance")
      setBalanceLoading(false)
    }
  }

  const fetchRecentTransactions = async () => {
    setTransactionsLoading(true)
    try {
      // In a real app, this would fetch from your API
      // const response = await fetch('/api/stripe/transactions')
      // const data = await response.json()

      // Mock data for demo
      setTimeout(() => {
        setRecentTransactions([
          {
            id: "ch_1234567890",
            amount: 125.0,
            status: "succeeded",
            created: Date.now() - 86400000, // 1 day ago
            customer: {
              name: "John Smith",
              email: "john@example.com",
            },
            currency: "usd",
            type: "payment",
          },
          {
            id: "ch_0987654321",
            amount: 75.5,
            status: "succeeded",
            created: Date.now() - 172800000, // 2 days ago
            customer: {
              name: "Sarah Johnson",
              email: "sarah@example.com",
            },
            currency: "usd",
            type: "payment",
          },
          {
            id: "po_1234567890",
            amount: 2500.0,
            status: "paid",
            created: Date.now() - 259200000, // 3 days ago
            customer: {
              name: "Your Bank Account",
              email: "",
            },
            currency: "usd",
            type: "payout",
          },
          {
            id: "ch_5678901234",
            amount: 200.0,
            status: "succeeded",
            created: Date.now() - 345600000, // 4 days ago
            customer: {
              name: "Michael Brown",
              email: "michael@example.com",
            },
            currency: "usd",
            type: "payment",
          },
          {
            id: "re_1234567890",
            amount: 50.0,
            status: "succeeded",
            created: Date.now() - 432000000, // 5 days ago
            customer: {
              name: "Emily Davis",
              email: "emily@example.com",
            },
            currency: "usd",
            type: "refund",
          },
        ])
        setTransactionsLoading(false)
      }, 1000)
    } catch (err) {
      setError("Failed to fetch recent transactions")
      setTransactionsLoading(false)
    }
  }

  const handleStripeCallback = async (code: string) => {
    try {
      const response = await fetch(`/api/stripe/connect?code=${code}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setAccountStatus({
        connected: true,
        accountId: data.accountId,
        payoutsEnabled: true,
        chargesEnabled: true,
      })

      // Fetch balance and transactions after successful connection
      fetchAccountBalance()
      fetchRecentTransactions()

      window.history.replaceState({}, document.title, "/dashboard/connect")
    } catch (err) {
      setError("Failed to connect Stripe account")
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = () => {
    const connectUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write`
    window.location.href = connectUrl
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(timestamp))
  }

  // Add a new function to handle creating a new Stripe account
  const handleCreateAccount = async () => {
    try {
      setLoading(true)
      // Call our API to create a new Stripe account
      const response = await fetch("/api/stripe/create-account", {
        method: "POST",
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      // Redirect to Stripe's onboarding URL
      window.location.href = data.accountLinkUrl
    } catch (err) {
      setError("Failed to create Stripe account")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container ">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Payment Settings</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect your organization with Stripe to start accepting donations and managing your revenue stream
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Main Connect Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bank className="h-6 w-6 text-primary" />
                Account Connection
              </CardTitle>
              <CardDescription>Set up your payment processing and manage your financial operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {accountStatus.connected ? (
                <div className="space-y-6">
                  <Alert className="bg-primary/10 border-primary text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Successfully Connected</AlertTitle>
                    <AlertDescription>
                      Your Stripe account is ready to process payments and receive donations
                    </AlertDescription>
                  </Alert>

                  {/* Account Balance Cards */}
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card className="bg-primary/5">
                      <CardHeader className="space-y-1 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-primary" />
                          Available Balance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {balanceLoading ? (
                          <Skeleton className="h-8 w-32" />
                        ) : (
                          <span className="text-2xl font-bold text-green-600">
                            {balance ? formatCurrency(balance.available, balance.currency) : "$0.00"}
                          </span>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0 text-xs text-muted-foreground">
                        Ready to be paid out to your bank account
                      </CardFooter>
                    </Card>

                    <Card className="bg-primary/5">
                      <CardHeader className="space-y-1 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          Pending Balance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {balanceLoading ? (
                          <Skeleton className="h-8 w-32" />
                        ) : (
                          <span className="text-2xl font-bold text-amber-600">
                            {balance ? formatCurrency(balance.pending, balance.currency) : "$0.00"}
                          </span>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0 text-xs text-muted-foreground">
                        Will be available for payout soon
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="space-y-1">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          Account Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">Account ID: {accountStatus.accountId}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="transactions">Transactions</TabsTrigger>
                      <TabsTrigger value="payouts">Payouts</TabsTrigger>
                     
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="rounded-lg border p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Account Summary</p>
                            <p className="text-sm text-muted-foreground">
                              View your account details and recent activity
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open("https://dashboard.stripe.com", "_blank")}
                          >
                            View Dashboard
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              {transactionsLoading ? (
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-full" />
                                </div>
                              ) : recentTransactions.length > 0 ? (
                                <ul className="space-y-2">
                                  {recentTransactions.slice(0, 3).map((transaction) => (
                                    <li key={transaction.id} className="flex justify-between items-center">
                                      <div className="flex items-center gap-2">
                                        {transaction.type === "payment" ? (
                                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                                        ) : transaction.type === "payout" ? (
                                          <ArrowDownRight className="h-4 w-4 text-blue-500" />
                                        ) : (
                                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                                        )}
                                        <span>
                                          {transaction.type === "payment"
                                            ? "Payment"
                                            : transaction.type === "payout"
                                              ? "Payout"
                                              : "Refund"}
                                        </span>
                                      </div>
                                      <span
                                        className={
                                          transaction.type === "payment"
                                            ? "text-green-600 font-medium"
                                            : transaction.type === "payout"
                                              ? "text-blue-600 font-medium"
                                              : "text-red-600 font-medium"
                                        }
                                      >
                                        {transaction.type === "payment" ? "+" : "-"}
                                        {formatCurrency(transaction.amount, transaction.currency)}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-muted-foreground">No recent activity</p>
                              )}
                            </CardContent>
                            <CardFooter className="pt-0">
                              <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
                                <a href="#transactions">View all transactions</a>
                              </Button>
                            </CardFooter>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full justify-between">
                                  Create Payment Link
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-between">
                                  Schedule Payout
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-between">
                                  View Reports
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="transactions" id="transactions" className="space-y-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>View your recent payments and payouts</CardDescription>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchRecentTransactions}
                            disabled={transactionsLoading}
                          >
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Refresh
                          </Button>
                        </CardHeader>
                        <CardContent>
                          {transactionsLoading ? (
                            <div className="space-y-4">
                              <Skeleton className="h-12 w-full" />
                              <Skeleton className="h-12 w-full" />
                              <Skeleton className="h-12 w-full" />
                              <Skeleton className="h-12 w-full" />
                            </div>
                          ) : recentTransactions.length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Customer</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {recentTransactions.map((transaction) => (
                                  <TableRow key={transaction.id}>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarFallback className="bg-primary/10 text-primary">
                                            {transaction.customer.name.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                          <span className="font-medium">{transaction.customer.name}</span>
                                          {transaction.customer.email && (
                                            <span className="text-xs text-muted-foreground">
                                              {transaction.customer.email}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant="outline"
                                        className={
                                          transaction.type === "payment"
                                            ? "bg-green-50 text-green-700 hover:bg-green-50"
                                            : transaction.type === "payout"
                                              ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                              : "bg-red-50 text-red-700 hover:bg-red-50"
                                        }
                                      >
                                        {transaction.type === "payment"
                                          ? "Payment"
                                          : transaction.type === "payout"
                                            ? "Payout"
                                            : "Refund"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(transaction.created)}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                        {transaction.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell
                                      className={`text-right font-medium ${
                                        transaction.type === "payment"
                                          ? "text-green-600"
                                          : transaction.type === "payout"
                                            ? "text-blue-600"
                                            : "text-red-600"
                                      }`}
                                    >
                                      {transaction.type === "payment" ? "+" : "-"}
                                      {formatCurrency(transaction.amount, transaction.currency)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">No transactions found</div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm" disabled>
                            Previous
                          </Button>
                          <Button variant="outline" size="sm" disabled>
                            Next
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>

                    <TabsContent value="payouts">
                      <Card>
                        <CardHeader>
                          <CardTitle>Payout Schedule</CardTitle>
                          <CardDescription>Manage when and how you receive your funds</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Current Schedule</p>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  <p className="text-sm">Automatic (Every 2 business days)</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Update Schedule
                              </Button>
                            </div>
                          </div>

                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Payout Method</p>
                                <div className="flex items-center gap-2">
                                  <Bank className="h-4 w-4 text-primary" />
                                  <p className="text-sm">Bank Account (••••4567)</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Manage Methods
                              </Button>
                            </div>
                          </div>

                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Manual Payout</p>
                                <p className="text-sm text-muted-foreground">
                                  Transfer your available balance to your bank account
                                </p>
                              </div>
                              <Button variant="default" size="sm" disabled={!balance || balance.available <= 0}>
                                Initiate Payout
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                  
                  </Tabs>
                </div>
              ) : (
                <div className="text-center space-y-6 py-8">
                  <div className="bg-primary/10 rounded-full p-6 w-24 h-24 mx-auto">
                    <Wallet className="w-12 h-12 text-primary mx-auto" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold">Ready to accept payments?</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Connect your Stripe account or create a new one to start accepting donations and managing your
                      revenue
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={handleConnect} size="lg" className="px-8">
                        Connect Existing Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button onClick={handleCreateAccount} size="lg" variant="outline" className="px-8">
                        Create New Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>Connect your existing Stripe account if you already have one</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>Create a new account if you're just getting started with payments</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Cards */}
          {!accountStatus.connected && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Accept Donations
                  </CardTitle>
                  <CardDescription>Start accepting donations from supporters worldwide</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Accept credit cards and bank transfers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Support multiple currencies
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Automatic receipt generation
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Financial Insights
                  </CardTitle>
                  <CardDescription>Track and analyze your organization's finances</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Real-time transaction monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Detailed financial reports
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Export data for accounting
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Missing component definition
function Clock(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

