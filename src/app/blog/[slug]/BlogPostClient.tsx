"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Clock, User, Home } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import TableOfContents from "@/components/TableOfContents"
import { siteServiceApi, type ProductDetailResponse, type SiteData } from "@/services/api/siteServiceApi"
import * as cheerio from "cheerio"

interface Heading {
  id: string
  text: string
  level: number
}

interface BlogPostClientProps {
  slug: string
  initialSiteData: SiteData | null
}

async function fetchGoogleDocsContent(url: string): Promise<string> {
  try {
    const response = await fetch(`${url}/export?format=html`)
    if (!response.ok) throw new Error("Failed to fetch Google Docs content")
    return await response.text()
  } catch (error) {
    console.error("Error fetching Google Docs content:", error)
    return "<p>Content could not be loaded.</p>"
  }
}

function parseContentAndExtractHeadings(content: string): {
  htmlContent: string
  headings: Heading[]
} {
  const headings: Heading[] = []
  const $ = cheerio.load(content)

  $("h1, h2, h3").each((_, el) => {
    const tag = (el as cheerio.TagElement).tagName.toLowerCase()
    const level = Number(tag.replace('h', ''))
    const text = $(el).text().trim()
    if (text) {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      $(el).attr("id", id)
      headings.push({ id, text, level })
    }
  })

  return {
    htmlContent: $.root().html() ?? content,
    headings,
  }
}

export default function BlogPostClient({ slug, initialSiteData }: BlogPostClientProps) {
  const [productDetail, setProductDetail] = useState<ProductDetailResponse | null>(null)
  const [htmlContent, setHtmlContent] = useState<string>("")
  const [headings, setHeadings] = useState<Heading[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detail = await siteServiceApi.getProductDetail(slug)
        setProductDetail(detail)

        if (detail?.detail?.[0]?.content) {
          const rawContent = await fetchGoogleDocsContent(detail.detail[0].content)
          const { htmlContent: html, headings: h } = parseContentAndExtractHeadings(rawContent)
          setHtmlContent(html)
          setHeadings(h)
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const post = productDetail?.detail?.[0]
  const relatedPosts = productDetail?.product_relate || []

  if (!post) {
    notFound()
  }

  const getSiteInfo = (code: string) => {
    return siteServiceApi.getSiteInfoByCode(initialSiteData?.site_informations || [], code)
  }

  const relatedPostsTitle = getSiteInfo("related_posts") || 'Related posts'
  const ctaTitle = getSiteInfo("cta_title") || 'Ready to Kickstart Your Website?'
  const ctaSubtitle = getSiteInfo("cta_subtitle") || 'Transform your Google Sheets into a professional website in minutes'
  const ctaButtonText = getSiteInfo("cta_button_text") || 'Build Your Site Today'
  const ctaButtonLink = getSiteInfo("cta_button_link") || '#'
  const tableOfContentsTitle = getSiteInfo("table_of_contents") || 'Table of contents'

  const Breadcrumb = ({ postTitle }: { postTitle: string }) => (
    <nav className="flex items-center text-sm text-gray-600 space-x-2 mb-6" aria-label="Breadcrumb">
      <Link href="/" className="flex items-center hover:text-green-600 transition-colors">
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      <span className="text-gray-400">›</span>
      <Link href="/" className="hover:text-green-600 transition-colors">
        Blog
      </Link>
      <span className="text-gray-400">›</span>
      <span className="text-green-600 truncate">{postTitle}</span>
    </nav>
  )

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb postTitle={post.title} />

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

          <div className="flex items-center text-gray-600 mb-8">
            <div className="flex items-center mr-6">
              <User className="w-4 h-4 mr-2" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center mr-6">
              <Clock className="w-4 h-4 mr-2" />
              <span>{new Date(post.published_date).toDateString()}</span>
            </div>
          </div>
        </header>

        <div className="relative h-64 md:h-96 mb-12 rounded-xl overflow-hidden">
          <img
            src={post.thumbnail || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {headings.length > 0 && <TableOfContents headings={headings} tableOfContentsTitle={tableOfContentsTitle} />}

        <article
          className="gdoc-content prose prose-lg max-w-none mb-16"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className="!bg-gray-900 !text-white !rounded-2xl !p-8 !text-center !mb-16">
          <h3 className="!text-2xl !text-center !text-white !font-bold !mb-4 !p-0">{ctaTitle}</h3>
          <p className="!text-gray-300 !mb-6">
            {ctaSubtitle}
          </p>
          <Link
            href={ctaButtonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block !bg-green-500 !hover:bg-green-600 !text-white !px-8 !py-3 !rounded-lg !font-semibold !transition-colors"
          >
            {ctaButtonText}
          </Link>
        </div>

        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{relatedPostsTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={related.thumbnail || "/placeholder.svg"}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full mb-2">
                      {related.category_relate?.[0]?.category_name || "Uncategorized"}
                    </span>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
