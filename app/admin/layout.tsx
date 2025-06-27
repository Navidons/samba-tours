'use client'

import type React from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Handle redirection if not authenticated after loading is complete
  if (!loading && !user) {
    router.replace("/signin")
    return null; // Prevent rendering anything while redirecting
  }

  // Show a loading spinner or null while authenticating
  if (loading) {
    return null 
  }

  // Render the admin layout if authenticated and not loading
  if (user) {
  return <AdminLayout>{children}</AdminLayout>
  }

  return null; // Fallback, should ideally not be reached
}
