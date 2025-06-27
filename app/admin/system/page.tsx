import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Server,
  Database,
  HardDrive,
  Cpu,
  MemoryStickIcon as Memory,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Shield,
  Clock,
} from "lucide-react"

export const metadata = {
  title: "System Monitor - Samba Tours Admin",
  description: "Monitor system health and performance.",
}

const systemStats = [
  {
    name: "CPU Usage",
    value: 45,
    status: "good",
    icon: Cpu,
    color: "text-green-600",
  },
  {
    name: "Memory Usage",
    value: 68,
    status: "warning",
    icon: Memory,
    color: "text-yellow-600",
  },
  {
    name: "Disk Usage",
    value: 32,
    status: "good",
    icon: HardDrive,
    color: "text-green-600",
  },
  {
    name: "Database Size",
    value: 78,
    status: "warning",
    icon: Database,
    color: "text-yellow-600",
  },
]

const systemLogs = [
  {
    timestamp: "2024-06-21 14:30:25",
    level: "INFO",
    message: "Daily backup completed successfully",
    component: "Backup Service",
  },
  {
    timestamp: "2024-06-21 14:15:12",
    level: "WARNING",
    message: "High memory usage detected (85%)",
    component: "System Monitor",
  },
  {
    timestamp: "2024-06-21 13:45:33",
    level: "INFO",
    message: "New user registration: sarah@example.com",
    component: "Auth Service",
  },
  {
    timestamp: "2024-06-21 13:30:18",
    level: "ERROR",
    message: "Failed to send email notification",
    component: "Email Service",
  },
  {
    timestamp: "2024-06-21 12:15:44",
    level: "INFO",
    message: "Payment processed successfully: $1,200",
    component: "Payment Gateway",
  },
]

const services = [
  {
    name: "Web Server",
    status: "running",
    uptime: "99.9%",
    lastRestart: "2024-06-15 10:30:00",
  },
  {
    name: "Database",
    status: "running",
    uptime: "99.8%",
    lastRestart: "2024-06-10 08:15:00",
  },
  {
    name: "Email Service",
    status: "warning",
    uptime: "98.5%",
    lastRestart: "2024-06-21 13:30:00",
  },
  {
    name: "Payment Gateway",
    status: "running",
    uptime: "99.7%",
    lastRestart: "2024-06-12 14:20:00",
  },
  {
    name: "Backup Service",
    status: "running",
    uptime: "100%",
    lastRestart: "2024-06-01 00:00:00",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "running":
      return "bg-green-100 text-green-800"
    case "warning":
      return "bg-yellow-100 text-yellow-800"
    case "error":
      return "bg-red-100 text-red-800"
    case "stopped":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getLogLevelColor = (level: string) => {
  switch (level) {
    case "INFO":
      return "bg-blue-100 text-blue-800"
    case "WARNING":
      return "bg-yellow-100 text-yellow-800"
    case "ERROR":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function SystemMonitor() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-earth-900 mb-2">System Monitor</h1>
              <p className="text-earth-600">Monitor system health and performance</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </div>

          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {systemStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    <Badge
                      className={
                        stat.status === "good" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {stat.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-earth-900 mb-2">{stat.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage</span>
                      <span>{stat.value}%</span>
                    </div>
                    <Progress value={stat.value} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="services" className="space-y-6">
            <TabsList>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="logs">System Logs</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Services */}
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    System Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {service.status === "running" ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            )}
                            <h4 className="font-medium text-earth-900">{service.name}</h4>
                          </div>
                          <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-earth-600">
                          <div>
                            <span className="font-medium">Uptime: </span>
                            {service.uptime}
                          </div>
                          <div>
                            <span className="font-medium">Last Restart: </span>
                            {service.lastRestart}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Activity className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Logs */}
            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>System Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemLogs.map((log, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getLogLevelColor(log.level)}>{log.level}</Badge>
                              <span className="text-sm text-earth-600">{log.component}</span>
                            </div>
                            <p className="text-sm text-earth-900">{log.message}</p>
                            <p className="text-xs text-earth-500 mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {log.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance */}
            <TabsContent value="performance">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Average Response Time</span>
                        <span className="text-sm text-green-600">245ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Requests per Minute</span>
                        <span className="text-sm text-blue-600">1,247</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Error Rate</span>
                        <span className="text-sm text-red-600">0.02%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Cache Hit Rate</span>
                        <span className="text-sm text-green-600">94.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resource Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Bandwidth Usage</span>
                          <span>2.4 GB / 10 GB</span>
                        </div>
                        <Progress value={24} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Storage Usage</span>
                          <span>45.2 GB / 100 GB</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>API Calls</span>
                          <span>8,432 / 50,000</span>
                        </div>
                        <Progress value={17} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SSL Certificate</span>
                        <Badge className="bg-green-100 text-green-800">Valid</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Firewall Status</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Security Scan</span>
                        <span className="text-sm text-earth-600">2024-06-21 08:00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Failed Login Attempts</span>
                        <span className="text-sm text-red-600">3 (last 24h)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Security Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <p className="font-medium">Suspicious login attempt blocked</p>
                        <p className="text-earth-600">IP: 192.168.1.100 - 2 hours ago</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">SSL certificate renewed</p>
                        <p className="text-earth-600">Valid until: 2025-06-21</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Security scan completed</p>
                        <p className="text-earth-600">No vulnerabilities found</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
