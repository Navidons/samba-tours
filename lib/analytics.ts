import { createClient } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface AnalyticsStat {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon: string
}

export interface RecentActivity {
  action: string
  details: string
  time: string
  type: 'booking' | 'blog' | 'customer' | 'system'
}

export interface BookingTrend {
  date: string
  bookings: number
  revenue: number
}

export class AnalyticsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AnalyticsError'
  }
}

export async function fetchOverallStats(days: number = 30): Promise<AnalyticsStat[]> {
  const supabase = createClient()
  
  try {
    // Total Revenue (Paid Bookings)
    const { data: revenueData, error: revenueError } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('payment_status', 'paid')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

    if (revenueError) throw new AnalyticsError(`Revenue fetch error: ${revenueError.message}`)

    // Total Bookings (Paid Bookings)
    const { count: paidBookingsCount, error: paidBookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact' })
      .eq('payment_status', 'paid')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

    if (paidBookingsError) throw new AnalyticsError(`Paid bookings count error: ${paidBookingsError.message}`)

    // Pending Payments (Booked not paid)
    const { count: pendingPaymentsCount, error: pendingPaymentsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact' })
      .eq('payment_status', 'pending')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

    if (pendingPaymentsError) throw new AnalyticsError(`Pending payments count error: ${pendingPaymentsError.message}`)

    // Estimate website visitors
    const websiteVisitors = await estimateWebsiteVisitors()

    // Calculate total revenue and compare with previous period
    const totalRevenue = revenueData?.reduce((sum, booking) => sum + parseFloat(booking.total_amount), 0) || 0
    const previousPeriodRevenue = await fetchPreviousPeriodRevenue(days)
    const revenueChange = calculatePercentageChange(previousPeriodRevenue, totalRevenue)

    // Conversion Rate calculation (using total paid bookings for conversion)
    const conversionRate = paidBookingsCount && paidBookingsCount > 0 
      ? ((paidBookingsCount / websiteVisitors) * 100).toFixed(1) 
      : '0.0'

    return [
      {
        title: "Total Revenue",
        value: formatCurrency(totalRevenue),
        change: revenueChange > 0 ? `+${revenueChange.toFixed(1)}%` : `${revenueChange.toFixed(1)}%`,
        changeType: revenueChange >= 0 ? 'positive' : 'negative',
        icon: 'DollarSign'
      },
      {
        title: "Total Paid Bookings",
        value: String(paidBookingsCount || 0),
        change: calculateBookingsTrend(days),
        changeType: 'positive',
        icon: 'Calendar'
      },
      {
        title: "Pending Payments",
        value: String(pendingPaymentsCount || 0),
        change: "",
        changeType: 'positive',
        icon: 'DollarSign'
      },
      {
        title: "Website Visitors",
        value: websiteVisitors.toString(),
        change: "+15.3%",
        changeType: 'positive',
        icon: 'Eye'
      }
    ]
  } catch (error) {
    console.error('Overall stats fetch error:', error)
    return []
  }
}

export async function fetchRecentActivity(limit: number = 5): Promise<RecentActivity[]> {
  const supabase = createClient()
  
  try {
    // Fetch bookings
    const { data: bookingActivities } = await supabase
      .from('bookings')
      .select('customer_name, created_at, booking_reference')
      .order('created_at', { ascending: false })
      .limit(limit)

    // Fetch blog posts
    const { data: blogActivities } = await supabase
      .from('blog_posts')
      .select('title, created_at, author_id')
      .order('created_at', { ascending: false })
      .limit(limit)

    // Combine and sort activities
    const combinedActivities: RecentActivity[] = [
      ...(bookingActivities || []).map(booking => ({
        action: 'New booking',
        details: `${booking.customer_name} booked (Ref: ${booking.booking_reference})`,
        time: formatTimeAgo(new Date(booking.created_at)),
        type: 'booking' as const
      })),
      ...(blogActivities || []).map(blog => ({
        action: 'Blog post published',
        details: blog.title,
        time: formatTimeAgo(new Date(blog.created_at)),
        type: 'blog' as const
      }))
    ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, limit)

    return combinedActivities
  } catch (error) {
    console.error('Recent activity fetch error:', error)
    return []
  }
}

export async function fetchBookingTrends(days: number = 30): Promise<BookingTrend[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('created_at, total_amount')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

    if (error) throw new AnalyticsError(`Booking trends fetch error: ${error.message}`)

    // Group bookings by date
    const bookingTrends = (data || []).reduce((acc, booking) => {
      const date = new Date(booking.created_at).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { bookings: 0, revenue: 0 }
      }
      acc[date].bookings += 1
      acc[date].revenue += parseFloat(booking.total_amount)
      return acc
    }, {} as Record<string, { bookings: number, revenue: number }>)

    return Object.entries(bookingTrends)
      .map(([date, { bookings, revenue }]) => ({
        date,
        bookings,
        revenue
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error('Booking trends fetch error:', error)
    return []
  }
}

// Helper function to estimate website visitors
async function estimateWebsiteVisitors(): Promise<number> {
  const supabase = createClient()
  
  try {
    // Count unique visitors in the last 30 days
    const { count, error } = await supabase
      .from('visitors')
      .select('unique_identifier', { count: 'exact' })
      .gte('first_visit_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    if (error) {
      console.error('Error fetching website visitors:', error)
      return 45231 // Fallback to hardcoded value
    }

    return count || 45231
  } catch (error) {
    console.error('Unexpected error fetching website visitors:', error)
    return 45231 // Fallback to hardcoded value
  }
}

// Helper function to calculate revenue for previous period
async function fetchPreviousPeriodRevenue(days: number): Promise<number> {
  const supabase = createClient()
  
  const { data } = await supabase
    .from('bookings')
    .select('total_amount')
    .gte('created_at', new Date(Date.now() - 2 * days * 24 * 60 * 60 * 1000).toISOString())
    .lte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

  return data?.reduce((sum, booking) => sum + parseFloat(booking.total_amount), 0) || 0
}

// Helper function to calculate percentage change
function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0
  return ((newValue - oldValue) / oldValue) * 100
}

// Helper function to calculate bookings trend
function calculateBookingsTrend(days: number): string {
  // Placeholder implementation
  // In a real scenario, this would compare current period bookings with previous period
  return "+8.2%"
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInHours = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours} hours ago`
  return `${Math.round(diffInHours / 24)} days ago`
}

export async function fetchRevenueReport(startDate?: Date, endDate?: Date) {
  const supabase = createClient()
  
  let query = supabase
    .from('bookings')
    .select(`
      id,
      total_amount,
      created_at,
      status,
      payment_status,
      booking_items (
        tour_title,
        tour_price,
        number_of_guests
      )
    `)
    .eq('status', 'confirmed')
    .eq('payment_status', 'paid')

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString())
  }

  if (endDate) {
    query = query.lte('created_at', endDate.toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching revenue report:', error)
    return null
  }

  // Calculate total revenue, bookings count, and breakdown
  const totalRevenue = data.reduce((sum, booking) => sum + parseFloat(booking.total_amount), 0)
  const bookingsCount = data.length
  const tourBreakdown = data.reduce((acc: Record<string, number>, booking) => {
    booking.booking_items.forEach(item => {
      acc[item.tour_title] = (acc[item.tour_title] || 0) + item.tour_price * item.number_of_guests
    })
    return acc
  }, {})

  return {
    totalRevenue,
    bookingsCount,
    tourBreakdown,
    bookings: data
  }
}

export async function fetchBookingsReport(startDate?: Date, endDate?: Date) {
  const supabase = createClient()
  
  let query = supabase
    .from('bookings')
    .select(`
      id,
      booking_reference,
      customer_name,
      customer_country,
      status,
      payment_status,
      created_at,
      total_amount,
      booking_items (
        tour_title,
        number_of_guests
      )
    `)

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString())
  }

  if (endDate) {
    query = query.lte('created_at', endDate.toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching bookings report:', error)
    return null
  }

  // Calculate bookings statistics
  const totalBookings = data.length
  const confirmedBookings = data.filter(b => b.status === 'confirmed').length
  const cancelledBookings = data.filter(b => b.status === 'cancelled').length
  const tourBookingBreakdown = data.reduce((acc: Record<string, number>, booking) => {
    booking.booking_items.forEach(item => {
      acc[item.tour_title] = (acc[item.tour_title] || 0) + item.number_of_guests
    })
    return acc
  }, {})

  return {
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    tourBookingBreakdown,
    bookings: data
  }
}

export async function fetchCustomerReport(startDate?: Date, endDate?: Date) {
  const supabase = createClient()
  
  let query = supabase
    .from('customers')
    .select(`
      id,
      name,
      email,
      country,
      total_bookings,
      total_spent,
      customer_type,
      join_date,
      last_booking_date
    `)

  if (startDate) {
    query = query.gte('join_date', startDate.toISOString())
  }

  if (endDate) {
    query = query.lte('join_date', endDate.toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching customer report:', error)
    return null
  }

  // Calculate customer statistics
  const totalCustomers = data.length
  const customerTypeBreakdown = data.reduce((acc: Record<string, number>, customer) => {
    acc[customer.customer_type] = (acc[customer.customer_type] || 0) + 1
    return acc
  }, {})
  const totalRevenue = data.reduce((sum, customer) => sum + parseFloat(customer.total_spent), 0)
  const averageOrderValue = totalRevenue / totalCustomers

  return {
    totalCustomers,
    customerTypeBreakdown,
    totalRevenue,
    averageOrderValue,
    customers: data
  }
}

export async function fetchToursReport(startDate?: Date, endDate?: Date) {
  const supabase = createClient()
  
  let query = supabase
    .from('tours')
    .select(`
      id,
      title,
      category_id (name),
      price,
      review_count,
      rating,
      booking_items (
        id,
        number_of_guests,
        total_price
      )
    `)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching tours report:', error)
    return null
  }

  // Calculate tour performance metrics
  const toursPerformance = data.map(tour => ({
    title: tour.title,
    category: typeof tour.category_id === 'object' && tour.category_id && 'name' in tour.category_id 
      ? tour.category_id.name 
      : 'Uncategorized',
    totalBookings: tour.booking_items.length,
    totalGuests: tour.booking_items.reduce((sum, item) => sum + item.number_of_guests, 0),
    totalRevenue: tour.booking_items.reduce((sum, item) => sum + parseFloat(item.total_price), 0),
    averageRating: tour.rating,
    reviewCount: tour.review_count
  }))

  // Sort tours by total revenue
  toursPerformance.sort((a, b) => b.totalRevenue - a.totalRevenue)

  return {
    toursPerformance
  }
}

export async function generatePDFReport(reportType: string, data: any) {
  try {
    // Placeholder for PDF generation logic
    // In a real-world scenario, you'd use a library like PDFKit or a service
    console.log(`Generating ${reportType} PDF report`, data)
    
    // Simulate PDF generation
    return {
      success: true,
      filename: `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`,
      url: '/placeholder-report-url',
      size: `${Math.round(Math.random() * 5)} MB`
    }
  } catch (error) {
    console.error('PDF Generation Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      filename: null,
      url: null
    }
  }
}

export async function fetchRecentReports() {
  // This would typically fetch from a reports table or generate dynamically
  return [
    {
      id: 1,
      name: `Revenue Report - ${new Date().toLocaleDateString()}`,
      type: 'Revenue',
      generated: new Date().toISOString(),
      size: '2.4 MB',
      format: 'PDF',
      status: 'completed'
    },
    // Add more recent reports dynamically
  ]
}

// Real-time analytics stream types
export interface LiveMetrics {
  totalVisitors: number
  activeBookings: number
  revenueToday: number
  tourPopularity: { [key: string]: number }
}

export interface RealtimeReport {
  type: 'revenue' | 'bookings' | 'visitors' | 'tours'
  data: any
  timestamp: number
}

export class AnalyticsStream {
  private supabase = createClient()
  private channels: RealtimeChannel[] = []

  // Bind the existing top-level functions to the class
  fetchRevenueReport = fetchRevenueReport
  fetchBookingsReport = fetchBookingsReport
  fetchToursReport = fetchToursReport

  // Live dashboard metrics
  async getLiveMetrics(): Promise<LiveMetrics> {
    const today = new Date().toISOString().split('T')[0]

    const [visitorsResult, bookingsResult, revenueResult, tourPopularityResult] = await Promise.all([
      this.supabase
        .from('visitors')
        .select('id', { count: 'exact' })
        .gte('first_visit_at', today),
      
      this.supabase
        .from('bookings')
        .select('id', { count: 'exact' })
        .eq('status', 'confirmed')
        .gte('created_at', today),
      
      this.supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'confirmed')
        .gte('created_at', today),
      
      this.supabase
        .from('booking_items')
        .select('tour_title, number_of_guests')
        .gte('created_at', today)
    ])

    return {
      totalVisitors: visitorsResult.count || 0,
      activeBookings: bookingsResult.count || 0,
      revenueToday: revenueResult.data?.reduce((sum, booking) => sum + parseFloat(booking.total_amount), 0) || 0,
      tourPopularity: tourPopularityResult.data?.reduce((acc: Record<string, number>, item) => {
        acc[item.tour_title] = (acc[item.tour_title] || 0) + item.number_of_guests
        return acc
      }, {}) || {}
    }
  }

  // Stream real-time reports
  streamReports(callback: (report: RealtimeReport) => void) {
    // Revenue stream
    const revenueChannel = this.supabase
      .channel('revenue-updates')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'bookings' 
        }, 
        async (payload) => {
          const revenueReport = await this.fetchRevenueReport()
          callback({
            type: 'revenue',
            data: revenueReport,
            timestamp: Date.now()
          })
        }
      )
      .subscribe()

    // Bookings stream
    const bookingsChannel = this.supabase
      .channel('bookings-updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings' 
        }, 
        async (payload) => {
          const bookingsReport = await this.fetchBookingsReport()
          callback({
            type: 'bookings',
            data: bookingsReport,
            timestamp: Date.now()
          })
        }
      )
      .subscribe()

    // Visitors stream
    const visitorsChannel = this.supabase
      .channel('visitors-updates')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'visitors' 
        }, 
        async (payload) => {
          const visitorsCount = await this.supabase
            .from('visitors')
            .select('id', { count: 'exact' })

          callback({
            type: 'visitors',
            data: { count: visitorsCount.count },
            timestamp: Date.now()
          })
        }
      )
      .subscribe()

    // Tours stream
    const toursChannel = this.supabase
      .channel('tours-updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'tours' 
        }, 
        async (payload) => {
          const toursReport = await this.fetchToursReport()
          callback({
            type: 'tours',
            data: toursReport,
            timestamp: Date.now()
          })
        }
      )
      .subscribe()

    this.channels = [
      revenueChannel, 
      bookingsChannel, 
      visitorsChannel, 
      toursChannel
    ]

    return () => {
      this.channels.forEach(channel => {
        this.supabase.removeChannel(channel)
      })
    }
  }

  // Cleanup method
  cleanup() {
    this.channels.forEach(channel => {
      this.supabase.removeChannel(channel)
    })
  }
}

// Export the existing functions along with the new class
export const analyticsStream = new AnalyticsStream() 