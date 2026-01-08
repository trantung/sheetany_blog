"use client"

import Link from "next/link"
import { Twitter, Linkedin, Facebook, Instagram } from "lucide-react"
import { useEffect, useState } from "react"
import { siteServiceApi, type SiteData } from "@/services/api/siteServiceApi"

export default function Footer() {
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

  // Hide footer if configured
  if (typeof siteData?.configs === "object" && siteData.configs?.hide_footer == 2) {
    return null;
  }

  if (loading) {
    return (
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-64 mx-auto mb-6"></div>
            <div className="h-10 bg-gray-300 rounded w-80 mx-auto"></div>
          </div>
        </div>
      </footer>
    )
  }

  const getSiteInfo = (code: string) => {
    return siteServiceApi.getSiteInfoByCode(siteData?.site_informations || [], code)
  }

  const siteName = getSiteInfo("site_name") || "Sheetany"
  const siteLogo = getSiteInfo("site_logo")
  const emailSubscriptionTitle = getSiteInfo("email_subscription_title") || "Follow the Journey"
  const emailSubscriptionSubtitle =
    getSiteInfo("email_subscription_subtitle") || "Receive a daily digest of the newest startups"
  const emailSubscriptionButton = getSiteInfo("email_subscription_button") || "Subscribe to newsletter"
  const footerCopyright = getSiteInfo("footer_copyright") || "© 2024 Sheetany Blog - All Rights Reserved"

  // Social links
  const facebookUrl = getSiteInfo("facebook_url")
  const twitterUrl = getSiteInfo("twitter_url")
  const linkedinUrl = getSiteInfo("linkedin_url")
  const instagramUrl = getSiteInfo("instagram_url")
  // const threadsUrl = getSiteInfo("threads_url")

  return (
    <footer className="!bg-white !border-t !border-gray-200 !mt-16">
      <div className="!max-w-7xl !mx-auto !px-4 !sm:!px-6 !lg:!px-8 !py-12">
        {/* Newsletter Section */}
        <div className="!text-center !mb-12">
          <h3 className="!text-center !text-2xl !font-bold !text-gray-900 !mb-2 !p-0">{emailSubscriptionTitle}</h3>
          <p className="!text-center !text-gray-600 !mb-6">{emailSubscriptionSubtitle}</p>

          <div className="!flex !max-w-2xl !mx-auto">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="!flex-1 !px-4 !py-2 !border !border-gray-300 !rounded-l-lg !focus:outline-none !focus:ring-1 !focus:ring-green-500 !focus:border-green-500"
            />
            <button className="!bg-green-500 !hover:bg-green-600 !text-white !px-6 !py-2 !rounded-r-lg !transition-colors">
              {emailSubscriptionButton} →
            </button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="!flex !flex-col !items-center !space-y-4">
          {/* Logo */}
          <Link href="/" className="!flex !items-center !space-x-2">
            {siteLogo ? (
              <img src={siteLogo || "/placeholder.svg"} alt={siteName} className="!w-8 !h-8 !rounded-full" />
            ) : (
              <div className="!w-8 !h-8 !bg-green-500 !rounded-full !flex !items-center !justify-center">
                <span className="!text-white !font-bold !text-sm">{siteName.charAt(0)}</span>
              </div>
            )}
            <span className="!text-xl !font-semibold !text-gray-900">{siteName}</span>
          </Link>

          {/* Social Links */}
          <div className="!flex !space-x-4">
            {twitterUrl && (
              <Link href={twitterUrl} className="!text-gray-400 !hover:text-gray-600 !transition-colors">
                <Twitter className="!w-5 !h-5" />
              </Link>
            )}
            {linkedinUrl && (
              <Link href={linkedinUrl} className="!text-gray-400 !hover:text-gray-600 !transition-colors">
                <Linkedin className="!w-5 !h-5" />
              </Link>
            )}
            {facebookUrl && (
              <Link href={facebookUrl} className="!text-gray-400 !hover:text-gray-600 !transition-colors">
                <Facebook className="!w-5 !h-5" />
              </Link>
            )}
            {instagramUrl && (
              <Link href={instagramUrl} className="!text-gray-400 !hover:text-gray-600 !transition-colors">
                <Instagram className="!w-5 !h-5" />
              </Link>
            )}
          </div>

          {/* Copyright */}
          <p className="!text-sm !text-gray-500">{footerCopyright}</p>
        </div>
      </div>
    </footer>

  )
}
