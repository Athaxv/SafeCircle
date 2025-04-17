// User types
export type User = {
  id: string
  name: string
  email: string
  profileImage?: string
  createdAt: Date
}

export type TripDetails = {
  id: string
  userId: string
  destination: string
  startDate: Date
  endDate: Date
  status: "upcoming" | "active" | "completed"
  itinerary?: ItineraryItem[]
}

export type EmergencyContact = {
  id: string
  userId: string
  name: string
  phone: string
  email?: string
  relationship: string
  isPrimary: boolean
}

export type SafetyPreferences = {
  userId: string
  safetyKeyword: string
  preferredLanguage: string
  checkInFrequency: "hourly" | "every2hours" | "every4hours" | "daily"
  medicalInfo?: string
  additionalNotes?: string
}

// Safety and location types
export type SafeZone = {
  id: string
  name: string
  type: "embassy" | "hospital" | "police" | "cafe" | "hotel" | "other"
  location: {
    lat: number
    lng: number
  }
  address: string
  phone?: string
  openHours?: string
  safetyScore: number
  verifiedBy: "Official" | "Community" | "Embassy" | "Government"
  distance?: number // Calculated field
}

export type LocationUpdate = {
  userId: string
  timestamp: Date
  location: {
    lat: number
    lng: number
  }
  accuracy?: number
}

export type SafetyAlert = {
  id: string
  userId: string
  timestamp: Date
  type: "sos" | "missed_checkin" | "area_warning" | "keyword_detected"
  status: "active" | "resolved" | "false_alarm"
  location?: {
    lat: number
    lng: number
  }
  resolvedAt?: Date
  notes?: string
}

// Trip planning types
export type ItineraryItem = {
  id: string
  tripId: string
  date: Date
  location: string
  description: string
  type: "accommodation" | "transportation" | "activity" | "other"
  safetyNotes?: string
}

export type CheckIn = {
  id: string
  userId: string
  timestamp: Date
  status: "on_time" | "late" | "missed"
  location?: {
    lat: number
    lng: number
  }
  notes?: string
}

// AI companion types
export type CompanionMessage = {
  id: string
  userId: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isEmergency?: boolean
}

export type CompanionSession = {
  id: string
  userId: string
  startedAt: Date
  endedAt?: Date
  messageCount: number
  location?: {
    lat: number
    lng: number
  }
}
