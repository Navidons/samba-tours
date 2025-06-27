import type { Metadata } from "next"
import ContactManagement from "@/components/admin/contact-management"

export const metadata: Metadata = {
  title: "Contact Management - Admin",
}

export default function AdminContactPage() {
  return <ContactManagement />
}
