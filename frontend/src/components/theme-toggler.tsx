"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {

    const {theme, setTheme} = useTheme()

  return (
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="group rounded-lg size-12 border-2 bg-transparent hover:bg-blue-600/5 flex-center">
          {theme === 'dark' ? (
          <Moon className="size-8 transition-all group-hover:text-blue-500 dark:text-white" />
          ) : (
          <Sun className="size-8 text-black transition-all group-hover:text-blue-500" />
          )}
          <span className="sr-only">Toggle theme</span>
        </button>
  )
}