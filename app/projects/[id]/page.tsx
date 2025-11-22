import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, CheckCircle2, Quote, Users, Calendar, DollarSign, Award, ExternalLink, Lightbulb, Target, Code2, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { notFound } from "next/navigation"
import { getTeamMemberById } from "@/data/team"
import Image from "next/image"
import { getAllProjectsForBuild, getProjectByIdForBuild } from "@/lib/get-projects"

interface ProjectLink {
  label: string
  url: string
}

interface TimelinePhase {
  phase: string
  duration: string
  description: string
}

interface Metric {
  label: string
  value: string
}

// Enable static generation with ISR
export const dynamic = 'force-static'
export const revalidate = 60 // Revalidate every 60 seconds
export const dynamicParams = true // Allow dynamic params not in generateStaticParams

async function getProject(id: string) {
  // During build time, use direct database access
  // During runtime, use API with ISR revalidation
  const isProductionBuild = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;
  
  if (isProductionBuild) {
    // Build time: Direct database access
    return getProjectByIdForBuild(id);
  }

  // Runtime: Try API first, fallback to DB if it fails
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/projects/${id}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })
    
    if (!response.ok) {
      throw new Error('API fetch failed')
    }
    
    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('API fetch failed, falling back to database:', error)
    // Fallback to database
    return getProjectByIdForBuild(id);
  }
}

