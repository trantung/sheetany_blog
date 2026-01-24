import { siteServiceApi } from "@/services/api/siteServiceApi"
import BlogPostClient from "./BlogPostClient"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPost({ params }: PageProps) {
  const slug = (await params).slug

  // Fetch site data on server-side for initial load
  const siteDataResp = await siteServiceApi.getSiteData()
  const siteData = siteDataResp.status ? siteDataResp.data : null

  // Delegate to client component for product detail fetching (visible in Network tab)
  return <BlogPostClient slug={slug} initialSiteData={siteData} />
}
