import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, Info } from "lucide-react"

export function SafetyStatus() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Safety Status</CardTitle>
        <CardDescription>Current area safety assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="font-medium">Area Safety Score</span>
            </div>
            <span className="font-bold">85/100</span>
          </div>
          <Progress value={85} className="h-2" />

          <div className="space-y-3 mt-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Tourist-friendly area</p>
                <p className="text-xs text-muted-foreground">Current location is well-traveled by tourists</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Evening caution advised</p>
                <p className="text-xs text-muted-foreground">Take extra precautions after 10 PM</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
