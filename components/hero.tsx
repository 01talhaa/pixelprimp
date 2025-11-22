import { Button } from "@/components/ui/button"
import Image from "next/image"
import LazyVideo from "./lazy-video"

export function Hero() {
  const buttonNew = (
    <Button asChild className="rounded-full bg-[#008CE2] px-8 py-6 text-[#F4F7F5] font-semibold hover:bg-[#06B9D0] shadow-lg shadow-[#008CE2]/30 hover:shadow-xl hover:shadow-[#06B9D0]/40 text-base animate-pulse-glow">
      <a href="https://wa.me/8801401658685?text=Hi!%20I'm%20interested%20in%20your%20services" target="_blank" rel="noopener noreferrer">
        Chat With Us
      </a>
    </Button>
  )

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#08090A] via-[#0F1113] to-[#08090A]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-14 sm:py-20">
          <div className="mb-5 flex items-center gap-2 animate-fade-in">
            <Image src="/icons/pqrix-white.svg" alt="PixelPrimp logo" width={32} height={32} className="h-8 w-8 animate-float" />
            <p className="text-sm uppercase tracking-[0.25em]">
              <span className="text-[#008CE2]">Pixel</span>
              <span className="text-[#F4F7F5]">Primp</span>
            </p>
          </div>
          <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-[#F4F7F5] animate-fade-in-up delay-100">
            <span className="block">SOFTWARE &</span>
            <span className="block text-[#008CE2] drop-shadow-[0_0_30px_rgba(0,140,226,0.5)]">CREATIVE STUDIO</span>
            <span className="block">FOR DIGITAL EXCELLENCE</span>
          </h1>
          <div className="mt-6 animate-scale-in delay-300">{buttonNew}</div>

          {/* Phone grid mimic */}
          <div className="mt-10 grid w-full gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {phoneData.map((p, i) => {
              const visibility = i <= 2 ? "block" : i === 3 ? "hidden md:block" : i === 4 ? "hidden xl:block" : "hidden"
              const animationDelay = i * 100 + 400

              return (
                <div key={i} className={`${visibility} animate-fade-in-up delay-${animationDelay}`} style={{ animationDelay: `${animationDelay}ms` }}>
                  <PhoneCard title={p.title} sub={p.sub} tone={p.tone} gradient={p.gradient} videoSrc={p.videoSrc} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function PhoneCard({
  title = "8°",
  sub = "Clear night. Great for render farm runs.",
  tone = "calm",
  gradient = "from-[#0f172a] via-[#14532d] to-[#052e16]",
  videoSrc,
}: {
  title?: string
  sub?: string
  tone?: string
  gradient?: string
  videoSrc?: string
}) {
  return (
    <div className="relative rounded-[28px] glass-border bg-[#0F1113]/90 p-2 shadow-lg shadow-[#008CE2]/20 hover:shadow-xl hover:shadow-[#06B9D0]/30 transition-all duration-300 hover:scale-[1.02]">
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1D21] to-[#0F1113]">
        <LazyVideo
          src={
            videoSrc ??
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b0f3222371106db366a14ca1c29cef55-1b1EWVSa4w3FL2zslcaCGYTy9vcxjF.mp4"
          }
          className="absolute inset-0 h-full w-full object-cover"
          autoplay={true}
          loop={true}
          muted={true}
          playsInline={true}
          aria-label={`${title} - ${sub}`}
        />

        <div className="relative z-10 p-3">
          <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-[#008CE2]/40" />
          <div className="space-y-1 px-1">
            <div className="text-3xl font-bold leading-snug text-[#F4F7F5] drop-shadow-lg">{title}</div>
            <p className="text-xs text-[#F4F7F5]/90 drop-shadow">{sub}</p>
            <div className="mt-3 inline-flex items-center rounded-full bg-[#008CE2]/90 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#F4F7F5]">
              {tone === "calm" ? "pqrix app" : tone}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const phoneData = [
  {
    title: "Conversions",
    sub: "Turn clicks into paying customers.",
    tone: "results",
    gradient: "from-[#0b0b0b] via-[#0f172a] to-[#020617]",
    videoSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A%20new%20chapter%20in%20the%20story%20of%20success.__Introducing%20the%20new%20TAG%20Heuer%20Carrera%20Day-Date%20collection%2C%20reimagined%20with%20bold%20colors%2C%20refined%20finishes%2C%20and%20upgraded%20functionality%20to%20keep%20you%20focused%20on%20your%20goals.%20__Six%20-nDNoRQyFaZ8oaaoty4XaQz8W8E5bqA.mp4",
  },
  {
    title: "Speed",
    sub: "Launch in days, not weeks.",
    tone: "speed",
    gradient: "from-[#0b1a0b] via-[#052e16] to-[#022c22]",
  },
  {
    title: "Social-Ready",
    sub: "Made for IG, TikTok, and Meta.",
    tone: "social",
    gradient: "from-[#001028] via-[#0b355e] to-[#052e5e]",
    videoSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%201-Ku3Y2Hgaw8hCiFEFg1ELtYp631rSzR.webm",
  },
  {
    title: "Standout",
    sub: "Be the product no one scrolls past.",
    tone: "standout",
    gradient: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
  },
  {
    title: "Premium",
    sub: "Look like the market leader.",
    tone: "premium",
    gradient: "from-[#0b0b0b] via-[#111827] to-[#052e16]",
  },
]
