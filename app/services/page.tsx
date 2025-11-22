import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { getAllServicesForBuild } from "@/lib/get-services"
import * as LucideIcons from "lucide-react"

// ISR configuration
export const dynamic = 'force-static'
export const revalidate = 60 // Revalidate every 60 seconds

async function getServices() {
  // During build time, use direct database access
  // During runtime, use API with ISR revalidation
  const isProductionBuild = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;
  
  if (isProductionBuild) {
    // Build time: Direct database access
    return getAllServicesForBuild();
  }

  // Runtime: Try API first, fallback to DB if it fails
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/services`, {
      next: { revalidate: 60 } // ISR with 60 second revalidation
    })
    
    if (!response.ok) {
      throw new Error('API fetch failed')
    }
    
    const data = await response.json()
    return data.success ? data.data : []
  } catch (error) {
    console.error('API fetch failed, falling back to database:', error);
    // Fallback to database
    return getAllServicesForBuild();
  }
}

export const metadata = {
  title: "Software Development Services in Bangladesh | Web, Mobile, Desktop & 3D Solutions",
  description:
    "Expert software development services in Bangladesh: Discovery & Strategy (৳8,500), Web/SaaS Development (৳35,000+), Mobile Apps (৳75,000+), Custom 3D Web/XR (৳55,000+), Desktop Applications (৳65,000+). Local payment integration (bKash/Nagad). Fixed-price quotes available.",
  keywords: [
    // Core Services - General
    "software development services",
    "custom software development",
    "software development company",
    "software solutions",
    "IT services",
    "technology services",
    
    // Discovery & Strategy - Broad
    "discovery and strategy",
    "software discovery",
    "project discovery",
    "technical blueprint",
    "software planning",
    "project planning",
    "requirements analysis",
    "scope of work",
    "SOW document",
    "statement of work",
    "software proposal",
    "technical proposal",
    "feasibility study",
    "product roadmap",
    "technology roadmap",
    "software architecture",
    "system architecture",
    "technical architecture",
    "wireframing services",
    "prototyping services",
    "UX flowchart",
    "user journey mapping",
    "software estimation",
    "project estimation",
    "cost estimation",
    "timeline estimation",
    "resource planning",
    "technical consultation",
    "software consulting",
    "IT consulting",
    "technology consulting",
    "proof of concept",
    "POC development",
    "MVP planning",
    "minimum viable product",
    "product strategy",
    "digital strategy",
    "software audit",
    "code audit",
    "technical audit",
    
    // Web & SaaS - Comprehensive
    "web development",
    "web application development",
    "web app development",
    "website development",
    "web design and development",
    "SaaS development",
    "software as a service",
    "cloud software development",
    "custom CRM",
    "CRM development",
    "customer relationship management",
    "custom ERP",
    "ERP development",
    "enterprise resource planning",
    "e-commerce development",
    "ecommerce solutions",
    "online store development",
    "shopping cart development",
    "marketplace development",
    "multi-vendor platform",
    "payment gateway integration",
    "payment processing",
    "bKash integration",
    "Nagad integration",
    "stripe integration",
    "paypal integration",
    "razorpay integration",
    "web portal development",
    "customer portal",
    "employee portal",
    "vendor portal",
    "admin portal",
    "corporate website",
    "business website",
    "company website",
    "responsive web design",
    "mobile-first design",
    "progressive web app",
    "PWA development",
    "single page application",
    "SPA development",
    "API development",
    "REST API development",
    "RESTful services",
    "GraphQL API",
    "API integration",
    "third-party integration",
    "webhook integration",
    "cloud hosting solutions",
    "cloud deployment",
    "cloud migration services",
    "AWS services",
    "azure solutions",
    "google cloud platform",
    "devops services",
    "CI/CD pipeline",
    "continuous integration",
    "continuous deployment",
    "automated deployment",
    "server management",
    "database management",
    "full stack development",
    "frontend development",
    "backend development",
    "server-side development",
    "client-side development",
    
    // Mobile App - Extensive
    "mobile app development",
    "mobile application development",
    "app development services",
    "iOS app development",
    "iPhone app development",
    "iPad app development",
    "iOS development services",
    "Android app development",
    "android development services",
    "google play store app",
    "cross-platform app development",
    "hybrid app development",
    "native app development",
    "mobile app design",
    "app UI design",
    "app UX design",
    "Flutter development",
    "React Native development",
    "ionic development",
    "xamarin development",
    "cordova development",
    "swift development",
    "kotlin development",
    "java development",
    "objective-c development",
    "app store optimization",
    "ASO services",
    "app store submission",
    "play store submission",
    "app deployment",
    "mobile backend development",
    "backend as a service",
    "BaaS",
    "push notification services",
    "in-app purchases",
    "mobile payment integration",
    "app analytics",
    "mobile analytics",
    "app maintenance",
    "app support",
    "app updates",
    "app testing services",
    "mobile testing",
    "QA testing",
    "beta testing",
    "user acceptance testing",
    
    // 3D Web & XR - Detailed
    "3D web development",
    "3D website development",
    "WebGL development",
    "Three.js development",
    "3D graphics",
    "web-based 3D",
    "interactive 3D website",
    "3D visualization",
    "3D product visualization",
    "product viewer 3D",
    "3D configurator",
    "product configurator",
    "virtual tour development",
    "360 virtual tour",
    "virtual showroom",
    "immersive web experience",
    "XR development",
    "extended reality",
    "augmented reality web",
    "AR web development",
    "WebAR",
    "virtual reality web",
    "VR web development",
    "WebVR",
    "WebXR development",
    "metaverse development",
    "3D modeling for web",
    "real-time rendering",
    "canvas 3D",
    "babylon.js development",
    "A-frame development",
    
    // Desktop Application - Complete
    "desktop application development",
    "desktop software development",
    "Windows application development",
    "Windows software",
    "macOS application development",
    "Mac software development",
    "linux application development",
    "cross-platform desktop app",
    "electron development",
    "electron app",
    "desktop app design",
    "enterprise desktop application",
    "business desktop software",
    "internal tools development",
    "custom desktop software",
    "data management software",
    "database application",
    "inventory management software",
    "stock management system",
    "POS system development",
    "point of sale software",
    "retail software",
    "accounting software development",
    "billing software",
    "invoicing software",
    "desktop CRM",
    "desktop ERP",
    "offline software",
    "standalone application",
    "legacy software modernization",
    "software migration services",
    "desktop to cloud migration",
    
    // Pricing & Business Models
    "fixed price development",
    "fixed cost software",
    "affordable software development",
    "budget software development",
    "cost-effective solutions",
    "transparent pricing",
    "no hidden costs",
    "flexible pricing",
    "package pricing",
    "tiered pricing",
    "subscription-based development",
    "monthly retainer",
    "dedicated team pricing",
    "hourly rate development",
    "project-based pricing",
    
    // Quality & Methodology
    "agile development",
    "scrum methodology",
    "agile software development",
    "sprint-based development",
    "iterative development",
    "rapid development",
    "quick turnaround",
    "fast delivery",
    "on-time delivery",
    "quality assurance",
    "QA services",
    "software testing",
    "bug-free software",
    "clean code",
    "maintainable code",
    "scalable software",
    "secure software development",
    "best practices",
    "code standards",
    
    // Support & Maintenance
    "software maintenance",
    "software support services",
    "technical support",
    "bug fixing services",
    "software updates",
    "feature enhancement",
    "ongoing support",
    "post-launch support",
    "24/7 support",
    "dedicated support",
    
    // Location-specific (keeping Bangladesh)
    "software development Bangladesh",
    "IT services Bangladesh",
    "software company Bangladesh",
    "bKash integration Bangladesh",
    "Nagad integration Bangladesh",

     "software development services Bangladesh",
    "discovery and strategy Bangladesh",
    "technical blueprint Bangladesh",
    "SOW Bangladesh",
    "web development Bangladesh",
    "SaaS development Bangladesh",
    "custom CRM Bangladesh",
    "custom ERP Bangladesh",
    "bKash integration",
    "Nagad integration",
    "mobile app development Bangladesh",
    "iOS app development BD",
    "Android app development BD",
    "cross-platform app development Bangladesh",
    "3D web development Bangladesh",
    "WebGL development BD",
    "Three.js development",
    "virtual tour Bangladesh",
    "desktop application Bangladesh",
    "Windows software development BD",
    "macOS software development",
    // Pricing-related
    "affordable software development Bangladesh",
    "fixed price software development",
    "software development packages BD",
    "software MVP Bangladesh",
    // Local market
    "software company Bangladesh",
    "IT services BD",
    "tech solutions Bangladesh",
    "software outsourcing Bangladesh",
    "local payment gateway integration"
  ].join(", "),
  openGraph: {
    title: "Software Development Services in Bangladesh | Pqrix",
    description: "Comprehensive software development services in Bangladesh: Discovery & Strategy, Web/SaaS, Mobile Apps, 3D Web/XR, Desktop Applications. Local payment integration available. Starting ৳8,500.",
    type: "website",
    url: "https://pqrix.com/services",
    images: [
      {
        url: "/icons/pqrix-logo.png",
        width: 1200,
        height: 630,
        alt: "Pqrix Software Development Services Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Development Services in Bangladesh | Pqrix",
    description: "Expert software development: Web/SaaS, Mobile Apps, 3D Web, Desktop Solutions in Bangladesh. bKash/Nagad integration. Starting ৳8,500.",
    images: ["/icons/pqrix-logo.png"],
  },
  alternates: {
    canonical: "https://pqrix.com/services",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function ServicesPage() {
  const services = await getServices()
  
  return (
    <>
      <main className="min-h-[100dvh] bg-[#08090A] text-[#F4F7F5]">
        <SiteHeader />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24 bg-gradient-to-b from-[#08090A] via-[#0F1113] to-[#08090A]">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-[#F4F7F5] animate-fade-in-up">
              <span className="block">Premium Creative</span>
              <span className="block text-[#008CE2] drop-shadow-[0_0_20px_rgba(0,140,226,0.5)]">Services</span>
            </h1>
            <p className="text-lg text-[#F4F7F5]/80 sm:text-xl animate-fade-in-up delay-100">
              From concept to completion, we deliver world-class creative solutions that drive real results for your
              business
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24">
          <div className="grid gap-8 lg:gap-12">
            {services.map((service: any, index: number) => {
              const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Box
              return (
              <Card
                key={service.id}
                className="liquid-glass border border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl overflow-hidden shadow-lg shadow-[#008CE2]/20 hover:shadow-xl hover:shadow-[#06B9D0]/30 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
              >
                <div className={`grid gap-8 lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                  {/* Image */}
                  <div className={`relative aspect-video lg:aspect-auto ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color}`} />
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-8 flex flex-col justify-center">
                    <div
                      className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.color}`}
                    >
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>

                    <CardHeader className="p-0 mb-4">
                      <p className="text-sm font-medium text-[#008CE2] mb-2">{service.tagline}</p>
                      <CardTitle className="text-3xl text-[#F4F7F5] mb-3">{service.title}</CardTitle>
                      <p className="text-[#F4F7F5]/80">{service.description}</p>
                    </CardHeader>

                    <CardContent className="p-0 space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-[#F4F7F5] mb-3">What's Included:</h4>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-[#F4F7F5]/80">
                              <Check className="h-4 w-4 text-[#008CE2] mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="text-2xl font-bold text-[#008CE2]">{service.pricing}</div>
                        <Button asChild className="rounded-full bg-[#008CE2] px-6 text-[#F4F7F5] hover:bg-[#06B9D0] shadow-lg shadow-[#008CE2]/30 hover:shadow-xl hover:shadow-[#06B9D0]/40 hover:scale-105 transition-all duration-300">
                          <Link href={`/services/${service.id}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24 bg-gradient-to-b from-[#08090A] via-[#0F1113] to-[#08090A]">
          <Card className="liquid-glass-enhanced border border-[#1F2329] bg-[#0F1113]/90 backdrop-blur-xl text-center p-8 sm:p-12 shadow-lg shadow-[#008CE2]/40 animate-fade-in-up">
            <h2 className="mb-4 text-3xl font-bold text-[#F4F7F5] sm:text-4xl">Ready to Start Your Project?</h2>
            <p className="mb-8 text-lg text-[#F4F7F5]/80">Let's discuss how we can bring your vision to life</p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#008CE2] px-8 text-base font-semibold text-[#F4F7F5] hover:bg-[#06B9D0] shadow-lg shadow-[#008CE2]/30 hover:shadow-xl hover:shadow-[#06B9D0]/40 hover:scale-105 transition-all duration-300"
            >
              <Link href="https://wa.me/8801401658685?text=Hi!%20I'm%20interested%20in%20your%20services">Get in Touch</Link>
            </Button>
          </Card>
        </section>

        <AppverseFooter />
      </main>
      
      {/* Structured Data for Services */}
      <Script
        id="services-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": services.map((service, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Service",
                "name": service.title,
                "description": service.description,
                "provider": {
                  "@type": "Organization",
                  "name": "Pqrix"
                },
                "areaServed": "Worldwide",
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": service.title,
                  "itemListElement": service.packages ? service.packages.map((pkg: any) => ({
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": `${service.title} - ${pkg.name}`
                    }
                  })) : []
                }
              }
            }))
          })
        }}
      />
    </>
  )
}
