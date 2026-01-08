"use client"

import { useEffect } from "react"

interface FontLoaderProps {
  fontFamily?: string
}

const fontMap: Record<string, string> = {
  "Arvo": "https://fonts.googleapis.com/css2?family=Arvo&display=swap",
  "Cabin": "https://fonts.googleapis.com/css2?family=Cabin&display=swap",
  "Droid Serif": "https://fonts.googleapis.com/css2?family=Droid+Serif&display=swap",
  "Fira Sans": "https://fonts.googleapis.com/css2?family=Fira+Sans&display=swap",
  "Inconsolata": "https://fonts.googleapis.com/css2?family=Inconsolata&display=swap",
  "Inter": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
  "IBM Plex Sans Thai": "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai&display=swap",
  "Lora": "https://fonts.googleapis.com/css2?family=Lora&display=swap",
  "Merriweather": "https://fonts.googleapis.com/css2?family=Merriweather&display=swap",
  "Montserrat": "https://fonts.googleapis.com/css2?family=Montserrat&display=swap",
  "Manrope": "https://fonts.googleapis.com/css2?family=Manrope&display=swap",
  "Noto Sans": "https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap",
  "Nunito": "https://fonts.googleapis.com/css2?family=Nunito&display=swap",
  "Open Sans": "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap",
  "Playfair Display": "https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap",
  "Poppins": "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap",
  "Public Sans": "https://fonts.googleapis.com/css2?family=Public+Sans&display=swap",
  "Quicksand": "https://fonts.googleapis.com/css2?family=Quicksand&display=swap",
  "Raleway": "https://fonts.googleapis.com/css2?family=Raleway&display=swap",
  "Roboto": "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
  "Source Sans Pro": "https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap",
  "Ubuntu": "https://fonts.googleapis.com/css2?family=Ubuntu&display=swap",
}

export default function FontLoader({ fontFamily }: FontLoaderProps) {
  useEffect(() => {
    if (!fontFamily) return

    const fontUrl = fontMap[fontFamily]
    if (!fontUrl) {
      console.warn(`Font "${fontFamily}" is not in the supported fontMap.`)
      return
    }

    const existing = document.querySelector(`link[href="${fontUrl}"]`)
    if (!existing) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = fontUrl
      document.head.appendChild(link)
    }
  }, [fontFamily])

  return null
}
