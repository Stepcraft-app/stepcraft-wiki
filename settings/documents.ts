import { Paths } from "@/lib/pageroutes"

export const Documents: Paths[] = [
  {
    heading: "Getting Started",
    title: "Welcome to Stepcraft",
    href: "/getting-started",
  },
  {
    spacer: true,
  },
  {
    title: "Characters",
    href: "/characters",
    heading: "Game Guide",
    items: [
      {
        title: "Races",
        href: "/races",
      },      
    ],
  },
  {
    title: "Items",
    href: "/items",
  },
  {
    title: "Resources",
    href: "/resources",
    items: [
      {
        title: "Catalog Overview",
        href: "/catalog",
      },
    ],
  },
  {
    title: "Skills",
    href: "/skills",
    items: [
      {
        title: "Individual Skills",
        href: "/individual",
      },
    ],
  },
]
