import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Globe, Mail, Bell, Shield, CreditCard, Database, Upload, Save, RefreshCw } from "lucide-react"

export const metadata = {
  title: "Settings - Samba Tours Admin",
  description: "Manage system settings and configurations.",
}

export default function AdminSettings() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="section-padding">
        <div className="container-max max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-earth-900 mb-2">Settings</h1>
            <p className="text-earth-600">Manage your system settings and configurations</p>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" defaultValue="Samba Tours Uganda" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-description">Description</Label>
                      <Textarea
                        id="company-description"
                        defaultValue="Premier tour operator in Uganda specializing in wildlife safaris and cultural experiences."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue="+256 123 456 789" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="info@sambatours.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" defaultValue="Kampala, Uganda" rows={2} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Website Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="site-url">Site URL</Label>
                      <Input id="site-url" defaultValue="https://sambatours.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="africa/kampala">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="africa/kampala">Africa/Kampala</SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="america/new_york">America/New_York</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="ugx">UGX (USh)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                      <Switch id="maintenance-mode" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Email Settings */}
            <TabsContent value="email">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      SMTP Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">SMTP Host</Label>
                      <Input id="smtp-host" placeholder="smtp.gmail.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">Port</Label>
                        <Input id="smtp-port" placeholder="587" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-encryption">Encryption</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select encryption" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tls">TLS</SelectItem>
                            <SelectItem value="ssl">SSL</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-username">Username</Label>
                      <Input id="smtp-username" placeholder="your-email@gmail.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">Password</Label>
                      <Input id="smtp-password" type="password" placeholder="••••••••" />
                    </div>
                    <Button className="w-full">Test Connection</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Email Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="from-name">From Name</Label>
                      <Input id="from-name" defaultValue="Samba Tours" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from-email">From Email</Label>
                      <Input id="from-email" defaultValue="noreply@sambatours.com" />
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="font-medium">Email Notifications</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="booking-confirmation">Booking Confirmation</Label>
                          <Switch id="booking-confirmation" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="payment-receipt">Payment Receipt</Label>
                          <Switch id="payment-receipt" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="tour-reminder">Tour Reminder</Label>
                          <Switch id="tour-reminder" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="newsletter">Newsletter</Label>
                          <Switch id="newsletter" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Admin Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="new-booking">New Booking</Label>
                          <Switch id="new-booking" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="payment-received">Payment Received</Label>
                          <Switch id="payment-received" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="cancellation">Cancellation</Label>
                          <Switch id="cancellation" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="new-review">New Review</Label>
                          <Switch id="new-review" defaultChecked />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Customer Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="booking-updates">Booking Updates</Label>
                          <Switch id="booking-updates" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="promotional">Promotional Emails</Label>
                          <Switch id="promotional" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="tour-tips">Tour Tips</Label>
                          <Switch id="tour-tips" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="feedback-request">Feedback Requests</Label>
                          <Switch id="feedback-request" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <Switch id="two-factor" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-attempts">Limit Login Attempts</Label>
                      <Switch id="login-attempts" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="60" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-policy">Password Policy</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (6+ characters)</SelectItem>
                          <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                          <SelectItem value="high">High (12+ chars, symbols)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Backup & Recovery</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-backup">Automatic Backups</Label>
                      <Switch id="auto-backup" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Backup Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retention-days">Retention Period (days)</Label>
                      <Input id="retention-days" type="number" defaultValue="30" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Database className="h-4 w-4 mr-2" />
                        Create Backup
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Restore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payments */}
            <TabsContent value="payments">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Gateways
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Stripe</h4>
                          <p className="text-sm text-earth-600">Credit cards, digital wallets</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">PayPal</h4>
                          <p className="text-sm text-earth-600">PayPal payments</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Mobile Money</h4>
                          <p className="text-sm text-earth-600">MTN, Airtel Uganda</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="deposit-percentage">Deposit Percentage</Label>
                      <Input id="deposit-percentage" type="number" defaultValue="30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cancellation-policy">Cancellation Policy</Label>
                      <Select defaultValue="flexible">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flexible">Flexible (24h)</SelectItem>
                          <SelectItem value="moderate">Moderate (7 days)</SelectItem>
                          <SelectItem value="strict">Strict (30 days)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-refund">Automatic Refunds</Label>
                      <Switch id="auto-refund" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="processing-fee">Processing Fee (%)</Label>
                      <Input id="processing-fee" type="number" step="0.1" defaultValue="2.9" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Integrations */}
            <TabsContent value="integrations">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Third-Party Integrations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Google Analytics</h4>
                          <p className="text-sm text-earth-600">Website analytics</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">WhatsApp Business</h4>
                          <p className="text-sm text-earth-600">Customer communication</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Mailchimp</h4>
                          <p className="text-sm text-earth-600">Email marketing</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>API Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <div className="flex gap-2">
                        <Input id="api-key" value="sk_live_••••••••••••••••" readOnly />
                        <Button variant="outline" size="sm">
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="api-access">Enable API Access</Label>
                      <Switch id="api-access" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate-limit">Rate Limit (requests/hour)</Label>
                      <Input id="rate-limit" type="number" defaultValue="1000" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Advanced */}
            <TabsContent value="advanced">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Database className="h-4 w-4 mr-2" />
                      Optimize Database
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="debug-mode">Debug Mode</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-earth-600">Enable detailed error logging</span>
                        <Switch id="debug-mode" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="image-optimization">Image Optimization</Label>
                      <Switch id="image-optimization" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cdn">CDN Acceleration</Label>
                      <Switch id="cdn" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cache-duration">Cache Duration (hours)</Label>
                      <Input id="cache-duration" type="number" defaultValue="24" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-upload">Max Upload Size (MB)</Label>
                      <Input id="max-upload" type="number" defaultValue="10" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button className="bg-forest-600 hover:bg-forest-700">
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
