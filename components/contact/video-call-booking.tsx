"use client"

import type React from "react"

import { useState } from "react"
import { Video, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const consultants = [
  {
    name: "Sarah Nakamya",
    title: "Senior Travel Consultant",
    specialties: ["Safari Tours", "Cultural Experiences"],
    image: "/placeholder.svg?height=60&width=60",
    availability: "Available Today",
  },
  {
    name: "David Okello",
    title: "Adventure Specialist",
    specialties: ["Mountain Climbing", "Adventure Tours"],
    image: "/placeholder.svg?height=60&width=60",
    availability: "Available Tomorrow",
  },
  {
    name: "Grace Atim",
    title: "Cultural Tour Expert",
    specialties: ["Cultural Tours", "Community Visits"],
    image: "/placeholder.svg?height=60&width=60",
    availability: "Available Today",
  },
]

export default function VideoCallBooking() {
  const [selectedConsultant, setSelectedConsultant] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Video Call Scheduled!",
      description: "You'll receive a meeting link via email shortly.",
    })

    setIsLoading(false)
    e.currentTarget.reset()
    setSelectedConsultant("")
  }

  return (
    <Card id="video-booking">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-forest-600" />
          Book a Video Consultation
        </CardTitle>
        <p className="text-earth-600">Free 30-minute video call with our travel experts</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Consultant Selection */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-3">Choose Your Consultant</label>
            <div className="space-y-3">
              {consultants.map((consultant, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedConsultant === consultant.name
                      ? "border-forest-500 bg-forest-50"
                      : "border-earth-200 hover:border-forest-300"
                  }`}
                  onClick={() => setSelectedConsultant(consultant.name)}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={consultant.image || "/placeholder.svg"}
                      alt={consultant.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-earth-900">{consultant.name}</h4>
                      <p className="text-sm text-earth-600">{consultant.title}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {consultant.specialties.map((specialty, idx) => (
                          <span key={idx} className="text-xs bg-forest-100 text-forest-700 px-2 py-1 rounded">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">{consultant.availability}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Your Name *</label>
              <Input required placeholder="Full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Email Address *</label>
              <Input required type="email" placeholder="your.email@example.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Preferred Date *
              </label>
              <Input required type="date" min={new Date().toISOString().split("T")[0]} />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Preferred Time *
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
              >
                <option value="">Select time</option>
                <option value="09:00">9:00 AM EAT</option>
                <option value="10:00">10:00 AM EAT</option>
                <option value="11:00">11:00 AM EAT</option>
                <option value="14:00">2:00 PM EAT</option>
                <option value="15:00">3:00 PM EAT</option>
                <option value="16:00">4:00 PM EAT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">What would you like to discuss? *</label>
            <select
              required
              className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              <option value="">Select topic</option>
              <option value="safari-planning">Safari Planning</option>
              <option value="cultural-tours">Cultural Tours</option>
              <option value="adventure-activities">Adventure Activities</option>
              <option value="custom-itinerary">Custom Itinerary</option>
              <option value="group-booking">Group Booking</option>
              <option value="travel-logistics">Travel Logistics</option>
            </select>
          </div>

          <Button type="submit" disabled={isLoading || !selectedConsultant} className="w-full btn-primary">
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
            ) : (
              <Video className="h-5 w-5 mr-2" />
            )}
            Book Free Video Call
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
