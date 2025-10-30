import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Linkedin, Twitter, Mail, Award, Briefcase, GraduationCap, FolderOpen } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllTeamMembersForBuild, getTeamMemberByIdForBuild } from "@/lib/get-team"
import { getProjectByIdForBuild } from "@/lib/get-projects"

export const dynamic = 'force-static'
export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const teamMembers = await getAllTeamMembersForBuild()
  return teamMembers.map((member: any) => ({ id: member.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await getTeamMemberByIdForBuild(id)
  if (!member) return {}

  return {
    title: `${(member as any).name} - ${(member as any).role} | Pqrix Team`,
    description: (member as any).bio,
  }
}

export default async function TeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Hybrid data fetching
  const isProductionBuild = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;
  let member: any
  
  if (isProductionBuild) {
    member = await getTeamMemberByIdForBuild(id)
  } else {
    try {
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      
      const response = await fetch(`${baseUrl}/api/team/${id}`, {
        next: { revalidate: 60 }
      })
      
      if (response.ok) {
        const data = await response.json()
        member = data.success ? data.data : null
      } else {
        member = await getTeamMemberByIdForBuild(id)
      }
    } catch (error) {
      console.error('API fetch failed, falling back to database:', error)
      member = await getTeamMemberByIdForBuild(id)
    }
  }

  if (!member) {
    notFound()
  }

  return (
    <>
      <main className="min-h-[100dvh] bg-white text-black">
        <SiteHeader />

        {/* Back Button */}
        <div className="container mx-auto px-4 pt-8 bg-gradient-to-b from-white to-sky-50">
          <Button asChild variant="ghost" className="text-gray-700 hover:text-black hover:bg-sky-50">
            <Link href="/team">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Team
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 bg-gradient-to-b from-sky-50 to-white">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
            {/* Left Column - Info */}
            <div className="order-2 lg:order-1">
              <div className="mb-4">
                <span className="inline-flex items-center rounded-full bg-sky-500/20 border border-sky-400 px-4 py-1.5 text-sm font-medium text-sky-600">
                  {member.department}
                </span>
              </div>
              <h1 className="mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-black">
                {member.name}
              </h1>
              <p className="text-xl font-medium text-sky-600 mb-6">{member.role}</p>
              <p className="text-lg text-gray-700 mb-8">{member.fullBio || member.bio}</p>

              {/* Social Links */}
              <div className="flex gap-3 mb-8">
                <Button
                  asChild
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white border border-sky-200 hover:bg-sky-50 shadow-sm hover:shadow-md hover:shadow-sky-200/30"
                >
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5 text-sky-600" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white border border-sky-200 hover:bg-sky-50 shadow-sm hover:shadow-md hover:shadow-sky-200/30"
                >
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-5 w-5 text-sky-600" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white border border-sky-200 hover:bg-sky-50 shadow-sm hover:shadow-md hover:shadow-sky-200/30"
                >
                  <a href={`mailto:${member.email}`}>
                    <Mail className="h-5 w-5 text-sky-600" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="order-1 lg:order-2">
              <div className="relative aspect-square rounded-2xl overflow-hidden liquid-glass border border-sky-200 shadow-xl shadow-sky-200/30">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Expertise */}
        {member.expertise && (
          <section className="container mx-auto px-4 pb-12 bg-white">
            <Card className="liquid-glass border border-sky-200 bg-sky-50 shadow-lg shadow-sky-200/30 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-6 w-6 text-sky-500" />
                <h2 className="text-2xl font-bold text-black">Expertise</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {member.expertise.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-gray-700 bg-white rounded-lg px-4 py-2 border border-sky-200 shadow-sm"
                  >
                    <div className="h-2 w-2 rounded-full bg-sky-500" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Experience */}
        {member.experience && (
          <section className="container mx-auto px-4 pb-12 bg-gradient-to-b from-white to-sky-50">
            <Card className="liquid-glass border border-sky-200 bg-white shadow-lg shadow-sky-200/30 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="h-6 w-6 text-sky-500" />
                <h2 className="text-2xl font-bold text-black">Experience</h2>
              </div>
              <div className="space-y-6">
                {member.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-sky-400 pl-6">
                    <h3 className="text-xl font-bold text-black mb-1">{exp.title}</h3>
                    <p className="text-sky-600 font-medium mb-2">{exp.company}</p>
                    <p className="text-sm text-gray-600 mb-2">{exp.period}</p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Education & Awards */}
        <section className="container mx-auto px-4 pb-12 bg-sky-50">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Education */}
            {member.education && (
              <Card className="liquid-glass border border-sky-200 bg-white shadow-lg shadow-sky-200/30 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="h-6 w-6 text-sky-500" />
                  <h2 className="text-2xl font-bold text-black">Education</h2>
                </div>
                <div className="space-y-4">
                  {member.education.map((edu, idx) => (
                    <div key={idx}>
                      <h3 className="text-lg font-bold text-black mb-1">{edu.degree}</h3>
                      <p className="text-sky-600 mb-1">{edu.school}</p>
                      <p className="text-sm text-gray-600">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Awards */}
            {member.awards && (
              <Card className="liquid-glass border border-sky-200 bg-white shadow-lg shadow-sky-200/30 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="h-6 w-6 text-sky-500" />
                  <h2 className="text-2xl font-bold text-black">Awards & Recognition</h2>
                </div>
                <ul className="space-y-3">
                  {member.awards.map((award, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <div className="h-1.5 w-1.5 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </section>

        {/* Projects */}
        {member.projects && member.projects.length > 0 && (await (async () => {
          // Fetch projects from MongoDB based on project IDs
          const memberProjects = []
          
          for (const projectId of member.projects) {
            if (!projectId || projectId.trim() === '') continue
            
            try {
              // Try fetching from API first
              if (!isProductionBuild) {
                try {
                  const baseUrl = process.env.VERCEL_URL 
                    ? `https://${process.env.VERCEL_URL}` 
                    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
                  
                  const response = await fetch(`${baseUrl}/api/projects/${projectId}`, {
                    next: { revalidate: 60 }
                  })
                  
                  if (response.ok) {
                    const data = await response.json()
                    if (data.success && data.data) {
                      memberProjects.push(data.data)
                      continue
                    }
                  }
                } catch (error) {
                  console.error(`API fetch failed for project ${projectId}:`, error)
                }
              }
              
              // Fallback to database
              const project = await getProjectByIdForBuild(projectId)
              if (project) {
                memberProjects.push(project)
              }
            } catch (error) {
              console.error(`Error fetching project ${projectId}:`, error)
            }
          }
          
          if (memberProjects.length > 0) {
            return (
              <section className="container mx-auto px-4 pb-12 bg-white">
                <Card className="liquid-glass border border-sky-200 bg-sky-50 shadow-lg shadow-sky-200/30 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FolderOpen className="h-6 w-6 text-sky-500" />
                    <h2 className="text-2xl font-bold text-black">Projects</h2>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {memberProjects.map((project: any) => (
                      <Link key={project.id} href={`/projects/${project.id}`}>
                        <Card className="liquid-glass border border-sky-200 bg-white hover:shadow-lg hover:shadow-sky-200/30 transition-all hover:scale-105 overflow-hidden h-full shadow-md">
                          <div className="relative aspect-video overflow-hidden">
                            {project.images && project.images.length > 0 ? (
                              <img
                                src={project.images[0] || "/placeholder.svg"}
                                alt={project.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-sky-100 to-sky-200" />
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-300 px-3 py-1 text-xs font-medium text-sky-600">
                                {project.category}
                              </span>
                              <span className="text-xs text-gray-600">{project.status}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-black mb-1">{project.title}</h3>
                            <p className="text-sm text-sky-600 font-medium mb-2">{project.client}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{project.description}</p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </Card>
              </section>
            )
          }
          return null
        })())}

        {/* CTA */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24 bg-gradient-to-b from-white to-sky-50">
          <Card className="liquid-glass-enhanced border border-sky-300 bg-gradient-to-br from-sky-400/20 to-sky-500/20 shadow-2xl shadow-sky-300/40 text-center p-8 sm:p-12">
            <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl">Work With Our Team</h2>
            <p className="mb-8 text-lg text-gray-700">
              Interested in collaborating with {member.name.split(" ")[0]}? Get in touch with our team
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-sky-500 px-8 text-base font-semibold text-white hover:bg-sky-600 shadow-lg shadow-sky-300/40"
            >
              <Link href="https://wa.me/8801401658685?text=Hi!%20I'd%20like%20to%20get%20in%20touch">Contact Us</Link>
            </Button>
          </Card>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
