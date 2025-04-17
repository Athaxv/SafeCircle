import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function TestimonialSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Solo trip to Thailand",
      avatar: "SJ",
      content:
        "TravelGuardian was my constant companion during my month-long solo trip through Southeast Asia. The emergency detection feature gave me peace of mind, especially when exploring remote areas.",
    },
    {
      name: "Emily Rodriguez",
      location: "Backpacking across Europe",
      avatar: "ER",
      content:
        "The safe zone recommendations were incredibly helpful when I found myself in an uncomfortable situation in Barcelona. The AI companion guided me to a women-friendly café nearby.",
    },
    {
      name: "Michelle Wong",
      location: "Business travel to Dubai",
      avatar: "MW",
      content:
        "As a frequent business traveler, I appreciate the cultural insights and safety tips. The regular check-ins made me feel like someone was looking out for me even when traveling alone.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Traveler Stories</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from solo female travelers who have experienced the safety and support of TravelGuardian.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${testimonial.avatar}`} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
