"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Clock } from "lucide-react"

type UserData = {
  name: string
  destination?: string
  startDate?: string
  endDate?: string
  instantTrip: boolean
  currentLocation?: { lat: number; lng: number } | null
}

export function TripOverview() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [localTime, setLocalTime] = useState("")

  useEffect(() => {
    // Get user data from localStorage
    const storedData = localStorage.getItem("travelGuardianUser")
    if (storedData) {
      setUserData(JSON.parse(storedData))
    }

    // Update time every minute
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      // Set local time based on destination or current location
      // This is a simplified example - in a real app, you would use the timezone of the destination
      setLocalTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " Local Time")
    }, 60000)

    // Initial time set
    const now = new Date()
    setLocalTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " Local Time")

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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Trip Overview</CardTitle>
        <CardDescription>Your current travel details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              {userData?.instantTrip ? (
                <>
                  <p className="font-medium">Current Location</p>
                  <p className="text-sm text-muted-foreground">
                    {userData?.currentLocation
                      ? `Lat: ${userData.currentLocation.lat.toFixed(4)}, Lng: ${userData.currentLocation.lng.toFixed(4)}`
                      : "Location tracking active"}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">{userData?.destination || "Your destination"}</p>
                  <p className="text-sm text-muted-foreground">Travel location</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              {userData?.instantTrip ? (
                <>
                  <p className="font-medium">Instant Trip</p>
                  <p className="text-sm text-muted-foreground">Started {new Date().toLocaleDateString()}</p>
                </>
              ) : (
                <>
                  <p className="font-medium">
                    {formatDate(userData?.startDate)} - {formatDate(userData?.endDate)}
                  </p>
                  <p className="text-sm text-muted-foreground">{getRemainingDays(userData?.endDate)}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Local Time</p>
              <p className="text-sm text-muted-foreground">{localTime}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
