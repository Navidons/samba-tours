'use client'

import type React from "react"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          console.log('Admin layout: User authenticated:', session.user.email)
          setUser(session.user)
        } else {
          console.log('Admin layout: No session found, redirecting to signin')
          router.replace('/signin')
        }
      } catch (error) {
        console.error('Admin layout auth error:', error)
        router.replace('/signin')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Admin layout auth state change:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          setLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          router.replace('/signin')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, supabase.auth])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Show admin layout if authenticated
  if (user) {
    return <AdminLayout>{children}</AdminLayout>
  }

  // Don't render anything while redirecting
  return null
}
