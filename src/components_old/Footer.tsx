import Link from "next/link"
import { Twitter, Linkedin, Facebook, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Follow the Journey</h3>
          <p className="text-gray-600 mb-6">Receive a daily digest of the newest startups</p>

          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-r-lg transition-colors">
              Subscribe to newsletter →
            </button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Sheetany</span>
          </Link>

          {/* Social Links */}
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              <Instagram className="w-5 h-5" />
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500">© 2024 Sheetany Blog - All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}
