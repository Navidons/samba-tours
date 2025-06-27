import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Eye, Download } from "lucide-react"

export const metadata = {
  title: "Analytics Dashboard - Samba Tours Admin",
  description: "View detailed analytics and reports.",
}

const stats = [
  {
    title: "Total Revenue",
    value: "$125,430",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Total Bookings",
    value: "1,234",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Calendar,
  },
  {
    title: "Website Visitors",
    value: "45,231",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: Eye,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "-0.5%",
    changeType: "negative" as const,
    icon: TrendingUp,
  },
]

const topTours = [
  { name: "Gorilla Trekking Adventure", bookings: 45, revenue: "$54,000" },
  { name: "Murchison Falls Safari", bookings: 32, revenue: "$25,600" },
  { name: "Queen Elizabeth Wildlife Tour", bookings: 28, revenue: "$26,600" },
  { name: "Cultural Heritage Experience", bookings: 25, revenue: "$16,250" },
  { name: "Mount Elgon Adventure", bookings: 18, revenue: "$19,800" },
]

const recentActivity = [
  { action: "New booking", details: "Sarah Johnson booked Gorilla Trekking", time: "2 hours ago" },
  { action: "Payment received", details: "$1,200 from Michael Chen", time: "4 hours ago" },
  { action: "Tour completed", details: "Emma Thompson completed Queen Elizabeth Tour", time: "6 hours ago" },
  { action: "New customer", details: "David Wilson registered", time: "8 hours ago" },
  { action: "Review posted", details: "5-star review for Murchison Falls Safari", time: "12 hours ago" },
]

export default function Analytics() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-earth-900 mb-2">Analytics Dashboard</h1>
              <p className="text-earth-600">View detailed analytics and reports</p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="30days">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-earth-600">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-earth-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-earth-900">{stat.value}</div>
                  <div className="flex items-center mt-1">
                    {stat.changeType === "positive" ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <p className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Revenue Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>

            {/* Bookings Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Bookings Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Tours */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Tours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topTours.map((tour, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-earth-900">{tour.name}</h4>
                        <p className="text-sm text-earth-600">{tour.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-forest-600">{tour.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-forest-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-earth-900">{activity.action}</p>
                        <p className="text-sm text-earth-600">{activity.details}</p>
                        <p className="text-xs text-earth-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
