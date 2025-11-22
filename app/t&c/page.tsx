import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions — Pqrix",
  description: "Terms and conditions for Pqrix 3D animation services.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-[#08090A] text-[#F4F7F5] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10 shadow-xl border border-[#1F2329] bg-[#0F1113]/80 animate-fade-in-up">
              <div className="relative space-y-12">
                <header className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight text-[#008CE2]">Terms and Conditions</h1>
                  <p className="text-[#F4F7F5]/70 text-lg">
                    Welcome to Pqrix. By accessing our website, you agree to these terms and conditions. Please read
                    them carefully.
                  </p>
                </header>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#F4F7F5]">1. Introduction</h2>
                  <p className="text-[#F4F7F5]/80">
                    These Terms and Conditions govern your use of the Pqrix website and services. By using our
                    website, you accept these Terms in full.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#F4F7F5]">2. Intellectual Property Rights</h2>
                  <p className="text-[#F4F7F5]/80">
                    Unless otherwise stated, Pqrix owns all the project files. This includes all electronic files,
                    drawings, source files, and any materials provided to the client, which remain the sole property of
                    Pqrix International, even if shared.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-[#F4F7F5]/70">
                    <li>You must not republish material from this site.</li>
                    <li>
                      You must not reproduce, duplicate, or copy material for commercial purposes without permission.
                    </li>
                    <li>You must not edit or modify any content without consent.</li>
                    <li>Currently all the content on the site are just place-holders (site is under production)</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#F4F7F5]">3. Acceptable Use</h2>
                  <p className="text-[#F4F7F5]/80">
                    You must not use this website in any way that causes, or may cause, damage to the website or
                    impairment of the availability or accessibility of the website.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#F4F7F5]">
                    4. Limitation of Liability & Subjectivity of Content
                  </h2>
                  <p className="text-[#F4F7F5]/80">
                    Pqrix will not be liable for any direct, indirect, or consequential loss or damage arising under
                    these Terms or in connection with our website or services. The perceived quality, style, or
                    suitability of content created by us remains subjective and cannot be used as grounds to increase
                    scope of work. Revisions are strictly governed by our{" "}
                    <Link href="/revisions" className="text-[#008CE2] underline hover:text-[#06B9D0] transition-colors duration-300">
                      revision policy
                    </Link>
                    .
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#F4F7F5]">5. Changes to These Terms</h2>
                  <p className="text-[#F4F7F5]/80">
                    We may revise these Terms from time to time. The revised Terms will apply from the date of
                    publication on this site.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#F4F7F5]">6. Contact Us</h2>
                  <p className="text-[#F4F7F5]/80">If you have any questions about these Terms, please contact us at:</p>
                  <p className="text-[#F4F7F5]/80">
                    Email:{" "}
                    <a href="mailto:hello@pqrix.com" className="text-[#008CE2] underline hover:text-[#06B9D0] transition-colors duration-300">
                      hello@pqrix.com
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AppverseFooter />
    </>
  )
}
