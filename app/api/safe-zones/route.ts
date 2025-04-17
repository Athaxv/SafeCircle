import { type NextRequest, NextResponse } from "next/server"

// In a real app, this would connect to a database
const safeZones = [
  {
    id: "1",
    name: "International Hospital Bangkok",
    type: "hospital",
    location: {
      lat: 13.7563,
      lng: 100.5018,
    },
    address: "2 Soi Soonvijai 7, New Petchburi Rd, Bangkok 10310",
    phone: "+66 2 310 3000",
    openHours: "24/7",
    safetyScore: 98,
    verifiedBy: "Embassy",
  },
  {
    id: "2",
    name: "Women's Café & Co-working",
    type: "cafe",
    location: {
      lat: 13.7308,
      lng: 100.534,
    },
    address: "42 Sukhumvit Soi 31, Bangkok 10110",
    phone: "+66 2 662 3465",
    openHours: "7:00 AM - 10:00 PM",
    safetyScore: 95,
    verifiedBy: "Community",
  },
  {
    id: "3",
    name: "U.S. Embassy Bangkok",
    type: "embassy",
    location: {
      lat: 13.7376,
      lng: 100.5322,
    },
    address: "95 Wireless Road, Bangkok 10330",
    phone: "+66 2 205 4000",
    openHours: "8:00 AM - 4:30 PM (Mon-Fri)",
    safetyScore: 99,
    verifiedBy: "Official",
  },
  {
    id: "4",
    name: "Tourist Police Station",
    type: "police",
    location: {
      lat: 13.7469,
      lng: 100.5349,
    },
    address: "1155 Wireless Road, Bangkok 10330",
    phone: "1155",
    openHours: "24/7",
    safetyScore: 97,
    verifiedBy: "Government",
  },
  {
    id: "5",
    name: "Starbucks Siam Paragon",
    type: "cafe",
    location: {
      lat: 13.7466,
      lng: 100.5347,
    },
    address: "Siam Paragon Shopping Center, Bangkok 10330",
    phone: "+66 2 610 8000",
    openHours: "10:00 AM - 10:00 PM",
    safetyScore: 90,
    verifiedBy: "Community",
  },
]

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const lat = url.searchParams.get("lat")
    const lng = url.searchParams.get("lng")
    const type = url.searchParams.get("type")

    let filteredZones = [...safeZones]

    // Filter by type if provided
    if (type) {
      filteredZones = filteredZones.filter((zone) => zone.type === type)
    }

    // Sort by distance if coordinates provided
    if (lat && lng) {
      const userLat = Number.parseFloat(lat)
      const userLng = Number.parseFloat(lng)

      // Calculate distance (simplified version)
      filteredZones = filteredZones
        .map((zone) => {
          const distance =
            Math.sqrt(Math.pow(zone.location.lat - userLat, 2) + Math.pow(zone.location.lng - userLng, 2)) * 111 // Rough conversion to km

          return {
            ...zone,
            distance: Number.parseFloat(distance.toFixed(1)),
          }
        })
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    }

    return NextResponse.json({ safeZones: filteredZones })
  } catch (error) {
    console.error("Error fetching safe zones:", error)
    return NextResponse.json({ error: "Failed to fetch safe zones" }, { status: 500 })
  }
}
