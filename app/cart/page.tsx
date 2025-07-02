import type { Metadata } from "next"
import CartContent from "@/components/cart/cart-content"

export const metadata: Metadata = {
  title: "Your Cart - Samba Tours & Travel",
  description: "Review your selected tours and proceed to booking. Secure your Uganda adventure with our easy booking process.",
  keywords: "tour cart, booking cart, uganda tours booking, safari booking checkout",
}

export default function CartPage() {
  return <CartContent />
} 