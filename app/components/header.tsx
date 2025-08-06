"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Moon, Sun, Search } from "lucide-react"

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

export function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search for tokens, addresses..."
            className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 border-transparent focus:border-primary focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full"
        >
          <Sun className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
