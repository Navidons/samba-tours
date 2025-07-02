import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Eye, 
  Download, 
  BarChart3, 
  Users,
  MapPin,
  Activity,
  Star,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from "lucide-react"
import { fetchOverallStats, fetchRecentActivity, analyticsStream } from "@/lib/analytics"
import { formatCurrency } from "@/lib/utils"

export const metadata = {
  title: "Analytics Dashboard - Samba Tours Admin",
  description: "Comprehensive analytics and insights dashboard.",
}

// Map icon strings to actual icon components
const iconMap = {
  'DollarSign': DollarSign,
  'Calendar': Calendar,
  'Eye': Eye,
  'TrendingDown': TrendingDown
}

export default async function Analytics() {
  const [stats, recentActivity] = await Promise.all([
    fetchOverallStats(),
    fetchRecentActivity()
  ])

  // Get live metrics for additional insights
  const liveMetrics = await analyticsStream.getLiveMetrics()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Real-time insights and performance metrics</p>
            </div>
            <div className="flex gap-3">
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
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon as keyof typeof iconMap]
              const isPositive = stat.changeType === "positive"
              const changeValue = parseFloat(stat.change.replace(/[^0-9.-]/g, '')) || 0
              
              return (
                <Card key={index} className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                      <IconComponent className={`h-4 w-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    {stat.change && (
                      <div className="flex items-center">
                        {isPositive ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">from last month</span>
                      </div>
                    )}
                  </CardContent>
                  {/* Progress indicator */}
                  <div className="absolute bottom-0 left-0 right-0">
                    <Progress 
                      value={Math.abs(changeValue) > 0 ? Math.min(Math.abs(changeValue), 100) : 25} 
                      className="h-1 rounded-none"
                    />
                  </div>
              </Card>
              )
            })}
          </div>

          {/* Tabs for different analytics views */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="tours">Tours</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Metrics */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Live Metrics
                      <Badge variant="outline" className="text-xs animate-pulse">LIVE</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-800">Today's Revenue</span>
                      <span className="text-lg font-bold text-blue-900">${liveMetrics.revenueToday.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">Active Bookings</span>
                      <span className="text-lg font-bold text-green-900">{liveMetrics.activeBookings}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-purple-800">Today's Visitors</span>
                      <span className="text-lg font-bold text-purple-900">{liveMetrics.totalVisitors}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Tours */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-orange-600" />
                      Popular Tours (Last 7 Days)
                    </CardTitle>
              </CardHeader>
              <CardContent>
                    {Object.entries(liveMetrics.tourPopularity).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(liveMetrics.tourPopularity)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 5)
                          .map(([tour, guests], index) => (
                            <div key={tour} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                  index === 1 ? 'bg-gray-100 text-gray-800' :
                                  index === 2 ? 'bg-orange-100 text-orange-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {index + 1}
                                </div>
                                <span className="text-sm font-medium truncate max-w-[200px]">{tour}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-semibold">{guests}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No tour bookings in the last 7 days</p>
                </div>
                )}
              </CardContent>
            </Card>
              </div>

              {/* Charts Section */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Advanced Charts Coming Soon</h3>
                      <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
                        Interactive charts and visualizations will be available here. 
                        For detailed analytics, use the <strong>Reports</strong> section.
                      </p>
                      <Button variant="outline" asChild>
                        <a href="/admin/reports">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Detailed Reports
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Booking Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700">Confirmed</span>
                        <Badge className="bg-green-100 text-green-800">85%</Badge>
                      </div>
                      <Progress value={85} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-yellow-700">Pending</span>
                        <Badge className="bg-yellow-100 text-yellow-800">12%</Badge>
                      </div>
                      <Progress value={12} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700">Cancelled</span>
                        <Badge className="bg-red-100 text-red-800">3%</Badge>
                      </div>
                      <Progress value={3} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Payment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700">Paid</span>
                        <Badge className="bg-green-100 text-green-800">78%</Badge>
          </div>
                      <Progress value={78} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-orange-700">Pending</span>
                        <Badge className="bg-orange-100 text-orange-800">22%</Badge>
                      </div>
                      <Progress value={22} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Booking Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm text-blue-800">This Week</span>
                        <span className="font-semibold text-blue-900">+23%</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm text-green-800">This Month</span>
                        <span className="font-semibold text-green-900">+45%</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                        <span className="text-sm text-purple-800">Peak Season</span>
                        <span className="font-semibold text-purple-900">Jun-Aug</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tours" className="space-y-6">
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Tour Analytics</h3>
                <p className="text-gray-500 mb-6">Detailed tour performance metrics will be displayed here</p>
                <Button variant="outline" asChild>
                  <a href="/admin/reports">Generate Tour Reports</a>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="customers" className="space-y-6">
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Customer Analytics</h3>
                <p className="text-gray-500 mb-6">Customer insights and demographics will be shown here</p>
                <Button variant="outline" asChild>
                  <a href="/admin/reports">Generate Customer Reports</a>
                </Button>
              </div>
            </TabsContent>
          </Tabs>

            {/* Recent Activity */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                Recent Activity
              </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-gray-50 ${
                      activity.type === 'booking' ? 'bg-blue-50 border-blue-100' : 
                      activity.type === 'blog' ? 'bg-green-50 border-green-100' : 
                      activity.type === 'customer' ? 'bg-purple-50 border-purple-100' : 
                      'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'booking' ? 'bg-blue-500' : 
                      activity.type === 'blog' ? 'bg-green-500' : 
                      activity.type === 'customer' ? 'bg-purple-500' : 
                      'bg-gray-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
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
