"use client"

import { usePathname } from "next/navigation"

import { Routes } from "@/lib/pageroutes"
import SubLink from "@/components/navigation/sublink"

export default function PageMenu({ isSheet = false }) {
  const pathname = usePathname()
  if (!pathname.startsWith("/docs")) return null

  return (
    <div className="flex flex-col gap-2 pb-6">
      {Routes.map((item, index) => {
        if ("spacer" in item) {
          return (
            <div key={`spacer-${index}`} className="my-3 mx-2">
              <hr className="border-t border-border/60" />
            </div>
          )
        }
        return (
          <div key={item.title + index} className="mb-1">
            {item.heading && (
              <div className="mb-3 px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {item.heading}
              </div>
            )}
            <div className="px-1">
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
