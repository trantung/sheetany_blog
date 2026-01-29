"use client"

import { useState } from "react"
import { siteServiceApi } from "@/services/api/siteServiceApi"
import { useSiteData } from "@/contexts/SiteDataContext"

export default function Newsletter() {
    const { siteData, loading } = useSiteData()
    const [email, setEmail] = useState("")
    const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle")

    if (loading || !siteData) return null

    const getSiteInfo = (code: string) => {
        return siteServiceApi.getSiteInfoByCode(siteData?.site_informations || [], code)
    }

    const emailSubscriptionTitle = getSiteInfo("email_subscription_title") || "Follow the Journey"
    const emailSubscriptionSubtitle =
        getSiteInfo("email_subscription_subtitle") || "Receive a daily digest of the newest startups"
    const emailSubscriptionButton = getSiteInfo("email_subscription_button") || "Subscribe to newsletter"

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        try {
            setSubscriptionStatus("idle")
            const result = await siteServiceApi.subscribeEmail(email)
            if (result.success) {
                setSubscriptionStatus("success")
                setEmail("")
            } else {
                setSubscriptionStatus("error")
            }
        } catch (error) {
            setSubscriptionStatus("error")
            console.error("Subscription error:", error)
        }
    }

    return (
        <div className="block block-subscription px-4 bg-slate-50 dark:bg-navy-800">
            <div className="block mx-auto max-w-screen-lg items-center text-center">
                <div className="block block-email-text max-w-2xl py-20 mx-auto">
                    <div className="block">
                        <span className="text-3xl font-bold dark:text-white">{emailSubscriptionTitle}</span>
                        <p className="block mt-2">
                            <span className="mx-auto text-base text-slate-500 dark:text-navy-300">
                                {emailSubscriptionSubtitle}
                            </span>
                        </p>
                        <div className="block mt-5">
                            <form onSubmit={handleSubscribe} className="block">
                                <div className="block grid grid-cols-12 items-center justify-center gap-4">
                                    <div className="block col-span-12 lg:col-span-7">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            className="form-input w-full rounded-lg border border-slate-300 dark:border-navy-450 px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-slate-500 dark:bg-navy-900 dark:text-navy-100"
                                            required
                                        />
                                    </div>
                                    <div className="block col-span-12 lg:col-span-5">
                                        <button
                                            type="submit"
                                            className="btn space-x-2 w-full font-medium text-white py-2 rounded-lg transition-colors"
                                            style={{ backgroundColor: "#0F9D60" }}
                                        >
                                            <span>{emailSubscriptionButton}</span>
                                            <span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 transition-colors duration-200"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M10.4995 13.5001L20.9995 3.00005M10.6271 13.8281L13.2552 20.5861C13.4867 21.1815 13.6025 21.4791 13.7693 21.566C13.9139 21.6414 14.0862 21.6415 14.2308 21.5663C14.3977 21.4796 14.5139 21.1821 14.7461 20.587L21.3364 3.69925C21.5461 3.16207 21.6509 2.89348 21.5935 2.72185C21.5437 2.5728 21.4268 2.45583 21.2777 2.40604C21.1061 2.34871 20.8375 2.45352 20.3003 2.66315L3.41258 9.25349C2.8175 9.48572 2.51997 9.60183 2.43326 9.76873C2.35809 9.91342 2.35819 10.0857 2.43353 10.2303C2.52043 10.3971 2.81811 10.5128 3.41345 10.7444L10.1715 13.3725C10.2923 13.4195 10.3527 13.443 10.4036 13.4793C10.4487 13.5114 10.4881 13.5509 10.5203 13.596C10.5566 13.6468 10.5801 13.7073 10.6271 13.8281Z"
                                                    ></path>
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                {subscriptionStatus === "success" && (
                                    <p className="text-green-600 mt-2">Subscribed successfully!</p>
                                )}
                                {subscriptionStatus === "error" && (
                                    <p className="text-red-500 mt-2">Subscription failed. Please try again.</p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
