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

  const generateWhatsAppMessage = () => {
    let message = `��� *New Service Order*\n\n`
    message += `��� *Service Details:*\n`
    message += `Service: ${service?.title}\n`
    message += `Package: ${selectedPackage?.name}\n`
    message += `Price: ${selectedPackage?.price}\n`
    message += `Duration: ${selectedPackage?.duration}\n\n`

    message += `��� *Customer Information:*\n`
    message += `Name: ${formData.name}\n`
    message += `Email: ${formData.email}\n`
    message += `Phone: ${formData.phone}\n`
    if (formData.company) {
      message += `Company: ${formData.company}\n`
    }
    message += `\n��� *Message:*\n${formData.message || "No additional message"}\n\n`

    message += `✅ Please confirm the order and share the next steps.`

    return encodeURIComponent(message)
  }

  const handleSubmit = async (e: React.FormEvent, whatsappNumber: string) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    window.open(whatsappUrl, "_blank")

    setTimeout(() => {
      setIsLoading(false)
      router.push("/services")
    }, 1000)
  }

  if (!service || !selectedPackage) {
    return null
  }

  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />

        <div className="container mx-auto px-4 pt-8">
          <Button asChild variant="ghost" className="text-gray-300 hover:text-white">
            <Link href={`/services/${serviceId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Service
            </Link>
          </Button>
        </div>

        <section className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white mb-8 text-center">
              Checkout
            </h1>

            <div className="grid gap-8 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-6 sticky top-8">
                  <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Service</p>
                      <p className="text-lg font-semibold text-white">{service.title}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">Package</p>
                      <p className="text-lg font-semibold text-lime-400">{selectedPackage.name}</p>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-400 mb-2">Package Includes:</p>
                      <ul className="space-y-2">
                        {selectedPackage.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                            <Check className="h-4 w-4 text-lime-400 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-300">Duration</span>
                        <span className="text-lg font-semibold text-white">{selectedPackage.duration}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xl font-bold text-white">Total</span>
                        <span className="text-2xl font-extrabold text-lime-400">{selectedPackage.price}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Your Information</h2>

                  <form className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-white">
                        Full Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white">
                        Email Address <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                        className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-white">
                        Phone Number <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        required
                        className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company" className="text-white">
                        Company Name (Optional)
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your Company"
                        className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white">
                        Project Details (Optional)
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your project requirements..."
                        rows={4}
                        className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div className="pt-4">
                      <p className="text-sm text-gray-400 mb-4">
                        Choose a WhatsApp number to send your order:
                      </p>
                      <div className="space-y-3">
                        <Button
                          type="button"
                          onClick={(e) => handleSubmit(e, "8801401658685")}
                          disabled={isLoading}
                          className="w-full rounded-full bg-lime-400 px-8 text-base font-semibold text-black hover:bg-lime-300 disabled:opacity-50"
                        >
                          <Send className="mr-2 h-5 w-5" />
                          {isLoading ? "Sending..." : "Send to +880 1401-658685"}
                        </Button>

                        <Button
                          type="button"
                          onClick={(e) => handleSubmit(e, "8801878377992")}
                          disabled={isLoading}
                          className="w-full rounded-full bg-lime-400 px-8 text-base font-semibold text-black hover:bg-lime-300 disabled:opacity-50"
                        >
                          <Send className="mr-2 h-5 w-5" />
                          {isLoading ? "Sending..." : "Send to +880 1878-377992"}
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 text-center">
                      By submitting this form, your order details will be sent via WhatsApp. We'll respond within 24
                      hours to confirm your order and discuss the next steps.
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
            <p>Loading checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
