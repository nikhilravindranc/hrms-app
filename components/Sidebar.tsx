'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useEmployee } from '@/context/EmployeeContext'
import { mockLeaveRequests } from '@/lib/mockData'
import {
  GridIcon,
  UsersIcon,
  ClockIcon,
  WalletIcon,
  ClipboardCheckIcon,
  BarChartIcon,
  GearIcon,
  ShieldIcon,
} from './Icons'

const navigationMenu = [
  { id: 'dashboard', label: 'Dashboard', icon: GridIcon, href: '/dashboard' },
  { id: 'people', label: 'People', icon: UsersIcon, href: '/people/employees', badgeKey: 'employees' },
  { id: 'workforce', label: 'Workforce', icon: ClockIcon, href: '/workforce' },
  { id: 'payroll', label: 'Payroll', icon: WalletIcon, href: '/payroll' },
  { id: 'requests', label: 'Requests', icon: ClipboardCheckIcon, href: '/requests', badgeKey: 'requests' },
  { id: 'reports', label: 'Reports', icon: BarChartIcon, href: '/reports' },
  { id: 'security', label: 'Security', icon: ShieldIcon, href: '/security' },
]

export function Sidebar() {
  const { isDark } = useTheme()
  const pathname = usePathname()
  const { user } = useAuth()
  const { employees } = useEmployee()

  const pendingApprovals = mockLeaveRequests.filter(r => r.status === 'Pending').length

  const badgeValues: Record<string, number> = {
    employees: employees.length,
    requests: pendingApprovals,
  }

  const sidebarBg = isDark ? 'bg-[#0A0A0A]' : 'bg-[#E8EFF6]'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textActive = isDark ? 'text-[#27EAA6]' : 'text-[#004D43]'
  // Nav item default color = Primary text (navy/light-gray), per typography spec
  const textInactive = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const iconInactive = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const hoverBg = isDark ? 'hover:bg-[#18181B]' : 'hover:bg-white'
  const activeBg = isDark ? 'bg-[#27EAA6]/10' : 'bg-[#ABE6D1]/30'
  // Count badge = 10px/700/white on app primary, per Component Typography spec
  const badgeBg = 'bg-[#004D43] text-white'

  return (
    <aside
      className={`
        w-64 h-screen fixed left-0 top-0 pt-16 z-30
        border-r ${borderColor}
        flex flex-col
        ${sidebarBg}
      `}
    >
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navigationMenu.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href.split('/').slice(0, 2).join('/')))
          const badgeValue = item.badgeKey ? badgeValues[item.badgeKey] : undefined

          return (
            <Link key={item.id} href={item.href}>
              <div
                className={`
                  relative flex items-center justify-between px-3 py-2.5 rounded-xl
                  transition-colors cursor-pointer
                  ${isActive ? activeBg : hoverBg}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={19} className={isActive ? textActive : iconInactive} />
                  <span className={`text-nav ${isActive ? textActive : textInactive}`}>
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {badgeValue !== undefined && badgeValue > 0 && (
                    <span className={`text-badge px-1.5 py-0.5 rounded-sm ${badgeBg}`}>
                      {badgeValue}
                    </span>
                  )}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#004D43]" />}
                </div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Settings + Profile */}
      <div className={`px-3 py-4 border-t ${borderColor} space-y-3`}>
        <Link href="/administration">
          <div
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer
              ${pathname === '/administration' ? activeBg : hoverBg}
            `}
          >
            <GearIcon size={19} className={pathname === '/administration' ? textActive : iconInactive} />
            <span className={`text-nav ${pathname === '/administration' ? textActive : textInactive}`}>
              Settings
            </span>
          </div>
        </Link>

        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${isDark ? 'bg-[#0F0F0F]' : 'bg-[#E8EFF6]'}`}>
          <div className="w-9 h-9 rounded-full bg-[#004D43] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="min-w-0">
            <p className={`text-body-value truncate ${isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'}`}>
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-metadata truncate">
              {user?.role} · {user?.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
