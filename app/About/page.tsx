// app/about/page.tsx
import React from "react";

export default function AboutPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PixelPrimp Studio",
    url: "https://pixelprimp.com",
    logo: "https://pixelprimp.com/logo.png",
    description:
      "PixelPrimp is a complete software development and creative studio offering web/mobile development, 3D animation, video editing, photo editing, and graphic design services worldwide.",
    sameAs: [
      "https://www.instagram.com/pixelprimp",
      "https://www.linkedin.com/company/pixelprimp",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Miami",
      addressRegion: "FL",
      addressCountry: "US",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-555-555-5555",
        contactType: "customer service",
      },
    ],
    areaServed: [
      { "@type": "Place", name: "Miami" },
      { "@type": "Place", name: "Los Angeles" },
      { "@type": "Place", name: "New York" },
      { "@type": "Place", name: "Canada" },
      { "@type": "Place", name: "United Kingdom" },
    ],
  };

  return (
    <>
      {/* SEO Schema for Google + LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0F1113] to-[#08090A] text-[#F4F7F5] py-20 px-6 md:px-12 lg:px-20 text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          About <span className="text-[#008CE2]">Pixel</span><span className="text-[#F4F7F5]">Primp</span> Studio
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#F4F7F5]/80">
          Your complete software development and creative production partner for digital excellence.
        </p>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-[#08090A] text-[#F4F7F5] px-6 md:px-12 lg:px-20 animate-fade-in-up">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              title: "Software Development",
              desc: "Custom web, mobile, and desktop applications built with cutting-edge technology.",
            },
            {
              title: "Video Production",
              desc: "Professional video editing, motion graphics, and 3D animation services.",
            },
            {
              title: "Creative Design",
              desc: "Photo editing, graphic design, and visual content creation for brands.",
            },
            {
              title: "Global Reach",
              desc: "Serving clients worldwide with world-class software and creative solutions.",
            },
            {
              title: "Collaborative Workflow",
              desc: "Work directly with our creative team for maximum efficiency.",
            },
            {
              title: "SEO & Marketing Focus",
              desc: "Optimized content to enhance your visibility on search engines.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-[#0F1113]/80 border border-[#1F2329] p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transform transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3 text-[#008CE2]">{feature.title}</h3>
              <p className="text-[#F4F7F5]/80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#0F1113] to-[#08090A] text-center text-[#F4F7F5] px-6 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Elevate Your Brand?
        </h2>
        <p className="text-lg text-[#F4F7F5]/80 mb-8">
          Let Pqrix International bring your products to life.
        </p>
        <a
          href="/contact"
          className="bg-[#008CE2] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#06B9D0] hover:scale-105 shadow-lg transition-all duration-300 inline-block"
        >
          Get in Touch
        </a>
      </section>
    </>
  );
}
