import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, MapPin, MessageCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Your AI Safety Companion for Solo Travel
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                TravelGuardian provides real-time safety guidance, emergency detection, and personalized travel support
                for solo female travelers.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-1">
                  <Shield className="h-5 w-5" />
                  Start Your Safe Journey
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-1">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">24/7 Protection</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Safe Zone Mapping</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">AI Companion</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-muted sm:h-[450px] lg:h-[500px]">
              <img
                src="/placeholder.svg?height=500&width=500&text=Women+Safety"
                alt="Woman traveling safely with TravelGuardian"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
