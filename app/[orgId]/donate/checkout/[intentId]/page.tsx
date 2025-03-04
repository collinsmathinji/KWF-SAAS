import { Suspense } from "react"
import { notFound } from "next/navigation"
import { CheckoutForm } from "./checkout-form"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  params: {
    intentId: string
  }
}

export default function CheckoutPage({ params }: PageProps) {
  // In a real app, verify the payment intent exists and belongs to the correct organization
  if (!params.intentId) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-md py-8 space-y-8">
        <Suspense fallback={<Skeleton className="h-[400px]" />}>
          <CheckoutForm intentId={params.intentId} />
        </Suspense>
      </div>
    </div>
  )
}

