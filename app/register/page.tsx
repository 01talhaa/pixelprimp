"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    const success = await register(email, password, name)

    if (success) {
      router.push("/client/dashboard")
    } else {
      setError("Registration failed. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-[#08090A]">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#008CE2]/10 via-[#08090A] to-[#08090A]" />

      <Card className="w-full max-w-md relative border-[#1F2329] bg-[#0F1113]/90 backdrop-blur-xl animate-fade-in-up shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-[#008CE2] to-[#06B9D0] bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-[#F4F7F5]/70">Register as a client to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 focus:border-[#008CE2] transition-colors duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 focus:border-[#008CE2] transition-colors duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 focus:border-[#008CE2] transition-colors duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 focus:border-[#008CE2] transition-colors duration-300"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-[#008CE2] hover:bg-[#06B9D0] hover:scale-105 transition-all duration-300" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
            <p className="text-sm text-center text-[#F4F7F5]/70">
              Already have an account?{" "}
              <Link href="/login" className="text-[#008CE2] hover:text-[#06B9D0] transition-colors duration-300">
                Sign in here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
