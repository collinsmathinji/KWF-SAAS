"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, AlertCircle, CreditCard, Calendar, Users, TrendingUp, CheckCircle2 } from "lucide-react"

interface DonationInterfaceProps {
  orgId: string
  orgName: string
}

type DonationFrequency = "one-time" | "monthly" | "annual"
type DonationAmount = 5 | 10 | 25 | 50 | 100 | "custom"

export function DonationInterface({ orgId, orgName }: DonationInterfaceProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [frequency, setFrequency] = useState<DonationFrequency>("one-time")
  const [amount, setAmount] = useState<DonationAmount>(25)
  const [customAmount, setCustomAmount] = useState<string>("")

  const handleDonation = async () => {
    try {
      setLoading(true)
      setError(null)

      const finalAmount = amount === "custom" ? Number.parseFloat(customAmount) : amount

      if (!finalAmount || finalAmount < 1) {
        throw new Error("Please enter a valid donation amount")
      }

      // Create a payment intent
      const response = await fetch("/api/donations/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orgId,
          amount: finalAmount,
          frequency,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process donation")
      }

      // Redirect to the checkout page
      router.push(`/donate/checkout/${data.intentId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 items-start md:grid-cols-3">
      {/* Main Donation Form */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Make a Donation</CardTitle>
          <CardDescription>Support {orgName} with a secure donation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Label>Donation Frequency</Label>
            <Tabs defaultValue="one-time" value={frequency} onValueChange={(v) => setFrequency(v as DonationFrequency)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="one-time">One-time</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-4">
            <Label>Donation Amount</Label>
            <RadioGroup
              defaultValue="25"
              value={amount.toString()}
              onValueChange={(v) => setAmount(v === "custom" ? "custom" : (Number(v) as DonationAmount))}
              className="grid grid-cols-3 gap-4"
            >
              {[5, 10, 25, 50, 100].map((value) => (
                <Label
                  key={value}
                  className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-accent ${
                    amount === value ? "border-primary bg-primary/5" : "border-input"
                  }`}
                >
                  <RadioGroupItem value={value.toString()} className="sr-only" />${value}
                </Label>
              ))}
              <Label
                className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-accent ${
                  amount === "custom" ? "border-primary bg-primary/5" : "border-input"
                }`}
              >
                <RadioGroupItem value="custom" className="sr-only" />
                Custom
              </Label>
            </RadioGroup>

            {amount === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="custom-amount">Custom Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="custom-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleDonation} disabled={loading} className="w-full">
            {loading ? (
              "Processing..."
            ) : (
              <>
                Donate ${amount === "custom" ? customAmount || "0" : amount}
                {frequency === "monthly" && "/month"}
                {frequency === "annual" && "/year"}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Side Panel */}
      <div className="space-y-6">
        {/* Organization Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Organization Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm">2,547 donors this month</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm">$127,892 raised this year</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-sm">95% of donations go to cause</span>
            </div>
          </CardContent>
        </Card>

        {/* Security & Trust */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Secure Donation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm">Encrypted payment processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm">Cancel recurring donations anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm">Tax deductible in eligible countries</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Donors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Supporters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Anonymous</Badge>
                    <span className="text-sm">$50</span>
                  </div>
                  <span className="text-xs text-muted-foreground">2m ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Sarah K.</Badge>
                    <span className="text-sm">$100</span>
                  </div>
                  <span className="text-xs text-muted-foreground">15m ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Michael R.</Badge>
                    <span className="text-sm">$25</span>
                  </div>
                  <span className="text-xs text-muted-foreground">1h ago</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

