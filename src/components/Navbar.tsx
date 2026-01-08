"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { siteServiceApi, type SiteData } from "@/services/api/siteServiceApi"

export default function Navbar() {
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
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="w-20 h-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Hide header if configured
  if (typeof siteData?.configs === "object" && siteData.configs?.hide_header == 2) {
    return null;
  }

  const getSiteInfo = (code: string) => {
    return siteServiceApi.getSiteInfoByCode(siteData?.site_informations || [], code)
  }

  const siteName = getSiteInfo("site_name") || "Sheetany"
  const siteLogo = getSiteInfo("site_logo")
  const headerLinkText = getSiteInfo("header_link_text") || "Try Sheetany for free"
  const headerLink = getSiteInfo("header_link") || "#"
  const showAboutUs = siteData?.configs?.about_us == 1;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Render page menus if menu_title is present */}
            {siteData?.header?.pages
            ?.filter((page) => page.menu_title && page.show_in_header == 1) // chỉ hiển thị nếu có menu_title
            .map((page, index) => (
              <Link
                key={`page-${index}`}
                href={`/pages/${page.page_address}`}
                target={page.target === 2 ? "_blank" : "_self"}
                className={
                  page.menu_type === 2
                    ? "text-gray-700 border border-gray-300 hover:text-gray-900 hover:border-gray-900 transition-colors px-3 py-1 rounded"
                    : "text-gray-700 border-gray-700 hover:text-gray-900 transition-colors"
                }
              >
                {page.menu_title}
              </Link>
            ))}

            {/* Render dynamic nav bars */}
            {siteData?.header?.nar_bars?.map((item, index) => (
              item.link ? (
                <Link
                  key={index}
                  href={item.link}
                  target={item.target === 1 ? "_blank" : "_self"}
                  className="text-gray-700 border-gray-700 hover:text-gray-900 transition-colors"
                >
                  {item.title}
                </Link>
              ) : (
                <span
                  key={index}
                  className="text-gray-700 border-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  {item.title}
                </span>
              )
            ))}
            {showAboutUs && (
              <Link href="/about" className="text-gray-700 border border-gray-300 hover:text-gray-900 hover:border-gray-900 transition-colors px-3 py-1 rounded">
                About us
              </Link>
            )}
            <Link
              href={headerLink}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {headerLinkText} →
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700">
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
