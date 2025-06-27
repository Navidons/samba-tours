import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Utensils, Bed } from "lucide-react"

interface ItineraryDay {
  day: number
  title: string
  description: string
  activities: string[]
  accommodation: string
  meals: string[]
}

interface TourItineraryProps {
  itinerary: ItineraryDay[]
}

export default function TourItinerary({ itinerary }: TourItineraryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-forest-600" />
          <span>Detailed Itinerary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {itinerary.map((day, index) => (
            <div key={day.day} className="relative">
              {/* Timeline line */}
              {index < itinerary.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-forest-200 -z-10"></div>
              )}

              <div className="flex items-start space-x-4">
                {/* Day number */}
                <div className="w-12 h-12 bg-forest-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {day.day}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-earth-900 mb-2">{day.title}</h3>
                  <p className="text-earth-700 leading-relaxed mb-4">{day.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Activities */}
                    <div>
                      <h4 className="font-semibold text-earth-900 mb-2 flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-forest-600" />
                        <span>Activities</span>
                      </h4>
                      <div className="space-y-1">
                        {day.activities.map((activity, idx) => (
                          <Badge key={idx} variant="secondary" className="mr-1 mb-1 text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Accommodation */}
                    <div>
                      <h4 className="font-semibold text-earth-900 mb-2 flex items-center space-x-2">
                        <Bed className="h-4 w-4 text-forest-600" />
                        <span>Accommodation</span>
                      </h4>
                      <p className="text-sm text-earth-700">{day.accommodation}</p>
                    </div>

                    {/* Meals */}
                    <div>
                      <h4 className="font-semibold text-earth-900 mb-2 flex items-center space-x-2">
                        <Utensils className="h-4 w-4 text-forest-600" />
                        <span>Meals</span>
                      </h4>
                      <div className="space-y-1">
                        {day.meals.map((meal, idx) => (
                          <Badge key={idx} variant="outline" className="mr-1 mb-1 text-xs">
                            {meal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
