import { notFound } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { siteServiceApi } from "@/services/api/siteServiceApi"
import * as cheerio from "cheerio"

interface Heading {
    id: string
    text: string
    level: number
}

interface PageProps {
  params: Promise<{ slug: string }>
}

async function fetchGoogleDocsContent(url: string): Promise<string> {
    try {
        const match = url.match(/\/d\/([^/]+)/);
        const documentId = match?.[1];

        if (!documentId) throw new Error("Invalid Google Docs URL");

        const exportUrl = `https://docs.google.com/document/d/${documentId}/export?format=html`;

        const response = await fetch(exportUrl);
        if (!response.ok) throw new Error("Failed to fetch Google Docs content");

        return await response.text();
    } catch (error) {
        console.error("Error fetching Google Docs content:", error);
        return "<p>Content could not be loaded.</p>";
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

    // // Xóa toàn bộ <style>
    // $('style').remove()

    // // Xóa style nội tuyến
    // $('[style]').removeAttr('style')

    return {
        htmlContent: $.root().html() ?? content,
        headings,
    }
}

export default async function PagePost({ params }: PageProps) {
    const slug = (await params).slug

    const page = await siteServiceApi.getPageDetail(slug)
    if (!page || Object.keys(page).length === 0) {
        notFound()
    }

    let htmlContent: string

    const isGoogleDocsUrl = typeof page.content === 'string' && page.content.includes("docs.google.com/document/d/")

    if (isGoogleDocsUrl) {
        const rawContent = await fetchGoogleDocsContent(page.content)
        htmlContent = parseContentAndExtractHeadings(rawContent).htmlContent
    } else {
        htmlContent = page.content
    }

    // const rawContent = await fetchGoogleDocsContent(page.content)
    // const { htmlContent } = parseContentAndExtractHeadings(rawContent)

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className={`${page.page_width} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
                <article
                    className="gdoc-content prose prose-lg max-w-none mb-16"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </main>

            <Footer />
        </div>
    )
}
