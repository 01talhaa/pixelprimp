import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import Plasma from "@/components/plasma"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL('https://pixelprimp.com'),
  title: {
    default: "PixelPrimp | Software Development & Creative Studio | Web, Mobile, Video & Photo Editing",
    template: "%s | PixelPrimp"
  },
  description:
    "PixelPrimp - Your complete software development and creative studio in Bangladesh. We offer web/mobile development, 3D animation, video editing, photo editing, and graphic design. From code to creativity, we handle it all. Affordable pricing starting ৳8,500.",
  keywords: [
    // Company & Location
    "software development company Bangladesh",
    "software company in Bangladesh",
    "IT company Bangladesh",
    "software development firm BD",
    "tech company Bangladesh",
    "software house Bangladesh",
    "software development agency",
    "custom software company",
    "software solutions provider",
    "IT solutions company",
    "technology partner",
    "digital transformation company",
    
    // Discovery & Strategy - General
    "discovery and strategy",
    "software project planning",
    "technical blueprint",
    "scope of work",
    "product roadmap",
    "software consultation",
    "project scope definition",
    "wireframing services",
    "UX flowchart",
    "software requirements analysis",
    "technical feasibility study",
    "product discovery phase",
    "project estimation",
    "software proposal",
    "technical documentation",
    "system architecture design",
    "software specification",
    "proof of concept",
    "MVP planning",
    "software audit",
    
    // Web & SaaS Development - Extensive
    "web development",
    "web application development",
    "SaaS development",
    "software as a service",
    "custom CRM development",
    "custom ERP development",
    "enterprise software",
    "business software",
    "e-commerce development",
    "online store development",
    "payment gateway integration",
    "bKash payment integration",
    "Nagad payment integration",
    "stripe integration",
    "paypal integration",
    "web portal development",
    "corporate website",
    "business website development",
    "responsive web design",
    "progressive web app",
    "PWA development",
    "API development",
    "REST API",
    "GraphQL API",
    "API integration",
    "third party integration",
    "cloud hosting",
    "cloud migration",
    "cloud infrastructure",
    "devops services",
    "continuous integration",
    "continuous deployment",
    "full stack development",
    "backend development",
    "frontend development",
    "MEAN stack",
    "MERN stack",
    "LAMP stack",
    "node.js development",
    "react development",
    "angular development",
    "vue.js development",
    "laravel development",
    "django development",
    "php development",
    "python development",
    "ruby on rails",
    "dotnet development",
    
    // Mobile App Development - Comprehensive
    "mobile app development",
    "iOS app development",
    "iPhone app development",
    "iPad app development",
    "Android app development",
    "cross-platform app development",
    "hybrid app development",
    "native app development",
    "mobile application company",
    "app development company",
    "Flutter development",
    "React Native development",
    "ionic development",
    "xamarin development",
    "swift development",
    "kotlin development",
    "mobile app design",
    "app UI UX design",
    "app store optimization",
    "app store submission",
    "play store submission",
    "mobile backend",
    "push notification",
    "in-app purchase",
    "mobile analytics",
    "app maintenance",
    "app testing",
    "QA testing",
    "beta testing",
    "mobile security",
    "app monetization",
    
    // Custom 3D Web & XR - Extensive
    "3D web development",
    "WebGL development",
    "Three.js development",
    "3D website",
    "interactive 3D",
    "3D visualization",
    "virtual tour",
    "360 virtual tour",
    "3D product viewer",
    "product configurator",
    "immersive web experience",
    "XR development",
    "augmented reality",
    "AR development",
    "virtual reality",
    "VR development",
    "mixed reality",
    "metaverse development",
    "3D modeling for web",
    "real-time 3D",
    "browser-based 3D",
    "canvas development",
    "babylon.js",
    "A-frame development",
    "webXR",
    
    // Desktop Application - Comprehensive
    "desktop application development",
    "Windows app development",
    "macOS app development",
    "linux app development",
    "cross-platform desktop",
    "electron development",
    "desktop software",
    "enterprise application",
    "internal tools development",
    "data management software",
    "inventory management",
    "POS system",
    "point of sale software",
    "accounting software",
    "billing software",
    "CRM desktop",
    "ERP desktop",
    "desktop automation",
    "legacy software modernization",
    "software migration",
    "desktop to web migration",
    
    // Services & Features - Universal
    "fixed price software development",
    "affordable software development",
    "cost-effective development",
    "budget-friendly software",
    "custom software solutions",
    "bespoke software",
    "tailor-made software",
    "software outsourcing",
    "offshore development",
    "nearshore development",
    "remote development team",
    "dedicated development team",
    "software MVP development",
    "minimum viable product",
    "rapid prototyping",
    "agile development",
    "scrum development",
    "waterfall methodology",
    "software maintenance",
    "software support",
    "bug fixing",
    "software updates",
    "feature enhancement",
    "software optimization",
    "performance tuning",
    "code refactoring",
    "technical debt reduction",
    "software scaling",
    "load balancing",
    
    // Industry Solutions - Broad
    "fintech development",
    "financial software",
    "banking software",
    "insurance software",
    "e-commerce solutions",
    "retail software solutions",
    "healthcare software",
    "hospital management system",
    "telemedicine platform",
    "education software",
    "e-learning platform",
    "LMS development",
    "learning management system",
    "logistics software",
    "supply chain management",
    "warehouse management",
    "fleet management",
    "real estate software",
    "property management",
    "hospitality software",
    "hotel management system",
    "restaurant software",
    "food delivery app",
    "social media platform",
    "marketplace development",
    "booking system",
    "appointment scheduling",
    "CMS development",
    "content management system",
    "HR management software",
    "payroll software",
    "project management software",
    "task management",
    "collaboration tools",
    
    // Technology Stack - Keywords
    "javascript development",
    "typescript development",
    "html5 development",
    "css3 development",
    "bootstrap development",
    "tailwind css",
    "material design",
    "sass development",
    "webpack",
    "vite",
    "next.js development",
    "nuxt.js development",
    "gatsby development",
    "express.js",
    "nest.js",
    "fastify",
    "spring boot",
    "mysql development",
    "postgresql",
    "mongodb",
    "redis",
    "elasticsearch",
    "firebase development",
    "supabase",
    "aws development",
    "azure development",
    "google cloud",
    "docker",
    "kubernetes",
    "microservices",
    "serverless",
    "lambda functions",
    
    // Software Types
    "web application",
    "mobile application",
    "desktop application",
    "cloud application",
    "enterprise software",
    "business intelligence",
    "data analytics",
    "dashboard development",
    "admin panel",
    "user portal",
    "customer portal",
    "vendor portal",
    "B2B software",
    "B2C software",
    "B2B2C platform",
    "multi-tenant software",
    "white label software",
    "franchise software",
    
    // Development Processes
    "software development lifecycle",
    "SDLC",
    "requirement gathering",
    "system design",
    "database design",
    "UI design",
    "UX design",
    "user interface",
    "user experience",
    "interaction design",
    "prototyping",
    "mockup design",
    "coding",
    "programming",
    "testing",
    "quality assurance",
    "deployment",
    "go-live",
    "post-launch support",
    
    // Business Terms
    "digital solution",
    "business automation",
    "workflow automation",
    "process automation",
    "digital transformation",
    "software integration",
    "system integration",
    "data migration",
    "software upgrade",
    "technology consulting",
    "IT consulting",
    "software architect",
    "solution architect",
    "technical lead",
    "software engineer",
    "programmer",
    "developer",
    "coder",
    
    // Quality & Security
    "secure software",
    "data security",
    "encryption",
    "authentication",
    "authorization",
    "RBAC",
    "role based access",
    "two factor authentication",
    "OAuth integration",
    "GDPR compliant",
    "HIPAA compliant",
    "PCI DSS",
    "penetration testing",
    "security audit",
    "vulnerability assessment",
    "code review",
    "peer review",
    "clean code",
    "best practices",
    "coding standards",
    "software quality",
    "high performance",
    "scalable software",
    "reliable software",
    "maintainable code",
    
    // Client-focused
    "software for startups",
    "startup software",
    "SME software",
    "small business software",
    "enterprise solutions",
    "corporate software",
    "government software",
    "NGO software",
    "non-profit software",
    "software for agencies",
    "white label solutions"
  ],
  authors: [{ name: "Pqrix Studio" }],
  creator: "Pqrix",
  publisher: "Pqrix",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pqrix.com",
    siteName: "Pqrix",
    title: "Pqrix | Professional Software Development Company in Bangladesh",
    description: "Expert software development services in Bangladesh: Discovery & Strategy, Web/SaaS Development, Mobile Apps, 3D Web/XR, Desktop Applications. Local payment integration (bKash/Nagad). Starting ৳8,500.",
    images: [
      {
        url: "/icons/pqrix-logo.png",
        width: 1200,
        height: 630,
        alt: "Pqrix - Software Development Company Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pqrix | Software Development Company in Bangladesh",
    description: "Leading software development company offering Web/SaaS, Mobile Apps, 3D Web/XR, and Desktop Solutions in Bangladesh. bKash/Nagad integration available.",
    images: ["/icons/pqrix-logo.png"],
    creator: "@pqrix",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/pqrix-icon.svg", type: "image/svg+xml" },
      { url: "/icons/pqrix-icon.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/icons/pqrix-icon.svg", sizes: "16x16", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/pqrix-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/pqrix-white.svg",
      },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  alternates: {
    canonical: "https://pqrix.com",
  },
  category: "Software Development Services",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* Font Preload */}
        <link
          rel="preload"
          href="/fonts/Inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          fetchPriority="high"
        />

        {/* Structured Data for Organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Pqrix",
              url: "https://pqrix.com",
              logo: "https://pqrix.com/icons/pqrix-logo.png",
              description: "Professional software development company in Bangladesh specializing in Discovery & Strategy, Web/SaaS Development, Mobile App Development, Custom 3D Web/XR, and Desktop Application Solutions with local payment gateway integration.",
              sameAs: [
                "https://twitter.com/pqrix",
                "https://www.youtube.com/@pqrix",
                "https://instagram.com/pqrix",
                "https://linkedin.com/company/pqrix"
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+880-1401-658685",
                contactType: "customer service",
                availableLanguage: ["English", "Bengali"],
                areaServed: "BD"
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "BD",
                addressRegion: "Dhaka"
              },
              areaServed: ["BD", "Worldwide"],
              serviceType: [
                "Discovery & Strategy Services",
                "Web Development",
                "SaaS Development",
                "Mobile App Development",
                "Custom 3D Web Development",
                "WebGL Development",
                "Desktop Application Development",
                "Software Consultation"
              ],
              priceRange: "৳৳৳"
            })
          }}
        />

        {/* Structured Data for Professional Service */}
        <Script
          id="service-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Pqrix Software Development",
              image: "https://pqrix.com/icons/pqrix-logo.png",
              "@id": "https://pqrix.com",
              url: "https://pqrix.com",
              telephone: "+880-1401-658685",
              priceRange: "৳8,500 - ৳3,00,000+",
              address: {
                "@type": "PostalAddress",
                addressCountry: "BD",
                addressRegion: "Dhaka"
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 23.8103,
                longitude: 90.4125
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                opens: "00:00",
                closes: "23:59"
              },
              paymentAccepted: ["bKash", "Nagad", "Bank Transfer", "Cash"],
              currenciesAccepted: "BDT",
              sameAs: [
                "https://twitter.com/pqrix",
                "https://www.youtube.com/@pqrix",
                "https://instagram.com/pqrix"
              ]
            })
          }}
        />

        {/* Google Tag Manager (deferred) */}
        <Script id="gtm-script" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NFLHXXGK');`}
        </Script>

        {/* Google Analytics (deferred) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-W6LV22900R" strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W6LV22900R');
          `}
        </Script>
      </head>
      <body className="bg-[#08090A] text-[#F4F7F5] antialiased">
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#08090A] via-[#0F1113] to-[#08090A]">
          <Plasma
            color="#008CE2"
            speed={0.6}
            direction="forward"
            scale={1.8}
            opacity={0.08}
            mouseInteractive={true}
          />
        </div>
        <div className="relative z-10">{children}</div>
        <Toaster />
      </body>
    </html>
  )
}
