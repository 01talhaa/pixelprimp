"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Briefcase, FolderKanban, Users, LogOut, FlaskConical, UserCircle, FileText } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    // Clear the cookie
    document.cookie = "admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    logout()
    router.push("/admin/login")
  }

  // If it's the login page, don't wrap with ProtectedRoute
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-[#08090A]">
        {/* Admin Header */}
        <header className="border-b border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm shadow-[#008CE2]/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/admin"
                className="text-2xl font-bold bg-gradient-to-r from-[#008CE2] to-[#06B9D0] bg-clip-text text-transparent"
              >
                Admin Panel
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/admin"
                  className="text-sm text-[#F4F7F5] hover:text-[#06B9D0] transition-all duration-300 flex items-center gap-2 hover:scale-105"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/services"
                  className="text-sm text-[#F4F7F5] hover:text-[#06B9D0] transition-all duration-300 flex items-center gap-2 hover:scale-105"
                >
                  <Briefcase className="w-4 h-4" />
                  Services
                </Link>
                <Link
                  href="/admin/projects"
                  className="text-sm text-[#F4F7F5] hover:text-[#06B9D0] transition-all duration-300 flex items-center gap-2 hover:scale-105"
                >
                  <FolderKanban className="w-4 h-4" />
                  Projects
                </Link>
                <Link
                  href="/admin/team"
                  className="text-sm text-[#F4F7F5] hover:text-[#06B9D0] transition-all duration-300 flex items-center gap-2 hover:scale-105"
                >
                  <Users className="w-4 h-4" />
                  Team
                </Link>
                <Link
                  href="/admin/clients"
                  className="text-sm text-[#F4F7F5] hover:text-[#06B9D0] transition-all duration-300 flex items-center gap-2 hover:scale-105"
                >
                  <UserCircle className="w-4 h-4" />
                  Clients
                </Link>
                <Link
                  href="/admin/inquiries"
                  className="text-sm text-[#F4F7F5] hover:text-[#06B9D0] transition-all duration-300 flex items-center gap-2 hover:scale-105"
                >
                  <FileText className="w-4 h-4" />
                  Inquiries
                </Link>
                <Link
                  href="/admin/test"
                  className="text-sm text-[#F4F7F5] hover:text-[#06B9D0] transition-all duration-300 flex items-center gap-2 hover:scale-105"
                >
                  <FlaskConical className="w-4 h-4" />
                  Test
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#F4F7F5]">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-[#1F2329] text-[#F4F7F5] hover:bg-[#1A1D21] hover:border-[#008CE2]">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 bg-gradient-to-b from-[#08090A] via-[#0F1113] to-[#08090A] min-h-[calc(100vh-73px)]">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
