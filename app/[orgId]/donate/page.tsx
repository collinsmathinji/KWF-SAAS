import { notFound } from "next/navigation"
import { DonationInterface } from "./donation-interface"
import { getOrgDetails } from "@/lib/organizations"

interface PageProps {
  params: {
    orgId: string
  }
}

export default async function OrganizationDonatePage({ params }: PageProps) {
  const org = await getOrgDetails(params.orgId)

  if (!org) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-6xl py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{org.name}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{org.description}</p>
        </div>
        <DonationInterface orgId={params.orgId} orgName={org.name} />
      </div>
    </div>
  )
}

