"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import BlogHeader from "@/components/BlogHeader"
import Footer from "@/components/Footer"
import FontLoader from "@/components/FontLoader"
import { siteServiceApi, type SiteData } from "@/services/api/siteServiceApi"

export default function HomePage() {
  const [siteData, setSiteData] = useState<SiteData | null>(null)

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await siteServiceApi.getSiteData()
        if (response.status) {
          setSiteData(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch site data:", error)
      } finally {
        
      }
    }

    fetchSiteData()
  }, [])

  const fontFamily = siteData?.configs?.font_family || "sans-serif"

  console.log(fontFamily);

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
