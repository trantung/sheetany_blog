"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { siteServiceApi } from "@/services/api/siteServiceApi"
import { useSiteData } from "@/contexts/SiteDataContext"

export default function Navbar() {
  const { siteData, loading } = useSiteData()

  if (loading) {
    return (
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
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
    <nav className="bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-500 block block-blog-header px-4">
      <div className="block mx-auto max-w-7xl py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {siteLogo ? (
              <img src={siteLogo || "/placeholder.svg"} alt={siteName} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="avatar h-8 w-8">
                <div className="w-8 h-8 bg-sheetany-green rounded-full flex items-center justify-center mask">
                  <span className="text-white font-bold text-sm">{siteName.charAt(0)}</span>
                </div>
              </div>
            )}
            <div>
              <p className="font-semibold text-xl line-clamp-1" style={{ color: "#0F9D60" }}>
                {siteName}
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Render page menus */}
            {siteData?.header?.pages
              ?.filter((page) => page.menu_title && page.show_in_header == 1)
              .map((page, index) => (
                <Link
                  key={`page-${index}`}
                  href={`/pages/${page.page_address}`}
                  target={page.target === 2 ? "_blank" : "_self"}
                  className={
                    page.menu_type === 2
                      ? "btn hover:bg-slate-300/20 border border-slate-200 dark:border-navy-450 dark:text-navy-100"
                      : "text-slate-700 dark:text-navy-100 hover:text-sheetany-green transition-colors"
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
                  className="text-slate-700 dark:text-navy-100 hover:text-sheetany-green transition-colors"
                >
                  {item.title}
                </Link>
              ) : (
                <span
                  key={index}
                  className="text-slate-700 dark:text-navy-100 hover:text-sheetany-green transition-colors cursor-pointer"
                >
                  {item.title}
                </span>
              )
            ))}
            {showAboutUs && (
              <Link href="/about-us" className="btn hover:bg-slate-300/20 border border-slate-200 dark:border-navy-450 dark:text-navy-100">
                About us
              </Link>
            )}
            <Link
              href={headerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn text-white space-x-1"
              style={{ backgroundColor: "#0F9D60" }}
            >
              <span>{headerLinkText}</span>
              <span>
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden space-x-2">
            <button className="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 dark:hover:bg-navy-300/20">
              <Search className="h-5 w-5 text-slate-700 dark:text-navy-100" />
            </button>
            <button className="btn border border-slate-300 p-2 font-medium text-slate-800 hover:bg-slate-150 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
