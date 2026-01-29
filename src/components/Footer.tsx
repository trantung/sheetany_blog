"use client"

import Link from "next/link"
import { Twitter, Linkedin, Facebook, Instagram } from "lucide-react"

import { siteServiceApi } from "@/services/api/siteServiceApi"
import { useSiteData } from "@/contexts/SiteDataContext"

export default function Footer() {
  const { siteData, loading } = useSiteData()

  // Hide footer if configured
  if (typeof siteData?.configs === "object" && siteData.configs?.hide_footer == 2) {
    return null;
  }

  if (loading) {
    return (
      <footer className="mt-20">
        <div className="block block-footer mt-10 px-4">
          <div className="block max-w-screen-lg mx-auto items-center py-10">
            <div className="text-center animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-64 mx-auto mb-6"></div>
              <div className="h-10 bg-gray-300 rounded w-80 mx-auto"></div>
            </div>
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
  const footerCopyright = getSiteInfo("footer_copyright") || "© 2024 Sheetany Blog - All Rights Reserved"

  // Social links
  const facebookUrl = getSiteInfo("facebook_url")
  const twitterUrl = getSiteInfo("twitter_url")
  const linkedinUrl = getSiteInfo("linkedin_url")
  const instagramUrl = getSiteInfo("instagram_url")

  return (
    <div className="block block-footer py-10 px-4">
      <div className="block max-w-screen-lg mx-auto items-center py-10">
        <div className="block flex flex-col items-center">
          <Link href="/" className="flex items-center space-x-2">
            {siteLogo ? (
              <img src={siteLogo || "/placeholder.svg"} alt={siteName} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{siteName.charAt(0)}</span>
              </div>
            )}
            <div>
              <p className="font-semibold text-xl line-clamp-1" style={{ color: "#0F9D60" }}>
                {siteName}
              </p>
            </div>
          </Link>
        </div>

        <div className="block footer-social-links mt-5">
          <ul className="flex flex-wrap items-center justify-center gap-6 text-slate-600 dark:text-navy-300">
            {twitterUrl && (
              <li>
                <Link href={twitterUrl} target="_blank">
                  <Twitter className="h-5 w-5" />
                </Link>
              </li>
            )}
            {linkedinUrl && (
              <li>
                <Link href={linkedinUrl} target="_blank">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </li>
            )}
            {facebookUrl && (
              <li>
                <Link href={facebookUrl} target="_blank">
                  <Facebook className="h-5 w-5" />
                </Link>
              </li>
            )}
            {instagramUrl && (
              <li>
                <Link href={instagramUrl} target="_blank">
                  <Instagram className="h-5 w-5" />
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="block flex flex-wrap items-center justify-center mt-5">
          <span className="text-xs+ text-slate-500 dark:text-navy-300">{footerCopyright}</span>
        </div>
      </div>
    </div>
  )
}
