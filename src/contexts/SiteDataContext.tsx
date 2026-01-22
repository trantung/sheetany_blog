"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { siteServiceApi, type SiteData } from "@/services/api/siteServiceApi"

interface SiteDataContextValue {
  siteData: SiteData | null
  loading: boolean
}

const SiteDataContext = createContext<SiteDataContextValue | undefined>(undefined)

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await siteServiceApi.getSiteData()
        if (response.status) {
          setSiteData(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch site data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSiteData()
  }, [])

  return (
    <SiteDataContext.Provider value={{ siteData, loading }}>
      {children}
    </SiteDataContext.Provider>
  )
}

export function useSiteData(): SiteDataContextValue {
  const context = useContext(SiteDataContext)
  if (!context) {
    throw new Error("useSiteData must be used within a SiteDataProvider")
  }
  return context
}


