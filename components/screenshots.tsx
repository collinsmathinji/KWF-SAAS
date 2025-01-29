import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const screenshots = [
  {
    title: "Dashboard Overview",
    description: "Get a quick overview of your organization's metrics and performance.",
    image: "/image/dashboard.png",
  },
  {
    title: "Member Types Management",
    description: "Create and manage different membership tiers with custom benefits.",
    image: "/images/member-types-management.png",
  },
  {
    title: "Group Management",
    description: "Organize your members into groups and track their activities.",
    image: "/images/group-management.png",
  },
  {
    title: "Event Calendar",
    description: "Schedule and manage events with an intuitive calendar interface.",
    image: "/images/event-calendar.png",
  },
]

export function Screenshots() {
  return (
    <section id="screenshots" className="container space-y-8 py-24">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">See it in action</h2>
        <p className="mx-auto mt-4 max-w-[600px] text-gray-500 md:text-xl">
          Take a tour of our platform&apos;s powerful features and intuitive interface
        </p>
      </div>
      <Carousel className="mx-auto max-w-5xl">
        <CarouselContent>
          {screenshots.map((screenshot, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="p-6">
                  {/* <img
                    src={screenshot.image || "/placeholder.svg"}
                    alt={screenshot.title}
                    className="rounded-lg border shadow-lg"
                    width={800}
                    height={600}
                  /> */}
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold">{screenshot.title}</h3>
                    <p className="mt-2 text-gray-500">{screenshot.description}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}

