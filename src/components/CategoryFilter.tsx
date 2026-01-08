"use client"

import { siteServiceApi, type SiteData } from "@/services/api/siteServiceApi"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  siteData: SiteData | null
}

export default function CategoryFilter({ selectedCategory, onCategoryChange, siteData }: CategoryFilterProps) {
  if (!siteData) {
    return (
      <div className="flex flex-wrap gap-2">
        <div className="animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-300 rounded-full w-24"></div>
          ))}
        </div>
      </div>
    )
  }

  const getSiteInfo = (code: string) => {
    return siteServiceApi.getSiteInfoByCode(siteData.site_informations, code)
  }

  const allCategoriesText = getSiteInfo("all_categories") || "All categories"

  // Create categories array with "All categories" first, then API categories
  const categories = [allCategoriesText, ...siteData.categories.map((cat) => cat.category_name)]

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
