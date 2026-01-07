"use client"

import { MobileNav } from "./sidebar"

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-card px-4 lg:hidden">
      <MobileNav />
      <div className="flex-1" />
    </header>
  )
}
