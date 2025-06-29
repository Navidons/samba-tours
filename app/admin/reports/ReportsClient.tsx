"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  Download,
  CalendarIcon,
  FileText,
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  Eye,
  Trash2,
  Plus,
  RefreshCw,
  Zap,
  Clock,
  BarChart2,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import {
  fetchRevenueReport,
  fetchBookingsReport,
  fetchCustomerReport,
  fetchToursReport,
  generatePDFReport,
  fetchRecentReports,
  analyticsStream,
  LiveMetrics,
  RealtimeReport
} from "@/lib/analytics"
import { toast } from "sonner"
import { 
  addDays, 
  subDays, 
  startOfToday, 
  endOfToday, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  subMonths, 
  subYears 
} from "date-fns"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const reportTypes = [
  {
    id: "revenue",
    name: "Revenue Report",
    description: "Detailed revenue analysis and trends",
    icon: DollarSign,
    color: "bg-green-100 text-green-800",
  },
  {
    id: "bookings",
    name: "Bookings Report",
    description: "Booking statistics and patterns",
    icon: CalendarIcon,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "customers",
    name: "Customer Report",
    description: "Customer demographics and behavior",
    icon: Users,
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "tours",
    name: "Tours Performance",
    description: "Tour popularity and performance metrics",
    icon: MapPin,
    color: "bg-orange-100 text-orange-800",
  },
]

const recentReports = [
  {
    id: 1,
    name: "Monthly Revenue Report - June 2024",
    type: "Revenue",
    generated: "2024-06-21 10:30:00",
    size: "2.4 MB",
    format: "PDF",
    status: "completed",
  },
  {
    id: 2,
    name: "Customer Analysis Q2 2024",
    type: "Customer",
    generated: "2024-06-20 15:45:00",
    size: "1.8 MB",
    format: "Excel",
    status: "completed",
  },
  {
    id: 3,
    name: "Tour Performance Report",
    type: "Tours",
    generated: "2024-06-19 09:15:00",
    size: "3.1 MB",
    format: "PDF",
    status: "completed",
  },
  {
    id: 4,
    name: "Weekly Bookings Summary",
    type: "Bookings",
    generated: "2024-06-18 14:20:00",
    size: "856 KB",
    format: "CSV",
    status: "completed",
  },
]

const scheduledReports = [
  {
    id: 1,
    name: "Daily Revenue Summary",
    frequency: "Daily",
    nextRun: "2024-06-22 08:00:00",
    recipients: ["admin@sambatours.com", "manager@sambatours.com"],
    status: "active",
  },
  {
    id: 2,
    name: "Weekly Booking Report",
    frequency: "Weekly",
    nextRun: "2024-06-24 09:00:00",
    recipients: ["admin@sambatours.com"],
    status: "active",
  },
  {
    id: 3,
    name: "Monthly Customer Analysis",
    frequency: "Monthly",
    nextRun: "2024-07-01 10:00:00",
    recipients: ["admin@sambatours.com", "marketing@sambatours.com"],
    status: "paused",
  },
]

// Date preset types
const datePresets = [
  {
    label: "Today",
    icon: Clock,
    getRange: () => ({
      from: startOfToday(),
      to: endOfToday()
    })
  },
  {
    label: "Last 7 Days",
    icon: BarChart2,
    getRange: () => ({
      from: subDays(startOfToday(), 6),
      to: endOfToday()
    })
  },
  {
    label: "This Month",
    icon: TrendingUp,
    getRange: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    })
  },
  {
    label: "Last Month",
    icon: RefreshCw,
    getRange: () => {
      const lastMonth = subMonths(new Date(), 1)
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth)
      }
    }
  },
  {
    label: "This Year",
    icon: BarChart2,
    getRange: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date())
    })
  },
  {
    label: "Last Year",
    icon: RefreshCw,
    getRange: () => {
      const lastYear = subYears(new Date(), 1)
      return {
        from: startOfYear(lastYear),
        to: endOfYear(lastYear)
      }
    }
  }
]

