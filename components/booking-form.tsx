"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { fetchWithAuth } from "@/lib/client-auth"

interface BookingFormProps {
  serviceId: string
  serviceName: string
  packages: Array<{ name: string; price: string }>
}

export function BookingForm({ serviceId, serviceName, packages }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [clientData, setClientData] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    package: "",
    message: "",
  })

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      const response = await fetch('/api/auth/client/me')
      if (response.ok) {
        const data = await response.json()
        const client = data.client || data
        setIsLoggedIn(true)
        setClientData(client)
        // Pre-fill form with client data
        setFormData(prev => ({
          ...prev,
          name: client.name || "",
          email: client.email || "",
          phone: client.phone || "",
          company: client.company || "",
        }))
      }
    } catch (error) {
      console.log('Not logged in or error checking auth')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const selectedPackage = packages.find(pkg => pkg.name === formData.package)
      
      if (isLoggedIn) {
        // Create inquiry for logged-in client
        const response = await fetchWithAuth('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId,
            serviceName,
            packageName: formData.package,
            packagePrice: selectedPackage?.price || '',
            message: formData.message,
            totalAmount: selectedPackage?.price || '',
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create inquiry')
        }

        const inquiry = await response.json()

        // Send WhatsApp message
        const whatsappMessage = `🎯 *New Service Inquiry*\n\n*Service:* ${serviceName}\n*Package:* ${formData.package}\n*Price:* ${selectedPackage?.price}\n*Invoice:* ${inquiry.invoiceNumber}\n\n*Client Details:*\n👤 ${formData.name}\n📧 ${formData.email}\n📱 ${formData.phone}\n🏢 ${formData.company || 'N/A'}\n\n*Message:*\n${formData.message}\n\n_Inquiry created in client dashboard_`
        
        const whatsappUrl = `https://wa.me/8801401658685?text=${encodeURIComponent(whatsappMessage)}`
        window.open(whatsappUrl, '_blank')

        toast({
          title: "✅ Inquiry Created Successfully!",
          description: "Your inquiry has been added to your dashboard. We'll contact you soon via WhatsApp.",
        })

        // Redirect to client dashboard
        setTimeout(() => {
          router.push('/client/dashboard')
        }, 2000)
      } else {
        // Guest user - only send WhatsApp message
        const whatsappMessage = `🎯 *New Service Inquiry*\n\n*Service:* ${serviceName}\n*Package:* ${formData.package}\n*Price:* ${selectedPackage?.price}\n\n*Client Details:*\n👤 ${formData.name}\n📧 ${formData.email}\n📱 ${formData.phone}\n🏢 ${formData.company || 'N/A'}\n\n*Message:*\n${formData.message}\n\n_Login to track this inquiry: ${window.location.origin}/client/login_`
        
        const whatsappUrl = `https://wa.me/8801401658685?text=${encodeURIComponent(whatsappMessage)}`
        window.open(whatsappUrl, '_blank')

        toast({
          title: "📱 WhatsApp Message Sent!",
          description: "Login or register to track your inquiry and get instant updates.",
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          package: "",
          message: "",
        })
      }
    } catch (error: any) {
      console.error('Error submitting inquiry:', error)
      toast({
        title: "❌ Submission Failed",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Login Status Alert */}
      {isLoggedIn ? (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-300">Logged in as {clientData?.name}</p>
            <p className="text-xs text-green-400/80">Your inquiry will be added to your dashboard automatically</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-yellow-300">Not logged in</p>
            <p className="text-xs text-yellow-400/80">
              <button
                type="button"
                onClick={() => router.push('/client/login')}
                className="underline hover:text-yellow-300"
              >
                Login
              </button>
              {' '}or{' '}
              <button
                type="button"
                onClick={() => router.push('/client/register')}
                className="underline hover:text-yellow-300"
              >
                register
              </button>
              {' '}to track your inquiry with invoice
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Full Name *
          </Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            disabled={isLoggedIn}
            className="liquid-glass border-white/20 bg-white/5 text-white placeholder:text-gray-500 disabled:opacity-60"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={isLoggedIn}
            className="liquid-glass border-white/20 bg-white/5 text-white placeholder:text-gray-500 disabled:opacity-60"
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            disabled={isLoggedIn}
            className="liquid-glass border-white/20 bg-white/5 text-white placeholder:text-gray-500 disabled:opacity-60"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-white">
            Company Name
          </Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            disabled={isLoggedIn}
            className="liquid-glass border-white/20 bg-white/5 text-white placeholder:text-gray-500 disabled:opacity-60"
            placeholder="Your Company"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="package" className="text-white">
          Select Package *
        </Label>
        <Select required value={formData.package} onValueChange={(value) => handleChange("package", value)}>
          <SelectTrigger className="liquid-glass border-white/20 bg-white/5 text-white">
            <SelectValue placeholder="Choose a package" />
          </SelectTrigger>
          <SelectContent className="liquid-glass border-white/20 bg-gray-900 text-white">
            {packages.filter(pkg => pkg.name && pkg.name.trim() !== "").map((pkg) => (
              <SelectItem key={pkg.name} value={pkg.name}>
                {pkg.name} - {pkg.price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-white">
          Project Details *
        </Label>
        <Textarea
          id="message"
          required
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          className="liquid-glass border-white/20 bg-white/5 text-white placeholder:text-gray-500 min-h-[120px]"
          placeholder="Tell us about your project, timeline, and any specific requirements..."
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-lime-400 px-8 py-6 text-base font-semibold text-black hover:bg-lime-300"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {isLoggedIn ? 'Creating Inquiry...' : 'Sending Message...'}
          </>
        ) : (
          <>
            {isLoggedIn ? '📋 Create Inquiry & Send WhatsApp' : '📱 Send WhatsApp Message'}
          </>
        )}
      </Button>

      <p className="text-center text-sm text-gray-400">
        {isLoggedIn 
          ? "Your inquiry will be saved with an invoice number and tracked in your dashboard"
          : "By submitting, you agree to our terms. Login to get invoice & tracking"}
      </p>
    </form>
  )
}
