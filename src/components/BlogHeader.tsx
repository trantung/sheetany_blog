"use client"

import { useState, useEffect } from "react"
import SearchBox from "./SearchBox"
import CategoryFilter from "./CategoryFilter"
import PostList from "./PostList"
import { siteServiceApi } from "@/services/api/siteServiceApi"
import { useSiteData } from "@/contexts/SiteDataContext"
import useDebounce from "@/hooks/useDebounce"

export default function BlogHeader() {
  const [selectedCategory, setSelectedCategory] = useState("All categories")
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 500) // 500ms delay
  const { siteData, loading } = useSiteData()

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
      {/* Blog Title and Description (Hero Section) */}
      <div className="block main-hero px-4 mt-10">
        <div className="block w-full max-w-7xl mx-auto py-10 lg:py-20 text-left">
          <div className="block max-w-4xl">
            <h1 className="lg:text-6xl font-bold block text-4xl dark:text-white text-slate-900">
              {titlePage}
            </h1>
            <h2 className="text-xl block mt-4 text-slate-500 dark:text-navy-300">
              {subtitlePage}
            </h2>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="block block-filter mt-10 px-4">
        <div className="block max-w-7xl mx-auto all-categories flex flex-col lg:flex-row justify-between items-start gap-4 w-full">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            siteData={siteData}
          />
          <SearchBox searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>
      </div>

      {/* Post List */}
      <div className="block block-content mt-10 px-4">
        <div className="block max-w-7xl mx-auto all-posts">
          <PostList selectedCategory={selectedCategory} searchQuery={debouncedSearchQuery} siteData={siteData} />
        </div>
      </div>
    </div>
  )
}
