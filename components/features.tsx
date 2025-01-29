import { Calendar, Group, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Member Management",
    description:
      "Create and manage different member types with custom benefits and pricing. Keep track of all your members in one place.",
    icon: Users,
  },
  {
    title: "Group Organization",
    description: "Organize your members into groups and departments. Assign leaders and track projects efficiently.",
    icon: Group,
  },
  {
    title: "Event Planning",
    description: "Schedule and manage events with ease. Keep your members informed and track attendance.",
    icon: Calendar,
  },
]

export function Features() {
  return (
    <section id="features" className="container space-y-8 py-24">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Everything you need to manage your organization
        </h2>
        <p className="mx-auto mt-4 max-w-[600px] text-gray-500 md:text-xl">
          Powerful features to help you take control of your organization&apos;s operations
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="h-10 w-10 text-blue-600" />
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="/placeholder.svg?height=200&width=400"
                alt={`${feature.title} Screenshot`}
                className="rounded-lg border"
                width={400}
                height={200}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

