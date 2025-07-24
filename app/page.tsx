import { Link } from "lib/transition"
import Image from "next/image"

import { PageRoutes } from "@/lib/pageroutes"
import { buttonVariants } from "@/components/ui/button"

export default function Home() {
  return (
    <section className="flex min-h-[86.5vh] flex-col items-center justify-center px-2 py-8 text-center">
      <div className="mb-8 flex items-center gap-4">
        <Image
          src="/assets/stepcraft-logotype.png"
          alt="Stepcraft Logo"
          width={120}
          height={120}
          className="rounded-xl"
        />
        <div>
          <h1 className="mb-2 text-4xl font-bold sm:text-7xl">Stepcraft Wiki</h1>
          <p className="text-lg text-muted-foreground">Your Complete Guide to the World of Stepcraft</p>
        </div>
      </div>
      
      <p className="text-foreground mb-8 max-w-[800px] text-lg sm:text-xl leading-relaxed">
        Discover everything about Stepcraft - from character races and skills to quests, items, locations, and enemies. 
        Whether you&apos;re a new adventurer or a seasoned player, this wiki has all the information you need to master your journey.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl">
        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          <Image src="/assets/icons/character.png" alt="Characters" width={48} height={48} className="mb-2" />
          <span className="text-sm font-medium">Characters</span>
        </div>
        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          <Image src="/assets/icons/crafting.png" alt="Skills" width={48} height={48} className="mb-2" />
          <span className="text-sm font-medium">Skills</span>
        </div>
        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          <Image src="/assets/icons/quest.png" alt="Quests" width={48} height={48} className="mb-2" />
          <span className="text-sm font-medium">Quests</span>
        </div>
        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          <Image src="/assets/icons/location.png" alt="World" width={48} height={48} className="mb-2" />
          <span className="text-sm font-medium">World</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <Link
          href={`/docs${PageRoutes[0].href}`}
          className={buttonVariants({ className: "px-8 py-3", size: "lg" })}
        >
          Explore the Wiki
        </Link>
        <Link
          href="/docs/characters"
          className={buttonVariants({ variant: "outline", className: "px-8 py-3", size: "lg" })}
        >
          Character Guide
        </Link>
      </div>
    </section>
  )
}
