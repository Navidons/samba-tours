import type { Metadata } from "next"
import BookingsContent from "@/components/bookings/bookings-content"
import { Suspense } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"

export const metadata: Metadata = {
  title: "My Bookings - Samba Tours & Travel",
  description: "View and manage your tour bookings",
}

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max px-4 py-8">
            <Suspense fallback={<LoadingSpinner />}>
              <BookingsContent />
            </Suspense>
      </div>
    </div>
  )
}
