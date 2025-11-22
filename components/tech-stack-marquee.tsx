"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"

export function TechStackMarquee() {
  const [pausedRow, setPausedRow] = useState<string | null>(null)

  // Technology stack data with icons
  const frontendTech = [
    { name: "React", icon: "⚛️", color: "text-cyan-400" },
    { name: "Next.js", icon: "▲", color: "text-white" },
    { name: "Vue.js", icon: "V", color: "text-green-400", bg: "bg-green-500/20" },
    { name: "Angular", icon: "A", color: "text-red-400", bg: "bg-red-500/20" },
    { name: "TypeScript", icon: "TS", color: "text-blue-400", bg: "bg-blue-500/20" },
    { name: "Tailwind CSS", icon: "🎨", color: "text-cyan-400" },
    { name: "Flutter", icon: "◆", color: "text-blue-400" },
    { name: "React Native", icon: "📱", color: "text-cyan-400" },
    { name: "Three.js", icon: "3D", color: "text-white", bg: "bg-purple-500/20" },
    { name: "WebGL", icon: "🎮", color: "text-orange-400" },
  ]

  const backendTech = [
    { name: "Node.js", icon: "◉", color: "text-green-400" },
    { name: "Python", icon: "🐍", color: "text-yellow-400" },
    { name: "Laravel", icon: "L", color: "text-red-400", bg: "bg-red-500/20" },
    { name: "Django", icon: "D", color: "text-green-400", bg: "bg-green-500/20" },
    { name: "Express", icon: "E", color: "text-white", bg: "bg-gray-500/20" },
    { name: "PostgreSQL", icon: "🐘", color: "text-blue-400" },
    { name: "MongoDB", icon: "🍃", color: "text-green-400" },
    { name: "Redis", icon: "◆", color: "text-red-400" },
    { name: "Docker", icon: "🐳", color: "text-blue-400" },
    { name: "Kubernetes", icon: "☸", color: "text-blue-400" },
  ]

  const cloudAndTools = [
    { name: "AWS", icon: "☁️", color: "text-orange-400" },
    { name: "Firebase", icon: "🔥", color: "text-yellow-400" },
    { name: "Vercel", icon: "▲", color: "text-white" },
    { name: "Git", icon: "⌥", color: "text-orange-400" },
    { name: "GitHub", icon: "🐙", color: "text-white" },
    { name: "Electron", icon: "e⁻", color: "text-cyan-400" },
    { name: "GraphQL", icon: "◈", color: "text-pink-400" },
    { name: "REST API", icon: "{}⟷", color: "text-green-400" },
    { name: "Stripe", icon: "💳", color: "text-purple-400" },
    { name: "WebXR", icon: "🥽", color: "text-blue-400" },
  ]

  const creativeTools = [
    { name: "Adobe Premiere", icon: "Pr", color: "text-purple-400", bg: "bg-purple-500/20" },
    { name: "After Effects", icon: "Ae", color: "text-purple-400", bg: "bg-purple-500/20" },
    { name: "Photoshop", icon: "Ps", color: "text-blue-400", bg: "bg-blue-500/20" },
    { name: "Illustrator", icon: "Ai", color: "text-orange-400", bg: "bg-orange-500/20" },
    { name: "DaVinci Resolve", icon: "🎬", color: "text-red-400" },
    { name: "Final Cut Pro", icon: "✂️", color: "text-blue-400" },
    { name: "Blender", icon: "🌀", color: "text-orange-400" },
    { name: "Cinema 4D", icon: "C4D", color: "text-blue-400", bg: "bg-blue-500/20" },
    { name: "Figma", icon: "F", color: "text-purple-400", bg: "bg-purple-500/20" },
    { name: "Canva", icon: "🎨", color: "text-cyan-400" },
  ]

  const TechCard = ({ tech, rowId }: { tech: any; rowId: string }) => (
    <div
      className="flex-shrink-0 mx-3"
      onMouseEnter={() => setPausedRow(rowId)}
      onMouseLeave={() => setPausedRow(null)}
    >
      <div className="group w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl bg-[#0F1113]/80 border border-[#1F2329] backdrop-blur-xl flex flex-col items-center justify-center gap-2 hover:bg-[#1A1D21] hover:border-[#008CE2] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#008CE2]/10 hover:shadow-xl hover:shadow-[#06B9D0]/20">
        {tech.bg ? (
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${tech.bg} flex items-center justify-center border border-[#1F2329]`}>
            <span className={`text-2xl sm:text-3xl font-bold ${tech.color}`}>{tech.icon}</span>
          </div>
        ) : (
          <span className={`text-3xl sm:text-4xl ${tech.color}`}>{tech.icon}</span>
        )}
        <span className="text-[10px] sm:text-xs font-medium text-[#F4F7F5]/80 group-hover:text-[#06B9D0] transition-colors">
          {tech.name}
        </span>
      </div>
    </div>
  )

  return (
    <section className="text-[#F4F7F5] py-16 sm:py-20 overflow-hidden bg-gradient-to-b from-[#08090A] via-[#0F1113] to-[#08090A]">
      <div className="container mx-auto px-4">
        {/* Header */}
<div className="flex items-center justify-between mb-12 flex-col sm:flex-row sm:items-center">
  <div className="text-center w-full"> {/* Added text-center and w-full */}
    <h2 className="text-4xl font-extrabold tracking-tight text-[#F4F7F5] sm:text-5xl animate-fade-in-up"> {/* Removed text-center sm:text-left */}
      Our <span className="text-sky-500">Technology</span>
      <br />
      Stack
    </h2>
    <p className="mt-3 text-sm sm:text-base text-[#F4F7F5]/80 max-w-xl mx-auto"> {/* Added mx-auto */}
      We combine cutting-edge development tools with professional creative software for complete digital solutions
    </p>
  </div>
</div>

        {/* Technology Categories */}
        <div className="relative">
          {/* First Row - Frontend Technologies */}
          <div className="mb-2">
            <div className="text-xs font-semibold text-[#008CE2] mb-3 pl-3">FRONTEND & MOBILE</div>
            <div className="flex overflow-hidden mb-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div
                className={`flex animate-scroll-right whitespace-nowrap`}
                style={{
                  animationPlayState: pausedRow === "frontend" ? "paused" : "running",
                  width: "max-content",
                  animationDuration: "40s",
                }}
              >
                {[...frontendTech, ...frontendTech, ...frontendTech].map((tech, index) => (
                  <TechCard key={`frontend-${index}`} tech={tech} rowId="frontend" />
                ))}
              </div>
            </div>
          </div>

          {/* Second Row - Backend Technologies */}
          <div className="mb-2">
            <div className="text-xs font-semibold text-sky-600 mb-3 pl-3">BACKEND & DATABASE</div>
            <div className="flex overflow-hidden mb-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div
                className={`flex animate-scroll-left whitespace-nowrap`}
                style={{
                  animationPlayState: pausedRow === "backend" ? "paused" : "running",
                  width: "max-content",
                  animationDuration: "35s",
                }}
              >
                {[...backendTech, ...backendTech, ...backendTech].map((tech, index) => (
                  <TechCard key={`backend-${index}`} tech={tech} rowId="backend" />
                ))}
              </div>
            </div>
          </div>

          {/* Third Row - Cloud & Tools */}
          <div className="mb-2">
            <div className="text-xs font-semibold text-sky-600 mb-3 pl-3">CLOUD & DEVOPS</div>
            <div className="flex overflow-hidden mb-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div
                className={`flex animate-scroll-right whitespace-nowrap`}
                style={{
                  animationPlayState: pausedRow === "cloud" ? "paused" : "running",
                  width: "max-content",
                  animationDuration: "38s",
                }}
              >
                {[...cloudAndTools, ...cloudAndTools, ...cloudAndTools].map((tech, index) => (
                  <TechCard key={`cloud-${index}`} tech={tech} rowId="cloud" />
                ))}
              </div>
            </div>
          </div>

          {/* Fourth Row - Creative & Editing Tools */}
          <div className="mb-2">
            <div className="text-xs font-semibold text-sky-600 mb-3 pl-3">CREATIVE & EDITING</div>
            <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div
                className={`flex animate-scroll-left whitespace-nowrap`}
                style={{
                  animationPlayState: pausedRow === "creative" ? "paused" : "running",
                  width: "max-content",
                  animationDuration: "42s",
                }}
              >
                {[...creativeTools, ...creativeTools, ...creativeTools].map((tech, index) => (
                  <TechCard key={`creative-${index}`} tech={tech} rowId="creative" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#008CE2]">40+</div>
            <div className="text-xs sm:text-sm text-[#F4F7F5]/70 mt-1">Technologies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#008CE2]">100%</div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">Modern Stack</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-sky-500">5+</div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-sky-500">24/7</div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  )
}
