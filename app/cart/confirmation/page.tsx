"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download, Calendar, MapPin, Users, Clock, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

// Loading component
function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-9 w-32" />
          </div>
          <Separator />
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Client component that uses useSearchParams
function BookingConfirmationClient() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('id')
  const bookingReference = searchParams.get('ref')

  if (!bookingId || !bookingReference) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Invalid Booking</AlertTitle>
          <AlertDescription>
            The booking information is invalid or missing. Please check your confirmation email for the correct link.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/tours">Browse Tours</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Booking Confirmation</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Confirmed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Booking Reference</p>
              <p className="text-lg font-semibold">{bookingReference}</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Tour Details</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Departure: March 15, 2024</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Duration: 7 Days</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Starting Point: Entebbe International Airport</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Group Size: 2 Adults</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tour Package (2 Adults)</span>
                  <span>$3,600</span>
                </div>
                <div className="flex justify-between">
                  <span>Additional Activities</span>
                  <span>$400</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Fees</span>
                  <span>$200</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total Paid</span>
                  <span>$4,200</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Next Steps</h3>
            <ScrollArea className="h-[100px]">
              <ol className="space-y-2 text-sm">
                <li className="flex items-start">
                  <ChevronRight className="mr-2 h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  Check your email for a detailed itinerary and important travel information.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="mr-2 h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  Review your travel requirements, including visas and vaccinations.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="mr-2 h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  Pack according to our suggested packing list (included in your email).
                </li>
              </ol>
            </ScrollArea>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/account/bookings">View All Bookings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main page component with Suspense boundary
export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <BookingConfirmationClient />
    </Suspense>
  )
} 
