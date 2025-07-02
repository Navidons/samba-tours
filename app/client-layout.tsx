"use client"

import type React from "react"
import { Toaster } from "@/components/ui/sonner"
import LiveChat from "@/components/ui/live-chat"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { CartProvider } from "@/components/cart/cart-context"
import { trackVisitor } from "@/lib/system-monitor"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

// Client-side tracking component
function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track visitor on each page load
    trackVisitor(pathname)
  }, [pathname])

  return null
}

// Layout content component to handle conditional header/footer
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    // Admin routes - no header/footer
    return <>{children}</>
  }

  // Regular pages - with header/footer
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
          <VisitorTracker />
          <LiveChat />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
} 