"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeaturesContent {
  title: string
  subtitle: string
}

const defaultContent: FeaturesContent = {
  title: "What makes us the best creative studio for you.",
  subtitle: "Discover our unique approach to software development and creative production",
}

export function Features() {
  const [content, setContent] = useState<FeaturesContent>(defaultContent)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("pqrix-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.features) {
          setContent(parsed.features)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section id="features" className="container mx-auto px-4 py-16 sm:py-20 bg-gradient-to-b from-[#08090A] via-[#0F1113] to-[#08090A]">
      <h2 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-[#F4F7F5] sm:text-5xl animate-fade-in-up">
        {content.title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Adaptability Card - Hidden on mobile */}
        <Card className="hidden md:block liquid-glass border border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl shadow-lg shadow-[#008CE2]/20 hover:shadow-xl hover:shadow-[#06B9D0]/30 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up delay-200">
          <CardHeader>
            <p className="text-[11px] tracking-widest text-[#008CE2]">ADAPTABILITY</p>
            <CardTitle className="mt-1 text-xl text-[#F4F7F5]">Make the experience truly intuitive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-sky-200">
                <Image
                  src="/images/intuitive-1.png"
                  alt="Close-up smartphone camera module on textured leather back"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 240px, 45vw"
                  priority={false}
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                <Image
                  src="/images/intuitive-2.png"
                  alt="Hand gripping textured phone back — macro detail"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 240px, 45vw"
                  priority={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Love Card - Always visible */}
        <Card className="liquid-glass border border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl shadow-lg shadow-[#008CE2]/20 hover:shadow-xl hover:shadow-[#06B9D0]/30 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up delay-300">
          <CardHeader>
            <p className="text-[11px] tracking-widest text-[#008CE2]">CLIENT LOVE</p>
            <CardTitle className="mt-1 text-xl text-[#F4F7F5]">
              Their work didn't just look good, it moved the needle — our audience felt the difference instantly.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-end gap-4">
              <div className="text-5xl font-bold text-[#008CE2]">4.9</div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#008CE2] text-[#008CE2]" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Image
                src={"/images/top-rated-1.png"}
                width={280}
                height={160}
                alt="Product sketch concepts of backpack on paper"
                className="h-full w-full rounded-xl border border-white/10 object-cover"
              />
              <Image
                src={"/images/top-rated-2.png"}
                width={280}
                height={160}
                alt="Backpacks on stage with Smartpack PRO lighting"
                className="h-full w-full rounded-xl border border-white/10 object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
