import { Calendar, Group, Users } from "lucide-react"

import { AnimatedImage } from "./ui/animated-image"
import { AnimatedSection } from "./ui/animated-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Member Management",
    description:
      "Create and manage different member types with custom benefits and pricing. Keep track of all your members in one place.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop",
  },
  {
    title: "Group Organization",
    description: "Organize your members into groups and departments. Assign leaders and track projects efficiently.",
    icon: Group,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=200&fit=crop",
  },
  {
    title: "Event Planning",
    description: "Schedule and manage events with ease. Keep your members informed and track attendance.",
    icon: Calendar,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=200&fit=crop",
  },
]

export function Features() {
  return (
    <section id="features" className="container space-y-8 py-24">
      <AnimatedSection className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Everything you need to manage your organization
        </h2>
        <p className="mx-auto mt-4 max-w-[600px] text-gray-500 md:text-xl">
          Powerful features to help you take control of your organization&apos;s operations
        </p>
      </AnimatedSection>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature, index) => (
          <AnimatedSection key={feature.title} delay={index * 0.2}>
            <Card className="h-full">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-blue-600" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatedImage
                  src={feature.image}
                  alt={`${feature.title} Screenshot`}
                  width={400}
                  height={200}
                  className="overflow-hidden rounded-lg border"
                />
              </CardContent>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}

