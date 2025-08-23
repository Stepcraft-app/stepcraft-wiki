import { LuAlignLeft } from "react-icons/lu"

import { Button } from "@/components/ui/button"
import { DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/navigation/logo"
import PageMenu from "@/components/navigation/pagemenu"

export function Sidebar() {
  return (
    <aside
      className="sticky top-16 hidden h-[94.5vh] min-w-[280px] flex-[1] flex-col overflow-y-auto md:flex border-r border-border/30 bg-gradient-to-b from-background/95 via-background/98 to-muted/15 backdrop-blur-sm"
      aria-label="Page navigation"
    >      
      <ScrollArea className="flex-1 px-3 py-4">
        <PageMenu />
      </ScrollArea>
    </aside>
  )
}

export function SheetLeft() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex cursor-pointer md:hidden"
        >
          <LuAlignLeft className="!size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col gap-0 px-0" side="left">
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <SheetHeader>
          <SheetClose asChild>
            <Logo />
          </SheetClose>
        </SheetHeader>
        <ScrollArea className="flex h-full flex-col gap-4 overflow-y-auto">
          <div className="mx-0 px-5">
            <PageMenu isSheet />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
