"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  BanknoteIcon as Bank,
  BarChart3,
  ArrowRight,
  DollarSign,
  Wallet,
  Building2,
} from "lucide-react"

export default function ConnectPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accountStatus, setAccountStatus] = useState<{
    connected: boolean
    accountId?: string
    payoutsEnabled?: boolean
    chargesEnabled?: boolean
  }>({
    connected: false,
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("code")

    if (code) {
      handleStripeCallback(code)
    } else {
      checkAccountStatus()
    }
  }, [])

  const checkAccountStatus = async () => {
    try {
      setLoading(false)
      setAccountStatus({ connected: false })
    } catch (err) {
      setError("Failed to check account status")
      setLoading(false)
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

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-6xl py-8 space-y-8">
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

                  <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                      <CardHeader className="space-y-1">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-primary" />
                          Payments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-2xl font-bold text-green-600">Active</span>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="space-y-1">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Bank className="h-4 w-4 text-primary" />
                          Payouts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-2xl font-bold text-green-600">Enabled</span>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="space-y-1">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          Account
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-2xl font-bold text-green-600">Verified</span>
                      </CardContent>
                    </Card>
                  </div>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="payouts">Payouts</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                      <div className="rounded-lg border p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Account ID</p>
                            <p className="text-sm text-muted-foreground font-mono">{accountStatus.accountId}</p>
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
                      </div>
                    </TabsContent>
                    <TabsContent value="payouts">
                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Payouts</CardTitle>
                          <CardDescription>Track your latest payouts and upcoming transfers</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center py-8 text-muted-foreground">No recent payouts</div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="settings">
                      <Card>
                        <CardHeader>
                          <CardTitle>Account Settings</CardTitle>
                          <CardDescription>Manage your payment processing settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Button variant="outline" className="w-full justify-between">
                            Update Business Information
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" className="w-full justify-between">
                            Manage Payment Methods
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" className="w-full justify-between">
                            Configure Payout Schedule
                            <ArrowRight className="h-4 w-4" />
                          </Button>
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
                      Connect your Stripe account to start accepting donations and managing your revenue in minutes
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Button onClick={handleConnect} size="lg" className="px-8">
                      Connect with Stripe
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      No Stripe account? No problem. We'll help you create one.
                    </p>
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

