"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ClientRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/client/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Dispatch custom event to update header
      window.dispatchEvent(new Event('clientUpdated'))
      toast.success("Account created successfully!")
      router.push("/client/dashboard")
      router.refresh()
    } catch (error: any) {
      console.error("Registration error:", error)
      toast.error(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08090A] via-[#0F1113] to-[#08090A] p-4 animate-fade-in-up">
      <Card className="w-full max-w-md border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl shadow-xl shadow-[#008CE2]/20">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center text-[#F4F7F5]">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-[#F4F7F5]/70">
            Register to access your client dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#F4F7F5]">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F4F7F5]">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#F4F7F5]">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 transition-all duration-300"
              />
              <p className="text-xs text-[#F4F7F5]/70">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#F4F7F5]">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-[#F4F7F5]">Company</Label>
              <Input
                id="company"
                type="text"
                placeholder="Your Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 transition-all duration-300"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#008CE2] text-white hover:bg-[#06B9D0] hover:scale-105 transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm text-[#F4F7F5]/70">
              Already have an account?{" "}
              <Link href="/client/login" className="text-[#008CE2] hover:text-[#06B9D0] font-semibold transition-colors duration-300">
                Login here
              </Link>
            </div>

            <div className="text-center">
              <Link href="/" className="text-sm text-[#F4F7F5]/70 hover:text-[#008CE2] transition-colors duration-300">
                ← Back to Home
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
