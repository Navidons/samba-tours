"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { useRateLimit } from "@/hooks/use-rate-limit"

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()
  const { isRateLimited, recordAttempt, resetAttempts, remainingAttempts } = useRateLimit({
    maxAttempts: 5,
    windowMs: 300000 // 5 minutes
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLoading) return // Prevent multiple submissions
    
    // Check rate limiting
    if (isRateLimited) {
      toast.error(`Too many sign in attempts. Please wait before trying again.`)
      return
    }
    
    setIsLoading(true)
    recordAttempt()

    try {
      const supabase = createClient()
      
      console.log('Attempting to sign in with:', formData.email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })

      if (error) {
        console.error('Sign in error:', error)
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          toast.error(`Invalid email or password. ${remainingAttempts} attempts remaining.`)
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please check your email and confirm your account')
        } else {
          toast.error('Sign in failed. Please try again.')
        }
        return
      }

      console.log('Sign in successful:', data)

      if (data.user && data.session) {
        resetAttempts() // Reset attempts on successful login
        
        // Verify the session was properly set
        const { data: { session } } = await supabase.auth.getSession()
        
        console.log('Session verification:', session ? 'Session found' : 'No session')
        
        if (session) {
          toast.success('Signed in successfully')
          
          // Force a page reload to ensure all auth state is properly set
          window.location.href = '/admin'
        } else {
          toast.error('Session not established. Please try again.')
        }
      } else {
        toast.error('Authentication failed. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email address
        </Label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="pl-10"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isLoading || isRateLimited}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="pl-10 pr-10"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={isLoading || isRateLimited}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading || isRateLimited}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isRateLimited && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          Too many sign in attempts. Please wait 5 minutes before trying again.
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-forest-600 hover:bg-forest-700" 
        disabled={isLoading || !formData.email || !formData.password || isRateLimited}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Signing in...
          </div>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  )
}
