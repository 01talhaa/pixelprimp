"use client"

import { MessageCircle, X } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)

  const whatsappNumbers = [
    { number: "8801401658685", label: "+880 1401-658685" },
    { number: "8801682888934", label: "+880 1682-888934" },
  ]

  const handleWhatsAppClick = (number: string) => {
    const message = encodeURIComponent("Hi! I'm interested in your services.")
    const url = `https://wa.me/${number}?text=${message}`
    window.open(url, "_blank")
    setIsOpen(false)
  }

  return (
    <>
      {/* Options Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="fixed bottom-24 right-4 sm:right-8 z-[9999]" onClick={(e) => e.stopPropagation()}>
            <Card className="liquid-glass border border-white/10 bg-black/80 backdrop-blur-xl p-4 w-64">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Chat with us</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-4">Choose a number to start chatting on WhatsApp</p>
              <div className="space-y-2">
                {whatsappNumbers.map((item) => (
                  <Button
                    key={item.number}
                    onClick={() => handleWhatsAppClick(item.number)}
                    className="w-full rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-8 z-[9999] h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse"></span>
      </button>
    </>
  )
}
