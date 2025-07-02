"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
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
  Settings,
  Target,
  Star,
  Activity,
  Clock,
  Eye
} from "lucide-react"
import {
  fetchRevenueReport,
  fetchBookingsReport,
  fetchCustomerReport,
  fetchToursReport,
  generatePDFReport,
  fetchRecentReports
} from "@/lib/analytics"
import { toast } from "sonner"

// Enhanced report categories with modern design
const reportCategories = [
  {
    id: "financial",
    name: "Financial Reports",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    reports: [
      {
        id: "revenue",
        name: "Revenue Analysis",
        description: "Revenue breakdown from confirmed + paid bookings",
        icon: TrendingUp,
        estimatedTime: "2-5 min",
        complexity: "detailed"
      },
      {
        id: "profit-margin",
        name: "Profit Margins", 
        description: "Profit analysis by tours and periods",
        icon: Target,
        estimatedTime: "3-7 min",
        complexity: "advanced"
      }
    ]
  },
  {
    id: "customer",
    name: "Customer Insights",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50", 
    borderColor: "border-purple-200",
    reports: [
      {
        id: "customers",
        name: "Customer Demographics",
        description: "Customer behavior from confirmed + paid bookings",
        icon: Users,
        estimatedTime: "2-4 min",
        complexity: "standard"
      },
      {
        id: "customer-lifetime",
        name: "Customer Lifetime Value",
        description: "CLV analysis and segmentation",
        icon: Star,
        estimatedTime: "4-8 min", 
        complexity: "advanced"
      }
    ]
  },
  {
    id: "operations",
    name: "Operations & Bookings",
    icon: CalendarIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200", 
    reports: [
      {
        id: "bookings",
        name: "Booking Analytics",
        description: "All booking patterns and conversions",
        icon: CalendarIcon,
        estimatedTime: "1-3 min",
        complexity: "standard"
      },
      {
        id: "operational",
        name: "Operational Efficiency", 
        description: "Productivity and operational metrics",
        icon: Activity,
        estimatedTime: "3-6 min",
        complexity: "detailed"
      }
    ]
  },
  {
    id: "marketing",
    name: "Marketing & Tours",
    icon: MapPin,
    color: "text-orange-600", 
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    reports: [
      {
        id: "tours",
        name: "Tour Performance",
        description: "Tour popularity and performance",
        icon: MapPin,
        estimatedTime: "2-4 min",
        complexity: "standard"
      },
      {
        id: "marketing",
        name: "Marketing ROI",
        description: "Channel effectiveness and ROI",
        icon: TrendingUp,
        estimatedTime: "5-10 min",
        complexity: "advanced"
      }
    ]
  }
]

// Export format options
const exportFormats = [
  {
    id: "pdf",
    name: "PDF Document",
    description: "Professional formatted report",
    icon: FileText,
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
  {
    id: "excel",
    name: "Excel Spreadsheet", 
    description: "Data analysis and manipulation",
    icon: FileSpreadsheet,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    id: "csv",
    name: "CSV Data",
    description: "Raw data for external tools",
    icon: FileText,
    color: "text-blue-600", 
    bgColor: "bg-blue-50"
  }
]

// Quick date presets
const datePresets = [
  {
    id: "today",
    label: "Today",
    getValue: () => ({
      from: new Date(),
      to: new Date()
    })
  },
  {
    id: "last7days",
    label: "Last 7 Days", 
    getValue: () => ({
      from: subDays(new Date(), 6),
      to: new Date()
    })
  },
  {
    id: "last30days",
    label: "Last 30 Days",
    getValue: () => ({
      from: subDays(new Date(), 29), 
      to: new Date()
    })
  },
  {
    id: "thisMonth",
    label: "This Month",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    })
  },
  {
    id: "lastMonth",
    label: "Last Month", 
    getValue: () => {
      const lastMonth = subDays(startOfMonth(new Date()), 1)
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth)
      }
    }
  },
  {
    id: "thisYear",
    label: "This Year",
    getValue: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date())  
    })
  }
]

interface ReportConfig {
  reportType: string
  dateFrom?: Date
  dateTo?: Date
  format: string
  includeCharts: boolean
  includeRawData: boolean
  reportName: string
}

