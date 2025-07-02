"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, Users, TrendingUp, MapPin, Camera, FileText, Settings, BarChart3, 
  RefreshCw, Plus, Eye, Clock, DollarSign, Star, Mail, MessageSquare, Globe,
  Activity, AlertCircle, CheckCircle, XCircle, TrendingDown, ArrowUpRight,
  ArrowDownRight, User, Image, Video, BookOpen, Heart, ThumbsUp
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface DashboardStats {
  // Core Business Metrics
  totalTours: number
  activeTours: number
  draftTours: number
  featuredTours: number
  
  // Booking Metrics
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  cancelledBookings: number
  totalRevenue: number
  monthlyRevenue: number
  averageBookingValue: number
  
  // Customer Metrics
  totalCustomers: number
  newCustomersThisMonth: number
  vipCustomers: number
  repeatCustomers: number
  
  // Content Metrics
  totalBlogPosts: number
  publishedBlogPosts: number
  draftBlogPosts: number
  totalBlogViews: number
  totalBlogLikes: number
  totalComments: number
  
  // Gallery Metrics
  totalGalleryImages: number
  totalGalleryVideos: number
  totalGalleryViews: number
  totalGalleryLikes: number
  
  // Communication Metrics
  contactInquiries: number
  newInquiriesToday: number
  newsletterSubscribers: number
  
  // Analytics
  totalVisitors: number
  uniqueVisitorsThisMonth: number
  mobileVisitors: number
  
  // Recent Data
  recentBookings: any[]
  recentCustomers: any[]
  recentBlogPosts: any[]
  recentInquiries: any[]
  recentVisitors: any[]
  popularTours: any[]
  topPerformingPosts: any[]
  recentActivity: any[]
}

