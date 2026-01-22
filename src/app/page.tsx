"use client"

import Navbar from "@/components/Navbar"
import BlogHeader from "@/components/BlogHeader"
import Footer from "@/components/Footer"
import FontLoader from "@/components/FontLoader"
import { useSiteData } from "@/contexts/SiteDataContext"

export default function HomePage() {
  const { siteData } = useSiteData()

  const fontFamily = siteData?.configs?.font_family || "sans-serif"

  return (
    <>
      <FontLoader fontFamily={fontFamily} />

      <div className="min-h-screen bg-gray-50" style={{ fontFamily }}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BlogHeader />
        </main>
        <Footer />
      </div>
    </>
  )
}
