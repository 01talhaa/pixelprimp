"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Instagram, Twitter, Youtube, MessageCircle } from "lucide-react"
import LazyVideo from "./lazy-video"
import Image from "next/image"

interface FooterContent {
  tagline: string
  copyright: string
}

const defaultContent: FooterContent = {
  tagline: "Experience software development and creative excellence like never before. We craft innovative solutions for brands and businesses.",
  copyright: "© 2025 — PixelPrimp",
}

export function AppverseFooter() {
  const [content, setContent] = useState<FooterContent>(defaultContent)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("pqrix-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.footer) {
          setContent(parsed.footer)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section className="text-[#F4F7F5] bg-gradient-to-b from-[#08090A] via-[#0F1113] to-[#08090A]">
      {/* Contact CTA */}
      <div className="container mx-auto px-4 pt-12 sm:pt-16">
        <div className="flex justify-center">
          <Button
            asChild
            className="rounded-full bg-[#008CE2] px-6 py-2 text-sm font-medium text-[#F4F7F5] shadow-lg shadow-[#008CE2]/30 hover:bg-[#06B9D0] hover:shadow-xl hover:shadow-[#06B9D0]/40"
          >
            <a href="https://wa.me/8801401658685?text=Hi!%20I'm%20interested%20in%20your%20services" target="_blank" rel="noopener noreferrer">
              Contact us
            </a>
          </Button>
        </div>
      </div>

      {/* Download the app */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <Card className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10 shadow-lg shadow-[#008CE2]/20">
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            {/* Left copy */}
            <div>
              <p className="mb-2 text-[11px] tracking-widest text-[#008CE2]">STREAMLINE YOUR WORKFLOW</p>
              <h3 className="text-2xl font-bold leading-tight text-[#F4F7F5] sm:text-3xl">
                Review &amp; approve projects from anywhere
              </h3>
              <p className="mt-2 max-w-prose text-sm text-[#F4F7F5]/80">
                Track progress, leave feedback, and approve deliverables from anywhere. Using our collaboration &amp;
                project management tools
              </p>
            </div>

            {/* Right mockup */}
            <div className="mx-auto w-full max-w-[320px]">
              <div className="relative rounded-[28px] liquid-glass p-2 shadow-2xl shadow-sky-400/30">
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1D21] to-[#0F1113]">
                  {/* Lazy-loaded video fills the screen */}
                  <LazyVideo
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%202-YFaCK7cEiHWSMRv8XEHaLCoYj2SUAi.mp4"
                    className="absolute inset-0 h-full w-full object-cover"
                    autoplay={true}
                    loop={true}
                    muted={true}
                    playsInline={true}
                    aria-label="PixelPrimp app preview - approvals made easy"
                  />
                  {/* On-screen content */}
                  <div className="relative p-3">
                    <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-sky-300/40" />
                    <div className="space-y-1 px-1">
                      <div className="text-5xl font-extrabold text-sky-500 drop-shadow-lg">Collaboration Made Easy</div>
                      <p className="text-xs text-white drop-shadow">From concept to delivery in a single flow</p>
                      <div className="mt-3 inline-flex items-center rounded-full bg-sky-500/90 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white">
                        Zero Hassle
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1F2329] pb-20 md:pb-10 bg-[#08090A]">
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Image src="/icons/pqrix-white.svg" alt="PixelPrimp logo" width={24} height={24} className="h-6 w-6" />
                <span className="text-xl font-semibold">
                  <span className="text-[#008CE2]">Pixel</span>
                  <span className="text-[#F4F7F5]">Primp</span>
                </span>
              </div>
              <p className="max-w-sm text-sm text-[#F4F7F5]/70">{content.tagline}</p>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-2">
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#F4F7F5]/70">Navigation</h5>
                <ul className="space-y-2 text-sm text-[#F4F7F5]/80">
                  {["Home", "Features", "Testimonials", "Pricing", "Blog", "Download"].map((item) => (
                    <li key={item}>
                      <Link href={`#${item.toLowerCase()}`} className="hover:text-sky-500 transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#F4F7F5]/70">Social media</h5>
                <ul className="space-y-2 text-sm text-[#F4F7F5]/80">
                  <li className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-sky-500" />
                    <a
                      href="https://twitter.com/pixelprimp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-sky-500 transition-colors"
                      aria-label="Follow PixelPrimp on Twitter"
                    >
                      X/Twitter
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-sky-500" />
                    <a
                      href="https://www.youtube.com/@pixelprimp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-sky-500 transition-colors"
                      aria-label="Subscribe to PixelPrimp on YouTube"
                    >
                      YouTube
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-sky-500" />
                    <a
                      href="https://instagram.com/pixelprimp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-sky-500 transition-colors"
                      aria-label="Follow PixelPrimp on Instagram"
                    >
                      Instagram
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-sky-500" />
                    <a
                      href="https://threads.com/pixelprimp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-sky-500 transition-colors"
                      aria-label="Follow PixelPrimp on Threads"
                    >
                      Threads
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500 sm:flex-row">
            <p>{content.copyright}</p>
            <div className="flex items-center gap-6">
              <Link href="/revisions" className="hover:text-lime-300">
                Revision Policy
              </Link>
              <Link href="/t&c" className="hover:text-lime-300">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
