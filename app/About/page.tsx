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
      <section className="relative bg-gradient-to-b from-sky-50 to-white text-black py-20 px-6 md:px-12 lg:px-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          About <span className="text-sky-500">Pixel</span><span className="text-black">Primp</span> Studio
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-700">
          Your complete software development and creative production partner for digital excellence.
        </p>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-white text-black px-6 md:px-12 lg:px-20">
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
              className="bg-sky-50 border border-sky-200 p-6 rounded-2xl shadow-lg shadow-sky-200/30 hover:scale-105 hover:shadow-xl hover:shadow-sky-300/40 transform transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3 text-sky-600">{feature.title}</h3>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-sky-50 to-white text-center text-black px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Elevate Your Brand?
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          Let Pqrix International bring your products to life.
        </p>
        <a
          href="/contact"
          className="bg-sky-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-600 shadow-lg shadow-sky-300/40 transition-all inline-block"
        >
          Get in Touch
        </a>
      </section>
    </>
  );
}
