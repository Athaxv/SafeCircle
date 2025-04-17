import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { message, userContext, history } = await req.json()

    // System prompt that defines the AI companion's behavior
    const systemPrompt = `
      You are TravelGuardian, an AI safety companion for solo female travelers.
      Your primary goal is to ensure the user's safety while providing helpful travel information.
      
      ${userContext}
      
      Your capabilities:
      1. Provide safety information about the current area
      2. Recommend nearby safe zones (embassies, hospitals, women-friendly cafes)
      3. Offer cultural insights and travel tips specific to the user's location
      4. Regular check-ins to ensure user safety
      5. Emergency detection and response
      6. Suggest local attractions, restaurants, and activities that are safe for solo female travelers
      7. Provide transportation advice and safety tips for getting around
      
      Be conversational, supportive, and proactive about safety without being alarmist.
      Be friendly and personable - you're a travel companion, not just a safety tool.
      Tailor your responses to women's safety concerns specifically.
      
      If you detect any of these emergency indicators:
      - Phrases like "help me", "I'm scared", "emergency", "SOS"
      - Unusual or concerning messages
      
      Then respond with: "EMERGENCY PROTOCOL ACTIVATED. I'm alerting your emergency contacts with your current location. Stay calm. Would you like me to guide you to the nearest safe zone?"
    `

    // Call Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY || "",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt }],
          },
          ...history.map((msg: any) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
          })),
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()

    // Extract the response text
    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm having trouble connecting to my knowledge base. Can you please try again?"

    // Check if this is an emergency response
    const isEmergency = responseText.includes("EMERGENCY PROTOCOL ACTIVATED")

    // In a real app, we would trigger emergency protocols here if needed
    if (isEmergency) {
      // This would connect to Twilio or another service to send alerts
      console.log("Emergency detected, would send alerts to contacts")
    }

    return NextResponse.json({
      response: responseText,
      isEmergency,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in companion chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