export default function ReportsClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedReport, setSelectedReport] = useState<string>("")
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    reportType: "",
    format: "pdf",
    includeCharts: true,
    includeRawData: false,
    reportName: ""
  })
  const [dateRange, setDateRange] = useState<{from?: Date, to?: Date}>({})
  const [recentReports, setRecentReports] = useState<any[]>([])
  const [reportData, setReportData] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewMode, setPreviewMode] = useState<'table' | 'chart' | 'summary'>('summary')

  // Load recent reports on mount
  useEffect(() => {
    const loadRecentReports = async () => {
      try {
        const reports = await fetchRecentReports()
        setRecentReports(reports)
      } catch (error) {
        console.error('Failed to load recent reports:', error)
      }
    }
    loadRecentReports()
  }, [])

  // Auto-generate report name based on selections
  useEffect(() => {
    if (selectedReport && dateRange.from) {
      const reportType = reportCategories
        .flatMap(cat => cat.reports)
        .find(r => r.id === selectedReport)
      
      const dateStr = dateRange.to && dateRange.from?.getTime() !== dateRange.to?.getTime()
        ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}`
        : format(dateRange.from, 'MMM d, yyyy')
      
      setReportConfig(prev => ({
        ...prev,
        reportName: `${reportType?.name} - ${dateStr}`
      }))
    }
  }, [selectedReport, dateRange])

  const handleReportSelect = (categoryId: string, reportId: string) => {
    setSelectedCategory(categoryId)
    setSelectedReport(reportId)
    setReportConfig(prev => ({
      ...prev,
      reportType: reportId
    }))
  }

  const handleDatePreset = (preset: typeof datePresets[0]) => {
    const range = preset.getValue()
    setDateRange(range)
  }

  const handleGenerateReport = async () => {
    if (!selectedReport || !dateRange.from) {
      toast.error("Please select a report type and date range")
      return
    }

    setIsGenerating(true)
    try {
      let reportResult = null
      
      switch (selectedReport) {
        case "revenue":
        case "profit-margin":
          reportResult = await fetchRevenueReport(dateRange.from, dateRange.to)
          break
        case "bookings":
        case "operational":
          reportResult = await fetchBookingsReport(dateRange.from, dateRange.to)
          break
        case "customers":
        case "customer-lifetime":
          reportResult = await fetchCustomerReport(dateRange.from, dateRange.to)
          break
        case "tours":
        case "marketing":
          reportResult = await fetchToursReport(dateRange.from, dateRange.to)
          break
        default:
          toast.error("Report type not implemented yet")
          return
      }

      if (reportResult) {
        setReportData(reportResult)
        toast.success("Report data generated successfully")
        
        // Auto-download if user selected a format
        await handleDownloadReport(reportResult)
      }
    } catch (error) {
      console.error('Report generation error:', error)
      toast.error("Failed to generate report")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = async (data: any) => {
    try {
      const result = await generatePDFReport(selectedReport, data)
      if (result.success) {
        toast.success(`${reportConfig.format.toUpperCase()} report generated!`, {
          description: `${result.filename} (${result.size})`,
          action: {
            label: "Download",
            onClick: () => {
              // Simulate download
              toast.info("Download started")
            }
          }
        })
        
        // Refresh recent reports
        const updatedReports = await fetchRecentReports()
        setRecentReports(updatedReports)
      } else {
        toast.error("Failed to generate download file")
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error("Failed to prepare download")
    }
  }

  const safeNumber = (value: any, defaultValue: number = 0) => {
    if (value === undefined || value === null) return defaultValue
    return typeof value === 'number' ? value : parseFloat(value) || defaultValue
  }

  const safeEntries = (obj: any) => {
    if (!obj || typeof obj !== 'object') return []
    return Object.entries(obj)
  }

  const renderReportPreview = () => {
    if (!reportData) return null

    return (
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Report Preview
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={previewMode === 'summary' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('summary')}
              >
                Summary
              </Button>
              <Button
                variant={previewMode === 'chart' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('chart')}
              >
                Charts
              </Button>
              <Button
                variant={previewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('table')}
              >
                Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {previewMode === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedReport === "revenue" && (
                <>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800">Total Revenue</h4>
                    <p className="text-2xl font-bold text-green-900">
                      ${safeNumber(reportData.totalRevenue).toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">From confirmed + paid bookings</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800">Customer Bookings</h4>
                    <p className="text-2xl font-bold text-blue-900">
                      {safeNumber(reportData.bookingsCount)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Revenue generating bookings</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800">Avg. Booking Value</h4>
                    <p className="text-2xl font-bold text-purple-900">
                      ${(safeNumber(reportData.totalRevenue) / Math.max(safeNumber(reportData.bookingsCount), 1)).toFixed(0)}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800">Tours Sold</h4>
                    <p className="text-2xl font-bold text-orange-900">
                      {safeEntries(reportData.tourBreakdown).length}
                    </p>
                  </div>
                </>
              )}
              
              {selectedReport === "customers" && (
                <>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800">Total Customers</h4>
                    <p className="text-2xl font-bold text-purple-900">
                      {safeNumber(reportData.totalCustomers)}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">From confirmed + paid bookings</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800">Customer Revenue</h4>
                    <p className="text-2xl font-bold text-green-900">
                      ${safeNumber(reportData.totalRevenue).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800">Avg. Lifetime Value</h4>
                    <p className="text-2xl font-bold text-blue-900">
                      ${safeNumber(reportData.averageLifetimeValue).toFixed(0)}
                    </p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-800">VIP Customers</h4>
                    <p className="text-2xl font-bold text-amber-900">
                      {safeNumber(reportData.customerTypeBreakdown?.vip)}
                    </p>
                  </div>
                </>
              )}

              {selectedReport === "bookings" && (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800">Total Bookings</h4>
                    <p className="text-2xl font-bold text-blue-900">
                      {safeNumber(reportData.totalBookings)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">All booking statuses</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800">Confirmed</h4>
                    <p className="text-2xl font-bold text-green-900">
                      {safeNumber(reportData.confirmedBookings)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800">Customer Bookings</h4>
                    <p className="text-2xl font-bold text-purple-900">
                      {safeNumber(reportData.confirmedPaidBookings)}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">Confirmed + Paid</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800">Cancelled</h4>
                    <p className="text-2xl font-bold text-red-900">
                      {safeNumber(reportData.cancelledBookings)}
                    </p>
                  </div>
                </>
              )}

              {selectedReport === "tours" && reportData.toursPerformance && (
                <>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800">Total Tours</h4>
                    <p className="text-2xl font-bold text-orange-900">
                      {reportData.toursPerformance.length}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800">Total Revenue</h4>
                    <p className="text-2xl font-bold text-green-900">
                      ${reportData.toursPerformance.reduce((sum: number, tour: any) => 
                        sum + safeNumber(tour.totalRevenue), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800">Total Guests</h4>
                    <p className="text-2xl font-bold text-blue-900">
                      {reportData.toursPerformance.reduce((sum: number, tour: any) => 
                        sum + safeNumber(tour.totalGuests), 0)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800">Avg. Rating</h4>
                    <p className="text-2xl font-bold text-purple-900">
                      {(reportData.toursPerformance.reduce((sum: number, tour: any) => 
                        sum + safeNumber(tour.averageRating), 0) / reportData.toursPerformance.length).toFixed(1)}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {previewMode === 'chart' && (
            <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization available in downloaded reports</p>
              </div>
            </div>
          )}

          {previewMode === 'table' && (
            <div className="overflow-x-auto">
              <div className="text-sm text-gray-500 mb-4">
                Data preview - Full dataset in downloaded report
              </div>
              {selectedReport === "revenue" && safeEntries(reportData.tourBreakdown).length > 0 && (
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Tour</th>
                      <th className="p-3 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeEntries(reportData.tourBreakdown).slice(0, 5).map(([tour, revenue]) => (
                      <tr key={tour} className="border-t">
                        <td className="p-3">{tour}</td>
                        <td className="p-3 text-right">${safeNumber(revenue).toLocaleString()}</td>
                      </tr>
                    ))}
                    {safeEntries(reportData.tourBreakdown).length > 5 && (
                      <tr className="border-t bg-gray-50">
                        <td className="p-3 text-sm text-gray-500" colSpan={2}>
                          +{safeEntries(reportData.tourBreakdown).length - 5} more rows in full report
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Business Reports
              </h1>
              <p className="text-gray-600 text-lg">
                Generate comprehensive insights and download detailed reports
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Report Selection */}
            <div className="xl:col-span-4">
              <Card className="sticky top-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Select Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {reportCategories.map((category) => (
                    <div key={category.id} className="space-y-3">
                      <div className={`p-4 rounded-lg border ${category.bgColor} ${category.borderColor}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <category.icon className={`h-4 w-4 ${category.color}`} />
                          <h4 className={`font-semibold text-sm ${category.color}`}>{category.name}</h4>
                        </div>
                        <div className="space-y-2">
                          {category.reports.map((report) => (
                            <button
                              key={report.id}
                              onClick={() => handleReportSelect(category.id, report.id)}
                              className={`w-full text-left p-3 rounded-md border transition-all duration-200 ${
                                selectedReport === report.id
                                  ? 'bg-white border-gray-300 shadow-sm ring-2 ring-blue-100'
                                  : 'bg-white/60 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                  <report.icon className="h-4 w-4 text-gray-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="font-medium text-sm text-gray-900 truncate pr-2">
                                      {report.name}
                                    </p>
                                    {selectedReport === report.id && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 leading-relaxed mb-2 break-words">
                                    {report.description}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <Badge variant="outline" className="text-xs px-2 py-0.5 font-normal">
                                      {report.estimatedTime}
                                    </Badge>
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs px-2 py-0.5 font-normal ${
                                        report.complexity === 'advanced' ? 'text-orange-600 border-orange-300' :
                                        report.complexity === 'detailed' ? 'text-blue-600 border-blue-300' :
                                        'text-green-600 border-green-300'
                                      }`}
                                    >
                                      {report.complexity}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Report Configuration */}
            <div className="xl:col-span-8 space-y-6">
              {/* Configuration Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Report Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!selectedReport ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Select a report type to get started</p>
                    </div>
                  ) : (
                    <>
                      {/* Report Name */}
                      <div className="space-y-2">
                        <Label htmlFor="reportName">Report Name</Label>
                        <Input
                          id="reportName"
                          value={reportConfig.reportName}
                          onChange={(e) => setReportConfig(prev => ({ ...prev, reportName: e.target.value }))}
                          placeholder="Enter custom report name..."
                        />
                      </div>

                      {/* Date Range */}
                      <div className="space-y-4">
                        <Label>Date Range</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                          {datePresets.map((preset) => (
                            <Button
                              key={preset.id}
                              variant="outline"
                              size="sm"
                              onClick={() => handleDatePreset(preset)}
                              className="text-xs whitespace-nowrap"
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm">From Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start h-10">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dateRange.from ? format(dateRange.from, 'PPP') : 'Select date'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={dateRange.from}
                                  onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div>
                            <Label className="text-sm">To Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start h-10">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dateRange.to ? format(dateRange.to, 'PPP') : 'Select date'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={dateRange.to}
                                  onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>

                      {/* Export Format */}
                      <div className="space-y-3">
                        <Label>Export Format</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {exportFormats.map((format) => (
                            <button
                              key={format.id}
                              onClick={() => setReportConfig(prev => ({ ...prev, format: format.id }))}
                              className={`p-4 rounded-lg border transition-colors ${
                                reportConfig.format === format.id
                                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                              }`}
                            >
                              <format.icon className={`h-8 w-8 mx-auto mb-3 ${format.color}`} />
                              <p className="font-medium text-sm text-center">{format.name}</p>
                              <p className="text-xs text-gray-500 text-center mt-1">{format.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Report Options */}
                      <div className="space-y-3">
                        <Label>Report Options</Label>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="includeCharts"
                              checked={reportConfig.includeCharts}
                              onCheckedChange={(checked) => 
                                setReportConfig(prev => ({ ...prev, includeCharts: !!checked }))
                              }
                            />
                            <Label htmlFor="includeCharts">Include charts and visualizations</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="includeRawData"
                              checked={reportConfig.includeRawData}
                              onCheckedChange={(checked) => 
                                setReportConfig(prev => ({ ...prev, includeRawData: !!checked }))
                              }
                            />
                            <Label htmlFor="includeRawData">Include raw data tables</Label>
                          </div>
                        </div>
                      </div>

                      {/* Generate Button */}
                      <div className="pt-4 border-t">
                        <Button
                          onClick={handleGenerateReport}
                          disabled={!selectedReport || !dateRange.from || isGenerating}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          size="lg"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Generating Report...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Generate & Download Report
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Report Preview */}
              {reportData && renderReportPreview()}

              {/* Recent Reports */}
              {recentReports.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Recent Downloads
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReports.slice(0, 5).map((report) => (
                        <div key={report.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3 mb-3 sm:mb-0">
                            <div className="p-2 bg-white rounded-md">
                              <FileText className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm text-gray-900 truncate">{report.name}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">{report.type}</Badge>
                                <Badge variant="outline" className="text-xs">{report.format}</Badge>
                                <span className="text-xs text-gray-500">{report.size}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:flex-shrink-0">
                            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
