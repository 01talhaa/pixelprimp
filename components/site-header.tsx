"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import { Menu, Briefcase, Tag, HelpCircle, Wrench, FolderOpen, Users, LogOut, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Client {
  _id: string
  name: string
  email: string
  avatar?: string
}

export function SiteHeader() {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()

    // Listen for client update events
    const handleClientUpdate = () => {
      checkAuth()
    }

    window.addEventListener('clientUpdated', handleClientUpdate)

    return () => {
      window.removeEventListener('clientUpdated', handleClientUpdate)
    }
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/client/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        // The API returns { client: {...} }, so we need to extract the client object
        const clientData = data.client || data
        console.log('Site header client data:', clientData)
        console.log('Avatar URL:', clientData.avatar)
        setClient(clientData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/client/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setClient(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const links = [
    { href: "/", label: "Home", icon: Briefcase },
    { href: "/services", label: "Services", icon: Wrench },
    { href: "/projects", label: "Projects", icon: FolderOpen },
    { href: "/team", label: "Team", icon: Users },
    { href: "#pricing", label: "Pricing", icon: Tag },
    { href: "faq", label: "FAQ", icon: HelpCircle },
  ]

  return (
    <header className="sticky top-0 z-50 p-4 animate-fade-in">
      <div className="container mx-auto max-w-4xl">
        <div className="flex h-14 items-center justify-between px-6 liquid-glass-header rounded-full shadow-md shadow-[#008CE2]/30">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5 hover:scale-105 transition-transform duration-300">
            <Image src="/icons/pqrix-white.svg" alt="PixelPrimp logo" width={20} height={20} className="h-5 w-5" />
            <span className="font-semibold tracking-wide">
              <span className="text-[#008CE2]">Pixel</span>
              <span className="text-[#F4F7F5]">Primp</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 text-sm text-[#F4F7F5] md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[#06B9D0] transition-all duration-300 font-medium hover:scale-105">
                {l.label}
              </Link>
            ))}  
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex">
            {!loading && (
              client ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                    <Avatar className="h-9 w-9 border-2 border-[#008CE2]">
                      <AvatarImage src={client.avatar} alt={client.name} />
                      <AvatarFallback className="bg-[#1A1D21] text-[#008CE2] font-semibold">
                        {client.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-white">{client.name}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-[#0F1113]/95 backdrop-blur-sm border-[#1F2329]">
                    <DropdownMenuLabel className="text-[#F4F7F5]">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#1F2329]" />
                    <DropdownMenuItem asChild>
                      <Link href="/client/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/client/profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#1F2329]" />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-[#EF4444] hover:text-[#DC2626]">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  asChild
                  className="bg-[#008CE2] text-[#F4F7F5] font-medium rounded-lg px-6 py-2.5
                             hover:bg-[#06B9D0] hover:shadow-xl hover:scale-[1.05] shadow-[#008CE2]/30
                             transition-all duration-300"
                >
                  <Link href="/client/login">Client Login</Link>
                </Button>
              )
            )}
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[#1F2329] bg-[#0F1113]/90 text-[#F4F7F5] hover:bg-[#1A1D21] hover:border-[#008CE2]"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="liquid-glass border-[#1F2329] p-0 w-64 flex flex-col bg-[#0F1113]/95">
                {/* Brand Header */}
                <div className="flex items-center gap-1.5 px-4 py-4 border-b border-[#1F2329]">
                  <Image src="/icons/pqrix-white.svg" alt="PixelPrimp logo" width={24} height={24} className="h-6 w-6" />
                  <span className="font-semibold tracking-wide text-lg">
                    <span className="text-[#008CE2]">Pixel</span>
                    <span className="text-[#F4F7F5]">Primp</span>
                  </span>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 mt-2 text-[#F4F7F5]">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#1A1D21] hover:text-[#008CE2] transition-colors"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 text-[#008CE2]">
                        <l.icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">{l.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* CTA Button at Bottom */}
                <div className="mt-auto border-t border-[#1F2329] p-4 space-y-2">
                  {!loading && (
                    client ? (
                      <>
                        <div className="flex items-center gap-3 px-2 py-3 bg-[#1A1D21] rounded-lg mb-3">
                          <Avatar className="h-10 w-10 border-2 border-[#008CE2]">
                            <AvatarImage src={client.avatar} alt={client.name} />
                            <AvatarFallback className="bg-[#1A1D21] text-[#008CE2] font-semibold">
                              {client.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{client.name}</p>
                            <p className="text-xs text-[#F4F7F5]/70 truncate">{client.email}</p>
                          </div>
                        </div>
                        <Button
                          asChild
                          className="w-full bg-[#008CE2] text-[#F4F7F5] font-medium rounded-lg px-6 py-2.5
                                     hover:bg-[#06B9D0] hover:shadow-lg hover:scale-[1.02] shadow-[#008CE2]/40
                                     transition-all"
                        >
                          <Link href="/client/dashboard">Dashboard</Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-[#1F2329] bg-[#0F1113] text-[#F4F7F5] font-medium rounded-lg px-6 py-2.5
                                     hover:bg-[#1A1D21] hover:border-[#008CE2] transition-all"
                        >
                          <Link href="/client/profile">Profile</Link>
                        </Button>
                        <Button
                          onClick={handleLogout}
                          variant="outline"
                          className="w-full border-red-200 bg-white text-red-600 font-medium rounded-lg px-6 py-2.5
                                     hover:bg-red-50 transition-all"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          asChild
                          className="w-full bg-[#008CE2] text-[#F4F7F5] font-medium rounded-lg px-6 py-2.5
                                     hover:bg-[#06B9D0] hover:shadow-lg hover:scale-[1.02] shadow-[#008CE2]/40
                                     transition-all"
                        >
                          <Link href="/client/login">Client Login</Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-[#1F2329] bg-[#0F1113] text-[#F4F7F5] font-medium rounded-lg px-6 py-2.5
                                     hover:bg-[#1A1D21] hover:border-[#008CE2] transition-all"
                        >
                          <Link href="https://wa.me/8801401658685?text=Hi!%20I'd%20like%20to%20get%20a%20quote">Get a Quote</Link>
                        </Button>
                      </>
                    )
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
