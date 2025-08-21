"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { LuSearch, LuX } from "react-icons/lu"

import { cn, debounce, highlight, searchItems, SearchResult } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import Anchor from "@/components/navigation/anchor"

const MIN_SEARCH_LENGTH = 3

export default function Search() {
  const [searchedInput, setSearchedInput] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const debouncedSearch = useMemo(
    () =>
      debounce((input) => {
        setIsLoading(true)
        const results = searchItems(input.trim())
        setFilteredResults(results)
        setIsLoading(false)
      }, 200),
    []
  )

  const clearSearch = () => {
    setSearchedInput("")
    setIsOpen(false)
    setIsFocused(false)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Open search with Cmd+K or Ctrl+K
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        inputRef.current?.focus()
        setIsFocused(true)
        return
      }

      // Escape to close
      if (event.key === "Escape") {
        clearSearch()
        inputRef.current?.blur()
        return
      }

      // Enter to navigate to first result
      if (isFocused && event.key === "Enter" && filteredResults.length > 0) {
        const selected = filteredResults[0]
        window.location.href = `/docs${selected.href}`
        clearSearch()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFocused, filteredResults])

  useEffect(() => {
    if (searchedInput.length >= MIN_SEARCH_LENGTH) {
      // Search if input is at least 3 characters
      debouncedSearch(searchedInput)
      setIsOpen(true)
    } else if (searchedInput.length > 0) {
      // Show message if input is 1-2 characters
      setFilteredResults([])
      setIsOpen(true)
    } else {
      // Close dropdown if input is empty
      setFilteredResults([])
      setIsOpen(false)
    }
  }, [searchedInput, debouncedSearch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        resultsRef.current &&
        !resultsRef.current.contains(target) &&
        !inputRef.current?.contains(target)
      ) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative w-full flex-1">
      <div className="relative">
        <LuSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
        <Input
          ref={inputRef}
          value={searchedInput}
          onChange={(e) => {
            const value = e.target.value
            setSearchedInput(value)
            // If input is cleared, close dropdown
            if (value === "") {
              setIsOpen(false)
            }
          }}
          onFocus={() => {
            setIsFocused(true)
            if (searchedInput.length > 0) {
              setIsOpen(true)
            }
          }}
          className={cn(
            "bg-background h-12 w-full rounded-lg border pr-12 pl-10 text-sm shadow-sm transition-all duration-200 md:w-full",
            isFocused && "ring-primary/20 border-primary/30 ring-2",
            "placeholder:text-neutral-500 dark:placeholder:text-neutral-400",
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
          )}
          placeholder="Search the wiki... (⌘K)"
          type="search"
        />
        {searchedInput ? (
          <button
            onClick={clearSearch}
            className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            aria-label="Clear search"
          >
            <LuX className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {/* Search Results Dropdown */}
      {isOpen ? (
        <div
          ref={resultsRef}
          className="bg-background absolute top-full right-0 left-0 z-50 mt-1 max-h-[400px] overflow-y-auto rounded-lg border shadow-lg"
        >
          {isLoading ? (
            <div className="p-4 text-center">
              <p className="text-muted-foreground text-sm leading-5">
                Searching...
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-muted-foreground text-sm leading-5">
                {searchedInput.length < MIN_SEARCH_LENGTH ? (
                  "Please enter at least 3 characters."
                ) : (
                  <>
                    No results found for{" "}
                    <span className="text-primary font-medium">{`"${searchedInput}"`}</span>
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {filteredResults.map((item, index) => (
                <Anchor
                  key={item.href}
                  className={cn(
                    "hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md p-3 text-sm transition-all duration-200",
                    index === 0 ? "bg-accent/50" : ""
                  )}
                  href={`/docs${item.href}`}
                  onClick={clearSearch}
                >
                  <span
                    className="truncate font-medium"
                    dangerouslySetInnerHTML={{
                      __html: highlight(item.title, searchedInput),
                    }}
                  />
                </Anchor>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
