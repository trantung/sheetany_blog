"use client"

import { useState, useEffect } from "react"
import SearchBox from "./SearchBox"
import CategoryFilter from "./CategoryFilter"
import PostList from "./PostList"
import { siteServiceApi, type SiteData } from "@/services/api/siteServiceApi"
import useDebounce from "@/hooks/useDebounce"

export default function BlogHeader() {
  const [selectedCategory, setSelectedCategory] = useState("All categories")
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 500) // 500ms delay
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await siteServiceApi.getSiteData()
        if (response.status) {
          setSiteData(response.data)
          // Update selected category with API data
          const allCategoriesText =
            siteServiceApi.getSiteInfoByCode(response.data.site_informations, "all_categories") || "All categories"
          setSelectedCategory(allCategoriesText)
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
      <div className="mb-12">
        <div className="text-center mb-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  const getSiteInfo = (code: string) => {
    return siteServiceApi.getSiteInfoByCode(siteData?.site_informations || [], code)
  }

  const titlePage = getSiteInfo("title_page") || "Sheetany Blog"
  const subtitlePage =
    getSiteInfo("subtitle_page") ||
    "Sheetany is a website builder that helps you quickly create websites directly from your Google Sheets without design or development skills, for Blogs, Directories, Job boards, and more."

  return (
    <div className="mb-12">
      {/* Blog Title and Description */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{titlePage}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitlePage}</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          siteData={siteData}
        />
        <SearchBox searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </div>

      {/* Post List */}
      <PostList selectedCategory={selectedCategory} searchQuery={debouncedSearchQuery} siteData={siteData} />
    </div>
  )
}
