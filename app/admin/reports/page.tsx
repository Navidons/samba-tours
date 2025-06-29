import ReportsClient from "./ReportsClient"

export const metadata = {
  title: "Business Reports - Samba Tours Analytics",
  description: "Comprehensive business intelligence and reporting dashboard for Samba Tours. Generate detailed insights on revenue, bookings, customers, and tour performance.",
  keywords: ["business reports", "analytics", "tourism", "revenue", "bookings", "customer insights"]
}

export default function Reports() {
  return <ReportsClient />
}
