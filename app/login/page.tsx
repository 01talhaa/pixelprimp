"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>, role: UserRole) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const success = await login(email, password, role)

    if (success) {
      if (role === "admin") {
        router.push("/admin")
      } else {
        router.push("/client/dashboard")
      }
    } else {
      setError("Invalid email or password")
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
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-[#F4F7F5]/70">Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="client">Client Login</TabsTrigger>
              <TabsTrigger value="admin">Admin Login</TabsTrigger>
            </TabsList>

            <TabsContent value="client">
              <form onSubmit={(e) => handleLogin(e, "client")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input
                    id="client-email"
                    name="email"
                    type="email"
                    placeholder="client@example.com"
                    required
                    className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 focus:border-[#008CE2] transition-colors duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-password">Password</Label>
                  <Input
                    id="client-password"
                    name="password"
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
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                <p className="text-sm text-center text-[#F4F7F5]/70">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-[#008CE2] hover:text-[#06B9D0] transition-colors duration-300">
                    Register here
                  </Link>
                </p>
                <p className="text-xs text-center text-[#F4F7F5]/50 mt-4">Demo: client@example.com / client123</p>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={(e) => handleLogin(e, "admin")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    name="email"
                    type="email"
                    placeholder="admin@pqrix.com"
                    required
                    className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 focus:border-[#008CE2] transition-colors duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    name="password"
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
                  {loading ? "Signing in..." : "Sign In as Admin"}
                </Button>
                <p className="text-xs text-center text-[#F4F7F5]/50 mt-4">Demo: admin@pqrix.com / admin123</p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
