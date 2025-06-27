"use client"

import { useEffect, useState } from "react"
import Confetti from "react-confetti"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

interface BookingSummary {
  items: Array<{
    tour_title: string;
    travel_date: string;
    number_of_guests: number;
  }>;
  total: number;
  bookingReference: string;
}

export default function CartConfirmationPage() {
  const [showConfetti, setShowConfetti] = useState(true)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [summary, setSummary] = useState<BookingSummary | null>(null)

  useEffect(() => {
    // Set dimensions for confetti
    setDimensions({ width: window.innerWidth, height: window.innerHeight })
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener("resize", handleResize)

    // Stop confetti after a few seconds
    const timer = setTimeout(() => setShowConfetti(false), 8000)

    // Load summary from localStorage
    const savedSummary = localStorage.getItem('bookingSummary')
    if (savedSummary) {
      setSummary(JSON.parse(savedSummary))
      localStorage.removeItem('bookingSummary') // Clean up
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      <Header />
      {showConfetti && <Confetti width={dimensions.width} height={dimensions.height} recycle={false} />} 
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
          <div className="p-4 bg-emerald-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
             <svg className="h-12 w-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
             </svg>
          </div>
          <h1 className="text-4xl font-bold text-emerald-600 mb-4">Congratulations!</h1>
          <p className="text-lg text-gray-700 mb-6">
            Your booking is confirmed! A summary has been sent to your email address.
            <br />
            Our team will contact you shortly to follow up.
          </p>
          
          {summary ? (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">Booking Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Booking Reference:</span>
                  <span className="font-bold text-gray-900 font-mono">#{summary.bookingReference}</span>
                </div>
                {summary.items.map((item, index) => (
                  <div key={index} className="py-3 border-b last:border-b-0">
                    <h3 className="font-semibold text-gray-800">{item.tour_title}</h3>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>Date: {new Date(item.travel_date).toLocaleDateString()}</span>
                      <span>Guests: {item.number_of_guests}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 text-lg">
                  <span className="font-semibold text-gray-800">Total Amount:</span>
                  <span className="font-bold text-emerald-600">${summary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
             <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
             </div>
          )}

          <p className="text-gray-600 mb-8">
            Thank you for choosing Samba Tours & Travel!
          </p>
          <a href="/" className="inline-block mt-4 px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold shadow-md hover:bg-emerald-700 transition-transform transform hover:scale-105">
            Back to Home
          </a>
        </div>
      </div>
      <Footer />
    </>
  )
} 