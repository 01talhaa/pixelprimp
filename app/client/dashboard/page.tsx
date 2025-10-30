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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    )
  }

  if (!client) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50">
      {/* Header */}
      <header className="border-b border-sky-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/client/dashboard"
            className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent"
          >
            My Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/client/profile">
              <Button
                variant="outline"
                className="border-sky-200 bg-white text-black hover:bg-sky-50"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-sky-200 bg-white text-black hover:bg-sky-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <Card className="border-sky-200 bg-white shadow-lg shadow-sky-200/30">
          <CardHeader>
            <div className="flex items-center gap-4">
              {client.avatar ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-sky-200">
                  <Image src={client.avatar} alt={client.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center border-2 border-sky-200">
                  <User className="w-8 h-8 text-sky-600" />
                </div>
              )}
              <div>
                <CardTitle className="text-2xl text-black">Welcome, {client.name}!</CardTitle>
                <p className="text-gray-600 mt-1">{client.email}</p>
                {client.company && <p className="text-sm text-gray-600">{client.company}</p>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-lg border border-sky-200">
                <FolderKanban className="w-8 h-8 text-sky-600" />
                <div>
                  <p className="text-2xl font-bold text-black">{projects.length}</p>
                  <p className="text-sm text-gray-600">Active Projects</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-lg border border-sky-200">
                <Briefcase className="w-8 h-8 text-sky-600" />
                <div>
                  <p className="text-2xl font-bold text-black">{services.length}</p>
                  <p className="text-sm text-gray-600">Booked Services</p>
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
          <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-sky-600" />
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
                      <CardTitle className="text-black">{project.title}</CardTitle>
                      <p className="text-sm text-sky-600">{project.category}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
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
            <Card className="border-sky-200 bg-white shadow-lg shadow-sky-200/30">
              <CardContent className="py-12 text-center">
                <FolderKanban className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No projects yet</p>
                <Link href="/projects">
                  <Button className="bg-sky-500 text-white hover:bg-sky-600">
                    Browse Projects
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Services Section */}
        <div>
          <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-sky-600" />
            Booked Services
          </h2>
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link key={service.id} href={`/services/${service.id}`}>
                  <Card className="border-sky-200 bg-white shadow-lg shadow-sky-200/30 hover:shadow-xl hover:shadow-sky-200/40 transition-all cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {service.icon && (
                          <div className="text-4xl">{service.icon}</div>
                        )}
                        <div>
                          <CardTitle className="text-black">{service.title}</CardTitle>
                          <p className="text-sm text-sky-600">{service.category}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-sky-200 bg-white shadow-lg shadow-sky-200/30">
              <CardContent className="py-12 text-center">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No services booked yet</p>
                <Link href="/services">
                  <Button className="bg-sky-500 text-white hover:bg-sky-600">
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
