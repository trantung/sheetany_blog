// import Image from "next/image"

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
    <a href={`/blog/${post.slug}`} className="block grid-one-post group">
      <div className="block">
        <img
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          className="h-48 w-full object-cover object-center rounded-lg shadow-lg bg-slate-100 dark:bg-navy-500 transition-transform duration-300"
        />
        <div className="block flex grow flex-col mt-4">
          <div className="flex items-center">
            <div className="block flex space-x-2 justify-start items-center">
              <div className="block block-author">
                <span className="text-sm font-medium text-slate-900 dark:text-navy-100">{post.author}</span>
              </div>
            </div>
            <div className="mx-2 text-slate-500">·</div>
            <div className="block">
              <span className="text-xs+ text-slate-500 dark:text-navy-300">{post.date}</span>
            </div>
          </div>
          <div className="block mt-2 line-clamp-2">
            <span className="article-title text-xl font-bold tracking-tight text-slate-900 dark:text-navy-100 transition-colors">
              {post.title}
            </span>
          </div>
          <p className="block blog-except article-excerpt text-base mt-2">
            <span className="line-clamp-3 text-slate-500 dark:text-navy-300">
              {post.description}
            </span>
          </p>
          <div className="mt-2 text-left text-xs+ flex flex-wrap gap-2">
            <span className="badge rounded-full bg-slate-150 text-slate-800 dark:bg-navy-500 dark:text-navy-100 px-3 py-1 font-medium">
              {post.category}
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}
