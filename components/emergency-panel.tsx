"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Phone, MessageSquare } from "lucide-react"

type UserData = {
  emergencyContact1Name?: string
  emergencyContact1Phone?: string
  emergencyContact1Relation?: string
  emergencyContact2Name?: string
  emergencyContact2Phone?: string
}

export function EmergencyPanel() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    // Get user data from localStorage
    const storedData = localStorage.getItem("travelGuardianUser")
    if (storedData) {
      setUserData(JSON.parse(storedData))
    }
  }, [])

  return (
    <Card className="border-red-200 dark:border-red-900">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Emergency Access
        </CardTitle>
        <CardDescription>Quick access to emergency services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button variant="destructive" className="w-full gap-2">
            <AlertCircle className="h-5 w-5" />
            Activate SOS
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="gap-2">
              <Phone className="h-4 w-4" />
              Call Help
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Text SOS
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mt-2">
            <p>Emergency contacts:</p>
            {userData?.emergencyContact1Name && (
              <p>
                • {userData.emergencyContact1Name} ({userData.emergencyContact1Relation}):{" "}
                {userData.emergencyContact1Phone}
              </p>
            )}
            {userData?.emergencyContact2Name && (
              <p>
                • {userData.emergencyContact2Name} ({userData.emergencyContact2Relation}):{" "}
                {userData.emergencyContact2Phone}
              </p>
            )}
            <p>• Local Emergency: 191</p>
            <p>• Tourist Police: 1155</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
