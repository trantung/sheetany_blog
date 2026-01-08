"use client"

import { useState, useMemo } from "react"
import PostCard from "./PostCard"

const allPosts = [
  {
    id: 1,
    title: "How to Create a Job Board from Google Sheets",
    description:
      "Managing job listings and recruitment can be complex and time consuming. However, with Sheetany's new template, you can effortlessly...",
    author: "Richard",
    date: "Oct 25, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "Job Board",
  },
  {
    id: 2,
    title: "Sheetany Ecommerce Template: The Best WordPress Alternative for Online Stores",
    description:
      "Sheetany's latest Ecommerce template, designed specifically for the furniture industry, helps you manage products, orders, coupons...",
    author: "Richard",
    date: "Dec 31, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "E-commerce Template",
  },
  {
    id: 3,
    title: "Affiliate Template for Google Sheets: Build an Organized Affiliate Directory",
    description:
      "Affiliate marketing is one of the most effective ways to generate passive income. Whether you're an seasoned marketer or just starting out...",
    author: "Richard",
    date: "Dec 24, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "Affiliate Template",
  },
  {
    id: 4,
    title: "How to Create a Simple Job Board Using Google Sheets and Sheetany",
    description:
      "Creating a job board has traditionally been easier thanks to Google Sheets and Sheetany. No coding or design skills are require...",
    author: "Richard",
    date: "Dec 22, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "Job Board",
  },
  {
    id: 5,
    title: "How to Get Free Direct Image Links from the Top 5 Free Image Sites",
    description: "When building a website, having direct image links embedded. A direct image link allows you to...",
    author: "Richard",
    date: "Nov 16, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "Blog",
  },
  {
    id: 6,
    title: "Google Docs to Blog: Manage Posts Easily with Sheetany & Sheets",
    description:
      "Content creators are always looking for ways to publish viral blog posts, using Google Docs to blog is game-changer. By combining the...",
    author: "Richard",
    date: "Oct 30, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "Google Docs",
  },
  {
    id: 7,
    title: "How to Make a Blog on Google Docs and Manage It with Google Sheets",
    description:
      "Blogging has come a long way, but simplicity remains key. If you love writing in Google Docs and want to easily turn your documents into a...",
    author: "Richard",
    date: "Sep 26, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "Google Docs",
  },
  {
    id: 8,
    title: "Create and Manage Blogs with Google Docs and Google Sheets",
    description:
      "With this new feature, you can not only create websites but now also turn Google Docs into blog posts and manage your entire blog directly fro...",
    author: "Richard",
    date: "Sep 14, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "Google Sheets",
  },
  {
    id: 9,
    title: "How to Create a Blog on Google Docs: Easy Steps with Sheetany",
    description:
      "If you're wondering how to create a blog on Google Docs, you're in the right place. By leveraging Google Docs for content creation an...",
    author: "Richard",
    date: "Sep 14, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "Google Docs",
  },
  {
    id: 10,
    title: "Create a Professional Waitlist Using Sheetany and Google Sheets",
    description:
      "Are you looking for an easy way to create a waitlist for your project or product without needing to code? Sheetany is the simple and fu...",
    author: "Richard",
    date: "Sep 10, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "Waitlist",
  },
  {
    id: 11,
    title: "Building Directories with Google Sheets: A Complete Guide",
    description:
      "Creating comprehensive directories has never been easier. With Sheetany's directory template, you can build professional listings...",
    author: "Richard",
    date: "Aug 28, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "Directories",
  },
  {
    id: 12,
    title: "Advanced Google Sheets Tips for Better Data Management",
    description:
      "Master the art of data organization with these advanced Google Sheets techniques that will transform your workflow...",
    author: "Richard",
    date: "Aug 15, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "Google Sheets",
  },
  {
    id: 13,
    title: "E-commerce Success: From Google Sheets to Online Store",
    description:
      "Transform your product catalog from a simple spreadsheet into a fully functional online store with our step-by-step guide...",
    author: "Richard",
    date: "Aug 02, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "E-commerce Template",
  },
  {
    id: 14,
    title: "Maximizing Affiliate Revenue with Smart Directory Design",
    description:
      "Learn how to optimize your affiliate directory for maximum conversions and revenue generation using proven strategies...",
    author: "Richard",
    date: "Jul 20, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "Affiliate Template",
  },
  {
    id: 15,
    title: "The Future of No-Code Website Building",
    description:
      "Explore the latest trends in no-code development and how tools like Sheetany are revolutionizing web creation...",
    author: "Richard",
    date: "Jul 05, 2024",
    image: "/placeholder.svg?height=200&width=300",
    category: "Blog",
  },
]

interface PostListProps {
  selectedCategory: string
  searchQuery: string
}

export default function PostList({ selectedCategory, searchQuery }: PostListProps) {
  const [visiblePosts, setVisiblePosts] = useState(10)

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCategory = selectedCategory === "All categories" || post.category === selectedCategory
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const displayedPosts = filteredPosts.slice(0, visiblePosts)
  const hasMorePosts = visiblePosts < filteredPosts.length

  const loadMore = () => {
    setVisiblePosts((prev) => prev + 10)
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {displayedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMorePosts && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Load more ↓
          </button>
        </div>
      )}

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}