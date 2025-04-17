"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Search, Shield, Coffee, Hospital, Building } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SafeZoneMap() {
  const [isLoaded, setIsLoaded] = useState(false)

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const safeZones = [
    { id: 1, name: "International Hospital", type: "hospital", distance: "0.8 km" },
    { id: 2, name: "Women's Café", type: "cafe", distance: "1.2 km" },
    { id: 3, name: "US Embassy", type: "embassy", distance: "2.5 km" },
    { id: 4, name: "Tourist Police Station", type: "police", distance: "1.7 km" },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "hospital":
        return <Hospital className="h-4 w-4" />
      case "cafe":
        return <Coffee className="h-4 w-4" />
      case "embassy":
        return <Building className="h-4 w-4" />
      case "police":
        return <Shield className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Safe Zones Nearby</CardTitle>
        <CardDescription>Verified safe locations around you</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative">
        <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
          <Input placeholder="Search for safe zones..." className="bg-background/90 backdrop-blur" />
          <Button size="icon" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-full w-full bg-muted relative">
          {!isLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          ) : (
            <div className="h-full w-full relative">
              <img
                src="/placeholder.svg?height=600&width=600&text=Map"
                alt="Map with safe zones"
                className="h-full w-full object-cover"
              />

              <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur rounded-lg p-4">
                <h3 className="font-medium mb-2">Nearby Safe Zones</h3>
                <div className="space-y-2">
                  {safeZones.map((zone) => (
                    <div key={zone.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getIcon(zone.type)}
                        <span>{zone.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{zone.distance}</Badge>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Navigation className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="absolute bottom-4 right-4 gap-2">
                <Navigation className="h-4 w-4" />
                Navigate to Nearest Safe Zone
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
