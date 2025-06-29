import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Eye, Download } from "lucide-react"
import { fetchOverallStats, fetchRecentActivity, fetchBookingTrends } from "@/lib/analytics"
import { formatCurrency } from "@/lib/utils"
import { BookingTrendChart } from "@/components/admin/analytics-charts"

export const metadata = {
  title: "Analytics Dashboard - Samba Tours Admin",
  description: "View detailed analytics and reports.",
}

// Map icon strings to actual icon components
const iconMap = {
  'DollarSign': DollarSign,
  'Calendar': Calendar,
  'Eye': Eye,
  'TrendingDown': TrendingDown
}

// Utility function to safely convert values
function safeConvert(value: any, type: 'number' | 'string' = 'number', defaultValue: any = 0) {
  if (value === undefined || value === null) return defaultValue

  try {
    if (type === 'number') {
      // Remove any non-numeric characters for currency strings
      const cleanValue = typeof value === 'string' 
        ? value.replace(/[^0-9.-]+/g, '') 
        : value
      
      const converted = Number(cleanValue)
      return isNaN(converted) ? defaultValue : converted
    }
    
    return value.toString() || defaultValue
  } catch {
    return defaultValue
  }
}

export default async function Analytics() {
  const [stats, recentActivity, bookingTrends] = await Promise.all([
    fetchOverallStats(),
    fetchRecentActivity(),
    fetchBookingTrends()
  ])

  // Prepare data for charts with robust type conversion
  const chartBookingTrends = (bookingTrends || []).map(trend => ({
    date: safeConvert(trend.date, 'string', new Date().toISOString()),
    bookings: safeConvert(trend.bookings),
    revenue: safeConvert(trend.revenue)
  }))

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
            {stats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon as keyof typeof iconMap]
              return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-earth-600">{stat.title}</CardTitle>
                    <IconComponent className="h-4 w-4 text-earth-500" />
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
                        {stat.change} {stat.change ? 'from last month' : ''}
                    </p>
                  </div>
                </CardContent>
              </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 gap-8 mb-8">
            {/* Booking Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {chartBookingTrends.length > 0 ? (
                  <BookingTrendChart data={chartBookingTrends} />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    No booking trend data available
                </div>
                )}
              </CardContent>
            </Card>

            {/* Top Tours Performance Chart */}
          </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-3 p-3 rounded-lg 
                      ${activity.type === 'booking' ? 'bg-blue-50' : 
                        activity.type === 'blog' ? 'bg-green-50' : 'bg-gray-50'}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 
                      ${activity.type === 'booking' ? 'bg-blue-600' : 
                        activity.type === 'blog' ? 'bg-green-600' : 'bg-gray-600'}`}
                    ></div>
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
    </main>
  )
}
