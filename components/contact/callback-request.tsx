"use client"

import type React from "react"

import { useState } from "react"
import { Phone, Clock, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const timeSlots = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
]

export default function CallbackRequest() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Callback Scheduled!",
      description: "We'll call you at your preferred time.",
    })

    setIsLoading(false)
    e.currentTarget.reset()
  }

  return (
    <Card id="callback-request">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-forest-600" />
          Request a Callback
        </CardTitle>
        <p className="text-earth-600">Schedule a convenient time for our travel experts to call you</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Your Name *</label>
              <Input required placeholder="Full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Phone Number *</label>
              <Input required type="tel" placeholder="+256 700 123 456" />
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
                <option value="">Select time slot</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot} EAT
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">What would you like to discuss?</label>
            <Textarea placeholder="Tour planning, pricing, custom itinerary, etc." rows={3} />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full btn-primary">
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
            ) : (
              <Phone className="h-5 w-5 mr-2" />
            )}
            Schedule Callback
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
