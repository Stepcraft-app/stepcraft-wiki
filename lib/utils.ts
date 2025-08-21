import searchJson from "@/public/search-data/documents.json"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

interface SearchDocument {
  slug: string
  title: string
}

export type SearchResult = {
  title: string
  href: string
}

const searchData = (
  searchJson as Array<{ slug: string; title: string; description?: string }>
).map((doc) => ({
  slug: doc.slug,
  title: doc.title,
})) as SearchDocument[]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SCORE_WEIGHTS = {
  EXACT_MATCH: 10000,
  EXACT_PHRASE_MULTI_WORD: 9000,
  EXACT_PHRASE: 8000,
  STARTS_WITH: 7000,
  CONSECUTIVE_WORDS: 5000,
  MINIMUM_THRESHOLD: 1000,
} as const

const MAX_RESULTS = {
  MULTI_WORD: 5,
  SINGLE_WORD: 12,
} as const

const MIN_QUERY_LENGTH = 3

function calculateConsecutiveWordScore(
  titleWords: string[],
  queryWords: string[]
): number {
  let bestScore = 0

  for (let i = 0; i <= titleWords.length - queryWords.length; i++) {
    let consecutiveMatches = 0

    for (let j = 0; j < queryWords.length; j++) {
      if (titleWords[i + j]?.includes(queryWords[j])) {
        consecutiveMatches++
      } else {
        break
      }
    }

    if (consecutiveMatches === queryWords.length) {
      return SCORE_WEIGHTS.CONSECUTIVE_WORDS
    }

    if (consecutiveMatches > 0) {
      bestScore = Math.max(bestScore, consecutiveMatches * 200)
    }
  }

  return bestScore
}

function calculateScore(
  doc: SearchDocument,
  lowerQuery: string,
  queryWords: string[]
): number {
  const lowerTitle = doc.title.toLowerCase()
  const isMultiWordQuery = queryWords.length > 1
  let score = 0

  // Exact title match gets highest score
  if (lowerTitle === lowerQuery) {
    score = SCORE_WEIGHTS.EXACT_MATCH
  }
  // Title contains exact query phrase
  else if (lowerTitle.includes(lowerQuery)) {
    score = isMultiWordQuery
      ? SCORE_WEIGHTS.EXACT_PHRASE_MULTI_WORD
      : SCORE_WEIGHTS.EXACT_PHRASE
  }
  // Title starts with query
  else if (lowerTitle.startsWith(lowerQuery)) {
    score = SCORE_WEIGHTS.STARTS_WITH
  }
  // Multi-word query: check for consecutive word matches
  else if (
    isMultiWordQuery &&
    queryWords.every((word) => lowerTitle.includes(word))
  ) {
    const titleWords = lowerTitle.split(/\s+/)
    score = calculateConsecutiveWordScore(titleWords, queryWords)
  }
  // Single word query: score by word length and position
  else if (!isMultiWordQuery) {
    queryWords.forEach((word, index) => {
      if (lowerTitle.includes(word)) {
        const wordScore = word.length * (index === 0 ? 20 : 10)
        score += wordScore
      }
    })
  }

  // Apply modifiers
  if (doc.slug.includes("/individual/")) {
    score *= 1.2
  }

  const isCatalogPage =
    lowerTitle.includes("catalog") || lowerTitle.includes("overview")
  const searchingForCatalog =
    lowerQuery.includes("catalog") || lowerQuery.includes("overview")

  if (isCatalogPage && !searchingForCatalog) {
    score *= 0.1
  }

  return score
}

export function searchItems(query: string): SearchResult[] {
  const lowerQuery = query.toLowerCase().trim()

  if (lowerQuery.length < MIN_QUERY_LENGTH) return []

  const queryWords = lowerQuery.split(/\s+/).filter((word) => word.length > 0)
  const isMultiWordQuery = queryWords.length > 1

  const results = searchData
    .map((doc) => ({
      title: doc.title,
      href: doc.slug,
      score: calculateScore(doc, lowerQuery, queryWords),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)

  // For multi-word queries, be very selective
  if (isMultiWordQuery) {
    const highScoreResults = results.filter(
      (result) => result.score >= SCORE_WEIGHTS.CONSECUTIVE_WORDS
    )
    if (highScoreResults.length > 0) {
      return highScoreResults
        .slice(0, MAX_RESULTS.MULTI_WORD)
        .map(({ title, href }) => ({ title, href }))
    }
  }

  // For single-word queries or if no exact matches found
  return results
    .slice(0, MAX_RESULTS.SINGLE_WORD)
    .map(({ title, href }) => ({ title, href }))
}

function formatDateHelper(
  dateStr: string,
  options: Intl.DateTimeFormatOptions
): string {
  const [day, month, year] = dateStr.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString("en-US", options)
}

export function formatDate(dateStr: string): string {
  return formatDateHelper(dateStr, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDate2(dateStr: string): string {
  return formatDateHelper(dateStr, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function stringToDate(date: string) {
  const [day, month, year] = date.split("-").map(Number)
  return new Date(year, month - 1, day)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let rafId: number | null = null
  let lastCallTime: number | null = null

  const later = (time: number) => {
    const remaining = wait - (time - (lastCallTime || 0))
    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      func(...(lastArgs as Parameters<T>))
      lastArgs = null
      lastCallTime = null
    } else {
      rafId = requestAnimationFrame(later)
    }
  }

  return (...args: Parameters<T>) => {
    lastArgs = args
    lastCallTime = performance.now()
    const callNow = immediate && !timeout
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      rafId = requestAnimationFrame(later)
    }, wait)
    if (callNow) func(...args)
  }
}

export function highlight(text: string, searchTerms: string): string {
  if (!text || !searchTerms) return text

  const terms = searchTerms
    .split(/\s+/)
    .filter((term) => term.trim().length > 0)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))

  if (terms.length === 0) return text

  const regex = new RegExp(`(${terms.join("|")})`, "gi")
  return text.replace(
    regex,
    "<span class='text-primary font-semibold'>$1</span>"
  )
}
