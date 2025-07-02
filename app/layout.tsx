"use client"

import type React from "react"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import LiveChat from "@/components/ui/live-chat"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { CartProvider } from "@/components/cart/cart-context"
import { trackVisitor } from "@/lib/system-monitor"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Inter, Playfair_Display } from "next/font/google"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

// Client-side tracking component
function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track visitor on each page load
    trackVisitor(pathname);
  }, [pathname]);

  return null;
}

// Layout content component to handle conditional header/footer
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Admin routes - no header/footer
    return <>{children}</>;
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
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-inter bg-cream-50 text-earth-900">
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
      </body>
    </html>
  )
}
