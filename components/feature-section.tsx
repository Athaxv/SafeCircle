import { Shield, MapPin, MessageCircle, Bell, Clock, FileText, Globe } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: Shield,
      title: "Emergency Detection & Response",
      description: "AI detects distress phrases and immediately alerts your emergency contacts with your location.",
    },
    {
      icon: MapPin,
      title: "Safe Zone Recommendations",
      description:
        "Get real-time suggestions for nearby safe locations like embassies, hospitals, and women-friendly cafes.",
    },
    {
      icon: MessageCircle,
      title: "AI Travel Companion",
      description: "Chat with your AI buddy about local culture, food recommendations, and safety concerns 24/7.",
    },
    {
      icon: Bell,
      title: "Proactive Safety Alerts",
      description: "Receive notifications about area safety scores and potential risks before you encounter them.",
    },
    {
      icon: Clock,
      title: "Regular Check-ins",
      description: "Your AI companion prompts regular check-ins and can trigger alerts if you don't respond.",
    },
    {
      icon: FileText,
      title: "Trip Summary & Safety Logs",
      description: "Get a comprehensive summary of your journey with safety logs and visited locations.",
    },
    {
      icon: Globe,
      title: "Cultural Insights",
      description: "Learn about local customs, etiquette, and women-specific cultural considerations.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              TravelGuardian combines AI technology with safety features to create a comprehensive travel companion.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-start space-y-3 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
