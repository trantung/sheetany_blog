"use client"

import Navbar from "@/components/Navbar"
import { Twitter, Linkedin, Facebook, Instagram } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { siteServiceApi, type SiteData } from "@/services/api/siteServiceApi"

export default function AboutPage() {
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)

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
        setLoading(false)
      }
    }

    fetchSiteData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center animate-pulse">
            <div className="h-12 bg-gray-300 rounded w-48 mx-auto mb-12"></div>
            <div className="h-6 bg-gray-300 rounded w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-80 mx-auto"></div>
          </div>
        </main>
      </div>
    )
  }

  const getSiteInfo = (code: string) => {
    return siteServiceApi.getSiteInfoByCode(siteData?.site_informations || [], code)
  }

  const siteName = getSiteInfo("site_name") || "Sheetany"
  const siteLogo = getSiteInfo("site_logo")
  const aboutUsContent =
    getSiteInfo("about_us") ||
    "Sheetany is a website builder that helps you quickly create professional websites (directories, blogs, waitlists, and more) directly from your Google Sheets - No coding or design skills required."
  const footerCopyright = getSiteInfo("footer_copyright") || "© 2024 Sheetany Blog - All Rights Reserved"

  // Social links
  const facebookUrl = getSiteInfo("facebook_url")
  const twitterUrl = getSiteInfo("twitter_url")
  const linkedinUrl = getSiteInfo("linkedin_url")
  const instagramUrl = getSiteInfo("instagram_url")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-12">About Us</h1>

          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed">{aboutUsContent}</p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Footer Bottom */}
          <div className="flex flex-col items-center space-y-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              {siteLogo ? (
                <img src={siteLogo || "/placeholder.svg"} alt={siteName} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{siteName.charAt(0)}</span>
                </div>
              )}
              <span className="text-xl font-semibold text-gray-900">{siteName}</span>
            </Link>

            {/* Social Links */}
            <div className="flex space-x-4">
              {twitterUrl && (
                <Link href={twitterUrl} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </Link>
              )}
              {linkedinUrl && (
                <Link href={linkedinUrl} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </Link>
              )}
              {facebookUrl && (
                <Link href={facebookUrl} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </Link>
              )}
              {instagramUrl && (
                <Link href={instagramUrl} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </Link>
              )}
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-500">{footerCopyright}</p>
          </div>
        </div>
      </footer>

      {/* Build on Sheetany Badge */}
      <div className="fixed bottom-4 left-4">
        <div className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">Build on {siteName} 🚀</div>
      </div>
    </div>
  )
}
