import type { Metadata } from "next"
import { OnboardingForm } from "@/components/onboarding-form"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Onboarding - TravelGuardian",
  description: "Set up your travel profile",
}

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container max-w-4xl py-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Travel Profile Setup</CardTitle>
            <CardDescription>Tell us about your travel plans so we can customize your safety companion</CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingForm />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
