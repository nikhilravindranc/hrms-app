'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { usePayrollConnection } from '@/context/PayrollConnectionContext'

export default function PayrollLayout({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme()
  const { isAuthenticated, isLoading } = useAuth()
  const { isConnected, isConfigured, isLoaded } = usePayrollConnection()
  const router = useRouter()
  const pathname = usePathname()
  const mainBg = isDark ? 'bg-[#0A0A0A]' : 'bg-[#E8EFF6]'

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (!isLoaded) return

    // Setup wizard is only reachable once connected and not yet configured.
    if (pathname === '/payroll/setup') {
      if (!isConnected || isConfigured) router.push('/payroll')
      return
    }

    // Every other Payroll route requires the app to be connected and configured first.
    if (pathname !== '/payroll' && (!isConnected || !isConfigured)) {
      router.push('/payroll')
    }
  }, [isLoaded, isConnected, isConfigured, pathname, router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className={`flex h-screen ${mainBg}`}>
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col ml-[280px]">
        <TopBar />

        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden pt-16">
          <div className="px-8 py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
