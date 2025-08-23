"use client"

import { usePathname } from "next/navigation"

import { Routes } from "@/lib/pageroutes"
import SubLink from "@/components/navigation/sublink"

export default function PageMenu({ isSheet = false }) {
  const pathname = usePathname()
  if (!pathname.startsWith("/docs") && pathname !== "/") return null

  return (
    <div className="flex flex-col gap-1 pb-4">
      {Routes.map((item, index) => {
        if ("spacer" in item) {
          return (
            <div key={`spacer-${index}`} className="my-3 mx-0">
              <hr className="border-t border-border/40" />
            </div>
          )
        }
        return (
          <div key={item.title + index} className="mb-0.5">
            {item.heading && (
              <div className="mb-3 px-0 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider border-b border-border/30 pb-1.5">
                {item.heading}
              </div>
            )}
            <div>
              <SubLink
                {...{
                  ...item,
                  href: `/docs${item.href}`,
                  level: 0,
                  isSheet,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
