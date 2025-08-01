"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { GitHubLink } from "@/settings/navigation"
import { LuArrowUpRight, LuGitBranch, LuMessageSquare, LuPenTool } from "react-icons/lu"

import { cn } from "@/lib/utils"

type SideBarEdit = {
  title: string
  slug: string
}

export default function RightSideBar({ slug, title }: SideBarEdit) {
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])

  // Enhanced GitHub URLs with better templates
  const feedbackUrl = `${GitHubLink.href}/issues/new?title=Feedback%20for%20"${encodeURIComponent(title)}"&labels=feedback&body=Page:%20${encodeURIComponent(currentUrl)}`
  
  // Handle different file structures
  const editUrl = `${GitHubLink.href}/edit/main/contents/docs/${slug.endsWith('.mdx') ? slug : `${slug}.mdx`}`
  
  // Alternative: edit the index.mdx if it's a directory
  const editIndexUrl = `${GitHubLink.href}/edit/main/contents/docs/${slug}/index.mdx`
  
  const contributeUrl = `${GitHubLink.href}/fork`

  return (
    <div className="flex flex-col gap-3 pl-2">
      <h3 className="text-sm font-semibold">Community</h3>
      <div className="flex flex-col gap-2">
        <Link
          href={feedbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-2 text-sm text-neutral-800 no-underline hover:text-blue-600 transition-colors dark:text-neutral-300/85 dark:hover:text-blue-400"
          )}
        >
          <LuMessageSquare className="h-4 w-4" />
          Give Feedback
          <LuArrowUpRight className="h-3 w-3" />
        </Link>
        
        <Link
          href={editIndexUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-2 text-sm text-neutral-800 no-underline hover:text-green-600 transition-colors dark:text-neutral-300/85 dark:hover:text-green-400"
          )}
        >
          <LuPenTool className="h-4 w-4" />
          Edit Page
          <LuArrowUpRight className="h-3 w-3" />
        </Link>                
        
        <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          Help improve this wiki by contributing directly on GitHub
        </div>
      </div>
    </div>
  )
}
