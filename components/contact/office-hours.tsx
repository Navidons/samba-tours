import { Clock, Globe, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const officeHours = [
  { day: "Monday - Friday", hours: "8:00 AM - 8:00 PM", timezone: "EAT (UTC+3)" },
  { day: "Saturday", hours: "9:00 AM - 6:00 PM", timezone: "EAT (UTC+3)" },
  { day: "Sunday", hours: "10:00 AM - 4:00 PM", timezone: "EAT (UTC+3)" },
]

const timezoneSupport = [
  { region: "East Africa", time: "Primary Hours", status: "online" },
  { region: "Europe", time: "6:00 AM - 6:00 PM", status: "online" },
  { region: "North America", time: "12:00 AM - 12:00 PM", status: "limited" },
  { region: "Asia Pacific", time: "11:00 AM - 11:00 PM", status: "online" },
]

export default function OfficeHours() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-forest-600" />
          Office Hours & Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Local Office Hours */}
        <div>
          <h4 className="font-semibold text-earth-900 mb-3">Kampala Office Hours</h4>
          <div className="space-y-2">
            {officeHours.map((schedule, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-earth-700">{schedule.day}</span>
                <div className="text-right">
                  <div className="font-medium text-earth-900">{schedule.hours}</div>
                  <div className="text-xs text-earth-500">{schedule.timezone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timezone Support */}
        <div>
          <h4 className="font-semibold text-earth-900 mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Global Support Coverage
          </h4>
          <div className="space-y-2">
            {timezoneSupport.map((zone, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <span className="text-earth-700">{zone.region}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-earth-600">{zone.time}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      zone.status === "online"
                        ? "bg-green-500"
                        : zone.status === "limited"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-4 w-4 text-red-600" />
            <span className="font-semibold text-red-900">24/7 Emergency Line</span>
          </div>
          <p className="text-sm text-red-700 mb-2">For urgent travel emergencies and assistance</p>
          <a href="tel:+256700123456" className="text-red-600 font-medium hover:underline">
            +256 700 123 456
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
