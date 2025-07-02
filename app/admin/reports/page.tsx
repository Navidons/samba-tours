import ReportsClient from "./ReportsClient"

export const metadata = {
  title: "Business Reports & Analytics - Samba Tours Admin",
  description: "Modern business intelligence dashboard for Samba Tours. Generate comprehensive reports on revenue, customer insights, booking analytics, and tour performance with downloadable formats.",
  keywords: ["business intelligence", "analytics dashboard", "revenue reports", "customer insights", "booking analytics", "tour performance", "data export", "business metrics"]
}

export default function Reports() {
  return <ReportsClient />
}
