import { AnimatedImage } from "./ui/animated-image"
import { AnimatedSection } from "./ui/animated-section"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const screenshots = [
  {
    title: "Dashboard Overview",
    description: "Get a quick overview of your organization's metrics and performance.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  },
  {
    title: "Member Types Management",
    description: "Create and manage different membership tiers with custom benefits.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
  },
  {
    title: "Group Management",
    description: "Organize your members into groups and track their activities.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop",
  },
  {
    title: "Event Calendar",
    description: "Schedule and manage events with an intuitive calendar interface.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop",
  },
]

export function Screenshots() {
  return (
    <section id="screenshots" className="container space-y-8 py-24">
      <AnimatedSection className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">See it in action</h2>
        <p className="mx-auto mt-4 max-w-[600px] text-gray-500 md:text-xl">
          Take a tour of our platform&apos;s powerful features and intuitive interface
        </p>
      </AnimatedSection>
      <AnimatedSection>
        <Carousel className="mx-auto max-w-5xl">
          <CarouselContent>
            {screenshots.map((screenshot, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="p-6">
                    <AnimatedImage
                      src={screenshot.image}
                      alt={screenshot.title}
                      width={800}
                      height={600}
                      className="overflow-hidden rounded-lg w-full shadow-lg"
                    />
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
      </AnimatedSection>
    </section>
  )
}

