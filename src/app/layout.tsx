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

function SiteWrapper({ children }: { children: React.ReactNode }) {
  const { siteData, loading } = useSiteData();

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
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      link.href = siteFavicon;
    }
  }, [siteFavicon]);

  return <>{children}</>;
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
          <SiteWrapper>
            {children}
          </SiteWrapper>
        </SiteDataProvider>
      </body>
    </html>
  );
}
