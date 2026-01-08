// import Image from "next/image"
import Link from "next/link"

interface Post {
  id: number
  title: string
  description: string
  author: string
  date: string
  image: string
  category: string
  slug: string,
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="font-medium">{post.author}</span>
            <span className="mx-2">•</span>
            <span>{post.date}</span>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
            {post.title}
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">{post.description}</p>

          <div className="flex items-center justify-between">
            <span className="inline-block px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
              {post.category}
            </span>
            <span className="text-green-600 text-sm font-medium group-hover:underline">Read more →</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
