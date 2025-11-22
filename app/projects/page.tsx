import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Link from "next/link"
import { getAllProjectsForBuild } from "@/lib/get-projects"

interface Project {
  id: string
  title: string
  client: string
  category: string
  description: string
  image?: string
  images?: string[]
  video?: string
  tags: string[]
  year: string
}

export const metadata = {
  title: "Our Projects & Portfolio | Software Development Case Studies | Pqrix Bangladesh",
  description:
    "Explore our portfolio of successful software projects in Bangladesh: Web applications, Mobile apps, SaaS platforms, 3D web experiences, and desktop solutions. Real client results, proven expertise in Discovery & Strategy, Full-stack development, and Custom software solutions.",
  keywords: [
    // Portfolio General
    "software development portfolio",
    "software projects",
    "IT portfolio",
    "development portfolio",
    "project showcase",
    "work portfolio",
    "case studies",
    "software case studies",
    "project case studies",
    "success stories",
    "client success stories",
    "software success stories",
    "completed projects",
    "delivered projects",
    "past projects",
    "project examples",
    "project samples",
    "software examples",
    "development work",
    "previous work",
    "client work",
    "client projects",
    
    // Project Types - Comprehensive
    "web application projects",
    "web development projects",
    "website projects",
    "web portfolio",
    "SaaS projects",
    "cloud application projects",
    "mobile app projects",
    "mobile application portfolio",
    "iOS app projects",
    "android app projects",
    "mobile app portfolio",
    "desktop software projects",
    "desktop application portfolio",
    "3D web projects",
    "WebGL projects",
    "interactive 3D projects",
    "virtual tour projects",
    "e-commerce projects",
    "online store projects",
    "marketplace projects",
    "fintech projects",
    "financial software projects",
    "healthcare software projects",
    "education software projects",
    "e-learning projects",
    "logistics software projects",
    "CRM projects",
    "ERP projects",
    "custom software projects",
    "enterprise software projects",
    "business software projects",
    "startup projects",
    "MVP projects",
    
    // Client & Results Focus
    "client testimonials",
    "customer testimonials",
    "client reviews",
    "project testimonials",
    "client feedback",
    "success metrics",
    "project results",
    "delivered results",
    "proven results",
    "measurable results",
    "ROI projects",
    "business impact",
    "real-world projects",
    "production projects",
    "live projects",
    "deployed projects",
    "successful implementations",
    "client satisfaction",
    "happy clients",
    "trusted by clients",
    
    // Industry-Specific Projects
    "fintech portfolio",
    "ecommerce portfolio",
    "healthcare portfolio",
    "education portfolio",
    "logistics portfolio",
    "retail projects",
    "hospitality projects",
    "real estate projects",
    "social media projects",
    "booking system projects",
    "management system projects",
    "B2B projects",
    "B2C projects",
    "enterprise projects",
    "startup portfolio",
    "SME projects",
    
    // Technical Showcases
    "full stack projects",
    "backend projects",
    "frontend projects",
    "React projects",
    "Angular projects",
    "Vue.js projects",
    "Node.js projects",
    "Python projects",
    "Laravel projects",
    "Django projects",
    "Flutter projects",
    "React Native projects",
    "Electron projects",
    "Three.js projects",
    "WebGL showcase",
    "API projects",
    "microservices projects",
    "cloud projects",
    "AWS projects",
    "azure projects",
    
    // Features Demonstrated
    "payment integration projects",
    "bKash integration projects",
    "Nagad integration projects",
    "payment gateway projects",
    "third-party integration",
    "API integration examples",
    "real-time projects",
    "chat application projects",
    "video streaming projects",
    "data visualization projects",
    "dashboard projects",
    "admin panel projects",
    "multi-tenant projects",
    "white label projects",
    "subscription-based projects",
    "marketplace platform",
    "booking platform",
    "management platform",
    
    // Project Attributes
    "custom solutions",
    "tailored solutions",
    "bespoke projects",
    "innovative projects",
    "cutting-edge projects",
    "modern projects",
    "scalable projects",
    "secure projects",
    "high-performance projects",
    "responsive projects",
    "mobile-friendly projects",
    "cross-platform projects",
    "cloud-based projects",
    "enterprise-grade projects",
    
    // Proof & Credibility
    "proven expertise",
    "demonstrated skills",
    "technical expertise",
    "industry experience",
    "project experience",
    "years of experience",
    "trusted partner",
    "reliable solutions",
    "quality work",
    "professional work",
    "award-winning projects",
    "featured projects",
    "highlighted work",
    "best projects",
    "top projects",
    
    // Development Proof
    "agile projects",
    "scrum projects",
    "sprint-based delivery",
    "on-time delivery",
    "successful delivery",
    "completed on budget",
    "satisfied clients",
    "repeat clients",
    "long-term clients",
    "partnership projects",
    
    // Transformation Stories
    "digital transformation",
    "business transformation",
    "process automation",
    "workflow automation",
    "legacy modernization",
    "system migration",
    "cloud migration projects",
    "technology upgrade",
    "software upgrade projects",
    "platform migration",
    
    // Specific Solutions
    "CRM implementation",
    "ERP implementation",
    "LMS implementation",
    "POS implementation",
    "inventory system",
    "accounting system",
    "billing system",
    "HR management system",
    "payroll system",
    "project management system",
    "task management system",
    "document management",
    "content management",
    "learning management",
    "customer management",
    "vendor management",
    "supply chain management",
    "warehouse management",
    "fleet management",
    "asset management",
    
    // Location-specific (keeping Bangladesh)
    "software portfolio Bangladesh",
    "IT projects Bangladesh",
    "software company portfolio Bangladesh",
    "development work Bangladesh",
    "Bangladesh tech projects"
  ].join(", "),
  openGraph: {
    title: "Software Development Projects Portfolio | Pqrix Bangladesh",
    description: "Browse our successful software development projects in Bangladesh: Web apps, Mobile applications, SaaS platforms, and Desktop solutions. See how we've helped businesses grow with technology.",
    type: "website",
    url: "https://pqrix.com/projects",
    images: [
      {
        url: "/icons/pqrix-logo.png",
        width: 1200,
        height: 630,
        alt: "Pqrix Software Development Projects Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Development Projects | Pqrix Bangladesh",
    description: "Explore our portfolio of web, mobile, and desktop software projects in Bangladesh. Real results, proven expertise.",
    images: ["/icons/pqrix-logo.png"],
  },
  alternates: {
    canonical: "https://pqrix.com/projects",
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Enable dynamic rendering in production for fresh data
export const dynamic = 'force-static'
export const revalidate = 60 // Revalidate every 60 seconds

async function getProjects(): Promise<any[]> {
  // During build time, use direct database access
  // During runtime, use API with ISR revalidation
  const isProductionBuild = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;
  
  if (isProductionBuild) {
    // Build time: Direct database access
    return await getAllProjectsForBuild();
  }

  // Runtime: Try API first, fallback to DB if it fails
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/projects`, {
      next: { revalidate: 60 } // ISR with 60 second revalidation
    })
    
    if (!response.ok) {
      throw new Error('API fetch failed')
    }
    
    const data = await response.json()
    return data.data || data || []
  } catch (error) {
    console.error('API fetch failed, falling back to database:', error);
    // Fallback to database
    return await getAllProjectsForBuild();
  }
}

function getAllCategories(projects: any[]) {
  if (!Array.isArray(projects)) return ['All']
  const categories = new Set(projects.map((p: any) => p.category))
  return ['All', ...Array.from(categories)]
}

export default async function ProjectsPage() {
  const allProjects = await getProjects()
  const categories = getAllCategories(allProjects)
  return (
    <>
      <main className="min-h-[100dvh] bg-[#08090A] text-[#F4F7F5]">
        <SiteHeader />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24 bg-gradient-to-b from-[#08090A] via-[#0F1113] to-[#08090A]">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-[#F4F7F5] animate-fade-in-up">
              <span className="block">Our Creative</span>
              <span className="block text-[#008CE2] drop-shadow-[0_0_20px_rgba(0,140,226,0.5)]">Portfolio</span>
            </h1>
            <p className="text-lg text-[#F4F7F5]/80 sm:text-xl animate-fade-in-up delay-100">
              Explore our latest work and see how we've helped brands create unforgettable experiences
            </p>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="container mx-auto px-4 pb-8 bg-gradient-to-b from-[#0F1113] to-[#08090A]">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={
                  category === "All"
                    ? "rounded-full bg-[#008CE2] text-[#F4F7F5] hover:bg-[#06B9D0] shadow-lg shadow-[#008CE2]/40 animate-pulse-glow"
                    : "rounded-full border-[#1F2329] bg-[#0F1113] text-[#F4F7F5] hover:bg-[#1A1D21] hover:border-[#008CE2]"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Projects Grid */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24 bg-gradient-to-b from-[#08090A] to-[#0F1113]">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allProjects.map((project: Project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="group liquid-glass border border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl overflow-hidden transition-all hover:border-[#008CE2] hover:bg-[#1A1D21]/90 hover:scale-[1.02] h-full shadow-lg shadow-[#008CE2]/20 hover:shadow-xl hover:shadow-[#06B9D0]/30 animate-fade-in-up">
                  <div className="relative aspect-video overflow-hidden bg-[#1A1D21]">
                    {project.video ? (
                      <>
                        <video
                          src={project.video}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08090A]/60 to-transparent" />
                      </>
                    ) : (
                      <>
                        <img
                          src={project.image || project.images?.[0] || "/placeholder.svg"}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08090A]/60 to-transparent" />
                      </>
                    )}

                    {project.video && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#008CE2]/90 backdrop-blur-sm shadow-lg shadow-[#008CE2]/50 group-hover:scale-110 transition-all duration-300">
                          <Play className="h-7 w-7 text-white fill-white ml-1" />
                        </div>
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center rounded-full bg-[#0F1113]/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-[#008CE2] border border-[#008CE2]/50">
                        {project.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center rounded-full bg-[#0F1113]/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-[#F4F7F5]">
                        {project.year}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-2 text-sm text-[#F4F7F5]/70">{project.client}</div>
                    <h3 className="mb-2 text-xl font-bold text-[#F4F7F5] group-hover:text-[#008CE2] transition-colors">
                      {project.title}
                    </h3>
                    <p className="mb-4 text-sm text-[#F4F7F5]/80 line-clamp-2">{project.description}</p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="rounded-full bg-[#1A1D21] px-2.5 py-1 text-xs text-[#F4F7F5]/80 border border-[#1F2329]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24">
          <Card className="liquid-glass-enhanced border border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl text-center p-8 sm:p-12 shadow-lg shadow-[#008CE2]/30 animate-fade-in-up">
            <h2 className="mb-4 text-3xl font-bold text-[#F4F7F5] sm:text-4xl">Ready to Create Something Amazing?</h2>
            <p className="mb-8 text-lg text-[#F4F7F5]/80">Let's bring your vision to life with our creative expertise</p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#008CE2] px-8 text-base font-semibold text-[#F4F7F5] hover:bg-[#06B9D0] shadow-lg shadow-[#008CE2]/30 hover:shadow-xl hover:shadow-[#06B9D0]/40 hover:scale-105 transition-all duration-300 animate-pulse-glow"
            >
              <Link href="https://wa.me/8801401658685?text=Hi!%20I'd%20like%20to%20start%20a%20project">Start Your Project</Link>
            </Button>
          </Card>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
