"use client"

import { useState, useEffect } from "react"
import { Trash2, Plus, Minus, Calendar, Users, MapPin, Clock, User, Mail, Phone, Globe, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import type { CartItem, BookingFormData, BookingGuest } from "@/lib/bookings"
import { useCart } from "@/components/cart/cart-context"

interface CartContentProps {
  onCheckoutSuccess?: () => void
}

export default function CartContent({ onCheckoutSuccess }: CartContentProps) {
  const { 
    cart, 
    removeFromCart, 
    updateTravelers, 
    getTotalItems, 
    getTotalTravelers,
    getTotalPrice,
    clearCart
  } = useCart()

  const [isLoading, setIsLoading] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [bookingData, setBookingData] = useState<BookingFormData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_country: "",
    special_requests: "",
    contact_method: "email",
    preferred_contact_time: "",
    guests: []
  })

  const subtotal = getTotalPrice()
  const total = subtotal // No tax for now

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!bookingData.customer_name || !bookingData.customer_email || !bookingData.customer_phone) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      // Convert cart items to the format expected by the booking API
      const cartItems = cart.map(item => ({
        tour_id: item.id,
        tour_title: item.title,
        tour_price: item.price,
        number_of_guests: item.travelers,
        travel_date: item.metadata?.travelDate || new Date().toISOString(),
        total_price: item.price * item.travelers,
        tour_image: item.image,
        tour_location: item.metadata?.location,
        tour_duration: item.metadata?.duration
      }))

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingData,
          cartItems
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Booking submitted successfully!")
        
        // --- Trigger Confirmation Email ---
        try {
            const emailResponse = await fetch('/api/email/booking-confirmation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: bookingData.customer_name,
                    customer_email: bookingData.customer_email,
                    booking_reference: result.booking.booking_reference,
                    items: cartItems,
                    total: total
                })
            });
            if (!emailResponse.ok) {
                // Log error but don't block user flow
                console.error("Failed to send confirmation email. Status:", emailResponse.status);
            }
        } catch (error) {
            console.error("Error sending confirmation email:", error);
        }
        // ------------------------------------
        
        // Save booking summary to localStorage for the confirmation page
        const bookingSummary = {
          items: cartItems,
          total: total,
          bookingReference: result.booking.booking_reference
        }
        localStorage.setItem('bookingSummary', JSON.stringify(bookingSummary));

        // Clear cart
        clearCart()
        
        // Reset form
        setBookingData({
          customer_name: "",
          customer_email: "",
          customer_phone: "",
          customer_country: "",
          special_requests: "",
          contact_method: "email",
          preferred_contact_time: "",
          guests: []
        })
        
        setShowCheckout(false)
        
        // Redirect to confirmation page if callback provided
        if (onCheckoutSuccess) {
          onCheckoutSuccess()
        } else {
          setTimeout(() => {
            window.location.href = '/'
          }, 2000)
        }
      } else {
        toast.error(result.error || "Failed to submit booking")
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      toast.error("Failed to submit booking. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-earth-900 mb-4">Your cart is empty</h2>
          <p className="text-earth-600 mb-8">Discover amazing tours and experiences to add to your cart</p>
          <Button asChild className="btn-primary">
            <Link href="/tours">Browse Tours</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-earth-900">
          {showCheckout ? "Complete Your Booking" : "Shopping Cart"}
        </h1>
        <p className="text-lg text-earth-600">
          {showCheckout 
            ? "Please provide your contact information to complete your booking"
            : "Review your selected tours and proceed to booking"
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <Card key={`${item.id}-${item.metadata?.travelDate}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={200}
                      height={150}
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-earth-900">{item.title}</h3>
                      <div className="flex items-center text-sm text-earth-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {item.metadata?.location || "Uganda"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-earth-500" />
                        {item.metadata?.duration || "Multi-day"}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-earth-500" />
                        {item.metadata?.travelDate ? new Date(item.metadata.travelDate).toLocaleDateString() : 'Not specified'}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-earth-500" />
                        {item.travelers} {item.travelers === 1 ? "Guest" : "Guests"}
                        {item.maxTravelers && (
                          <span className="ml-2 text-xs text-earth-600">
                            (Max {item.maxTravelers})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => updateTravelers(item.id, item.travelers - 1)}
                          disabled={item.travelers <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium">{item.travelers}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => updateTravelers(item.id, item.travelers + 1)}
                          disabled={item.maxTravelers ? item.travelers >= item.maxTravelers : false}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-forest-600">${item.price * item.travelers}</div>
                          <div className="text-sm text-earth-600">${item.price} per person</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart({ id: item.id, travelDate: item.metadata?.travelDate })}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary & Checkout */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-forest-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {!showCheckout ? (
              <div className="space-y-3 pt-4">
                  <Button 
                    className="w-full btn-primary" 
                    size="lg"
                    onClick={() => setShowCheckout(true)}
                  >
                  Proceed to Checkout
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/tours">Continue Shopping</Link>
                </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        value={bookingData.customer_name}
                        onChange={(e) => handleInputChange('customer_name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={bookingData.customer_email}
                        onChange={(e) => handleInputChange('customer_email', e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        value={bookingData.customer_phone}
                        onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Country
                      </label>
                      <Input
                        type="text"
                        value={bookingData.customer_country}
                        onChange={(e) => handleInputChange('customer_country', e.target.value)}
                        placeholder="Enter your country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Preferred Contact Method
                      </label>
                      <Select
                        value={bookingData.contact_method}
                        onValueChange={(value) => handleInputChange('contact_method', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Preferred Contact Time
                      </label>
                      <Input
                        type="text"
                        value={bookingData.preferred_contact_time}
                        onChange={(e) => handleInputChange('preferred_contact_time', e.target.value)}
                        placeholder="e.g., Morning, Afternoon, Evening"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Special Requests
                      </label>
                      <Textarea
                        value={bookingData.special_requests}
                        onChange={(e) => handleInputChange('special_requests', e.target.value)}
                        placeholder="Any special requirements or requests..."
                        rows={3}
                      />
                    </div>
              </div>

                  <div className="space-y-3 pt-4">
                    <Button 
                      type="submit" 
                      className="w-full btn-primary" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <>
                          <MessageSquare className="h-5 w-5 mr-2" />
                          Submit Booking
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowCheckout(false)}
                    >
                      Back to Cart
                    </Button>
              </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
