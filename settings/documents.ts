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
      {
        title: "Classes",
        href: "/classes",
      },
    ],
  },
  {
    title: "Items",
    href: "/items",
  },
]
