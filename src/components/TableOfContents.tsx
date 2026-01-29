"use client"

import { useState } from "react"

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: Heading[]
  tableOfContentsTitle: string
}

export default function TableOfContents({ headings, tableOfContentsTitle }: TableOfContentsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="block p-4 lg:p-6 bg-slate-100 rounded-2xl dark:bg-navy-800 space-y-3 lg:sticky top-0 z-50">
      <div
        className="block flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="block font-semibold uppercase opacity-50 dark:text-white">
          {tableOfContentsTitle}
        </span>
        <span className="text-slate-500 dark:text-navy-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 transition-colors duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isExpanded ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15"></path>
            )}
          </svg>
        </span>
      </div>

      {isExpanded && (
        <div className="block space-y-3">
          {headings.map((heading, index) => (
            <span key={index} className="block text-slate-500 dark:text-navy-300 pl-4">
              <a
                className="!underline cursor-pointer"
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(heading.id);
                }}
              >
                {heading.text}
              </a>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
