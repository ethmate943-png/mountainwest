"use client"

import { createContext, type ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import ErrorScreen from "@/components/ErrorScreen"
import type { GeoUsOnlyHeaderValue } from "@/lib/geo-us-header"
import { isUngatedSeoPath } from "@/lib/seo-public-paths"
import { MWB_SIGN_IN_PATH, MWB_VERIFY_PATH } from "@/lib/mwb-paths"
import { detectBotType, getSpecificBotType, isCrawlerUserAgent } from "@/utils/botDetection"

const ALLOWED_REFERRER_HOSTS = [
  "google.com",
  "www.google.com",
  "google.co.uk",
  "google.de",
  "google.fr",
  "google.es",
  "google.it",
  "google.ca",
  "google.com.au",
  "google.co.in",
  "google.com.br",
  "googleadservices.com",
  "bing.com",
  "www.bing.com",
  "yahoo.com",
  "duckduckgo.com",
  "baidu.com",
  "yandex.com",
  "yandex.ru",
  "ecosia.org",
  "startpage.com",
  "ask.com",
  "aol.com",
]

export const BotAccessContext = createContext(false)

const ACCESS_GRANTED_SESSION_KEY = "mwb_referrer_access_granted"
const GOOGLEBOT_VERIFY_TIMEOUT_MS = 10000

const PUBLIC_ENTRY_PATHS = new Set(["/", MWB_SIGN_IN_PATH, MWB_VERIFY_PATH])

function isPublicEntryPath(pathname: string): boolean {
  return PUBLIC_ENTRY_PATHS.has(pathname)
}

function isBotAllowedPath(pathname: string): boolean {
  return isPublicEntryPath(pathname) || isUngatedSeoPath(pathname)
}

const normalizeReferrerValue = (value: string) => value.toLowerCase().replace(/^www\./, "")

const normalizeOrigin = (value: string) => value.toLowerCase().replace(/^(https?:\/\/)www\./, "$1")

function isFromAllowedSource(referrer: string): boolean {
  if (!referrer || !referrer.startsWith("http")) return false
  try {
    const referrerUrl = new URL(referrer)
    const referrerHostname = normalizeReferrerValue(referrerUrl.hostname)
    const referrerHost = normalizeReferrerValue(referrerUrl.host)
    const referrerOrigin = normalizeOrigin(referrerUrl.origin)

    return ALLOWED_REFERRER_HOSTS.some((allowed) => {
      const normalizedAllowed = allowed.toLowerCase()
      const isHostnameOnly =
        !normalizedAllowed.includes("://") && !normalizedAllowed.includes(":")

      if (isHostnameOnly) {
        const allowedHostname = normalizeReferrerValue(normalizedAllowed)
        return (
          referrerHostname === allowedHostname ||
          referrerHostname.endsWith(`.${allowedHostname}`)
        )
      }

      const allowedUrl =
        normalizedAllowed.startsWith("http://") || normalizedAllowed.startsWith("https://")
          ? new URL(normalizedAllowed)
          : new URL(`http://${normalizedAllowed}`)

      return (
        referrerHost === normalizeReferrerValue(allowedUrl.host) ||
        referrerOrigin === normalizeOrigin(allowedUrl.origin)
      )
    })
  } catch {
    return false
  }
}

function isFromSameOrigin(referrer: string, currentUrl: URL): boolean {
  if (!referrer || !referrer.startsWith("http")) return false
  try {
    return new URL(referrer).origin === currentUrl.origin
  } catch {
    return false
  }
}

type ReffererProviderProps = {
  children: ReactNode
  isBot?: boolean
  geoAccess?: GeoUsOnlyHeaderValue
  allowLocalTesting?: boolean
}

const ReffererProvider = ({
  children,
  isBot: serverIsBot,
  geoAccess,
  allowLocalTesting = false,
}: ReffererProviderProps) => {
  const pathname = usePathname()
  const isUngated = isUngatedSeoPath(pathname)
  const isPublicEntry = isPublicEntryPath(pathname)

  const [isLoading, setIsLoading] = useState(
    !(serverIsBot || allowLocalTesting) && !isPublicEntry && !isUngated,
  )
  const [isVerifiedBot, setIsVerifiedBot] = useState(serverIsBot || false)
  const [isFromSearch, setIsFromSearch] = useState(allowLocalTesting || isPublicEntry)

  useEffect(() => {
    if (isUngated) {
      setIsLoading(false)
      setIsFromSearch(true)
      return
    }

    const checkIfBot = async () => {
      try {
        const uaMatch = isCrawlerUserAgent()
        if (!uaMatch) {
          return false
        }

        const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : ""
        const { botName } = detectBotType(userAgent)

        if (botName === "google") {
          try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), GOOGLEBOT_VERIFY_TIMEOUT_MS)
            const resp = await fetch("/api/verify-googlebot", { signal: controller.signal })
            clearTimeout(timeoutId)
            if (resp.ok) {
              const data = await resp.json()
              if (data?.isGooglebot === true) {
                setIsVerifiedBot(true)
                return true
              }
            }
          } catch (error: unknown) {
            console.warn("[ReferrerProvider] Googlebot verify fallback (UA allowed):", error)
          }
        }

        setIsVerifiedBot(true)
        return true
      } catch (error: unknown) {
        console.error("Error checking crawler status:", error)
        return false
      }
    }

    const checkAccess = async () => {
      if (typeof window === "undefined") return

      try {
        if (allowLocalTesting) {
          setIsFromSearch(true)
          return
        }

        if (serverIsBot) {
          setIsVerifiedBot(true)
          return
        }

        const ua = typeof navigator !== "undefined" ? navigator.userAgent : ""
        if (isCrawlerUserAgent(ua)) {
          setIsVerifiedBot(true)
          return
        }

        const referrer = document.referrer
        const currentUrl = new URL(window.location.href)

        const hasSessionAccess =
          typeof window !== "undefined" &&
          (window.sessionStorage.getItem(ACCESS_GRANTED_SESSION_KEY) === "1" ||
            window.sessionStorage.getItem("kushner_referrer_access_granted") === "1")

        if (hasSessionAccess) {
          setIsFromSearch(true)
          return
        }

        const isAllowedReferrer = isFromAllowedSource(referrer)
        const isInternalReferrer = isFromSameOrigin(referrer, currentUrl)
        const entryPath = isPublicEntryPath(pathname)
        const geo = geoAccess ?? "unknown"
        let isUsEntryAllowed = geo === "allow"

        if (geo === "unknown" && entryPath && (isAllowedReferrer || isInternalReferrer)) {
          try {
            const geoRes = await fetch("/api/visitor-geo", { cache: "no-store" })
            if (geoRes.ok) {
              const { isUs } = (await geoRes.json()) as { isUs?: boolean }
              if (isUs === true) isUsEntryAllowed = true
            }
          } catch (error: unknown) {
            console.warn("[ReferrerProvider] visitor-geo fallback failed:", error)
          }
        }

        const canGrantEntryAccess =
          (isAllowedReferrer || isInternalReferrer) && (!entryPath || isUsEntryAllowed)

        if (canGrantEntryAccess) {
          setIsFromSearch(true)
          try {
            window.sessionStorage.setItem(ACCESS_GRANTED_SESSION_KEY, "1")
          } catch {
            // ignore sessionStorage failures
          }
        } else {
          setIsFromSearch(false)
        }

        const isBot = await checkIfBot()
        if (isBot) {
          const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : ""
          getSpecificBotType(userAgent)
        }
      } finally {
        setIsLoading(false)
      }
    }

    void checkAccess()
  }, [allowLocalTesting, geoAccess, isUngated, pathname, serverIsBot])

  if (isUngated) {
    return <>{children}</>
  }

  if (isLoading) {
    return <div className="chrome-error-screen chrome-error-screen--loading min-h-screen bg-[#202124]" />
  }

  if (isVerifiedBot) {
    if (isBotAllowedPath(pathname)) {
      return <BotAccessContext.Provider value={true}>{children}</BotAccessContext.Provider>
    }
    return <ErrorScreen />
  }

  if (isFromSearch) {
    return <BotAccessContext.Provider value={false}>{children}</BotAccessContext.Provider>
  }

  return <ErrorScreen />
}

export { ReffererProvider, ReffererProvider as ReferrerProvider }
export default ReffererProvider
