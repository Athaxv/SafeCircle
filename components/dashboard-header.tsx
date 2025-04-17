"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, Clock } from "lucide-react"

type UserData = {
  name: string
  destination?: string
  startDate?: string
  endDate?: string
  instantTrip: boolean
  currentLocation?: { lat: number; lng: number } | null
}

export function DashboardHeader() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Get user data from localStorage
    const storedData = localStorage.getItem("travelGuardianUser")
    if (storedData) {
      setUserData(JSON.parse(storedData))
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  const getRemainingDays = (endDateString?: string) => {
    if (!endDateString) return ""
    const endDate = new Date(endDateString)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? `${diffDays} days remaining` : "Trip ended"
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {userData?.name || "Traveler"}</h1>
        {userData?.instantTrip ? (
          <p className="text-muted-foreground">Instant trip active • Started {new Date().toLocaleDateString()}</p>
        ) : (
          <p className="text-muted-foreground">
            Your trip to {userData?.destination || "your destination"} • {formatDate(userData?.startDate)} -{" "}
            {formatDate(userData?.endDate)}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="gap-1 py-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
          <span>Safe status</span>
        </Badge>
        <Badge variant="outline" className="gap-1 py-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </Badge>
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button>Check In</Button>
      </div>
    </div>
  )
}
