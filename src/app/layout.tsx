"use client"

import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteDataProvider, useSiteData } from "@/contexts/SiteDataContext";
import { siteServiceApi } from "@/services/api/siteServiceApi";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function HeadManager() {
  const { siteData } = useSiteData();

  const getSiteInfo = (code: string) => {
    return siteServiceApi.getSiteInfoByCode(siteData?.site_informations || [], code);
  };

  const titlePage = getSiteInfo("title_page") || "Sheetany";
  const subtitlePage = getSiteInfo("subtitle_page");
  const siteFavicon = getSiteInfo("site_favicon");

  useEffect(() => {
    if (titlePage) {
      document.title = subtitlePage ? `${titlePage} | ${subtitlePage}` : titlePage;
    }
  }, [titlePage, subtitlePage]);

  useEffect(() => {
    if (siteFavicon) {
      // Manage all icon rels: icon, shortcut icon, apple-touch-icon
      const rels = ["icon", "shortcut icon", "apple-touch-icon"];
      rels.forEach(rel => {
        let link = document.querySelector(`link[rel*='${rel}']`) as HTMLLinkElement;
        if (!link) {
          link = document.createElement("link");
          link.rel = rel;
          document.head.appendChild(link);
        }
        link.href = siteFavicon;
      });
    }
  }, [siteFavicon]);

  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteDataProvider>
          <HeadManager />
          {children}
        </SiteDataProvider>
      </body>
    </html>
  );
}
