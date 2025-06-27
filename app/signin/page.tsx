import type { Metadata } from "next"
import SignInForm from "@/components/auth/signin-form"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign In - Samba Tours & Travel",
  description: "Sign in to your account to manage bookings and preferences",
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-forest-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">ST</span>
            </div>
            <div>
              <h1 className="font-playfair text-2xl font-bold text-earth-900">Samba Tours</h1>
              <p className="text-sm text-earth-600">& Travel</p>
            </div>
          </div>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-earth-900">Sign in to your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
