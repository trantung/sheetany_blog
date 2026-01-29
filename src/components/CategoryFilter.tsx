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
    <div className="block flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`btn px-3 font-medium rounded-full transition-colors ${selectedCategory === category
              ? "bg-slate-150 dark:bg-navy-500 text-slate-900 dark:text-navy-100"
              : "hover:bg-slate-300/20 dark:hover:bg-navy-300/20 text-slate-700 dark:text-navy-100"
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
