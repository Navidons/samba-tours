import { AlertTriangle, Phone, MessageCircle, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const emergencyContacts = [
  {
    title: "Medical Emergency",
    phone: "+256 700 123 456",
    description: "24/7 medical assistance and evacuation support",
    icon: AlertTriangle,
    color: "text-red-600",
  },
  {
    title: "Travel Emergency",
    phone: "+256 700 123 457",
    description: "Lost documents, missed flights, urgent changes",
    icon: Phone,
    color: "text-orange-600",
  },
  {
    title: "Security Assistance",
    phone: "+256 700 123 458",
    description: "Safety concerns and security support",
    icon: MapPin,
    color: "text-purple-600",
  },
]

export default function EmergencyContact() {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-900">
          <AlertTriangle className="h-5 w-5" />
          Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-red-700 mb-4">Available 24/7 for urgent assistance during your travels</p>

        {emergencyContacts.map((contact, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <contact.icon className={`h-5 w-5 mt-1 ${contact.color}`} />
              <div className="flex-1">
                <h4 className="font-semibold text-earth-900 mb-1">{contact.title}</h4>
                <p className="text-sm text-earth-600 mb-2">{contact.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`tel:${contact.phone}`}>
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}>
                      <MessageCircle className="h-4 w-4 mr-1" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white p-4 rounded-lg border border-red-200">
          <h4 className="font-semibold text-earth-900 mb-2">Embassy Contacts</h4>
          <div className="text-sm text-earth-600 space-y-1">
            <div>US Embassy: +256 414 259 791</div>
            <div>UK Embassy: +256 312 312 000</div>
            <div>German Embassy: +256 414 501 111</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
