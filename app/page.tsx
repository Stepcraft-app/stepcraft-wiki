import { Link } from "lib/transition"
import Image from "next/image"

import { buttonVariants } from "@/components/ui/button"
import { Sidebar } from "@/components/navigation/sidebar"

export default function Home() {
  return (
    <div className="flex items-start">
      <Sidebar />
      <div className="flex-1 md:flex-[6]">
        <section className="flex min-h-[86.5vh] flex-col items-center justify-center px-2 py-8 text-center">
          <div className="mb-12 flex flex-col items-center gap-6 sm:flex-row">        
            <div className="text-center sm:text-left">
              <h1 className="mb-3 text-5xl font-bold sm:text-7xl bg-gradient-to-t from-slate-600 to-purple-600 bg-clip-text text-transparent">
                Stepcraft Wiki
              </h1>
              <p className="text-xl text-muted-foreground">Your Complete Guide to the World of Stepcraft</p>
            </div>
          </div>
          
          <p className="text-foreground mb-12 max-w-[900px] text-lg sm:text-xl leading-relaxed font-mono">
            Discover everything about Stepcraft - from character races and skills to items, locations, and enemies. 
            Whether you&apos;re a new adventurer or a seasoned player, this comprehensive wiki has all the information you need to master your journey.
          </p>

          <div className="mb-12 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6 max-w-6xl">
            
            <Link href="/docs/skills" className="group">
              <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800 transition-all hover:shadow-lg hover:scale-105">
                <Image src="/assets/icons/crafting.png" alt="Skills" width={48} height={48} className="mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">Skills</span>
              </div>
            </Link>
            
            <Link href="/docs/items" className="group">
              <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border border-yellow-200 dark:border-yellow-800 transition-all hover:shadow-lg hover:scale-105">
                <Image src="/assets/icons/chest.png" alt="Items" width={48} height={48} className="mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">Items</span>
              </div>
            </Link>
            
            <Link href="/docs/resources" className="group">
              <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800 transition-all hover:shadow-lg hover:scale-105">
                <Image src="/assets/icons/mining.png" alt="Resources" width={48} height={48} className="mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Resources</span>
              </div>
            </Link>
            
            <Link href="/docs/map" className="group">
              <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border border-indigo-200 dark:border-indigo-800 transition-all hover:shadow-lg hover:scale-105">
                <Image src="/assets/icons/maps.png" alt="World Map" width={48} height={48} className="mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">World Map</span>
              </div>
            </Link>
            
            <Link href="/docs/enemies" className="group">
              <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border border-red-200 dark:border-red-800 transition-all hover:shadow-lg hover:scale-105">
                <Image src="/assets/icons/combat.png" alt="Enemies" width={48} height={48} className="mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-red-700 dark:text-red-300">Enemies</span>
              </div>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link
              href="/docs/getting-started"
              className={buttonVariants({ 
                className: "px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all", 
                size: "lg" 
              })}
            >
              Get Started
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
