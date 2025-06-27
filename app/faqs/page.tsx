import type { Metadata } from "next"
import FaqsClientPage from "./FaqsClientPage"

export const metadata: Metadata = {
  title: "Frequently Asked Questions - Samba Tours & Travel",
  description: "Find answers to common questions about Uganda tours, booking process, travel requirements, and more.",
  keywords: "uganda travel faq, safari questions, gorilla trekking faq, booking help, travel requirements",
}

export default function FAQsPage() {
  return <FaqsClientPage />
}
