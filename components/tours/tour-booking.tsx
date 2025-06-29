"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Clock, Star, Shield, Phone, Mail, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { CartItem } from "@/lib/bookings"
import { useCart } from "@/components/cart/cart-context"

interface Tour {
  id: number
  title: string
  price: number
  originalPrice?: number
  duration: string
  groupSize: string
  rating: number
  reviewCount: number
  location?: string
  featured_image?: string
}

interface TourBookingProps {
  tour: Tour
}

export default function TourBooking({ tour }: TourBookingProps) {
  const router = useRouter()
  const { addToCart, cart } = useCart()
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState("")
  const [travelers, setTravelers] = useState(2)
  const [isLoading, setIsLoading] = useState(false)

  const totalPrice = tour.price * travelers
  const savings = tour.originalPrice ? (tour.originalPrice - tour.price) * travelers : 0

  const handleAddToCart = () => {
    if (!selectedDate) {
      toast({
        title: "Missing travel date",
        description: "Please select a travel date.",
        variant: "destructive"
      })
      return
    }

    // Prevent booking in the past
    const today = new Date()
    today.setHours(0,0,0,0)
    const selected = new Date(selectedDate)
    selected.setHours(0,0,0,0)
    if (selected < today) {
      toast({
        title: "Invalid date",
        description: "You cannot book a tour for a past date. Please select a valid future date.",
        variant: "destructive"
      })
      return
    }

    if (travelers < 1) {
      toast({
        title: "Invalid number of travelers",
        description: "Please select at least 1 traveler.",
        variant: "destructive"
      })
      return
    }

    // Check for duplicate booking before adding
    const duplicate = cart.some(item => item.id === tour.id && item.metadata?.travelDate === selectedDate)
    if (duplicate) {
      toast({
        title: "Duplicate booking",
        description: "You have already added this tour for the selected date. You can only book the same tour once per day. To change the number of travelers, update your cart.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Create cart item using the new cart context interface
      const cartItem = {
        id: tour.id,
        title: tour.title,
        price: tour.price,
        travelers: travelers,
        maxTravelers: parseInt(tour.groupSize.replace(/\D/g, ''), 10),
        image: tour.featured_image,
        metadata: {
          travelDate: selectedDate,
          location: tour.location,
          duration: tour.duration
        }
      }

      console.group('Adding to Cart')
      console.log('Cart Item:', cartItem)
      console.log('Number of Travelers:', travelers)
      console.log('Selected Date:', selectedDate)
      console.groupEnd()

      addToCart(cartItem)
      toast({
        title: "Tour added to cart!",
        description: "Redirecting to checkout...",
        variant: "success"
      })
      setTimeout(() => {
        router.push('/cart')
      }, 1000)

    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add tour to cart",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const bookNow = () => {
    if (!selectedDate) {
      toast({
        title: "Missing travel date",
        description: "Please select a travel date",
        variant: "destructive"
      })
      return
    }

    if (travelers < 1) {
      toast({
        title: "Invalid number of travelers",
        description: "Please select at least 1 traveler",
        variant: "destructive"
      })
      return
    }

    // Add to cart and proceed to checkout
    handleAddToCart()
  }

  return (
    <div className="space-y-6">
      {/* Pricing Card */}
      <Card className="border-forest-200">
        <CardHeader className="bg-forest-50">
          <CardTitle className="flex items-center justify-between">
            <span>Book This Tour</span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold">{tour.rating}</span>
              <span className="text-sm text-earth-600">({tour.reviewCount})</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Price */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-3xl font-bold text-forest-600">${tour.price}</span>
                {tour.originalPrice && (
                  <span className="text-lg text-earth-500 line-through">${tour.originalPrice}</span>
                )}
              </div>
              <p className="text-earth-600">per person</p>
              {savings > 0 && <Badge className="bg-red-100 text-red-800 mt-2">Save ${savings} total</Badge>}
            </div>

            {/* Tour Details */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-forest-600" />
                  <span className="text-sm">Duration</span>
                </div>
                <span className="text-sm font-semibold">{tour.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-forest-600" />
                  <span className="text-sm">Group Size</span>
                </div>
                <span className="text-sm font-semibold">Max {tour.groupSize}</span>
              </div>
            </div>

            {/* Booking Form */}
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Select Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Number of Travelers</label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    disabled={travelers <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">{travelers}</span>
                  <Button variant="outline" size="sm" onClick={() => setTravelers(travelers + 1)}>
                    +
                  </Button>
                </div>
              </div>

              {/* Total Price */}
              <div className="bg-forest-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-earth-700">Subtotal ({travelers} travelers)</span>
                  <span className="font-semibold">${totalPrice.toLocaleString()}</span>
                </div>
                {savings > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700">Total Savings</span>
                    <span className="font-semibold text-green-700">-${savings}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-lg font-bold border-t border-forest-200 pt-2">
                  <span>Total</span>
                  <span className="text-forest-600">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                className="w-full btn-primary" 
                size="lg" 
                disabled={!selectedDate || isLoading}
                onClick={bookNow}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                <DollarSign className="h-5 w-5 mr-2" />
                Book Now
                  </>
                )}
              </Button>

              <p className="text-xs text-earth-600 text-center">Free cancellation up to 24 hours before departure</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-forest-600" />
            <span>Need Help?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-earth-700">
              Our travel experts are here to help you plan the perfect Uganda adventure.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-forest-600" />
                <div>
                  <p className="text-sm font-semibold">Call Us</p>
                  <p className="text-sm text-earth-600">+256 700 123 456</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-forest-600" />
                <div>
                  <p className="text-sm font-semibold">Email Us</p>
                  <p className="text-sm text-earth-600">info@sambatours.com</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full" size="sm">
              Get Custom Quote
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-earth-700">Secure booking & payment</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-earth-700">4.9/5 customer rating</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Users className="h-4 w-4 text-forest-600" />
              <span className="text-earth-700">500+ happy travelers</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
