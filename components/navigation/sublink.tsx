import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LuChevronDown, LuChevronRight } from "react-icons/lu"

import { Paths } from "@/lib/pageroutes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { SheetClose } from "@/components/ui/sheet"
import Anchor from "@/components/navigation/anchor"

function isRoute(
  item: Paths
): item is Extract<Paths, { title: string; href: string }> {
  return "title" in item && "href" in item
}

export default function SubLink(
  props: Paths & { level: number; isSheet: boolean }
) {
  const path = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (
      isRoute(props) &&
      props.href &&
      path !== props.href
    ) {
      // Only open if path is a direct child route (not deeply nested)
      const expectedPrefix = props.href + '/'
      const isDirectChild = path.startsWith(expectedPrefix) && 
        !path.substring(expectedPrefix.length).includes('/')
      
      if (isDirectChild) {
        setIsOpen(true)
      }
    }
  }, [path, props])

  if (!isRoute(props)) {
    return null
  }

  const { title, href, items, noLink, level, isSheet } = props

  // Check if this is a hash link on the current page
  const isCurrentPageHashLink = href.includes("#") && href.startsWith(path)

  // Use native anchor for hash links to avoid transition library interference
  const Comp = isCurrentPageHashLink ? (
    <a 
      href={href}
      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-transparent hover:bg-muted/60 hover:border-border/40 hover:shadow-sm transition-all duration-200 font-medium group text-foreground hover:text-foreground"
      onClick={(e) => {
        const hashPart = href.split('#')[1]
        const targetElement = document.getElementById(hashPart)
        
        if (targetElement && isSheet) {
          // Prevent default navigation since we'll handle it manually
          e.preventDefault()
          
          // Close the sheet instantly
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
          
          // Scroll to target with header offset
          const elementTop = targetElement.offsetTop - 120
          window.scrollTo({
            top: elementTop,
            behavior: 'instant'
          })
          
          // Update the URL hash
          window.history.replaceState(null, '', href)
        } else if (targetElement) {
          // Desktop: scroll with header offset
          const elementTop = targetElement.offsetTop - 120
          window.scrollTo({
            top: elementTop,
            behavior: 'instant'
          })
        }
      }}
    >
      <span className="truncate">{title}</span>
    </a>
  ) : (
    <Anchor 
      activeClassName="text-primary bg-primary/10 border-primary/20 shadow-sm"
      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-transparent hover:bg-muted/60 hover:border-border/40 hover:shadow-sm transition-all duration-200 font-medium group"
      href={href}
      onClick={(e) => {
        // Handle cross-page hash navigation on mobile
        if (href.includes('#') && !href.startsWith(path) && isSheet) {
          e.preventDefault()
          
          // Close the sheet instantly
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
          
          // Navigate to the new page
          router.push(href)
        }
      }}
    >
      <span className="truncate">{title}</span>
    </Anchor>
  )
  
  const titleOrLink = !noLink ? (
    isSheet && !isCurrentPageHashLink ? (
      <SheetClose asChild>{Comp}</SheetClose>
    ) : (
      Comp
    )
  ) : (
    <h2 className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-foreground bg-muted/40 rounded-lg border border-border/20">{title}</h2>
  )

  if (!items) {
    return <div className="flex flex-col text-sm">{titleOrLink}</div>
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-1">
          <div className="flex-1">
            {titleOrLink}
          </div>
          <CollapsibleTrigger asChild>
            <Button className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-md" variant="ghost" size="icon">
              {!isOpen ? (
                <LuChevronRight className="h-3.5 w-3.5" />
              ) : (
                <LuChevronDown className="h-3.5 w-3.5" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="CollapsibleContent">
          <div
            className={cn(
              "mt-2 flex flex-col gap-1 border-l-2 border-primary/20 pl-4 ml-2 relative",
              level > 0 && "ml-3 border-l-2 border-border/20 pl-3"
            )}
          >
            {items?.map((innerLink) => {
              if (!isRoute(innerLink)) {
                return null
              }

              const modifiedItems = {
                ...innerLink,
                href: `${href}${innerLink.href}`,
                level: level + 1,
                isSheet,
              }

              return <SubLink key={modifiedItems.href} {...modifiedItems} />
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
