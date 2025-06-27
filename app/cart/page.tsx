"use client"

import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import CartContent from "@/components/cart/cart-content"
import { Suspense } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const router = useRouter()
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container-max px-4 py-8">
          <Suspense fallback={<LoadingSpinner />}>
            <CartContent onCheckoutSuccess={() => router.push("/cart/confirmation")} />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  )
}
