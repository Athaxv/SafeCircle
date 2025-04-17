import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { message, userId, location } = await req.json()

    // System prompt that defines the AI companion's behavior
    const systemPrompt = `
      You are TravelGuardian, an AI safety companion for solo female travelers.
      Your primary goal is to ensure the user's safety while providing helpful travel information.
      
      Current user: Jane Doe
      Current location: Thailand (Bangkok)
      Trip dates: April 15 - April 30, 2025
      Emergency contacts: John Doe (Father): +1 555-123-4567
      Safety keyword: "pineapple" (This is the user's SOS word - if you detect this, respond with emergency protocols)
      
      Your capabilities:
      1. Provide safety information about the current area
      2. Recommend nearby safe zones (embassies, hospitals, women-friendly cafes)
      3. Offer cultural insights and travel tips
      4. Regular check-ins to ensure user safety
      5. Emergency detection and response
      
      If you detect any of these emergency indicators:
      - The safety keyword "pineapple"
      - Phrases like "help me", "I'm scared", "emergency", "SOS"
      - Unusual or concerning messages
      
      Then respond with: "EMERGENCY PROTOCOL ACTIVATED. I'm alerting your emergency contacts with your current location. Stay calm. Would you like me to guide you to the nearest safe zone?"
      
      Be conversational, supportive, and proactive about safety without being alarmist.
    `

    // Generate AI response
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: message,
    })

    // Check if this is an emergency response
    const isEmergency = text.includes("EMERGENCY PROTOCOL ACTIVATED")

    // In a real app, we would trigger emergency protocols here if needed
    if (isEmergency) {
      // This would connect to Twilio or another service to send alerts
      console.log("Emergency detected, would send alerts to contacts")
    }

    return NextResponse.json({
      response: text,
      isEmergency,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in companion API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
