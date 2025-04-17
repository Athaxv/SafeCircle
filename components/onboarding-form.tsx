"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Copy, Check, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    instantTrip: z.boolean().default(false),
    destination: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    emergencyContact1Name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    emergencyContact1Phone: z.string().min(5, {
      message: "Please enter a valid phone number.",
    }),
    emergencyContact1Relation: z.string().min(2, {
      message: "Please specify the relationship.",
    }),
    emergencyContact2Name: z.string().optional(),
    emergencyContact2Phone: z.string().optional(),
    emergencyContact2Relation: z.string().optional(),
    language: z.string({
      required_error: "Please select a language.",
    }),
    safetyKeyword: z.string().min(3, {
      message: "Safety keyword must be at least 3 characters.",
    }),
    additionalInfo: z.string().optional(),
  })
  .refine(
    (data) => {
      // If it's not an instant trip, require destination, start date and end date
      if (!data.instantTrip) {
        return !!data.destination && !!data.startDate && !!data.endDate
      }
      return true
    },
    {
      message: "Please provide destination and dates for planned trips",
      path: ["destination"],
    },
  )
  .refine(
    (data) => {
      // If both dates are provided, ensure end date is after start date
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate
      }
      return true
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  )

export function OnboardingForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [dashboardLink, setDashboardLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)
  const [profileCreated, setProfileCreated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Generate a unique dashboard link
  useEffect(() => {
    // In a real app, this would be a unique, secure link
    // For demo purposes, we're just using the current origin + path
    const origin = window.location.origin
    setDashboardLink(`${origin}/dashboard`)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      instantTrip: false,
      destination: "",
      emergencyContact1Name: "",
      emergencyContact1Phone: "",
      emergencyContact1Relation: "",
      emergencyContact2Name: "",
      emergencyContact2Phone: "",
      emergencyContact2Relation: "",
      language: "english",
      safetyKeyword: "",
      additionalInfo: "",
    },
  })

  const watchInstantTrip = form.watch("instantTrip")

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation services.",
        variant: "destructive",
      })
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsLocating(false)
        toast({
          title: "Location detected",
          description: "Your current location has been detected successfully.",
        })
      },
      (error) => {
        setIsLocating(false)
        toast({
          title: "Location error",
          description: "Unable to get your location. Please check your permissions.",
          variant: "destructive",
        })
      },
    )
  }

  const copyDashboardLink = () => {
    navigator.clipboard.writeText(dashboardLink)
    setLinkCopied(true)
    toast({
      title: "Link copied!",
      description: "Dashboard link copied to clipboard.",
    })

    setTimeout(() => {
      setLinkCopied(false)
    }, 3000)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store user data in localStorage for demo purposes
      // In a real app, this would be sent to a backend
      const userData = {
        ...values,
        currentLocation: values.instantTrip ? currentLocation : null,
      }
      localStorage.setItem("travelGuardianUser", JSON.stringify(userData))

      toast({
        title: "Profile created!",
        description: values.instantTrip
          ? "Your instant trip has started. Stay safe!"
          : "Your travel profile has been set up successfully.",
      })

      // Show dashboard link instead of redirecting
      setProfileCreated(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (profileCreated) {
    return (
      <div className="space-y-6">
        <Alert className="bg-accent border-primary/50">
          <AlertTitle className="text-lg font-semibold text-primary">Profile Successfully Created!</AlertTitle>
          <AlertDescription>
            Your TravelGuardian profile has been set up. You can now access your dashboard from any device using the
            link below.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Your Dashboard Link</h3>
              <p className="text-sm text-muted-foreground">
                Use this link to access your TravelGuardian dashboard from any device. For security, don't share this
                link with others.
              </p>

              <div className="flex items-center gap-2 mt-2">
                <Input value={dashboardLink} readOnly className="flex-1" />
                <Button variant="outline" size="icon" onClick={copyDashboardLink}>
                  {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button className="flex-1 gap-2" onClick={() => router.push("/dashboard")}>
                <ExternalLink className="h-4 w-4" />
                Open Dashboard Now
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setProfileCreated(false)}>
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Jane Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Trip Details</h3>

          <FormField
            control={form.control}
            name="instantTrip"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Start Instant Trip</FormLabel>
                  <FormDescription>Begin tracking your safety immediately at your current location</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {watchInstantTrip ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Current Location</h4>
                      <p className="text-sm text-muted-foreground">We'll use this to track your safety</p>
                    </div>
                    <Button type="button" variant="outline" onClick={getCurrentLocation} disabled={isLocating}>
                      <MapPin className="mr-2 h-4 w-4" />
                      {isLocating ? "Detecting..." : "Detect Location"}
                    </Button>
                  </div>

                  {currentLocation && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-accent text-accent-foreground">
                        Location detected
                      </Badge>
                      <span className="text-sm">
                        Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Country/Region</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Thailand, Europe, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Emergency Contacts</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="emergencyContact1Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContact1Phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContact1Relation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Parent, Sibling, Friend" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="emergencyContact2Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Contact Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContact2Phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContact2Relation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Parent, Sibling, Friend" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preferences</h3>

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Communication Language</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="arabic">Arabic</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safetyKeyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Safety Keyword</FormLabel>
                <FormControl>
                  <Input placeholder="A unique word or phrase to trigger emergency mode" {...field} />
                </FormControl>
                <FormDescription>
                  This is your secret SOS phrase that will trigger emergency alerts. Choose something you'll remember
                  but isn't obvious to others.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Information (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any medical conditions, allergies, or specific concerns we should know about"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || (watchInstantTrip && !currentLocation)}>
          {isLoading ? "Creating profile..." : watchInstantTrip ? "Start Instant Trip" : "Complete Setup"}
        </Button>
      </form>
    </Form>
  )
}
