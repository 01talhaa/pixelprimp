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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-50 p-4">
      <Card className="w-full max-w-md border-sky-200 bg-white shadow-xl shadow-sky-200/30">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center text-black">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Register to access your client dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white border-sky-200 text-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-white border-sky-200 text-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="bg-white border-sky-200 text-black"
              />
              <p className="text-xs text-gray-600">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-black">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white border-sky-200 text-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-black">Company</Label>
              <Input
                id="company"
                type="text"
                placeholder="Your Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-white border-sky-200 text-black"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 text-white hover:bg-sky-600"
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

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/client/login" className="text-sky-500 hover:text-sky-600 font-semibold">
                Login here
              </Link>
            </div>

            <div className="text-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-sky-600">
                ← Back to Home
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
