"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

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

export default function ReportsClient() {
  const [selectedReportType, setSelectedReportType] = useState("")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [reportName, setReportName] = useState("")
  const [format, setFormat] = useState("pdf")

  const handleGenerateReport = () => {
    // Handle report generation
    console.log("Generating report:", {
      type: selectedReportType,
      name: reportName,
      dateFrom,
      dateTo,
      format,
    })
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
                    <div className="space-y-2">
                      <Label>Date From</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateFrom ? format(dateFrom, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Date To</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateTo ? format(dateTo, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
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
                    disabled={!selectedReportType || !reportName}
                    className="w-full bg-forest-600 hover:bg-forest-700"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
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
                        <p className="text-sm text-earth-500">Generated: {report.generated}</p>
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
