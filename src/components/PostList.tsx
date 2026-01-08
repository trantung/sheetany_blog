"use client"

import { useState, useEffect, useMemo } from "react"
import PostCard from "./PostCard"
import { siteServiceApi, type SiteData, type Product } from "@/services/api/siteServiceApi"

interface PostListProps {
  selectedCategory: string
  searchQuery: string
  siteData: SiteData | null
}

export default function PostList({ selectedCategory, searchQuery, siteData }: PostListProps) {
  const [visiblePosts, setVisiblePosts] = useState(10)
  const [filteredPosts, setFilteredPosts] = useState<(Product & { category: string })[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)

  useEffect(() => {
    const fetchFilteredPosts = async () => {
      setLoadingSearch(true)

      try {
        if (searchQuery.trim() !== "") {
          const results = await siteServiceApi.searchPosts(searchQuery)

          const enriched: (Product & { category: string })[] = results.map((post) => ({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            thumbnail: post.thumbnail,
            author: post.author,
            content: post.content,
            published_date: post.published_date,
            status: post.status,
            categories_relate: post.category_relate,
            category: post.category_relate?.[0]?.category_name || "Uncategorized",
          }))

          const allCategoriesText =
            siteServiceApi.getSiteInfoByCode(siteData?.site_informations || [], "all_categories") || "All categories"

          const filtered = enriched.filter(
            (post) => selectedCategory === allCategoriesText || post.category === selectedCategory
          )

          setFilteredPosts(filtered)
        } else if (siteData) {
          const allCategoriesText =
            siteServiceApi.getSiteInfoByCode(siteData.site_informations, "all_categories") || "All categories"

          const posts: (Product & { category: string })[] = []

          siteData.categories.forEach((category) => {
            category.products.forEach((product) => {
              posts.push({
                ...product,
                category: category.category_name,
              })
            })
          })

          const filtered = posts.filter(
            (post) =>
              selectedCategory === allCategoriesText || post.category === selectedCategory
          )

          setFilteredPosts(filtered)
        }
      } catch (error) {
        console.error("Failed to load posts:", error)
        setFilteredPosts([])
      } finally {
        setLoadingSearch(false)
      }
    }

    fetchFilteredPosts()
  }, [searchQuery, selectedCategory, siteData])

  const displayedPosts = filteredPosts.slice(0, visiblePosts)
  const hasMorePosts = visiblePosts < filteredPosts.length
  const loadMore = () => setVisiblePosts((prev) => prev + 10)

  const getSiteInfo = (code: string) =>
    siteData ? siteServiceApi.getSiteInfoByCode(siteData.site_informations, code) : ""

  const loadMoreText = getSiteInfo("load_more") || "Load more"

  const transformedPosts = displayedPosts.map((post, index) => ({
    id: index + 1,
    title: post.title,
    description: post.excerpt,
    author: post.author,
    date: new Date(post.published_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    image: post.thumbnail,
    category: post.category,
    slug: post.slug,
  }))

  const gridColsClass = useMemo(() => {
    const cols = siteData?.configs?.grid_content || 3

    // Tối đa 6 cột, tối thiểu 1
    const safeCols = Math.min(Math.max(cols, 1), 6)

    return `grid-cols-1 md:grid-cols-2 lg:grid-cols-${safeCols}`
  }, [siteData])

  return (
    <div>
      <div className={`grid ${gridColsClass} gap-8 mb-12`}>
        {loadingSearch ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))
        ) : (
          transformedPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {!loadingSearch && hasMorePosts && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            {loadMoreText} ↓
          </button>
        </div>
      )}

      {!loadingSearch && filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
