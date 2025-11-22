import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { ServicesSection } from "@/components/services-section"
import { LogoMarquee } from "@/components/logo-marquee"
import { TechStackMarquee } from "@/components/tech-stack-marquee"
import { Pricing } from "@/components/pricing"
import { AppverseFooter } from "@/components/appverse-footer"
import { ProjectsSection } from "@/components/projects-section"
import { WhatsAppButton } from "@/components/whatsapp-button"
import Script from "next/script"

// ✅ Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
  // Structured data for pricing
  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPageElement",
    "@id": "https://pixelprimp.com/#pricing",
    name: "Pricing Plans",
    description: "Software development and creative services pricing plans including web/mobile development, video editing, photo editing, and 3D animation",
    url: "https://pixelprimp.com/#pricing",
    mainEntity: {
      "@type": "PriceSpecification",
      name: "Software Development Services",
      description: "Professional software development services with comprehensive pricing packages",
      offers: [
        {
          "@type": "Offer",
          name: "Discovery & Strategy",
          price: "8500",
          priceCurrency: "BDT",
          description: "Technical blueprint, wireframing, and project planning",
        },
        {
          "@type": "Offer",
          name: "Web & SaaS Development",
          price: "35000",
          priceCurrency: "BDT",
          description: "Custom web applications, CRM, ERP, and SaaS solutions",
        },
        {
          "@type": "Offer",
          name: "Mobile App Development",
          price: "75000",
          priceCurrency: "BDT",
          description: "iOS, Android, and cross-platform mobile applications",
        },
      ],
    },
  }

    // Structured data for main page
  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://pqrix.com/",
    name: "Pqrix | Software Development Company in Bangladesh",
    description:
      "Leading software development company in Bangladesh offering Discovery & Strategy, Web/SaaS Development, Mobile Apps, 3D Web/XR, and Desktop solutions with local payment integration.",
    url: "https://pqrix.com/",
    mainEntity: {
      "@type": "Organization",
      name: "Pqrix",
      url: "https://pqrix.com",
      sameAs: [
        "https://twitter.com/pqrix",
        "https://www.youtube.com/@pqrix",
        "https://instagram.com/pqrix",
        "https://threads.com/pqrix",
      ],
    },
    hasPart: [
      {
        "@type": "WebPageElement",
        "@id": "https://pqrix.com/#pricing",
        name: "Pricing Section",
        url: "https://pqrix.com/#pricing",
      },
    ],
  }

  return (
    <>
      <main className="min-h-[100dvh] bg-[#08090A] text-[#F4F7F5]">
        <SiteHeader />
        <Hero />
        <Features />
        <ServicesSection />
        <TechStackMarquee />
        <ProjectsSection />
        {/* <LogoMarquee /> */}
        {/* <Pricing /> */}
        <AppverseFooter />
      </main>
      
      {/* WhatsApp Floating Button */}
      <WhatsAppButton />

      {/* JSON-LD structured data */}
      <Script
        id="pricing-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricingStructuredData),
        }}
      />

      <Script
        id="page-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageStructuredData),
        }}
      />
    </>
  )
}
