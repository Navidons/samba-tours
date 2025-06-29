"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, TrendingUp, MapPin, Camera, FileText, Settings, BarChart3, RefreshCw, Plus, Eye, Clock, DollarSign, Star } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface DashboardStats {
  totalTours: number
  activeTours: number
  totalBookings: number
  totalRevenue: number
  totalCustomers: number
  averageRating: number
  recentBookings: any[]
  popularTours: any[]
  recentActivity: any[]
}

const navigationItems = [
  { name: "Tours", href: "/admin/tours", icon: MapPin, description: "Manage tour packages", color: "text-blue-600" },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar, description: "View and manage bookings", color: "text-green-600" },
  { name: "Customers", href: "/admin/customers", icon: Users, description: "Customer management", color: "text-purple-600" },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3, description: "View detailed analytics", color: "text-orange-600" },
  { name: "Gallery", href: "/admin/gallery", icon: Camera, description: "Manage photo galleries", color: "text-pink-600" },
  { name: "Blog", href: "/admin/blog", icon: FileText, description: "Manage blog content", color: "text-indigo-600" },
  { name: "Settings", href: "/admin/settings", icon: Settings, description: "System settings", color: "text-gray-600" },
  { name: "Reports", href: "/admin/reports", icon: TrendingUp, description: "Generate reports", color: "text-red-600" },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      const supabase = createClient()

      // Fetch all data in parallel
      const [
        toursResult,
        bookingsResult,
        customersResult,
        recentBookingsResult,
        popularToursResult
      ] = await Promise.all([
        // Tours stats
        supabase
          .from('tours')
          .select('id, status, price')
          .order('created_at', { ascending: false }),
        
        // Bookings stats
        supabase
          .from('bookings')
          .select('id, total_amount, status, created_at')
          .order('created_at', { ascending: false })
          .limit(10),
        
        // Customers count
        supabase
          .from('profiles')
          .select('id', { count: 'exact' }),
        
        // Recent bookings with details
        supabase
          .from('bookings')
          .select(`
            id,
            total_amount,
            status,
            created_at,
            customer:profiles(full_name, email)
          `)
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Popular tours
        supabase
          .from('tours')
          .select(`
            id,
            title,
            price,
            featured_image,
            _count:booking_items(count)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(5)
      ])

      // Calculate stats
      const totalTours = toursResult.data?.length || 0
      const activeTours = toursResult.data?.filter(tour => tour.status === 'active').length || 0
      const totalBookings = bookingsResult.data?.length || 0
      const totalRevenue = bookingsResult.data?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0
      const totalCustomers = customersResult.count || 0
      const averageRating = 4.5 // Placeholder - would need reviews table

      setStats({
        totalTours,
        activeTours,
        totalBookings,
        totalRevenue,
        totalCustomers,
        averageRating,
        recentBookings: recentBookingsResult.data || [],
        popularTours: popularToursResult.data || [],
        recentActivity: [] // Would need activity log table
      })

      setLastUpdated(new Date())
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleRefresh = () => {
    fetchDashboardData()
    toast.success('Dashboard refreshed')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
            <h1 className="text-3xl font-bold text-earth-900 mb-2">Admin Dashboard</h1>
              <p className="text-earth-600">
                Welcome back! Here's what's happening with your tours.
                {lastUpdated && (
                  <span className="text-sm text-gray-500 ml-2">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {/* Quick Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 border-transparent hover:border-gray-200">
                  <CardContent className="p-4 text-center">
                    <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.color} group-hover:scale-110 transition-transform`} />
                    <h3 className="font-semibold text-sm text-earth-900">{item.name}</h3>
                    <p className="text-xs text-earth-600 mt-1">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Tours</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalTours}</p>
                      <p className="text-xs text-blue-600 mt-1">{stats.activeTours} active</p>
                    </div>
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-green-900">{stats.totalBookings}</p>
                      <p className="text-xs text-green-600 mt-1">All time</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-purple-900">{formatCurrency(stats.totalRevenue)}</p>
                      <p className="text-xs text-purple-600 mt-1">All time</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Customers</p>
                      <p className="text-2xl font-bold text-orange-900">{stats.totalCustomers}</p>
                      <p className="text-xs text-orange-600 mt-1">Registered</p>
                    </div>
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Bookings and Popular Tours */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.recentBookings.length ? (
                  <div className="space-y-4">
                    {stats.recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {booking.customer?.full_name || 'Unknown Customer'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(booking.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{formatCurrency(booking.total_amount || 0)}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent bookings</p>
                  </div>
                )}
                <div className="mt-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/admin/bookings">
                      View All Bookings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Popular Tours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Popular Tours
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.popularTours.length ? (
                  <div className="space-y-4">
                    {stats.popularTours.map((tour) => (
                      <div key={tour.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-cover bg-center rounded-lg" 
                             style={{ backgroundImage: `url(${tour.featured_image || '/placeholder.jpg'})` }}>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{tour.title}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(tour.price || 0)}</p>
                        </div>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/admin/tours/${tour.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tours available</p>
                  </div>
                )}
                <div className="mt-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/admin/tours">
                      View All Tours
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="h-auto p-4 flex flex-col items-center gap-2">
                  <Link href="/admin/tours/new">
                    <Plus className="h-6 w-6" />
                    <span>Create New Tour</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Link href="/admin/bookings">
                    <Calendar className="h-6 w-6" />
                    <span>View Bookings</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Link href="/admin/analytics">
                    <BarChart3 className="h-6 w-6" />
                    <span>View Analytics</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
