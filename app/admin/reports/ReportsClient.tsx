"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfDay, endOfDay } from "date-fns"
import {
  Download,
  CalendarIcon,
  FileText,
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  BarChart3,
  RefreshCw,
  FileSpreadsheet,
  Filter,
  Search,
  Calendar,
  Eye,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import {
  fetchRevenueReport,
  fetchBookingsReport,
  fetchCustomerReport,
  fetchToursReport
} from "@/lib/analytics"
import { toast } from "sonner"

// Filter options
const datePresets = [
  { id: "today", label: "Today", getValue: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
  { id: "last7days", label: "Last 7 Days", getValue: () => ({ from: startOfDay(subDays(new Date(), 6)), to: endOfDay(new Date()) }) },
  { id: "last30days", label: "Last 30 Days", getValue: () => ({ from: startOfDay(subDays(new Date(), 29)), to: endOfDay(new Date()) }) },
  { id: "thisMonth", label: "This Month", getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { id: "lastMonth", label: "Last Month", getValue: () => {
    const lastMonth = subDays(startOfMonth(new Date()), 1)
    return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
  }},
  { id: "thisYear", label: "This Year", getValue: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) }
]

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
  { value: "paid", label: "Paid Only" }
]

const customerTypeOptions = [
  { value: "all", label: "All Types" },
  { value: "regular", label: "Regular" },
  { value: "vip", label: "VIP" },
  { value: "repeat", label: "Repeat" },
  { value: "new", label: "New" }
]

const tourStatusOptions = [
  { value: "all", label: "All Tours" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "inactive", label: "Inactive" }
]

export default function ReportsClient() {
  // State for filters
  const [dateRange, setDateRange] = useState<{from?: Date, to?: Date}>({
    from: startOfDay(subDays(new Date(), 29)),
    to: endOfDay(new Date())
  })
  const [statusFilter, setStatusFilter] = useState("all")
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all")
  const [tourStatusFilter, setTourStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  
  // State for data
  const [revenueData, setRevenueData] = useState<any>(null)
  const [bookingsData, setBookingsData] = useState<any>(null)
  const [customersData, setCustomersData] = useState<any>(null)
  const [toursData, setToursData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filtered data states
  const [filteredRevenueData, setFilteredRevenueData] = useState<any>(null)
  const [filteredBookingsData, setFilteredBookingsData] = useState<any>(null)
  const [filteredCustomersData, setFilteredCustomersData] = useState<any>(null)
  const [filteredToursData, setFilteredToursData] = useState<any>(null)

  // Load data on mount and filter changes
  useEffect(() => {
    loadAllData()
  }, [dateRange, statusFilter, customerTypeFilter, tourStatusFilter])

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadAllData()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Filter data whenever filters or raw data changes
  useEffect(() => {
    // Filter Revenue Data
    if (revenueData?.tourBreakdown) {
      const filtered = { ...revenueData }
      if (searchTerm) {
        const filteredBreakdown: Record<string, number> = {}
        Object.entries(revenueData.tourBreakdown).forEach(([tour, revenue]) => {
          if (tour.toLowerCase().includes(searchTerm.toLowerCase())) {
            filteredBreakdown[tour] = revenue as number
          }
        })
        filtered.tourBreakdown = filteredBreakdown
        filtered.totalRevenue = Object.values(filteredBreakdown).reduce((sum, val) => sum + val, 0)
      }
      setFilteredRevenueData(filtered)
    } else {
      setFilteredRevenueData(revenueData)
    }

    // Filter Bookings Data
    if (bookingsData?.bookings) {
      let filteredBookings = [...bookingsData.bookings]

      // Apply search filter
      if (searchTerm) {
        filteredBookings = filteredBookings.filter((booking: any) => {
          const searchLower = searchTerm.toLowerCase()
          return (
            booking.customer_name?.toLowerCase().includes(searchLower) ||
            booking.customer_email?.toLowerCase().includes(searchLower) ||
            booking.booking_reference?.toLowerCase().includes(searchLower) ||
            booking.customer_country?.toLowerCase().includes(searchLower)
          )
        })
      }

      // Apply status filter
      if (statusFilter !== "all") {
        filteredBookings = filteredBookings.filter((booking: any) => {
          if (statusFilter === "paid") return booking.payment_status === "paid"
          return booking.status === statusFilter
        })
      }

      // Apply date range filter
      if (dateRange.from || dateRange.to) {
        filteredBookings = filteredBookings.filter((booking: any) => {
          const bookingDate = new Date(booking.created_at)
          if (dateRange.from && bookingDate < dateRange.from) return false
          if (dateRange.to && bookingDate > dateRange.to) return false
          return true
        })
      }

      const filtered = {
        ...bookingsData,
        bookings: filteredBookings,
        totalBookings: filteredBookings.length,
        confirmedBookings: filteredBookings.filter((b: any) => b.status === 'confirmed').length,
        cancelledBookings: filteredBookings.filter((b: any) => b.status === 'cancelled').length,
        paidBookingsCount: filteredBookings.filter((b: any) => b.payment_status === 'paid').length,
        confirmedPaidBookings: filteredBookings.filter((b: any) => b.status === 'confirmed' && b.payment_status === 'paid').length
      }
      setFilteredBookingsData(filtered)
    } else {
      setFilteredBookingsData(bookingsData)
    }

    // Filter Customers Data
    if (customersData?.customers) {
      let filteredCustomers = [...customersData.customers]

      // Apply search filter
      if (searchTerm) {
        filteredCustomers = filteredCustomers.filter((customer: any) => {
          const searchLower = searchTerm.toLowerCase()
          return (
            customer.name?.toLowerCase().includes(searchLower) ||
            customer.email?.toLowerCase().includes(searchLower) ||
            customer.country?.toLowerCase().includes(searchLower) ||
            customer.phone?.toLowerCase().includes(searchLower)
          )
        })
      }

      // Apply customer type filter
      if (customerTypeFilter !== "all") {
        filteredCustomers = filteredCustomers.filter((customer: any) => {
          if (customerTypeFilter === "new" && (!customer.customer_type || customer.customer_type === "new")) return true
          if (customerTypeFilter === "regular" && customer.customer_type === "regular") return true
          if (customerTypeFilter === "vip" && customer.customer_type === "vip") return true
          if (customerTypeFilter === "repeat" && customer.customer_type === "repeat") return true
          return false
        })
      }

      // Apply date range filter (based on join_date)
      if (dateRange.from || dateRange.to) {
        filteredCustomers = filteredCustomers.filter((customer: any) => {
          const joinDate = new Date(customer.join_date)
          if (dateRange.from && joinDate < dateRange.from) return false
          if (dateRange.to && joinDate > dateRange.to) return false
          return true
        })
      }

      const filtered = {
        ...customersData,
        customers: filteredCustomers,
        totalCustomers: filteredCustomers.length
      }
      setFilteredCustomersData(filtered)
    } else {
      setFilteredCustomersData(customersData)
    }

    // Filter Tours Data
    if (toursData?.toursPerformance) {
      let filteredTours = [...toursData.toursPerformance]

      // Apply search filter
      if (searchTerm) {
        filteredTours = filteredTours.filter((tour: any) => {
          const searchLower = searchTerm.toLowerCase()
          return (
            tour.title?.toLowerCase().includes(searchLower) ||
            tour.category?.toLowerCase().includes(searchLower)
          )
        })
      }

      // Apply tour status filter
      if (tourStatusFilter !== "all") {
        filteredTours = filteredTours.filter((tour: any) => {
          if (tourStatusFilter === "active") return tour.totalBookings > 0
          if (tourStatusFilter === "inactive") return tour.totalBookings === 0
          if (tourStatusFilter === "draft") return tour.status === "draft"
          return true
        })
      }

      const filtered = {
        ...toursData,
        toursPerformance: filteredTours
      }
      setFilteredToursData(filtered)
    } else {
      setFilteredToursData(toursData)
    }
  }, [revenueData, bookingsData, customersData, toursData, searchTerm, statusFilter, customerTypeFilter, tourStatusFilter, dateRange])

  const loadAllData = async () => {
    setIsLoading(true)
    try {
      const [revenue, bookings, customers, tours] = await Promise.all([
        fetchRevenueReport(dateRange.from, dateRange.to),
        fetchBookingsReport(dateRange.from, dateRange.to),
        fetchCustomerReport(dateRange.from, dateRange.to),
        fetchToursReport(dateRange.from, dateRange.to)
      ])
      
      setRevenueData(revenue)
      setBookingsData(bookings)
      setCustomersData(customers)
      setToursData(tours)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error("Failed to load analytics data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDatePreset = (preset: typeof datePresets[0]) => {
    const range = preset.getValue()
    setDateRange(range)
  }

  const handleExport = (type: string, exportFormat: string) => {
    let data: any = null
    let filename = ""
    const dateStr = format(new Date(), 'yyyy-MM-dd')
    
    switch (type) {
        case "revenue":
        data = filteredRevenueData
        filename = `revenue_report_${dateStr}`
          break
        case "bookings":
        data = filteredBookingsData
        filename = `bookings_report_${dateStr}`
          break
        case "customers":
        data = filteredCustomersData
        filename = `customers_report_${dateStr}`
          break
        case "tours":
        data = filteredToursData
        filename = `tours_report_${dateStr}`
          break
      }

    if (!data) {
      toast.error("No data available to export")
      return
    }

    // Generate CSV content
    let csvContent = ""
    if (type === "revenue" && data.tourBreakdown) {
      csvContent = "Tour,Revenue\n"
      Object.entries(data.tourBreakdown).forEach(([tour, revenue]) => {
        csvContent += `"${tour}",${revenue}\n`
      })
    } else if (type === "bookings" && data.bookings) {
      csvContent = "Reference,Customer,Status,Payment,Amount,Date\n"
      data.bookings.forEach((booking: any) => {
        csvContent += `"${booking.booking_reference}","${booking.customer_name}","${booking.status}","${booking.payment_status}",${booking.total_amount},"${booking.created_at}"\n`
      })
    } else if (type === "customers" && data.customers) {
      csvContent = "Name,Email,Country,Type,Total Spent,Bookings\n"
      data.customers.forEach((customer: any) => {
        csvContent += `"${customer.name}","${customer.email}","${customer.country}","${customer.customer_type}",${customer.total_spent},${customer.total_bookings}\n`
      })
    } else if (type === "tours" && data.toursPerformance) {
      csvContent = "Tour,Category,Bookings,Guests,Revenue,Rating\n"
      data.toursPerformance.forEach((tour: any) => {
        csvContent += `"${tour.title}","${tour.category}",${tour.totalBookings},${tour.totalGuests},${tour.totalRevenue},${tour.averageRating}\n`
      })
    }

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.csv`
    link.click()
    URL.revokeObjectURL(url)

    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported successfully!`)
  }

    const safeNumber = (value: any, defaultValue: number = 0) => {
      if (value === undefined || value === null) return defaultValue
    return typeof value === 'number' ? value : parseFloat(value) || defaultValue
  }

        return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600 text-lg">Comprehensive business intelligence and reporting</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={loadAllData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <Button onClick={() => handleExport("revenue", "csv")}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>

          {/* Filters Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                {/* Date Range Presets */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date Range Presets</Label>
                  <div className="grid grid-cols-2 gap-1">
                    {datePresets.slice(0, 6).map((preset) => {
                      const presetRange = preset.getValue()
                      const isSelected = dateRange.from && dateRange.to && 
                        dateRange.from.toDateString() === presetRange.from.toDateString() &&
                        dateRange.to.toDateString() === presetRange.to.toDateString()
                      
                      return (
                        <Button
                          key={preset.id}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const range = preset.getValue()
                            setDateRange(range)
                          }}
                          className="text-xs h-8"
                        >
                          {preset.label}
                        </Button>
                      )
                    })}
                </div>
                </div>

                {/* Custom Date Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Custom Date Range</Label>
                  <div className="space-y-2">
                    <Input
                      type="date"
                      value={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : undefined
                        setDateRange(prev => ({ ...prev, from: date }))
                      }}
                      className="h-8 text-xs"
                      placeholder="From date"
                    />
                    <Input
                      type="date"
                      value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : undefined
                        setDateRange(prev => ({ ...prev, to: date }))
                      }}
                      className="h-8 text-xs"
                      placeholder="To date"
                      min={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined}
                    />
              </div>
                    </div>

                {/* Search */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Search</Label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-2 top-2 text-gray-400" />
                    <Input
                      placeholder="Search customers, tours..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-8"
                    />
              </div>
                </div>
                </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Booking Status Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Booking Status</Label>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select booking status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer Type Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Customer Type</Label>
                  <Select value={customerTypeFilter} onValueChange={(value) => setCustomerTypeFilter(value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select customer type" />
                    </SelectTrigger>
                    <SelectContent>
                      {customerTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>

                {/* Tour Status Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tour Status</Label>
                  <Select value={tourStatusFilter} onValueChange={(value) => setTourStatusFilter(value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select tour status" />
                    </SelectTrigger>
                    <SelectContent>
                      {tourStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                    </div>
              </div>

              {/* Active Filters Display */}
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {dateRange.from ? format(dateRange.from, 'MMM d') : 'No start'} - {dateRange.to ? format(dateRange.to, 'MMM d, yyyy') : 'No end'}
                </Badge>
                {statusFilter !== "all" && (
                  <Badge variant="outline" className="text-xs">
                    Booking: {statusOptions.find(s => s.value === statusFilter)?.label}
                  </Badge>
                )}
                {customerTypeFilter !== "all" && (
                  <Badge variant="outline" className="text-xs">
                    Customer: {customerTypeOptions.find(s => s.value === customerTypeFilter)?.label}
                  </Badge>
                )}
                {tourStatusFilter !== "all" && (
                  <Badge variant="outline" className="text-xs">
                    Tour: {tourStatusOptions.find(s => s.value === tourStatusFilter)?.label}
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="outline" className="text-xs">
                    <Search className="h-3 w-3 mr-1" />
                    "{searchTerm}"
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all")
                    setCustomerTypeFilter("all")
                    setTourStatusFilter("all")
                    setSearchTerm("")
                    setDateRange({ from: startOfDay(subDays(new Date(), 29)), to: endOfDay(new Date()) })
                  }}
                  className="h-6 px-2 text-xs"
                >
                  Clear All
                </Button>
                {/* Debug Info */}
                {process.env.NODE_ENV === 'development' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log('Current filters:', {
                        dateRange,
                        statusFilter,
                        customerTypeFilter,
                        tourStatusFilter,
                        searchTerm
                      })
                      console.log('Data loaded:', {
                        revenueData: !!revenueData,
                        bookingsData: !!bookingsData,
                        customersData: !!customersData,
                        toursData: !!toursData
                      })
                    }}
                    className="h-6 px-2 text-xs text-gray-500"
                  >
                    Debug
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${safeNumber(filteredRevenueData?.totalRevenue).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">From paid bookings</p>
                </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                        <div>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {safeNumber(filteredBookingsData?.totalBookings)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">All statuses</p>
                        </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
              </div>
            </CardContent>
          </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
        <div>
                    <p className="text-sm text-gray-600">Active Customers</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {safeNumber(filteredCustomersData?.totalCustomers)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Confirmed + paid</p>
        </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
      </div>
                </div>
              </CardContent>
            </Card>

              <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                        <div>
                    <p className="text-sm text-gray-600">Active Tours</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {safeNumber(filteredToursData?.toursPerformance?.length)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">With bookings</p>
                        </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <MapPin className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                </CardContent>
              </Card>
            </div>

          {/* Data Tables */}
          <Tabs defaultValue="revenue" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
              <TabsTrigger value="bookings">Bookings Data</TabsTrigger>
              <TabsTrigger value="customers">Customer Insights</TabsTrigger>
              <TabsTrigger value="tours">Tour Performance</TabsTrigger>
            </TabsList>

            {/* Revenue Tab */}
            <TabsContent value="revenue">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleExport("revenue", "csv")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  {filteredRevenueData?.tourBreakdown ? (
                    <>
                      <div className="mb-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Showing {Object.entries(filteredRevenueData.tourBreakdown).length} of {Object.entries(revenueData?.tourBreakdown || {}).length} tours
                  </div>
                        {(searchTerm || statusFilter !== "all" || customerTypeFilter !== "all" || tourStatusFilter !== "all") && (
                          <Badge variant="secondary" className="text-xs">Filtered</Badge>
                        )}
                  </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 p-3 text-left">Tour Name</th>
                              <th className="border border-gray-200 p-3 text-right">Revenue</th>
                              <th className="border border-gray-200 p-3 text-right">Percentage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(filteredRevenueData.tourBreakdown)
                              .sort(([,a], [,b]) => (b as number) - (a as number))
                              .map(([tour, revenue], index) => {
                                const percentage = ((revenue as number) / filteredRevenueData.totalRevenue * 100).toFixed(1)
                                return (
                                  <tr key={tour} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="border border-gray-200 p-3">{tour}</td>
                                    <td className="border border-gray-200 p-3 text-right font-semibold">
                                      ${(revenue as number).toLocaleString()}
                                    </td>
                                    <td className="border border-gray-200 p-3 text-right">
                                      <Badge variant="outline">{percentage}%</Badge>
                                    </td>
                                  </tr>
                                )
                              })}
                          </tbody>
                        </table>
                  </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <DollarSign className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No revenue data available for the selected period</p>
                    </div>
                  )}
                </CardContent>
              </Card>
        </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
          <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Bookings</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleExport("bookings", "csv")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
            </CardHeader>
            <CardContent>
                  {filteredBookingsData?.bookings ? (
                    <>
                      <div className="mb-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Showing {filteredBookingsData.bookings.slice(0, 50).length} of {bookingsData?.bookings?.length || 0} bookings
                        </div>
                        {(statusFilter !== "all" || searchTerm || dateRange.from || dateRange.to || customerTypeFilter !== "all" || tourStatusFilter !== "all") && (
                          <Badge variant="secondary" className="text-xs">Filtered</Badge>
                        )}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 p-3 text-left">Reference</th>
                              <th className="border border-gray-200 p-3 text-left">Customer</th>
                              <th className="border border-gray-200 p-3 text-left">Status</th>
                              <th className="border border-gray-200 p-3 text-left">Payment</th>
                              <th className="border border-gray-200 p-3 text-right">Amount</th>
                              <th className="border border-gray-200 p-3 text-left">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredBookingsData.bookings
                              .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                              .slice(0, 50)
                              .map((booking: any, index: number) => (
                                <tr key={booking.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="border border-gray-200 p-3 font-mono text-sm">
                                    {booking.booking_reference}
                                  </td>
                                  <td className="border border-gray-200 p-3">{booking.customer_name}</td>
                                  <td className="border border-gray-200 p-3">
                                    <Badge 
                                      variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                                      className={
                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                      }
                                    >
                                      {booking.status}
                                    </Badge>
                                  </td>
                                  <td className="border border-gray-200 p-3">
                                    <Badge 
                                      variant={booking.payment_status === 'paid' ? 'default' : 'secondary'}
                                      className={
                                        booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                        'bg-orange-100 text-orange-800'
                                      }
                                    >
                                      {booking.payment_status}
                                    </Badge>
                                  </td>
                                  <td className="border border-gray-200 p-3 text-right font-semibold">
                                    ${safeNumber(booking.total_amount).toLocaleString()}
                                  </td>
                                  <td className="border border-gray-200 p-3">
                                    {new Date(booking.created_at).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
              </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No booking data available for the selected period</p>
                    </div>
                  )}
            </CardContent>
          </Card>
        </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers">
          <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Customer Analytics</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleExport("customers", "csv")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
            </CardHeader>
            <CardContent>
                  {filteredCustomersData?.customers ? (
                    <>
                      <div className="mb-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Showing {filteredCustomersData.customers.slice(0, 50).length} of {customersData?.customers?.length || 0} customers
                        </div>
                        {(searchTerm || customerTypeFilter !== "all" || dateRange.from || dateRange.to || statusFilter !== "all" || tourStatusFilter !== "all") && (
                          <Badge variant="secondary" className="text-xs">Filtered</Badge>
                        )}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 p-3 text-left">Name</th>
                              <th className="border border-gray-200 p-3 text-left">Email</th>
                              <th className="border border-gray-200 p-3 text-left">Country</th>
                              <th className="border border-gray-200 p-3 text-left">Type</th>
                              <th className="border border-gray-200 p-3 text-right">Total Spent</th>
                              <th className="border border-gray-200 p-3 text-right">Bookings</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCustomersData.customers
                              .sort((a: any, b: any) => b.total_spent - a.total_spent)
                              .slice(0, 50)
                              .map((customer: any, index: number) => (
                                <tr key={customer.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="border border-gray-200 p-3">{customer.name}</td>
                                  <td className="border border-gray-200 p-3 text-sm">{customer.email}</td>
                                  <td className="border border-gray-200 p-3">{customer.country}</td>
                                  <td className="border border-gray-200 p-3">
                        <Badge
                                      variant="outline"
                          className={
                                        customer.customer_type === 'vip' ? 'bg-purple-100 text-purple-800' :
                                        customer.customer_type === 'repeat' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                          }
                        >
                                      {customer.customer_type}
                        </Badge>
                                  </td>
                                  <td className="border border-gray-200 p-3 text-right font-semibold">
                                    ${safeNumber(customer.total_spent).toLocaleString()}
                                  </td>
                                  <td className="border border-gray-200 p-3 text-right">
                                    {customer.total_bookings}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No customer data available for the selected period</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tours Tab */}
            <TabsContent value="tours">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Tour Performance</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleExport("tours", "csv")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                      </Button>
                </CardHeader>
                <CardContent>
                  {filteredToursData?.toursPerformance ? (
                    <>
                      <div className="mb-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Showing {filteredToursData.toursPerformance.length} of {toursData?.toursPerformance?.length || 0} tours
                    </div>
                        {(searchTerm || tourStatusFilter !== "all" || statusFilter !== "all" || customerTypeFilter !== "all" || dateRange.from || dateRange.to) && (
                          <Badge variant="secondary" className="text-xs">Filtered</Badge>
                        )}
                  </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 p-3 text-left">Tour Name</th>
                              <th className="border border-gray-200 p-3 text-left">Category</th>
                              <th className="border border-gray-200 p-3 text-right">Bookings</th>
                              <th className="border border-gray-200 p-3 text-right">Guests</th>
                              <th className="border border-gray-200 p-3 text-right">Revenue</th>
                              <th className="border border-gray-200 p-3 text-right">Rating</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredToursData.toursPerformance
                              .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
                              .map((tour: any, index: number) => (
                                <tr key={tour.title} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="border border-gray-200 p-3">{tour.title}</td>
                                  <td className="border border-gray-200 p-3">
                                    <Badge variant="outline">{tour.category}</Badge>
                                  </td>
                                  <td className="border border-gray-200 p-3 text-right">{tour.totalBookings}</td>
                                  <td className="border border-gray-200 p-3 text-right">{tour.totalGuests}</td>
                                  <td className="border border-gray-200 p-3 text-right font-semibold">
                                    ${safeNumber(tour.totalRevenue).toLocaleString()}
                                  </td>
                                  <td className="border border-gray-200 p-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <span>{tour.averageRating}/5</span>
                                      <span className="text-xs text-gray-500">({tour.reviewCount})</span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
              </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No tour data available for the selected period</p>
                    </div>
                  )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
  )
}
