import { HeroSection } from "@/components/hero-section"
import { FeatureSection } from "@/components/feature-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { FaqSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
// import BotPress from "@/components/BotPress"

export default function Home() {
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <TestimonialSection />
        <FaqSection />
      </main>
      <Footer />
      {/* <BotPress/> */}
    </div>
  )
}
