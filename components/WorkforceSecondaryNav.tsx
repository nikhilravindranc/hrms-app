'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import {
  ClockIcon,
  CalendarIcon,
  EditIcon,
  HomeIcon,
  LayersIcon,
  ListIcon,
  SettingsIcon,
} from './Icons'

const sections = [
  {
    label: 'Today',
    items: [
      { id: 'today', label: "Today's Workforce", icon: HomeIcon, href: '/workforce' },
    ],
  },
  {
    label: 'Attendance',
    items: [
      { id: 'attendance', label: 'Attendance', icon: ClockIcon, href: '/workforce/attendance' },
      { id: 'attendance-corrections', label: 'Attendance Corrections', icon: EditIcon, href: '/workforce/attendance-corrections' },
    ],
  },
  {
    label: 'Time Off',
    items: [
      { id: 'leave', label: 'Leave', icon: CalendarIcon, href: '/workforce/leave' },
      { id: 'holiday-calendar', label: 'Holiday Calendar', icon: CalendarIcon, href: '/workforce/holiday-calendar' },
    ],
  },
  {
    label: 'Scheduling',
    items: [
      { id: 'shifts', label: 'Shifts', icon: LayersIcon, href: '/workforce/shifts' },
      { id: 'shift-assignments', label: 'Shift Assignments', icon: ListIcon, href: '/workforce/shift-assignments' },
    ],
  },
  {
    label: 'Setup',
    items: [
      { id: 'leave-types', label: 'Leave Types', icon: SettingsIcon, href: '/workforce/leave-types' },
      { id: 'leave-policies', label: 'Leave Policies', icon: SettingsIcon, href: '/workforce/leave-policies' },
      { id: 'holidays', label: 'Holidays', icon: SettingsIcon, href: '/workforce/holidays' },
    ],
  },
]

export function WorkforceSecondaryNav() {
  const { isDark } = useTheme()
  const pathname = usePathname()

  const panelBg = isDark ? 'bg-[#0F0F0F]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textPrimary = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const textActive = isDark ? 'text-[#27EAA6]' : 'text-[#004D43]'
  const iconInactive = isDark ? 'text-[#9CA3AF]' : 'text-[#64748B]'
  const hoverBg = isDark ? 'hover:bg-[#18181B]' : 'hover:bg-[#F7FAF9]'
  const activeBg = isDark ? 'bg-[#27EAA6]/10' : 'bg-[#ABE6D1]/30'

  const isItemActive = (href: string) => (href === '/workforce' ? pathname === '/workforce' : pathname === href || pathname?.startsWith(href + '/'))

  return (
    <aside className={`w-60 flex-shrink-0 h-full overflow-y-auto border-r ${borderColor} ${panelBg}`}>
      <div className={`px-5 py-5 border-b ${borderColor}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
            <ClockIcon size={16} />
          </div>
          <div>
            <h1 className={`text-sm font-bold ${textPrimary}`}>Workforce</h1>
          </div>
        </div>
        <p className={`text-xs font-medium mt-2 ${textSecondary}`}>Attendance, leave, schedules & availability.</p>
      </div>

      <nav className="px-3 py-4 space-y-5">
        {sections.map(section => (
          <div key={section.label}>
            <p className={`px-3 mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(item => {
                const Icon = item.icon
                const isActive = isItemActive(item.href)
                return (
                  <Link key={item.id} href={item.href}>
                    <div
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                        isActive ? activeBg : hoverBg
                      }`}
                    >
                      <Icon size={16} className={isActive ? textActive : iconInactive} />
                      <span className={`text-sm font-medium ${isActive ? `${textActive} font-semibold` : textPrimary}`}>
                        {item.label}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
