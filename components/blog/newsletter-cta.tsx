"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Mail, Send, CheckCircle } from "lucide-react"

export default function NewsletterCTA() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog" }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "You've been subscribed to our travel insights newsletter.",
        })
        setEmail("")
      } else {
        throw new Error("Failed to subscribe")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="section-padding bg-gradient-to-r from-forest-800 to-forest-600 text-white">
      <div className="container-max">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-forest-500 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>

          <h2 className="font-playfair text-3xl lg:text-4xl font-bold mb-4">Never Miss a Travel Story</h2>
          <p className="text-xl text-forest-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who get our weekly newsletter with expert tips, destination guides, and
            exclusive stories from Uganda's wilderness.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-cream-100 hover:bg-cream-200 text-earth-800 px-6 h-12"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-earth-800 border-t-transparent" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>

          <div className="flex items-center justify-center space-x-6 text-sm text-forest-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Weekly travel insights</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Exclusive stories</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>No spam, unsubscribe anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