const quickActions = [
  { name: "New Tour", href: "/admin/tours/new", icon: Plus, color: "bg-blue-500 hover:bg-blue-600" },
  { name: "View Bookings", href: "/admin/bookings", icon: Calendar, color: "bg-green-500 hover:bg-green-600" },
  { name: "Customer List", href: "/admin/customers", icon: Users, color: "bg-purple-500 hover:bg-purple-600" },
  { name: "Create Blog", href: "/admin/blog/new", icon: FileText, color: "bg-indigo-500 hover:bg-indigo-600" },
  { name: "Gallery", href: "/admin/gallery", icon: Camera, color: "bg-pink-500 hover:bg-pink-600" },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3, color: "bg-orange-500 hover:bg-orange-600" },
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

      // Get current date for monthly calculations
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      // Fetch all data in parallel
      const [
        toursResult,
        bookingsResult,
        customersResult,
        blogPostsResult,
        blogCommentsResult,
        galleryImagesResult,
        galleryVideosResult,
        contactInquiriesResult,
        newsletterSubscribersResult,
        visitorsResult,
        recentBookingsResult,
        recentCustomersResult,
        recentBlogPostsResult,
        recentInquiriesResult,
        popularToursResult,
        topBlogPostsResult,
        bookingItemsResult
      ] = await Promise.all([
        // Tours
        supabase.from('tours').select('id, status, featured, price, title, rating, review_count, created_at'),
        
        // Bookings
        supabase.from('bookings').select('id, total_amount, status, payment_status, created_at, customer_name, customer_email'),
        
        // Customers
        supabase.from('customers').select('id, customer_type, total_spent, join_date, status'),
        
        // Blog Posts
        supabase.from('blog_posts').select('id, status, views, likes, comments_count, featured, created_at, title, thumbnail'),
        
        // Blog Comments
        supabase.from('blog_comments').select('id, created_at'),
        
        // Gallery Images
        supabase.from('gallery_images').select('id, views, likes, created_at'),
        
        // Gallery Videos
        supabase.from('gallery_videos').select('id, views, likes, created_at'),
        
        // Contact Inquiries
        supabase.from('contact_inquiries').select('id, created_at, name, email, subject'),
        
        // Newsletter Subscribers
        supabase.from('newsletter_subscribers').select('id, subscribed_at, is_active'),
        
        // Visitors
        supabase.from('visitors').select('id, first_visit_at, is_mobile, total_visits'),
        
        // Recent Bookings with details
        supabase
          .from('bookings')
          .select('id, booking_reference, customer_name, total_amount, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Recent Customers
        supabase
          .from('customers')
          .select('id, name, email, customer_type, total_spent, join_date')
          .order('join_date', { ascending: false })
          .limit(5),
        
        // Recent Blog Posts
        supabase
          .from('blog_posts')
          .select('id, title, status, views, likes, created_at, thumbnail')
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Recent Contact Inquiries
        supabase
          .from('contact_inquiries')
          .select('id, name, email, subject, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Popular Tours (by booking count)
        supabase
          .from('tours')
          .select(`
            id, title, price, featured_image, rating, review_count,
            booking_items(id)
          `)
          .eq('status', 'active')
          .limit(5),
        
        // Top Performing Blog Posts
        supabase
          .from('blog_posts')
          .select('id, title, views, likes, comments_count, thumbnail')
          .eq('status', 'published')
          .order('views', { ascending: false })
          .limit(5),
        
        // Booking Items for revenue calculation
        supabase.from('booking_items').select('total_price, created_at, booking_id')
      ])

      // Calculate comprehensive stats
      const tours = toursResult.data || []
      const bookings = bookingsResult.data || []
      const customers = customersResult.data || []
      const blogPosts = blogPostsResult.data || []
      const blogComments = blogCommentsResult.data || []
      const galleryImages = galleryImagesResult.data || []
      const galleryVideos = galleryVideosResult.data || []
      const contactInquiries = contactInquiriesResult.data || []
      const newsletterSubscribers = newsletterSubscribersResult.data || []
      const visitors = visitorsResult.data || []
      const bookingItems = bookingItemsResult.data || []

      // Tour Statistics
      const totalTours = tours.length
      const activeTours = tours.filter(t => t.status === 'active').length
      const draftTours = tours.filter(t => t.status === 'draft').length
      const featuredTours = tours.filter(t => t.featured).length

      // Booking Statistics
      const totalBookings = bookings.length
      const pendingBookings = bookings.filter(b => b.status === 'pending').length
      const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
      const completedBookings = bookings.filter(b => b.status === 'completed').length
      const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length
      
      // Revenue calculations (only from confirmed AND paid bookings)
      const confirmedPaidBookings = bookings.filter(b => b.status === 'confirmed' && b.payment_status === 'paid')
      const confirmedPaidBookingIds = confirmedPaidBookings.map(b => b.id)
      
      // Get booking items only from confirmed+paid bookings
      const confirmedPaidBookingItems = bookingItems.filter(item => 
        confirmedPaidBookingIds.includes(item.booking_id)
      )
      
      const totalRevenue = confirmedPaidBookingItems.reduce((sum, item) => sum + (item.total_price || 0), 0)
      const monthlyRevenue = confirmedPaidBookingItems
        .filter(item => new Date(item.created_at) >= startOfMonth)
        .reduce((sum, item) => sum + (item.total_price || 0), 0)
      
      // Use total revenue for confirmed+paid bookings
      const totalRevenueFromBookings = confirmedPaidBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0)
      const averageBookingValue = confirmedPaidBookings.length > 0 ? totalRevenueFromBookings / confirmedPaidBookings.length : 0

      // Customer Statistics
      const totalCustomers = customers.length
      const newCustomersThisMonth = customers.filter(c => new Date(c.join_date) >= startOfMonth).length
      const vipCustomers = customers.filter(c => c.customer_type === 'vip').length
      const repeatCustomers = customers.filter(c => c.customer_type === 'repeat').length

      // Blog Statistics
      const totalBlogPosts = blogPosts.length
      const publishedBlogPosts = blogPosts.filter(p => p.status === 'published').length
      const draftBlogPosts = blogPosts.filter(p => p.status === 'draft').length
      const totalBlogViews = blogPosts.reduce((sum, post) => sum + (post.views || 0), 0)
      const totalBlogLikes = blogPosts.reduce((sum, post) => sum + (post.likes || 0), 0)
      const totalComments = blogComments.length

      // Gallery Statistics
      const totalGalleryImages = galleryImages.length
      const totalGalleryVideos = galleryVideos.length
      const totalGalleryViews = [...galleryImages, ...galleryVideos].reduce((sum, item) => sum + (item.views || 0), 0)
      const totalGalleryLikes = [...galleryImages, ...galleryVideos].reduce((sum, item) => sum + (item.likes || 0), 0)

      // Communication Statistics
      const newInquiriesToday = contactInquiries.filter(i => new Date(i.created_at) >= startOfDay).length
      const activeSubscribers = newsletterSubscribers.filter(s => s.is_active).length

      // Analytics
      const totalVisitors = visitors.length
      const uniqueVisitorsThisMonth = visitors.filter(v => new Date(v.first_visit_at) >= startOfMonth).length
      const mobileVisitors = visitors.filter(v => v.is_mobile).length

      setStats({
        totalTours,
        activeTours,
        draftTours,
        featuredTours,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
        monthlyRevenue,
        averageBookingValue,
        totalCustomers,
        newCustomersThisMonth,
        vipCustomers,
        repeatCustomers,
        totalBlogPosts,
        publishedBlogPosts,
        draftBlogPosts,
        totalBlogViews,
        totalBlogLikes,
        totalComments,
        totalGalleryImages,
        totalGalleryVideos,
        totalGalleryViews,
        totalGalleryLikes,
        contactInquiries: contactInquiries.length,
        newInquiriesToday,
        newsletterSubscribers: activeSubscribers,
        totalVisitors,
        uniqueVisitorsThisMonth,
        mobileVisitors,
        recentBookings: recentBookingsResult.data || [],
        recentCustomers: recentCustomersResult.data || [],
        recentBlogPosts: recentBlogPostsResult.data || [],
        recentInquiries: recentInquiriesResult.data || [],
        recentVisitors: [],
        popularTours: popularToursResult.data || [],
        topPerformingPosts: topBlogPostsResult.data || [],
        recentActivity: []
      })

      setLastUpdated(new Date())
    } catch (error) {
      console.error('Dashboard error:', error)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': case 'active': case 'published': return 'text-green-600 bg-green-100'
      case 'pending': case 'draft': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': case 'inactive': return 'text-red-600 bg-red-100'
      case 'completed': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'vip': return 'text-purple-600 bg-purple-100'
      case 'repeat': return 'text-blue-600 bg-blue-100'
      case 'new': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
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
              <h1 className="text-3xl font-bold text-earth-900 mb-2">Dashboard Overview</h1>
              <p className="text-earth-600">
                Complete business insights and performance metrics
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

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <Button className={`w-full h-auto p-4 flex flex-col items-center gap-2 ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{action.name}</span>
                </Button>
              </Link>
            ))}
          </div>

          {stats && (
            <>
              {/* Core Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Revenue Card */}
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalRevenue)}</p>
                        <p className="text-xs text-green-600 mt-1">
                          From confirmed + paid bookings only
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                {/* Bookings Card */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.totalBookings}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">{stats.pendingBookings} pending</Badge>
                          <Badge className="bg-green-100 text-green-800 text-xs">{stats.confirmedBookings} confirmed</Badge>
                        </div>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                {/* Customers Card */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Active Customers</p>
                        <p className="text-2xl font-bold text-purple-900">{stats.totalCustomers}</p>
                        <p className="text-xs text-purple-600 mt-1">
                          From confirmed + paid bookings
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                {/* Tours Card */}
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">Active Tours</p>
                        <p className="text-2xl font-bold text-orange-900">{stats.activeTours}</p>
                        <p className="text-xs text-orange-600 mt-1">
                          {stats.featuredTours} featured
                        </p>
                      </div>
                      <MapPin className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {/* Blog Metrics */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-8 w-8 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Blog Posts</p>
                        <p className="text-xl font-bold text-gray-900">{stats.publishedBlogPosts}</p>
                        <p className="text-xs text-gray-500">{stats.totalBlogViews.toLocaleString()} views</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Gallery Metrics */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Camera className="h-8 w-8 text-pink-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Media Files</p>
                        <p className="text-xl font-bold text-gray-900">{stats.totalGalleryImages + stats.totalGalleryVideos}</p>
                        <p className="text-xs text-gray-500">{stats.totalGalleryViews} views</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Inquiries */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Inquiries</p>
                        <p className="text-xl font-bold text-gray-900">{stats.contactInquiries}</p>
                        <p className="text-xs text-gray-500">{stats.newInquiriesToday} today</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Subscribers</p>
                        <p className="text-xl font-bold text-gray-900">{stats.newsletterSubscribers}</p>
                        <p className="text-xs text-gray-500">Active</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Visitors */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Globe className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Visitors</p>
                        <p className="text-xl font-bold text-gray-900">{stats.uniqueVisitorsThisMonth}</p>
                        <p className="text-xs text-gray-500">This month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Recent Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Recent Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.recentBookings.length ? (
                      <div className="space-y-3">
                        {stats.recentBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{booking.customer_name}</p>
                              <p className="text-xs text-gray-500">{booking.booking_reference}</p>
                              <p className="text-xs text-gray-500">{formatDate(booking.created_at)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">{formatCurrency(booking.total_amount || 0)}</p>
                              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No recent bookings</p>
                      </div>
                    )}
                    <Button asChild variant="outline" size="sm" className="w-full mt-4">
                      <Link href="/admin/bookings">View All Bookings</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Customers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      New Customers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.recentCustomers.length ? (
                      <div className="space-y-3">
                        {stats.recentCustomers.map((customer) => (
                          <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{customer.name}</p>
                                <p className="text-xs text-gray-500">{customer.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getCustomerTypeColor(customer.customer_type)}>{customer.customer_type}</Badge>
                              <p className="text-xs text-gray-500 mt-1">{formatCurrency(customer.total_spent || 0)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No new customers</p>
                      </div>
                    )}
                    <Button asChild variant="outline" size="sm" className="w-full mt-4">
                      <Link href="/admin/customers">View All Customers</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Blog Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-indigo-600" />
                      Recent Blog Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.recentBlogPosts.length ? (
                      <div className="space-y-3">
                        {stats.recentBlogPosts.map((post) => (
                          <div key={post.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-cover bg-center rounded-lg flex-shrink-0" 
                                 style={{ backgroundImage: `url(${post.thumbnail || '/placeholder.jpg'})` }}>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                                <span className="text-xs text-gray-500">{post.views} views</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No recent posts</p>
                      </div>
                    )}
                    <Button asChild variant="outline" size="sm" className="w-full mt-4">
                      <Link href="/admin/blog">View All Posts</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Inquiries */}
              {stats.recentInquiries.length > 0 && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      Recent Contact Inquiries
                      {stats.newInquiriesToday > 0 && (
                        <Badge className="bg-red-100 text-red-800 ml-2">{stats.newInquiriesToday} new today</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {stats.recentInquiries.map((inquiry) => (
                        <div key={inquiry.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm">{inquiry.name}</p>
                            <span className="text-xs text-gray-500">{formatDate(inquiry.created_at)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{inquiry.email}</p>
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{inquiry.subject}</p>
                        </div>
                      ))}
                    </div>
                    <Button asChild variant="outline" className="w-full mt-4">
                      <Link href="/admin/contact">View All Inquiries</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
