"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

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
    <div className="!bg-gray-50 !border !border-gray-200 !rounded-lg !mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="!w-full !flex !items-center !justify-between !p-4 !text-left hover:!bg-gray-100 !transition-colors"
      >
        <h3 className="!text-lg !font-semibold !text-gray-900 !p-0">{tableOfContentsTitle}</h3>
        {isExpanded ? (
          <ChevronDown className="!w-5 !h-5 !text-gray-500" />
        ) : (
          <ChevronRight className="!w-5 !h-5 !text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="!px-4 !pb-4">
          <ul className="!space-y-2">
            {headings.map((heading, index) => (
              <li key={index}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className="!cursor-pointer !text-left !text-green-600 hover:!text-green-700 hover:!underline !transition-colors !block !w-full"
                  style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
