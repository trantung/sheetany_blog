"use client"

import { Search } from "lucide-react"

interface SearchBoxProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function SearchBox({ searchQuery, onSearchChange }: SearchBoxProps) {
  return (
    <div className="block block-search">
      <div className="relative flex">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-input h-10 font-medium peer bg-transparent rounded-lg border border-slate-300 dark:border-navy-450 px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-slate-500 dark:text-navy-100"
        />
        <div className="cursor-pointer hover:text-slate-800 absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:border-slate-500">
          <Search className="h-5 w-5 transition-colors duration-200" />
        </div>
      </div>
    </div>
  )
}
