"use client"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  "All categories",
  "Affiliate Template",
  "Blog",
  "Directories",
  "E-commerce Template",
  "Google Docs",
  "Google Sheets",
  "Job board",
  "Waitlist",
]

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
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
