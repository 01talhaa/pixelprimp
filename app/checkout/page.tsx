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
      <main className="min-h-[100dvh] bg-white text-black">
        <SiteHeader />

        <div className="container mx-auto px-4 pt-8 bg-gradient-to-b from-white to-sky-50">
          <Button asChild variant="ghost" className="text-gray-700 hover:text-black hover:bg-sky-50">
            <Link href={`/services/${serviceId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Service
            </Link>
          </Button>
        </div>

        <section className="container mx-auto px-4 py-12 sm:py-16 bg-gradient-to-b from-sky-50 to-white">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-black mb-8 text-center">
              Complete Your Order
            </h1>

            {/* Login Status Alert */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30 mb-8">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-700">Logged in as {clientData?.name}</p>
                  <p className="text-xs text-green-600">Your inquiry will be added to your dashboard with invoice tracking</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-8">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-yellow-700">Not logged in</p>
                  <p className="text-xs text-yellow-600">
                    <Link href="/client/login" className="underline hover:text-yellow-700">Login</Link>
                    {' '}or{' '}
                    <Link href="/client/register" className="underline hover:text-yellow-700">register</Link>
                    {' '}to track your inquiry with invoice
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-8 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <Card className="border border-sky-200 bg-white shadow-lg shadow-sky-200/30 p-6 sticky top-8">
                  <h2 className="text-xl font-bold text-black mb-4">Order Summary</h2>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Service</p>
                      <p className="text-lg font-semibold text-black">{service.title}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Package</p>
                      <p className="text-lg font-semibold text-sky-600">{selectedPackage.name}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Package Includes:</p>
                      <ul className="space-y-2">
                        {selectedPackage.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="h-4 w-4 text-sky-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-700">Duration</span>
                        <span className="text-lg font-semibold text-black">{selectedPackage.duration}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xl font-bold text-black">Total</span>
                        <span className="text-2xl font-extrabold text-sky-600">{selectedPackage.price}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <Card className="border border-sky-200 bg-white shadow-lg shadow-sky-200/30 p-8">
                  <h2 className="text-2xl font-bold text-black mb-6">Your Information</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-black">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isLoggedIn}
                        className="border-sky-200 focus:border-sky-500 disabled:opacity-60"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-black">
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
                        className="border-sky-200 focus:border-sky-500 disabled:opacity-60"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-black">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={isLoggedIn}
                        className="border-sky-200 focus:border-sky-500 disabled:opacity-60"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company" className="text-black">
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        disabled={isLoggedIn}
                        className="border-sky-200 focus:border-sky-500 disabled:opacity-60"
                        placeholder="Your Company"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-black">
                        Project Details <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="border-sky-200 focus:border-sky-500 min-h-[150px]"
                        placeholder="Tell us about your project requirements, timeline, and any specific needs..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-sky-500 text-white hover:bg-sky-600 py-6 text-lg font-semibold rounded-full shadow-lg shadow-sky-400/30"
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

                    <p className="text-center text-sm text-gray-600">
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