// Enhanced Calendar Component
function EnhancedCalendar({ 
  selected, 
  onSelect, 
  mode = "single",
  className 
}: { 
  selected?: Date | undefined, 
  onSelect?: (date: Date | undefined) => void,
  mode?: "single" | "range",
  className?: string
}) {
  return (
    <div className={`p-4 bg-white border rounded-lg shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button 
          type="button" 
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="font-semibold text-gray-800">June 2025</div>
        <button 
          type="button" 
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((day) => (
          <button
            key={day}
            type="button"
            className={`
              w-8 h-8 rounded-full text-sm 
              ${day === 9 ? 'bg-forest-600 text-white' : 'hover:bg-gray-100'}
              ${day < 9 ? 'text-gray-300' : 'text-gray-800'}
            `}
            disabled={day < 9}
            onClick={() => onSelect && onSelect(new Date(2025, 5, day))}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}

// Updated DateRangePicker Component
function DateRangePicker({ 
  label, 
  date, 
  setDate, 
  className 
}: { 
  label: string, 
  date: Date | undefined, 
  setDate: (date: Date | undefined) => void,
  className?: string
}) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  const handlePresetSelect = (preset: typeof datePresets[number]) => {
    const range = preset.getRange()
    setDate(range.to)
    setSelectedPreset(preset.label)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex">
              {/* Date Presets */}
              <div className="w-40 border-r p-2 space-y-1">
                <h4 className="font-medium mb-2 text-sm">Quick Select</h4>
                {datePresets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant={selectedPreset === preset.label ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handlePresetSelect(preset)}
                  >
                    <preset.icon className="mr-2 h-4 w-4" />
                    {preset.label}
                  </Button>
                ))}
              </div>
              
              {/* Custom Calendar */}
              <EnhancedCalendar
                selected={date}
                onSelect={setDate}
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Button */}
        {date && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => {
              setDate(undefined)
              setSelectedPreset(null)
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default function ReportsClient() {
  const [selectedReportType, setSelectedReportType] = useState("")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [reportName, setReportName] = useState("")
  const [format, setFormat] = useState("pdf")
  const [recentReports, setRecentReports] = useState<any[]>([])
  const [reportData, setReportData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // New live metrics state
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics | null>(null)
  const [realtimeUpdates, setRealtimeUpdates] = useState<RealtimeReport[]>([])
  const [isStreamingLive, setIsStreamingLive] = useState(false)

  // Refs to manage streaming
  const streamCleanupRef = useRef<(() => void) | null>(null)

  // Fetch live metrics on component mount
  useEffect(() => {
    const fetchInitialMetrics = async () => {
      try {
        const metrics = await analyticsStream.getLiveMetrics()
        setLiveMetrics(metrics)
      } catch (error) {
        console.error("Failed to fetch live metrics:", error)
        toast.error("Could not load live metrics")
      }
    }
    fetchInitialMetrics()

    // Fetch recent reports
    const loadRecentReports = async () => {
      const reports = await fetchRecentReports()
      setRecentReports(reports)
    }
    loadRecentReports()
  }, [])

  // Start/stop live streaming
  const toggleLiveStreaming = useCallback(() => {
    if (isStreamingLive) {
      // Stop streaming
      if (streamCleanupRef.current) {
        streamCleanupRef.current()
        streamCleanupRef.current = null
      }
      setIsStreamingLive(false)
      setRealtimeUpdates([])
    } else {
      // Start streaming
      setIsStreamingLive(true)
      
      // Start streaming reports
      streamCleanupRef.current = analyticsStream.streamReports((report) => {
        setRealtimeUpdates(prev => {
          // Limit to last 10 updates
          const updates = [...prev, report].slice(-10)
          return updates
        })

        // Update live metrics based on report type
        if (report.type === 'revenue' && report.data) {
          setLiveMetrics(prev => prev ? {
            ...prev,
            revenueToday: report.data.totalRevenue
          } : prev)
        } else if (report.type === 'bookings' && report.data) {
          setLiveMetrics(prev => prev ? {
            ...prev,
            activeBookings: report.data.totalBookings
          } : prev)
        }
      })
    }
  }, [isStreamingLive])

  // Cleanup streaming on unmount
  useEffect(() => {
    return () => {
      if (streamCleanupRef.current) {
        streamCleanupRef.current()
      }
    }
  }, [])

  // Render live metrics dashboard
  const renderLiveMetricsDashboard = () => {
    if (!liveMetrics) return null

    return (
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Live Business Metrics</CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isStreamingLive ? "default" : "outline"}
              className={isStreamingLive ? "bg-green-500 text-white" : ""}
            >
              {isStreamingLive ? "Live" : "Paused"}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleLiveStreaming}
            >
              {isStreamingLive ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" /> Pause
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" /> Go Live
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm text-blue-800 mb-2">Total Visitors Today</h4>
              <p className="text-2xl font-bold text-blue-600">{liveMetrics.totalVisitors}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm text-green-800 mb-2">Active Bookings</h4>
              <p className="text-2xl font-bold text-green-600">{liveMetrics.activeBookings}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="text-sm text-purple-800 mb-2">Revenue Today</h4>
              <p className="text-2xl font-bold text-purple-600">
                ${liveMetrics.revenueToday.toFixed(2)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="text-sm text-orange-800 mb-2">Top Tour</h4>
              <p className="text-xl font-bold text-orange-600">
                {Object.entries(liveMetrics.tourPopularity).reduce(
                  (a, b) => b[1] > a[1] ? b : a
                )[0]}
              </p>
            </div>
          </div>

          {/* Realtime Updates Log */}
          {isStreamingLive && realtimeUpdates.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h4 className="text-sm font-semibold mb-2">Recent Updates</h4>
              <div className="space-y-2">
                {realtimeUpdates.map((update, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 p-2 rounded-lg flex justify-between items-center"
                  >
                    <span className="text-sm">
                      {update.type.charAt(0).toUpperCase() + update.type.slice(1)} Report Updated
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(update.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const handleGenerateReport = async () => {
    if (!selectedReportType) {
      toast.error("Please select a report type")
      return
    }

    setIsLoading(true)
    try {
      let reportResult = null
      switch (selectedReportType) {
        case "revenue":
          reportResult = await fetchRevenueReport(dateFrom, dateTo)
          break
        case "bookings":
          reportResult = await fetchBookingsReport(dateFrom, dateTo)
          break
        case "customers":
          reportResult = await fetchCustomerReport(dateFrom, dateTo)
          break
        case "tours":
          reportResult = await fetchToursReport(dateFrom, dateTo)
          break
      }

      if (reportResult) {
        setReportData(reportResult)
        
        // Generate PDF if selected
        if (format === "pdf") {
          const pdfReport = await generatePDFReport(selectedReportType, reportResult)
          
          if (pdfReport.success) {
            toast.success(`Report generated: ${pdfReport.filename}`, {
              description: `Size: ${pdfReport.size}`
            })
          } else {
            toast.error("Failed to generate PDF report", {
              description: pdfReport.error || "Unknown error"
            })
          }
        } else {
          toast.success("Report data fetched successfully")
        }
      } else {
        toast.error("Failed to generate report")
      }
    } catch (error) {
      console.error("Report generation error:", error)
      toast.error("An error occurred while generating the report", {
        description: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderReportPreview = () => {
    if (!reportData) return null

    // Helper function to safely get numeric value
    const safeNumber = (value: any, defaultValue: number = 0) => {
      if (value === undefined || value === null) return defaultValue
      return typeof value === 'number' ? value : parseFloat(value)
    }

    // Helper function to safely get object entries
    const safeEntries = (obj: any) => {
      if (!obj || typeof obj !== 'object') return []
      return Object.entries(obj)
    }

    switch (selectedReportType) {
      case "revenue":
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Revenue Report Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Total Revenue</h4>
                  <p className="text-2xl text-forest-600">
                    ${safeNumber(reportData.totalRevenue).toFixed(2)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Total Bookings</h4>
                  <p className="text-2xl">
                    {safeNumber(reportData.bookingsCount)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Tour Revenue Breakdown</h4>
                {safeEntries(reportData.tourBreakdown).length > 0 ? (
                  safeEntries(reportData.tourBreakdown).map(([tour, revenue]) => (
                    <div key={tour} className="flex justify-between mb-1">
                      <span>{tour}</span>
                      <span className="text-forest-600">
                        ${safeNumber(revenue).toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No revenue breakdown available</p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      case "bookings":
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Bookings Report Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold">Total Bookings</h4>
                  <p className="text-2xl">
                    {safeNumber(reportData.totalBookings)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Confirmed</h4>
                  <p className="text-green-600 text-2xl">
                    {safeNumber(reportData.confirmedBookings)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Paid Bookings</h4>
                  <p className="text-blue-600 text-2xl">
                    {safeNumber(reportData.paidBookingsCount)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Tour Booking Breakdown</h4>
                {safeEntries(reportData.tourBookingBreakdown).length > 0 ? (
                  safeEntries(reportData.tourBookingBreakdown).map(([tour, guests]) => (
                    <div key={tour} className="flex justify-between mb-1">
                      <span>{tour}</span>
                      <span className="text-forest-600">
                        {safeNumber(guests)} guests
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No booking breakdown available</p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      case "customers":
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Customer Report Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Total Customers</h4>
                  <p className="text-2xl">
                    {safeNumber(reportData.totalCustomers)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Total Revenue</h4>
                  <p className="text-forest-600 text-2xl">
                    ${safeNumber(reportData.totalRevenue).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Customer Type Breakdown</h4>
                {safeEntries(reportData.customerTypeBreakdown).length > 0 ? (
                  safeEntries(reportData.customerTypeBreakdown).map(([type, count]) => (
                    <div key={type} className="flex justify-between mb-1">
                      <span>{type}</span>
                      <span className="text-forest-600">
                        {safeNumber(count)} customers
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No customer type breakdown available</p>
                )}
              </div>
              <div className="mt-2">
                <h4 className="font-semibold">Average Order Value</h4>
                <p className="text-forest-600">
                  ${safeNumber(reportData.averageOrderValue).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      case "tours":
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Tours Performance Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.toursPerformance && reportData.toursPerformance.length > 0 ? (
                  reportData.toursPerformance.map((tour, index) => (
                    <div key={tour.title} className="border-b pb-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{tour.title}</h4>
                          <p className="text-sm text-earth-600">{tour.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-forest-600 font-bold">
                            ${safeNumber(tour.totalRevenue).toFixed(2)}
                          </p>
                          <p className="text-sm">
                            {safeNumber(tour.totalBookings)} bookings
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <span>
                          Total Guests: {safeNumber(tour.totalGuests)}
                        </span>
                        <span>
                          Avg. Rating: {safeNumber(tour.averageRating).toFixed(1)} 
                          ({safeNumber(tour.reviewCount)} reviews)
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    No tour performance data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-earth-900 mb-2">Reports</h1>
          <p className="text-earth-600">Generate and manage business reports</p>
        </div>
        <Button className="bg-forest-600 hover:bg-forest-700">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Report
        </Button>
      </div>

      {/* Live Metrics Dashboard */}
      {renderLiveMetricsDashboard()}

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        {/* Generate Report */}
        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Types */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Report Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reportTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedReportType === type.id
                          ? "border-forest-600 bg-forest-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedReportType(type.id)}
                    >
                      <div className="flex items-center gap-3">
                        <type.icon className="h-5 w-5 text-forest-600" />
                        <div>
                          <h4 className="font-medium text-earth-900">{type.name}</h4>
                          <p className="text-sm text-earth-600">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Report Configuration */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input
                      id="report-name"
                      placeholder="Enter report name"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DateRangePicker
                      label="Date From"
                      date={dateFrom}
                      setDate={setDateFrom}
                    />
                    <DateRangePicker
                      label="Date To"
                      date={dateTo}
                      setDate={setDateTo}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleGenerateReport}
                    disabled={!selectedReportType || isLoading}
                    className="w-full bg-forest-600 hover:bg-forest-700"
                  >
                    {isLoading ? (
                      "Generating Report..."
                    ) : (
                      <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Generate Report
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Report Preview */}
              {reportData && renderReportPreview()}
            </div>
          </div>
        </TabsContent>

        {/* Recent Reports */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-forest-600" />
                      <div>
                        <h4 className="font-medium text-earth-900">{report.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{report.type}</Badge>
                          <Badge variant="outline">{report.format}</Badge>
                          <span className="text-sm text-earth-600">{report.size}</span>
                        </div>
                        <p className="text-sm text-earth-500">Generated: {new Date(report.generated).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Reports */}
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-earth-900">{report.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-earth-600">
                        <span>Frequency: {report.frequency}</span>
                        <span>Next run: {report.nextRun}</span>
                        <Badge
                          className={
                            report.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-earth-500 mt-1">Recipients: {report.recipients.join(", ")}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