async function getAllProjects() {
  // During build time, use direct DB access
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
    return getAllProjectsForBuild()
  }

  // During runtime, use API
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/projects`, {
      next: { revalidate: 3600 }, // Revalidate every hour for build
    })
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    return data.success ? data.data : []
  } catch (error) {
    console.error('Error fetching projects:', error)
    // Fallback to direct DB access if API fails
    return getAllProjectsForBuild()
  }
}

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects
    .filter((project: any) => project.id && typeof project.id === 'string')
    .map((project: any) => ({ 
      id: project.id.toString() 
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProject(id)
  if (!project) return {}

  const keywords = [
    project.title,
    `${project.title} case study`,
    `${project.category} project`,
    `${project.category} Bangladesh`,
    project.client,
    `${project.client} project`,
    "software development case study",
    "Bangladesh software project",
    ...project.tags,
    "successful software implementation",
    "software project results",
    "client testimonial Bangladesh"
  ].join(", ")

  const description = `${project.longDescription || project.description} See how we helped ${project.client} with ${project.category}. Project completed in ${project.year}. ${project.results ? 'Results: ' + project.results.slice(0, 2).join(', ') : ''}`

  return {
    title: `${project.title} - ${project.client} | Software Project Case Study | Pqrix`,
    description: description.slice(0, 160),
    keywords,
    openGraph: {
      title: `${project.title} - ${project.client} | Pqrix Bangladesh`,
      description: `${project.category} project for ${project.client}. ${project.description}`,
      type: "article",
      url: `https://pqrix.com/projects/${project.id}`,
      images: [
        {
          url: project.image || "/icons/pqrix-logo.png",
          width: 1200,
          height: 630,
          alt: `${project.title} by Pqrix`,
        },
      ],
      article: {
        publishedTime: `${project.year}-01-01`,
        authors: ["Pqrix Team"],
        tags: project.tags,
      },
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} - ${project.client}`,
      description: project.description,
      images: [project.image || "/icons/pqrix-logo.png"],
    },
    alternates: {
      canonical: `https://pqrix.com/projects/${project.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    notFound()
  }

  return (
    <>
      <main className="min-h-[100dvh] bg-[#08090A] text-[#F4F7F5]">
        <SiteHeader />

        {/* Back Button */}
        <div className="container mx-auto px-4 pt-8 bg-gradient-to-b from-[#08090A] to-[#0F1113]">
          <Button asChild variant="ghost" className="text-[#F4F7F5]/80 hover:text-[#F4F7F5] hover:bg-[#1A1D21]">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 bg-gradient-to-b from-[#0F1113] to-[#08090A] animate-fade-in-up">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="inline-flex items-center rounded-full bg-[#008CE2]/20 border border-[#008CE2] px-4 py-1.5 text-sm font-medium text-[#008CE2]">
                  {project.category}
                </span>
                <span className="inline-flex items-center rounded-full bg-[#0F1113]/80 border border-[#1F2329] px-4 py-1.5 text-sm font-medium text-[#F4F7F5]">
                  {project.year}
                </span>
                {project.status && (
                  <span className="inline-flex items-center rounded-full bg-green-500/20 border border-green-500/30 px-4 py-1.5 text-sm font-medium text-green-600">
                    {project.status}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-[#F4F7F5]/70 mb-3">Client: {project.client}</p>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-[#F4F7F5]">
                {project.title}
              </h1>
              <p className="text-xl text-[#F4F7F5]/80 mb-6">{project.description}</p>
              <p className="text-[#F4F7F5]/70 mb-6">{project.longDescription}</p>

              {/* Project Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                {project.duration && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#008CE2]" />
                    <div>
                      <p className="text-xs text-[#F4F7F5]/70">Duration</p>
                      <p className="text-sm font-medium text-[#F4F7F5]">{project.duration}</p>
                    </div>
                  </div>
                )}
                {project.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[#008CE2]" />
                    <div>
                      <p className="text-xs text-[#F4F7F5]/70">Budget</p>
                      <p className="text-sm font-medium text-[#F4F7F5]">{project.budget}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Media */}
            <div className="relative aspect-video rounded-2xl overflow-hidden liquid-glass border border-[#1F2329] shadow-lg shadow-[#008CE2]/10 hover:scale-[1.02] transition-all duration-300">
              {project.video ? (
                <video
                  src={project.video}
                  className="h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              ) : (
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        {project.images && project.images.length > 1 && (
          <section className="container mx-auto px-4 pb-12 bg-[#08090A] animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#F4F7F5] mb-6">Project Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {project.images.slice(1).map((image: string, idx: number) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden liquid-glass border border-[#1F2329] hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:shadow-[#008CE2]/20"
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${project.title} - Image ${idx + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <section className="container mx-auto px-4 pb-12 bg-gradient-to-b from-[#0F1113] to-[#08090A] animate-fade-in-up">
            <h2 className="text-3xl font-bold text-[#F4F7F5] mb-8 text-center">Key Results & Metrics</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {project.metrics.map((metric, idx) => (
                <Card
                  key={idx}
                  className="liquid-glass-enhanced border border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/10 text-center p-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-[#008CE2]/20"
                >
                  <TrendingUp className="h-8 w-8 text-[#008CE2] mx-auto mb-3" />
                  <p className="text-3xl font-bold text-[#F4F7F5] mb-2">{metric.value}</p>
                  <p className="text-sm text-[#F4F7F5]/80">{metric.label}</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        {project.tags && (
          <section className="container mx-auto px-4 py-12 bg-[#0F1113] animate-fade-in-up">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-[#F4F7F5]">Tags</h2>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-[#1A1D21] border border-[#1F2329] px-4 py-2 text-sm font-medium text-[#008CE2] shadow-sm hover:shadow-md hover:shadow-[#008CE2]/20 transition-all duration-300 hover:scale-[1.02]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Metrics */}
        {project.metrics && (
          <section className="container mx-auto px-4 py-12 bg-[#08090A] animate-fade-in-up">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-[#F4F7F5]">Key Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {project.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="liquid-glass rounded-xl p-6 border border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/10 text-center hover:shadow-xl hover:shadow-[#008CE2]/20 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="text-3xl font-bold text-[#008CE2] mb-2">{metric.value}</div>
                    <p className="text-sm text-[#F4F7F5]/80">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Technologies Used */}
        {project.technologies && project.technologies.length > 0 && (
          <section className="container mx-auto px-4 pb-12 bg-[#0F1113] animate-fade-in-up">
            <Card className="liquid-glass border border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Code2 className="h-6 w-6 text-[#008CE2]" />
                <h2 className="text-2xl font-bold text-[#F4F7F5]">Technologies & Tools</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#1A1D21] to-[#1A1D21] border border-[#1F2329] px-4 py-2 text-sm font-medium text-[#008CE2] shadow-sm hover:shadow-md hover:shadow-[#008CE2]/20 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Code2 className="h-4 w-4" />
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Timeline */}
        {project.timeline && project.timeline.length > 0 && (
          <section className="container mx-auto px-4 pb-12 bg-[#08090A] animate-fade-in-up">
            <h2 className="text-3xl font-bold text-[#F4F7F5] mb-8 text-center">Project Timeline</h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {project.timeline.map((phase, idx) => (
                  <Card
                    key={idx}
                    className="liquid-glass border border-[#1F2329] bg-[#0F1113]/80 shadow-md shadow-[#008CE2]/10 p-6 hover:shadow-lg hover:shadow-[#008CE2]/20 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1A1D21] border-2 border-[#008CE2] flex items-center justify-center shadow-sm">
                        <span className="text-lg font-bold text-[#008CE2]">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-[#F4F7F5]">{phase.phase}</h3>
                          <span className="text-sm text-[#F4F7F5]/70">{phase.duration}</span>
                        </div>
                        <p className="text-[#F4F7F5]/80">{phase.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Challenges & Solutions */}
        {(project.challenges || project.solutions) && (
          <section className="container mx-auto px-4 pb-12 bg-gradient-to-b from-[#0F1113] to-[#08090A] animate-fade-in-up">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Challenges */}
              {project.challenges && project.challenges.length > 0 && (
                <Card className="liquid-glass border border-red-500/30 bg-red-500/10 shadow-lg shadow-red-500/10 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                    <h2 className="text-2xl font-bold text-[#F4F7F5]">Challenges</h2>
                  </div>
                  <div className="space-y-4">
                    {project.challenges.map((challenge, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mt-0.5 shadow-sm">
                          <span className="text-xs font-bold text-red-400">{idx + 1}</span>
                        </div>
                        <p className="text-[#F4F7F5]/80">{challenge}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Solutions */}
              {project.solutions && project.solutions.length > 0 && (
                <Card className="liquid-glass border border-green-500/30 bg-green-500/10 shadow-lg shadow-green-500/10 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Lightbulb className="h-6 w-6 text-green-400" />
                    <h2 className="text-2xl font-bold text-[#F4F7F5]">Solutions</h2>
                  </div>
                  <div className="space-y-4">
                    {project.solutions.map((solution, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-[#F4F7F5]/80">{solution}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </section>
        )}

                {/* Deliverables */}
        {project.deliverables && (
          <section className="container mx-auto px-4 py-12 bg-[#08090A] animate-fade-in-up">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-[#F4F7F5]">Deliverables</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {project.deliverables.map((deliverable, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 liquid-glass rounded-xl p-4 border border-[#1F2329] bg-[#0F1113]/80 shadow-sm hover:shadow-md hover:shadow-[#008CE2]/20 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#008CE2] flex-shrink-0" />
                    <p className="text-[#F4F7F5]/80">{deliverable}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Awards & Recognition */}
        {project.awards && (
          <section className="container mx-auto px-4 py-12 bg-gradient-to-b from-[#0F1113] to-[#08090A] animate-fade-in-up">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-[#F4F7F5] flex items-center gap-3">
                <Award className="h-8 w-8 text-[#008CE2]" />
                Awards & Recognition
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {project.awards.map((award, idx) => (
                  <div key={idx} className="liquid-glass rounded-xl p-6 border border-[#1F2329] bg-[#0F1113]/80 shadow-sm hover:shadow-md hover:shadow-[#008CE2]/20 transition-all duration-300 hover:scale-[1.02]">
                    <p className="text-lg font-semibold text-[#F4F7F5] mb-1">{award}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Results & Metrics */}
        {project.results && (
          <section className="container mx-auto px-4 py-12 bg-[#08090A] animate-fade-in-up">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-[#F4F7F5]">Results & Impact</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {project.results.map((result, idx) => (
                  <div
                    key={idx}
                    className="liquid-glass rounded-xl p-6 border border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/10 text-center hover:shadow-xl hover:shadow-[#008CE2]/20 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="text-4xl font-bold text-[#008CE2] mb-2">{result.metric}</div>
                    <p className="text-[#F4F7F5]/80">{result.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Awards */}
        {project.awards && project.awards.length > 0 && (
          <section className="container mx-auto px-4 pb-12 bg-[#08090A] animate-fade-in-up">
            <Card className="liquid-glass border border-amber-500/30 bg-amber-500/10 shadow-lg shadow-amber-500/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-6 w-6 text-amber-400" />
                <h2 className="text-2xl font-bold text-[#F4F7F5]">Awards & Recognition</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.awards.map((award, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 rounded-lg bg-[#0F1113]/80 border border-amber-500/30 shadow-sm hover:shadow-md hover:shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02]">
                    <Award className="h-5 w-5 text-amber-400 flex-shrink-0" />
                    <span className="text-[#F4F7F5]/80 font-medium">{award}</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Results */}
        {project.results && (
          <section className="container mx-auto px-4 pb-12 bg-gradient-to-b from-[#0F1113] to-[#08090A] animate-fade-in-up">
            <h2 className="text-3xl font-bold text-[#F4F7F5] mb-8 text-center">Project Outcomes</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {project.results.map((result, idx) => (
                <Card
                  key={idx}
                  className="liquid-glass border border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/10 text-center p-6 hover:shadow-xl hover:shadow-[#008CE2]/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  <Check className="h-8 w-8 text-[#008CE2] mx-auto mb-3" />
                  <p className="text-lg font-semibold text-[#F4F7F5]">{result}</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Testimonial */}
        {project.testimonial && (
          <section className="container mx-auto px-4 pb-12 bg-[#08090A] animate-fade-in-up">
            <Card className="liquid-glass-enhanced border border-[#1F2329] bg-[#1A1D21] shadow-xl shadow-[#008CE2]/10 p-8 sm:p-12 max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-[#008CE2]/20 border-2 border-[#008CE2] flex items-center justify-center shadow-sm">
                  <Quote className="h-8 w-8 text-[#008CE2]" />
                </div>
              </div>
              <blockquote className="text-xl sm:text-2xl text-center text-[#F4F7F5] mb-6 italic leading-relaxed">
                "{project.testimonial.quote}"
              </blockquote>
              <div className="text-center">
                <p className="font-bold text-xl text-[#F4F7F5]">{project.testimonial.author}</p>
                <p className="text-sm text-[#F4F7F5]/70 mt-1">{project.testimonial.role}</p>
              </div>
            </Card>
          </section>
        )}

        {/* Links */}
        {project.links && project.links.length > 0 && (
          <section className="container mx-auto px-4 pb-12 bg-gradient-to-b from-[#08090A] to-[#0F1113] animate-fade-in-up">
            <div className="flex flex-wrap gap-4 justify-center">
              {project.links.map((link, idx) => (
                <Button
                  key={idx}
                  asChild
                  variant="outline"
                  className="liquid-glass hover:liquid-glass-enhanced border-[#008CE2] text-[#008CE2] hover:bg-[#1A1D21] shadow-sm hover:shadow-md hover:shadow-[#008CE2]/20 transition-all duration-300"
                >
                  <Link href={link.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {link.label}
                  </Link>
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* Team Members */}
        {project.teamMembers && project.teamMembers.length > 0 && (
          <section className="container mx-auto px-4 pb-12 bg-[#0F1113] animate-fade-in-up">
            <Card className="liquid-glass border border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-[#008CE2]" />
                <h2 className="text-2xl font-bold text-[#F4F7F5]">Project Team</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.teamMembers.map((memberId) => {
                  const member = getTeamMemberById(memberId)
                  if (!member) return null
                  return (
                    <Link key={memberId} href={`/team/${memberId}`}>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-[#1A1D21] hover:bg-[#1A1D21]/80 transition-all duration-300 hover:scale-[1.02] border border-[#1F2329] shadow-sm hover:shadow-md hover:shadow-[#008CE2]/20">
                        <div className="relative h-14 w-14 rounded-full overflow-hidden bg-[#1A1D21] flex-shrink-0 shadow-sm">
                          <img
                            src={member.image || "/placeholder.svg"}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-[#F4F7F5]">{member.name}</p>
                          <p className="text-sm text-[#F4F7F5]/70">{member.role}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </Card>
          </section>
        )}

        {/* CTA */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24 bg-gradient-to-b from-[#0F1113] to-[#08090A] animate-fade-in-up">
          <Card className="liquid-glass-enhanced border border-[#008CE2]/30 bg-gradient-to-br from-[#008CE2]/20 to-[#06B9D0]/10 shadow-2xl shadow-[#008CE2]/20 text-center p-8 sm:p-12">
            <h2 className="mb-4 text-3xl font-bold text-[#F4F7F5] sm:text-4xl">Ready to Start Your Project?</h2>
            <p className="mb-8 text-lg text-[#F4F7F5]/80 max-w-2xl mx-auto">
              Let's create something amazing together. Get in touch to discuss how we can help bring your vision to life.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#008CE2] px-8 text-base font-semibold text-white hover:bg-[#06B9D0] shadow-lg shadow-[#008CE2]/30 transition-all duration-300"
              >
                <Link href="https://wa.me/8801401658685?text=Hi!%20I'm%20interested%20in%20this%20project">Get in Touch via WhatsApp</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-[#008CE2] text-[#008CE2] hover:bg-[#1A1D21] shadow-sm transition-all duration-300"
              >
                <Link href="/services">Explore Our Services</Link>
              </Button>
            </div>
          </Card>
        </section>

        <AppverseFooter />
      </main>
      
      {/* Structured Data for Project Case Study */}
      <Script
        id="project-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": project.title,
            "description": project.longDescription || project.description,
            "author": {
              "@type": "Organization",
              "name": "Pqrix"
            },
            "datePublished": `${project.year}-01-01`,
            "image": project.image || project.video,
            "keywords": project.tags.join(", "),
            "about": {
              "@type": "Thing",
              "name": project.category
            },
            "client": {
              "@type": "Organization",
              "name": project.client
            },
            "review": project.testimonial ? {
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5"
              },
              "author": {
                "@type": "Person",
                "name": project.testimonial.author,
                "jobTitle": project.testimonial.role
              },
              "reviewBody": project.testimonial.quote
            } : undefined
          })
        }}
      />
    </>
  )
}
