import BlogPostClient from "./BlogPostClient"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPost({ params }: PageProps) {
  const slug = (await params).slug

  // Delegate to client component for product detail fetching (visible in Network tab)
  return <BlogPostClient slug={slug} />
}
