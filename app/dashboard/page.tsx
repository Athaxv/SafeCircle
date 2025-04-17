import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { TripOverview } from "@/components/trip-overview"
import { SafetyStatus } from "@/components/safety-status"
import { CompanionChat } from "@/components/companion-chat"
import { EmergencyPanel } from "@/components/emergency-panel"
import { SafeZoneMap } from "@/components/safe-zone-map"

export const metadata: Metadata = {
  title: "Dashboard - TravelGuardian",
  description: "Your travel safety dashboard",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <TripOverview />
        <SafetyStatus />
        <EmergencyPanel />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SafeZoneMap />
        <CompanionChat />
      </div>
    </DashboardLayout>
  )
}
