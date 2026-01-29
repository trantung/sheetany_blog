"use client"

import Navbar from "@/components/Navbar"
import BlogHeader from "@/components/BlogHeader"
import Newsletter from "@/components/Newsletter"
import Footer from "@/components/Footer"
import FontLoader from "@/components/FontLoader"
import { useSiteData } from "@/contexts/SiteDataContext"

export default function HomePage() {
  const { siteData } = useSiteData()

  const fontFamily = siteData?.configs?.font_family || "sans-serif"

  return (
    <>
      <FontLoader fontFamily={fontFamily} />

      <div className="12323 block main-blog-app w-full bg-white dark:bg-navy-900 dark:text-navy-100 text-slate-900 text-base min-h-screen" style={{ fontFamily }}>
        <Navbar />
        <BlogHeader />
        <Newsletter />
        <Footer />
      </div>
    </>
  )
}
