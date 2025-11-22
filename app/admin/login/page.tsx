"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("Form submitted with:", { email, password })

    const success = await login(email, password, "admin")

    console.log("Login success:", success)

    if (success) {
      console.log("Setting cookie and redirecting...")
      document.cookie = "admin-session=authenticated; path=/; max-age=86400"
      
      // Wait a bit for state to persist
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log("Redirecting to /admin")
      window.location.href = "/admin"
    } else {
      console.log("Login failed")
      setError("Invalid email or password - Try: abstalha@gmail.com / 123456")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F1113] via-[#08090A] to-[#1A1D21] p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0F1113]/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#1F2329] animate-fade-in-up">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#008CE2] mb-2">Pqrix Admin</h1>
            <p className="text-[#F4F7F5]/70">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-400 bg-red-950/50 border border-red-900/50 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#F4F7F5] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abstalha@gmail.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-[#1A1D21] border border-[#1F2329] rounded-lg text-[#F4F7F5] placeholder-[#F4F7F5]/50 focus:outline-none focus:ring-2 focus:ring-[#008CE2] focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#F4F7F5] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-[#1A1D21] border border-[#1F2329] rounded-lg text-[#F4F7F5] placeholder-[#F4F7F5]/50 focus:outline-none focus:ring-2 focus:ring-[#008CE2] focus:border-transparent transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#008CE2] hover:bg-[#06B9D0] hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#1F2329] text-center">
            <p className="text-xs text-[#F4F7F5]/50">
              Test Credentials:<br />
              <span className="text-[#F4F7F5]/40">abstalha@gmail.com / 123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
