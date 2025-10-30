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
      <div className="min-h-screen bg-white">
        {/* Admin Header */}
        <header className="border-b border-sky-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/admin"
                className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent"
              >
                Admin Panel
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/admin"
                  className="text-sm text-gray-600 hover:text-sky-600 transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/services"
                  className="text-sm text-gray-600 hover:text-sky-600 transition-colors flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Services
                </Link>
                <Link
                  href="/admin/projects"
                  className="text-sm text-gray-600 hover:text-sky-600 transition-colors flex items-center gap-2"
                >
                  <FolderKanban className="w-4 h-4" />
                  Projects
                </Link>
                <Link
                  href="/admin/team"
                  className="text-sm text-gray-600 hover:text-sky-600 transition-colors flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Team
                </Link>
                <Link
                  href="/admin/clients"
                  className="text-sm text-gray-600 hover:text-sky-600 transition-colors flex items-center gap-2"
                >
                  <UserCircle className="w-4 h-4" />
                  Clients
                </Link>
                <Link
                  href="/admin/inquiries"
                  className="text-sm text-gray-600 hover:text-sky-600 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Inquiries
                </Link>
                <Link
                  href="/admin/test"
                  className="text-sm text-gray-600 hover:text-sky-600 transition-colors flex items-center gap-2"
                >
                  <FlaskConical className="w-4 h-4" />
                  Test
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-sky-300 text-sky-600 hover:bg-sky-50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 bg-gradient-to-b from-sky-50 to-white min-h-[calc(100vh-73px)]">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
