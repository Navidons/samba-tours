"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Send, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
    priority: "Normal",
  });
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccess(true)
        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for reaching out. We'll get back to you shortly.",
        })
        // Reset form after a delay to show success message
        setTimeout(() => {
          setFormData({ name: "", email: "", subject: "", message: "", phone: "", priority: "Normal" });
          setIsSuccess(false);
        }, 5000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center p-10 flex flex-col items-center justify-center h-full bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl shadow-lg border border-emerald-100">
        <CheckCircle className="h-16 w-16 text-emerald-500 mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-emerald-800 mb-2">Message Sent!</h3>
        <p className="text-emerald-700 text-lg">
          We've received your inquiry and will respond as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <Card id="contact-form" className="w-full shadow-xl border-l-8 border-emerald-500 rounded-2xl bg-white/90">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl flex items-center gap-2 text-emerald-800">
          <Send className="h-6 w-6 text-emerald-500" />
          Send us a Message
        </CardTitle>
        <p className="text-emerald-700 text-base mt-2">
          Have a question or a project in mind? Let's talk.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-emerald-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input 
                id="name" 
                name="name" 
                type="text" 
                required 
                placeholder="Your full name" 
                value={formData.name}
                onChange={handleInputChange}
                className="rounded-lg border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200 bg-emerald-50/50"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-emerald-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="rounded-lg border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200 bg-emerald-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-emerald-700 mb-2">
                Phone
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g. +256 700 123 456"
                value={formData.phone}
                onChange={handleInputChange}
                className="rounded-lg border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200 bg-emerald-50/50"
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-emerald-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full rounded-lg border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200 bg-emerald-50/50 px-3 py-2"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-emerald-700 mb-2">
              Subject
            </label>
            <Input 
              id="subject" 
              name="subject" 
              type="text" 
              placeholder="What is this about?" 
              value={formData.subject}
              onChange={handleInputChange}
              className="rounded-lg border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200 bg-emerald-50/50"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-emerald-700 mb-2">
              Your Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="message"
              name="message"
              required
              rows={6}
              placeholder="Tell us about your inquiry..."
              value={formData.message}
              onChange={handleInputChange}
              className="rounded-lg border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200 bg-emerald-50/50"
            />
          </div>

          <div>
            <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-emerald-600 hover:to-blue-600 transition-all duration-200" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}