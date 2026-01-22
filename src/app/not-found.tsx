import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-xl text-center">
          <p className="text-3xl font-semibold text-green-600 mb-2">404</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            This page could not be found.
          </h1>
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition-colors"
            >
              Go back home
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Browse blog
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


