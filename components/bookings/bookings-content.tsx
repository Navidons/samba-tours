"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Download,
  MessageCircle,
  Star,
  Search,
  Filter,
  Eye,
  CreditCard,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { getBookingsByEmail } from "@/lib/bookings"
import type { Booking } from "@/lib/bookings"
import LoadingSpinner from "@/components/ui/loading-spinner"

const bookings = [
  {
    id: "BK001",
    tour: "Gorilla Trekking Adventure",
    destination: "Bwindi Impenetrable Forest",
    date: "2024-02-15",
    endDate: "2024-02-18",
    status: "confirmed",
    guests: 2,
    amount: 2400,
    image: "/placeholder.svg?height=80&width=120",
    bookingDate: "2024-01-10",
    guide: "Samuel Mukasa",
  },
  {
    id: "BK002",
    tour: "Murchison Falls Safari",
    destination: "Murchison Falls National Park",
    date: "2024-03-20",
    endDate: "2024-03-23",
    status: "pending",
    guests: 4,
    amount: 3200,
    image: "/placeholder.svg?height=80&width=120",
    bookingDate: "2024-02-05",
    guide: "Grace Nakato",
  },
  {
    id: "BK003",
    tour: "Queen Elizabeth Wildlife Tour",
    destination: "Queen Elizabeth National Park",
    date: "2024-01-10",
    endDate: "2024-01-13",
    status: "completed",
    guests: 2,
    amount: 1800,
    image: "/placeholder.svg?height=80&width=120",
    bookingDate: "2023-12-15",
    guide: "David Ssemakula",
    rating: 5,
  },
]

export default function BookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        
        // For demo purposes, we'll use a sample email
        // In a real app, this would come from user authentication
        const sampleEmail = "john@example.com"
        
        const result = await getBookingsByEmail(supabase, sampleEmail)
        
        if (result.success && result.bookings) {
          setBookings(result.bookings)
        } else {
          setError(result.error || "Failed to load bookings")
        }
      } catch (err) {
        console.error('Error loading bookings:', err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.tour.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && booking.status === activeTab
  })

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "completed":
      return "bg-blue-100 text-blue-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
  return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-earth-900 mb-4">Error Loading Bookings</h2>
          <p className="text-earth-600 mb-8">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-earth-900 mb-4">No Bookings Found</h2>
          <p className="text-earth-600 mb-8">You haven't made any bookings yet. Start exploring our amazing tours!</p>
          <Button asChild className="btn-primary">
            <a href="/tours">Browse Tours</a>
            </Button>
          </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-earth-900">My Bookings</h1>
        <p className="text-lg text-earth-600">Manage and track your tour bookings</p>
      </div>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden">
            <CardHeader className="bg-forest-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Booking #{booking.booking_reference}</CardTitle>
                  <p className="text-sm text-earth-600 mt-1">
                    Created on {new Date(booking.created_at!).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(booking.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    ${booking.total_amount}
                  </Badge>
                              </div>
                            </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-earth-900">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-forest-600" />
                      <span className="font-medium">{booking.customer_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-forest-600" />
                      <span>{booking.customer_email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-forest-600" />
                      <span>{booking.customer_phone}</span>
                    </div>
                    {booking.customer_country && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-forest-600" />
                        <span>{booking.customer_country}</span>
                      </div>
                    )}
                          </div>

                  {booking.special_requests && (
                    <div className="mt-4">
                      <h4 className="font-medium text-earth-900 mb-2">Special Requests</h4>
                      <p className="text-sm text-earth-600 bg-gray-50 p-3 rounded-lg">
                        {booking.special_requests}
                      </p>
                    </div>
                  )}
                              </div>

                {/* Tour Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-earth-900">Tour Details</h3>
                  {booking.items && booking.items.length > 0 ? (
                    <div className="space-y-3">
                      {booking.items.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <h4 className="font-medium text-earth-900">{item.tour_title}</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm text-earth-600 mt-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(item.travel_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{item.number_of_guests} guests</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3" />
                              <span>${item.tour_price} per person</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>${item.total_price} total</span>
                            </div>
                          </div>
                        </div>
                                ))}
                              </div>
                  ) : (
                    <p className="text-sm text-earth-600">No tour details available</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-earth-900">Contact Method:</span>
                    <p className="text-earth-600 capitalize">{booking.contact_method}</p>
                  </div>
                  {booking.preferred_contact_time && (
                    <div>
                      <span className="font-medium text-earth-900">Preferred Time:</span>
                      <p className="text-earth-600">{booking.preferred_contact_time}</p>
                            </div>
                          )}
                  <div>
                    <span className="font-medium text-earth-900">Payment Status:</span>
                    <Badge variant="outline" className="ml-2 capitalize">
                      {booking.payment_status}
                    </Badge>
                  </div>
                </div>
                        </div>

                        {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                <Button variant="outline" size="sm">
                              View Details
                              </Button>
                              <Button variant="outline" size="sm">
                  Contact Support
                              </Button>
                {booking.status === 'pending' && (
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Cancel Booking
                            </Button>
                          )}
                  </div>
                </CardContent>
              </Card>
        ))}
      </div>
    </div>
  )
}
