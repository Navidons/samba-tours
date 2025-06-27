"use client"

import { useState } from "react"
import { MapPin, Navigation, Phone, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const locations = [
  {
    id: 1,
    name: "Kampala Headquarters",
    address: "Plot 123, Kampala Road, Kampala, Uganda",
    phone: "+256 700 123 456",
    hours: "Mon-Fri: 8AM-8PM, Sat: 9AM-6PM, Sun: 10AM-4PM",
    coordinates: { lat: 0.3476, lng: 32.5825 },
    services: ["Tour Planning", "Bookings", "Customer Support"],
    isMain: true,
  },
  {
    id: 2,
    name: "Entebbe Airport Office",
    address: "Airport Road, Entebbe International Airport, Uganda",
    phone: "+256 700 123 457",
    hours: "Daily: 6AM-10PM",
    coordinates: { lat: 0.0464, lng: 32.4435 },
    services: ["Airport Transfers", "Last-minute Bookings"],
    isMain: false,
  },
  {
    id: 3,
    name: "Jinja Adventure Base",
    address: "Nile Avenue, Jinja, Uganda",
    phone: "+256 700 123 458",
    hours: "Daily: 7AM-7PM",
    coordinates: { lat: 0.4312, lng: 33.2041 },
    services: ["Adventure Tours", "White Water Rafting"],
    isMain: false,
  },
]

export default function ContactMap() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0])

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-earth-900 mb-4">Visit Our Offices</h2>
        <p className="text-lg text-earth-600 max-w-2xl mx-auto">
          We have multiple locations across Uganda to serve you better
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Location List */}
        <div className="space-y-4">
          {locations.map((location) => (
            <Card
              key={location.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedLocation.id === location.id ? "ring-2 ring-forest-500 bg-forest-50" : "hover:shadow-lg"
              }`}
              onClick={() => setSelectedLocation(location)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      location.isMain ? "bg-forest-600" : "bg-earth-600"
                    }`}
                  >
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-earth-900 mb-1">
                      {location.name}
                      {location.isMain && (
                        <span className="ml-2 text-xs bg-forest-100 text-forest-700 px-2 py-1 rounded">
                          Main Office
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-earth-600 mb-2">{location.address}</p>
                    <div className="flex items-center gap-1 text-sm text-earth-600 mb-2">
                      <Phone className="h-3 w-3" />
                      {location.phone}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-earth-600 mb-3">
                      <Clock className="h-3 w-3" />
                      {location.hours}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {location.services.map((service, index) => (
                        <span key={index} className="text-xs bg-earth-100 text-earth-700 px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map and Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedLocation.name}</span>
                <Button asChild size="sm" variant="outline">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.coordinates.lat},${selectedLocation.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Get Directions
                  </a>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Interactive Map Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-forest-100 to-earth-100 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=600')] bg-cover bg-center opacity-20" />
                <div className="relative z-10 text-center">
                  <MapPin className="h-12 w-12 text-forest-600 mx-auto mb-2" />
                  <p className="text-earth-700 font-medium">Interactive Map</p>
                  <p className="text-sm text-earth-600">Click "Get Directions" for navigation</p>
                </div>

                {/* Map Markers */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                </div>
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-earth-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-earth-600" />
                      <span className="text-sm text-earth-700">{selectedLocation.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-earth-600" />
                      <a href={`tel:${selectedLocation.phone}`} className="text-sm text-forest-600 hover:underline">
                        {selectedLocation.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-earth-600" />
                      <span className="text-sm text-earth-700">{selectedLocation.hours}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-earth-900 mb-3">Services Available</h4>
                  <div className="space-y-2">
                    {selectedLocation.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-forest-500 rounded-full" />
                        <span className="text-sm text-earth-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-earth-200">
                <Button asChild className="flex-1">
                  <a href={`tel:${selectedLocation.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call This Office
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.coordinates.lat},${selectedLocation.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
