"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-full transition-all duration-300 hover:bg-gray-200 dark:hover:bg-white/10"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon size={20} className="text-gray-800" />
      ) : (
        <Sun size={20} className="text-gray-200" />
      )}
    </button>
  )
}
