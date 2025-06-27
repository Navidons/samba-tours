"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle chat message submission
    console.log("Chat message:", message)
    setMessage("")
  }

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 z-50">
          <Card className="h-full flex flex-col shadow-2xl">
            <CardHeader className="bg-forest-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Chat with us</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-forest-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-forest-100">We're here to help!</p>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-4">
              <div className="flex-1 mb-4 space-y-3">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm">Hello! How can we help you plan your Uganda adventure today?</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="sm" className="bg-forest-600 hover:bg-forest-700">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-forest-600 hover:bg-forest-700 shadow-lg z-50"
        size="sm"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </>
  )
}
