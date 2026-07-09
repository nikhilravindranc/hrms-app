'use client'

import React from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useTheme } from '@/context/ThemeContext'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme()
  const mainBg = isDark ? 'bg-[#0A0A0A]' : 'bg-[#F0FBF7]'

  return (
    <div className={`flex h-screen ${mainBg}`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* TopBar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto pt-16 pb-6">
          <div className="px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
