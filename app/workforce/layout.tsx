'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { WorkforceSecondaryNav } from '@/components/WorkforceSecondaryNav'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'

export default function WorkforceLayout({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme()
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const mainBg = isDark ? 'bg-[#0A0A0A]' : 'bg-[#E8EFF6]'

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className={`flex h-screen ${mainBg}`}>
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col ml-64">
        <TopBar />

        <div className="flex-1 min-w-0 flex overflow-hidden pt-16">
          <WorkforceSecondaryNav />

          <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
            <div className="px-8 py-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
