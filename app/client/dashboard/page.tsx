"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogOut, FolderKanban, Briefcase, User } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import Link from "next/link"
import { fetchWithAuth, setupAutoRefresh } from "@/lib/client-auth"
import { InquiriesSection } from "@/components/inquiries-section"

interface Client {
  _id: string
  name: string
  email: string
  phone?: string
  company?: string
  avatar?: string
  projects: string[]
  services: string[]
}

interface Project {
  id: string
  title: string
  category: string
  description: string
  images: string[]
  status: string
}

interface Service {
  id: string
  title: string
  category: string
  description: string
  icon: string
}

export default function ClientDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<Client | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    fetchClientData()
    
    // Setup automatic token refresh
    const cleanup = setupAutoRefresh()
    
    // Cleanup on unmount
    return cleanup
  }, [])

  const fetchClientData = async () => {
    try {
      // Fetch client info using fetchWithAuth (auto-refreshes token if needed)
      const clientResponse = await fetchWithAuth("/api/auth/client/me")
      if (!clientResponse.ok) {
        throw new Error("Not authenticated")
      }
      const clientData = await clientResponse.json()
      setClient(clientData.client)

      // Fetch projects
      if (clientData.client.projects?.length > 0) {
        const projectsResponse = await fetchWithAuth("/api/projects")
        if (projectsResponse.ok) {
          const allProjects = await projectsResponse.json()
          const clientProjects = allProjects.filter((p: Project) =>
            clientData.client.projects.includes(p.id)
          )
          setProjects(clientProjects)
        }
      }

      // Fetch services
      if (clientData.client.services?.length > 0) {
        const servicesResponse = await fetchWithAuth("/api/services")
        if (servicesResponse.ok) {
          const allServices = await servicesResponse.json()
          const clientServices = allServices.filter((s: Service) =>
            clientData.client.services.includes(s.id)
          )
          setServices(clientServices)
        }
      }
    } catch (error) {
      console.error("Error fetching client data:", error)
      toast.error("Please login to continue")
      router.push("/client/login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/client/logout", { method: "POST" })
      toast.success("Logged out successfully")
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08090A]">
        <Loader2 className="w-8 h-8 animate-spin text-[#008CE2]" />
      </div>
    )
  }

  if (!client) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08090A] via-[#0F1113] to-[#08090A]">
      {/* Header */}
      <header className="border-b border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm shadow-[#008CE2]/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
                      <Link href="/" className="flex items-center gap-1.5 hover:scale-105 transition-transform duration-300">
            <Image src="/icons/pqrix-white.svg" alt="PixelPrimp logo" width={20} height={20} className="h-5 w-5" />
            <span className="font-semibold tracking-wide">
              <span className="text-[#008CE2]">Pixel</span>
              <span className="text-[#F4F7F5]">Primp</span>
            </span>
          </Link>
            
            <Link
              href="/client/dashboard"
              className="text-2xl font-bold bg-gradient-to-r from-[#008CE2] to-[#06B9D0] bg-clip-text text-transparent"
            >
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/client/profile">
              <Button
                variant="outline"
                className="border-[#1F2329] bg-[#0F1113] text-[#F4F7F5] hover:bg-[#1A1D21] hover:border-[#008CE2]"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-[#1F2329] bg-[#0F1113] text-[#F4F7F5] hover:bg-[#1A1D21] hover:border-[#008CE2] hover:scale-105 transition-all duration-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <Card className="border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl shadow-lg shadow-[#008CE2]/20 animate-fade-in-up">
          <CardHeader>
            <div className="flex items-center gap-4">
              {client.avatar ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#008CE2]">
                  <Image src={client.avatar} alt={client.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#1A1D21] flex items-center justify-center border-2 border-[#008CE2]">
                  <User className="w-8 h-8 text-[#008CE2]" />
                </div>
              )}
              <div>
                <CardTitle className="text-2xl text-[#F4F7F5]">Welcome, {client.name}!</CardTitle>
                <p className="text-[#F4F7F5]/80 mt-1">{client.email}</p>
                {client.company && <p className="text-sm text-[#F4F7F5]/70">{client.company}</p>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-[#1A1D21] rounded-lg border border-[#1F2329] hover:border-[#008CE2] transition-all duration-300">
                <FolderKanban className="w-8 h-8 text-[#008CE2]" />
                <div>
                  <p className="text-2xl font-bold text-[#F4F7F5]">{projects.length}</p>
                  <p className="text-sm text-[#F4F7F5]/70">Active Projects</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#1A1D21] rounded-lg border border-[#1F2329] hover:border-[#008CE2] transition-all duration-300">
                <Briefcase className="w-8 h-8 text-[#008CE2]" />
                <div>
                  <p className="text-2xl font-bold text-[#F4F7F5]">{services.length}</p>
                  <p className="text-sm text-[#F4F7F5]/70">Booked Services</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inquiries Section */}
        <div>
          <InquiriesSection />
        </div>

        {/* Projects Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#F4F7F5] mb-4 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-[#008CE2]" />
            Your Projects
          </h2>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="border-sky-200 bg-white shadow-lg shadow-sky-200/30 hover:shadow-xl hover:shadow-sky-200/40 transition-all cursor-pointer">
                    {project.images?.[0] && (
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <Image
                          src={project.images[0]}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-[#F4F7F5]">{project.title}</CardTitle>
                      <p className="text-sm text-[#008CE2]">{project.category}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[#F4F7F5]/70 line-clamp-2">{project.description}</p>
                      <div className="mt-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            project.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : project.status === "In Progress"
                                ? "bg-sky-100 text-sky-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20">
              <CardContent className="py-12 text-center">
                <FolderKanban className="w-12 h-12 text-[#F4F7F5]/30 mx-auto mb-4" />
                <p className="text-[#F4F7F5]/70 mb-4">No projects yet</p>
                <Link href="/projects">
                  <Button className="bg-[#008CE2] text-white hover:bg-[#06B9D0] hover:scale-105 transition-all duration-300">
                    Browse Projects
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Services Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#F4F7F5] mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#008CE2]" />
            Booked Services
          </h2>
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link key={service.id} href={`/services/${service.id}`}>
                  <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 hover:shadow-xl hover:shadow-[#008CE2]/30 hover:scale-105 transition-all duration-300 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {service.icon && (
                          <div className="text-4xl">{service.icon}</div>
                        )}
                        <div>
                          <CardTitle className="text-[#F4F7F5]">{service.title}</CardTitle>
                          <p className="text-sm text-[#008CE2]">{service.category}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[#F4F7F5]/70 line-clamp-2">{service.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20">
              <CardContent className="py-12 text-center">
                <Briefcase className="w-12 h-12 text-[#F4F7F5]/30 mx-auto mb-4" />
                <p className="text-[#F4F7F5]/70 mb-4">No services booked yet</p>
                <Link href="/services">
                  <Button className="bg-[#008CE2] text-white hover:bg-[#06B9D0] hover:scale-105 transition-all duration-300">
                    Browse Services
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
