"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Mic, MapPin, AlertCircle, Info, Volume2, VolumeX } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

type UserData = {
  name: string
  destination?: string
  instantTrip: boolean
  currentLocation?: { lat: number; lng: number } | null
}

export function CompanionChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Speech recognition setup
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Get user data from localStorage
    const storedData = localStorage.getItem("travelGuardianUser")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setUserData(parsedData)

      // Initialize with welcome message based on user data
      const location = parsedData.instantTrip ? "your current location" : parsedData.destination || "your trip"
      const welcomeMessage: Message = {
        id: "1",
        content: `Hello ${parsedData.name || "there"}! I'm your AI travel companion. How can I assist you with ${location} today?`,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    } else {
      // Fallback welcome message
      const welcomeMessage: Message = {
        id: "1",
        content: "Hello! I'm your AI travel companion. How can I assist you with your trip today?",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }

    // Initialize speech recognition if available
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = false

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript
        setInput(transcript)
        // Auto-send after voice input
        setTimeout(() => {
          handleSendMessage(transcript)
          setIsListening(false)
        }, 500)
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
        toast({
          title: "Voice recognition error",
          description: "There was a problem with voice recognition. Please try again.",
          variant: "destructive",
        })
      }
    }

    // Initialize speech synthesis
    speechSynthesisRef.current = new SpeechSynthesisUtterance()

    return () => {
      // Cleanup
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [toast])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await generateGeminiResponse(messageText)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // If voice mode is on, read the response
      if (isVoiceMode && !isSpeaking) {
        speakText(response)
      }
    } catch (error) {
      console.error("Error generating response:", error)
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateGeminiResponse = async (userInput: string): Promise<string> => {
    try {
      // Create context for the AI based on user data
      const location = userData?.instantTrip ? "your current location" : userData?.destination || "your trip"

      const userContext = `
        User name: ${userData?.name || "Traveler"}
        Location: ${location}
        Trip type: ${userData?.instantTrip ? "Instant trip (current location)" : "Planned trip"}
      `

      // Call the Gemini API through our backend
      const response = await fetch("/api/companion/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
          userContext,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from Gemini API")
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      return "I'm having trouble connecting to my knowledge base right now. Can you please try again in a moment?"
    }
  }

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode)
    toast({
      title: !isVoiceMode ? "Voice mode activated" : "Voice mode deactivated",
      description: !isVoiceMode
        ? "I'll speak my responses and listen for your voice commands."
        : "Returning to text-only mode.",
    })
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice recognition not supported",
        description: "Your browser doesn't support voice recognition. Please type your message instead.",
        variant: "destructive",
      })
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        toast({
          title: "Listening...",
          description: "Speak now. I'll send your message when you pause.",
        })
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        toast({
          title: "Error",
          description: "Couldn't start voice recognition. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const speakText = (text: string) => {
    if (!speechSynthesisRef.current || !window.speechSynthesis) {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive",
      })
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    // Set up new speech
    speechSynthesisRef.current.text = text
    speechSynthesisRef.current.rate = 1.0
    speechSynthesisRef.current.pitch = 1.0

    // Use a female voice if available
    const voices = window.speechSynthesis.getVoices()
    const femaleVoice = voices.find(
      (voice) => voice.name.includes("female") || voice.name.includes("woman") || voice.name.includes("girl"),
    )

    if (femaleVoice) {
      speechSynthesisRef.current.voice = femaleVoice
    }

    // Events to track speaking state
    speechSynthesisRef.current.onstart = () => setIsSpeaking(true)
    speechSynthesisRef.current.onend = () => setIsSpeaking(false)
    speechSynthesisRef.current.onerror = () => {
      setIsSpeaking(false)
      toast({
        title: "Speech error",
        description: "There was a problem with text-to-speech. Please try again.",
        variant: "destructive",
      })
    }

    window.speechSynthesis.speak(speechSynthesisRef.current)
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>AI Companion</CardTitle>
            <CardDescription>Your personal travel assistant</CardDescription>
          </div>
          <Button variant={isVoiceMode ? "default" : "outline"} size="sm" className="gap-2" onClick={toggleVoiceMode}>
            {isVoiceMode ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {isVoiceMode ? "Voice On" : "Voice Off"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[450px] p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  {message.role === "assistant" && (
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40&text=AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <Avatar>
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40&text=${userData?.name?.charAt(0) || "U"}`}
                      />
                      <AvatarFallback>{userData?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40&text=AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce delay-75"></div>
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isListening && (
              <div className="flex justify-end">
                <div className="flex gap-3 max-w-[80%] flex-row-reverse">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${userData?.name?.charAt(0) || "U"}`} />
                    <AvatarFallback>{userData?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-primary text-primary-foreground">
                    <div className="flex space-x-2 items-center">
                      <Mic className="h-4 w-4 animate-pulse" />
                      <span className="text-sm">Listening...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center w-full gap-2">
          <Button
            variant={isListening ? "default" : "outline"}
            size="icon"
            onClick={toggleListening}
            disabled={isLoading}
            className={isListening ? "bg-primary animate-pulse" : ""}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading || isListening}
          />
          <Button size="icon" onClick={() => handleSendMessage()} disabled={isLoading || isListening || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="w-full flex justify-between mt-2">
          <Button variant="ghost" size="sm" className="text-xs gap-1">
            <MapPin className="h-3 w-3" /> Share Location
          </Button>
          <Button variant="ghost" size="sm" className="text-xs gap-1">
            <Info className="h-3 w-3" /> Safety Tips
          </Button>
          <Button variant="ghost" size="sm" className="text-xs gap-1 text-red-500">
            <AlertCircle className="h-3 w-3" /> SOS
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
