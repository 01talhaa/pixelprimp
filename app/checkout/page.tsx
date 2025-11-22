"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Check, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { fetchWithAuth } from "@/lib/client-auth"

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [clientData, setClientData] = useState<any>(null)
  const [service, setService] = useState<any>(null)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })

  const serviceId = searchParams.get("service")
  const packageIndex = searchParams.get("package")

  useEffect(() => {
    checkAuthAndLoadData()
    fetchService()
  }, [serviceId, packageIndex])

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

  const fetchService = async () => {
    if (!serviceId) {
      router.push("/services")
      return
    }

    try {
      const response = await fetch(`/api/services/${serviceId}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setService(data.data)
        
        if (packageIndex !== null && data.data.packages) {
          const pkgIdx = parseInt(packageIndex)
          if (data.data.packages[pkgIdx]) {
            setSelectedPackage(data.data.packages[pkgIdx])
          } else {
            router.push("/services")
          }
        }
      } else {
        router.push("/services")
      }
    } catch (error) {
      console.error("Error fetching service:", error)
      router.push("/services")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generateWhatsAppMessage = (invoiceNumber?: string) => {
    let message = `🎯 *New Service Inquiry*\n\n`
    message += `*Service:* ${service?.title}\n`
    message += `*Package:* ${selectedPackage?.name}\n`
    message += `*Price:* ${selectedPackage?.price}\n`
    if (invoiceNumber) {
      message += `*Invoice:* ${invoiceNumber}\n`
    }
    message += `\n*Client Details:*\n`
    message += `👤 ${formData.name}\n`
    message += `📧 ${formData.email}\n`
    message += `📱 ${formData.phone}\n`
    if (formData.company) {
      message += `🏢 ${formData.company}\n`
    }
    message += `\n*Message:*\n${formData.message || "No additional message"}\n\n`

    if (invoiceNumber) {
      message += `_Inquiry created in client dashboard_`
    } else {
      message += `_Client is not logged in - Login to track: ${window.location.origin}/client/login_`
    }

    return encodeURIComponent(message)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      if (isLoggedIn) {
        // Create inquiry for logged-in client
        const response = await fetchWithAuth('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId,
            serviceName: service.title,
            packageName: selectedPackage.name,
            packagePrice: selectedPackage.price,
            message: formData.message,
            totalAmount: selectedPackage.price,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.error('API Error:', response.status, errorData)
          throw new Error(errorData.error || `Failed to create inquiry (${response.status})`)
        }

        const inquiry = await response.json()

        // Send WhatsApp message
        const message = generateWhatsAppMessage(inquiry.invoiceNumber)
        const whatsappUrl = `https://wa.me/8801401658685?text=${message}`
        window.open(whatsappUrl, '_blank')

        toast.success('✅ Inquiry Created Successfully!')
        
        // Redirect to client dashboard
        setTimeout(() => {
          router.push('/client/dashboard')
        }, 1500)
      } else {
        // Guest user - only send WhatsApp message
        const message = generateWhatsAppMessage()
        const whatsappUrl = `https://wa.me/8801401658685?text=${message}`
        window.open(whatsappUrl, '_blank')

        toast.success('📱 Message Sent! Login to track your inquiry')

        // Redirect after showing message
        setTimeout(() => {
          router.push('/client/login')
        }, 2000)
      }
    } catch (error: any) {
      console.error('Error submitting inquiry:', error)
      toast.error(error.message || 'Failed to submit inquiry')
    } finally {
      setIsLoading(false)
    }
  }

  if (!service || !selectedPackage) {
    return null
  }

  return (
    <>
      <main className="min-h-[100dvh] bg-[#08090A] text-[#F4F7F5]">
        <SiteHeader />

        <div className="container mx-auto px-4 pt-8 bg-gradient-to-b from-[#08090A] to-[#0F1113] animate-fade-in-up">
          <Button asChild variant="ghost" className="text-[#F4F7F5]/80 hover:text-[#F4F7F5] hover:bg-[#1A1D21] transition-all duration-300">
            <Link href={`/services/${serviceId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Service
            </Link>
          </Button>
        </div>

        <section className="container mx-auto px-4 py-12 sm:py-16 bg-gradient-to-b from-[#0F1113] to-[#08090A] animate-fade-in-up">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-[#F4F7F5] mb-8 text-center">
              Complete Your Order
            </h1>

            {/* Login Status Alert */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-[#1F2329] mb-8 animate-fade-in-up">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-400">Logged in as {clientData?.name}</p>
                  <p className="text-xs text-green-500/80">Your inquiry will be added to your dashboard with invoice tracking</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-[#1F2329] mb-8 animate-fade-in-up">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-yellow-400">Not logged in</p>
                  <p className="text-xs text-yellow-500/80">
                    <Link href="/client/login" className="underline hover:text-[#008CE2] transition-colors duration-300">Login</Link>
                    {' '}or{' '}
                    <Link href="/client/register" className="underline hover:text-[#008CE2] transition-colors duration-300">register</Link>
                    {' '}to track your inquiry with invoice
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-8 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <Card className="border border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 p-6 sticky top-8 animate-fade-in-up">
                  <h2 className="text-xl font-bold text-[#F4F7F5] mb-4">Order Summary</h2>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-[#F4F7F5]/70">Service</p>
                      <p className="text-lg font-semibold text-[#F4F7F5]">{service.title}</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#F4F7F5]/70">Package</p>
                      <p className="text-lg font-semibold text-[#008CE2]">{selectedPackage.name}</p>
                    </div>

                    <div className="pt-4 border-t border-[#1F2329]">
                      <p className="text-sm text-[#F4F7F5]/70 mb-2">Package Includes:</p>
                      <ul className="space-y-2">
                        {selectedPackage.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-[#F4F7F5]/80">
                            <Check className="h-4 w-4 text-[#008CE2] mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-[#1F2329]">
                      <div className="flex justify-between items-center">
                        <span className="text-lg text-[#F4F7F5]/80">Duration</span>
                        <span className="text-lg font-semibold text-[#F4F7F5]">{selectedPackage.duration}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xl font-bold text-[#F4F7F5]">Total</span>
                        <span className="text-2xl font-extrabold text-[#008CE2]">{selectedPackage.price}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <Card className="border border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 p-8 animate-fade-in-up">
                  <h2 className="text-2xl font-bold text-[#F4F7F5] mb-6">Your Information</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-[#F4F7F5]">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isLoggedIn}
                        className="border-[#1F2329] focus:border-[#008CE2] bg-[#1A1D21] text-[#F4F7F5] disabled:opacity-60 transition-all duration-300"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-[#F4F7F5]">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isLoggedIn}
                        className="border-[#1F2329] focus:border-[#008CE2] bg-[#1A1D21] text-[#F4F7F5] disabled:opacity-60 transition-all duration-300"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-[#F4F7F5]">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={isLoggedIn}
                        className="border-[#1F2329] focus:border-[#008CE2] bg-[#1A1D21] text-[#F4F7F5] disabled:opacity-60 transition-all duration-300"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company" className="text-[#F4F7F5]">
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        disabled={isLoggedIn}
                        className="border-[#1F2329] focus:border-[#008CE2] bg-[#1A1D21] text-[#F4F7F5] disabled:opacity-60 transition-all duration-300"
                        placeholder="Your Company"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-[#F4F7F5]">
                        Project Details <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="border-[#1F2329] focus:border-[#008CE2] bg-[#1A1D21] text-[#F4F7F5] min-h-[150px] transition-all duration-300"
                        placeholder="Tell us about your project requirements, timeline, and any specific needs..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#008CE2] text-[#F4F7F5] hover:bg-[#06B9D0] hover:scale-105 py-6 text-lg font-semibold rounded-full shadow-lg shadow-[#008CE2]/20 transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {isLoggedIn ? 'Creating Inquiry...' : 'Sending Message...'}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          {isLoggedIn ? 'Create Inquiry & Send WhatsApp' : 'Send WhatsApp Message'}
                        </>
                      )}
                    </Button>

                    <p className="text-center text-sm text-[#F4F7F5]/70">
                      {isLoggedIn 
                        ? "Your inquiry will be saved with an invoice number and tracked in your dashboard"
                        : "Login or register to get invoice tracking and real-time status updates"}
                    </p>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#08090A]">
        <Loader2 className="h-8 w-8 animate-spin text-[#008CE2]" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
