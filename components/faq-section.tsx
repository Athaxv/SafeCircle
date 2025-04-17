import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
  const faqs = [
    {
      question: "How does the emergency detection feature work?",
      answer:
        "The AI companion monitors your chat for predefined distress phrases or your personal safety keyword. When detected, it immediately alerts your emergency contacts with your GPS location and can record audio/video if permitted.",
    },
    {
      question: "Can I use TravelGuardian without an internet connection?",
      answer:
        "TravelGuardian requires an internet connection for most features. However, we offer an offline mode with limited functionality that can store emergency information locally until connectivity is restored.",
    },
    {
      question: "Is my personal information and location data secure?",
      answer:
        "Yes, we take security seriously. All your data is encrypted, and location information is only shared with your emergency contacts during an alert. You can delete your data at any time from your account settings.",
    },
    {
      question: "How accurate are the safe zone recommendations?",
      answer:
        "Our safe zones are verified through multiple sources including official embassy data, user reports, and partnerships with women's safety organizations. We update this information regularly to ensure accuracy.",
    },
    {
      question: "Can I customize the AI companion's personality?",
      answer:
        "Yes, during onboarding you can select preferences for your AI companion including communication style, frequency of check-ins, and types of recommendations you'd like to receive.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to common questions about TravelGuardian.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl py-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
