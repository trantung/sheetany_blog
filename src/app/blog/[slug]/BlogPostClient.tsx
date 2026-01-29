"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import TableOfContents from "@/components/TableOfContents"
import { siteServiceApi, type ProductDetailResponse, type SiteData } from "@/services/api/siteServiceApi"
import * as cheerio from "cheerio"
import { Element } from "domhandler";

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
  htmlContent: string;
  headings: Heading[];
} {
  const headings: Heading[] = [];
  const $ = cheerio.load(content);

  // 1. Trích xuất CSS để tìm class Bold/Italic [cite: 1]
  const styleContent = $('style').html() || "";
  const boldClasses: string[] = [];
  const italicClasses: string[] = [];

  const boldRegex = /\.([a-z0-9-_]+)\{[^}]*font-weight:700[^}]*\}/g;
  const italicRegex = /\.([a-z0-9-_]+)\{[^}]*font-style:italic[^}]*\}/g;

  let match;
  while ((match = boldRegex.exec(styleContent)) !== null) boldClasses.push(match[1]);
  while ((match = italicRegex.exec(styleContent)) !== null) italicClasses.push(match[1]);

  // 2. Chuyển đổi Span sang thẻ semantic chuẩn [cite: 6, 16]
  $('span').each((_, el) => {
    const $el = $(el);
    const className = $el.attr('class') || "";
    const classes = className.split(/\s+/);

    const isBold = classes.some(c => boldClasses.includes(c));
    const isItalic = classes.some(c => italicClasses.includes(c));

    if (isBold || isItalic) {
      let inner = $el.html() || "";
      // Thứ tự bọc thẻ quan trọng để đảm bảo HTML hợp lệ
      if (isItalic) inner = `<i>${inner}</i>`;
      if (isBold) inner = `<b>${inner}</b>`;
      $el.html(inner);
    }
  });

  // 3. Làm sạch HTML và trích xuất Headings [cite: 7, 13]
  const bodyHtml = $('body').html() || "";
  const $clean = cheerio.load(bodyHtml);

  $clean('*').each((_, el) => {
    const node = $clean(el);
    // Fix lỗi 'any' bằng cách sử dụng thuộc tính name của Element
    const element = el as unknown as Element;
    const tagName = element.name.toLowerCase();

    // Xử lý Headings 
    if (['h1', 'h2', 'h3'].includes(tagName)) {
      const text = node.text().trim();
      if (text) {
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        node.attr("id", id);
        headings.push({ id, text, level: Number(tagName.replace('h', '')) });
      }
    }

    // Xóa toàn bộ rác định dạng của Google Docs để không ảnh hưởng style project [cite: 9, 10, 15]
    node.removeAttr('class');
    node.removeAttr('style');
  });

  return {
    // Trả về nội dung đã được làm sạch hoàn toàn
    htmlContent: $clean('body').html() || bodyHtml,
    headings,
  };
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
    <div className="block block-breadcrumb flex space-x-2 items-center mx-auto font-medium text-slate-500 dark:text-navy-300 text-sm">
      <Link href="/" className="">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
        </svg>
      </Link>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
        </svg>
      </span>
      <Link href="/" className="">Posts</Link>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
        </svg>
      </span>
      <span className="line-clamp-1" style={{ color: "#0F9D60" }}>{postTitle}</span>
    </div>
  )

  return (
    <div className="block main-blog-app text-base w-full bg-white dark:bg-navy-900 dark:text-navy-100 text-slate-900 min-h-screen">
      <Navbar />

      <div className="block px-4 w-full mx-auto">
        <div className="block max-w-7xl mx-auto py-20">
          <Breadcrumb postTitle={post.title} />
          <div className="block w-full max-w-7xl mx-auto mt-4 text-sm">
            <div className="block max-w-screen-lg">
              <h1 className="block !text-2xl font-semibold lg:!text-5xl dark:text-white tracking-tight">
                {post.title}
              </h1>
              <span className="block mt-4 font-medium text-slate-500 dark:text-navy-300">
                <span className="">3 min read</span>
                <span className="mx-2">·</span>
                <span className="">{new Date(post.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="block w-full px-4">
        <div className="block max-w-7xl thumbnail mx-auto w-full">
          <img
            src={post.thumbnail || "/placeholder.svg"}
            alt={post.title}
            className="w-full object-cover object-center rounded-lg shadow-lg bg-slate-100 dark:bg-navy-500"
          />
        </div>
      </div>

      <div className="block px-4 mt-16 lg:mt-20">
        <div className="block max-w-2xl mx-auto">
          {headings.length > 0 && (
            <TableOfContents headings={headings} tableOfContentsTitle={tableOfContentsTitle} />
          )}

          <div
            className="mt-10 block text-base tracking-wide blog-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <div className="block max-w-2xl mx-auto author py-6 border-b border-t dark:border-navy-600 mt-10 grid gap-4 lg:flex items-center justify-between">
            <div className="block flex space-x-2 justify-start items-center">
              <span className="text-slate-500 dark:text-navy-300">Written by</span>
              <span className="font-semibold">{post.author}</span>
            </div>
            <div className="block flex space-x-2 items-center">
              <div className="text-slate-500 dark:text-navy-300">Share with</div>
              <div className="block">
                <ul className="flex flex-wrap items-center justify-center gap-2">
                  <li>
                    <a href={`https://twitter.com/share?url=${typeof window !== 'undefined' ? window.location.href : ''}`} rel="noopener noreferrer" target="_blank">
                      <img src="/x.svg" className="h-8 w-8 object-cover object-center rounded-lg" alt="x.com" />
                    </a>
                  </li>
                  <li>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`} rel="noopener noreferrer" target="_blank">
                      <img src="/facebook.svg" className="h-8 w-8 object-cover object-center rounded-lg" alt="facebook.com" />
                    </a>
                  </li>
                  <li>
                    <a href={`https://www.linkedin.com/share?url=${typeof window !== 'undefined' ? window.location.href : ''}`} rel="noopener noreferrer" target="_blank">
                      <img src="/linkedin.svg" className="h-8 w-8 object-cover object-center rounded-lg" alt="linkedin.com" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="block block-cta mt-20 px-4" id="cta">
        <div className="block bg-navy-700 py-20 text-white rounded-2xl mx-auto max-w-7xl shadow-lg px-4">
          <div className="block text-center cta items-center">
            <div className="block">
              <h1 className="text-4xl font-semibold">{ctaTitle}</h1>
              <p className="mt-4 dark:text-navy-100 opacity-80">{ctaSubtitle}</p>
            </div>
            <div className="block mt-5">
              <div className="block flex justify-center">
                <Link
                  href={ctaButtonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn space-x-2 bg-white lg:text-base text-navy-700 hover:bg-slate-100"
                >
                  <span className="font-medium">{ctaButtonText}</span>
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <div className="block related-posts mt-20 bg-slate-50 dark:bg-navy-800 p-4">
          <div className="block max-w-7xl mx-auto py-10">
            <span className="block text-2xl lg:text-3xl font-bold">{relatedPostsTitle}</span>
            <div className="block grid-all-posts grid grid-cols-1 sm:grid-cols-3 gap-12 mt-10">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="block grid-one-post"
                >
                  <div className="block">
                    <img
                      src={related.thumbnail || "/placeholder.svg"}
                      alt={related.title}
                      className="h-48 w-full object-cover object-center rounded-lg shadow-lg bg-slate-100 dark:bg-navy-500"
                    />
                    <div className="block flex grow flex-col mt-4">
                      <div className="flex items-center">
                        <div className="block flex space-x-2 justify-start items-center">
                          <div className="block block-author">
                            <span className="text-sm font-medium">{related.author || post.author}</span>
                          </div>
                        </div>
                        <div className="mx-2 text-slate-500">·</div>
                        <div className="block">
                          <span className="text-xs+ text-slate-500 dark:text-navy-300">
                            {new Date(related.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="block mt-2 line-clamp-2">
                        <span className="article-title text-xl font-bold tracking-tight text-slate-900 dark:text-navy-100">
                          {related.title}
                        </span>
                      </div>
                      <p className="block blog-except article-excerpt text-base mt-2 text-slate-500 dark:text-navy-300">
                        <span className="line-clamp-3">
                          {related.excerpt || related.title}
                        </span>
                      </p>
                      <div className="mt-2 text-left text-xs+ space-x-2">
                        <span className="badge rounded-full bg-slate-150 text-slate-800 dark:bg-navy-500 dark:text-navy-100 px-3 py-1">
                          {related.category_relate?.[0]?.category_name || "Uncategorized"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
