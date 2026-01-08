"use client"

import { useState } from "react"
import SearchBox from "./SearchBox"
import CategoryFilter from "./CategoryFilter"
import PostList from "./PostList"

export default function BlogHeader() {
  const [selectedCategory, setSelectedCategory] = useState("All categories")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="mb-12">
      {/* Blog Title and Description */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Sheetany Blog</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Sheetany is a website builder that helps you quickly create websites directly from your Google Sheets without
          design or development skills, for Blogs, Directories, Job boards, and more.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        <SearchBox searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </div>

      {/* Post List */}
      <PostList selectedCategory={selectedCategory} searchQuery={searchQuery} />
    </div>
  )
}
