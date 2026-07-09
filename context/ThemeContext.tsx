'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('hrms-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = saved || (prefersDark ? 'dark' : 'light')
    const isDarkMode = theme === 'dark'

    setIsDark(isDarkMode)
    const html = document.documentElement
    html.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    if (isDarkMode) html.classList.add('dark')
  }, [])

  const toggleTheme = () => {
    setIsDark(prev => {
      const newDark = !prev
      const html = document.documentElement
      html.setAttribute('data-theme', newDark ? 'dark' : 'light')
      if (newDark) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
      localStorage.setItem('hrms-theme', newDark ? 'dark' : 'light')
      return newDark
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
