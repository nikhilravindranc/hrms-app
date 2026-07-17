'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import {
  UsersIcon,
  BuildingIcon,
  BadgeIcon,
  MapPinIcon,
  SitemapIcon,
  LayersIcon,
} from './Icons'

const sections = [
  {
    label: 'Employee Management',
    items: [
      { id: 'employees', label: 'Employees', icon: UsersIcon, href: '/people/employees' },
      { id: 'departments', label: 'Departments', icon: BuildingIcon, href: '/people/departments' },
      { id: 'designations', label: 'Designations', icon: BadgeIcon, href: '/people/designations' },
      { id: 'locations', label: 'Locations', icon: MapPinIcon, href: '/people/locations' },
    ],
  },
  {
    label: 'Organization',
    items: [
      { id: 'employee-tree', label: 'Employee Tree', icon: SitemapIcon, href: '/people/employee-tree' },
      { id: 'department-tree', label: 'Department Tree', icon: LayersIcon, href: '/people/department-tree' },
    ],
  },
]

export function PeopleSecondaryNav() {
  const { isDark } = useTheme()
  const pathname = usePathname()

  const panelBg = isDark ? 'bg-[#0F0F0F]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textPrimary = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const textActive = 'text-[#004D43]'
  const iconInactive = isDark ? 'text-[#9CA3AF]' : 'text-[#64748B]'
  const hoverBg = isDark ? 'hover:bg-[#18181B]' : 'hover:bg-[#F7FAF9]'
  const activeBg = isDark ? 'bg-[#004D43]/15' : 'bg-[#ABE6D1]/30'

  return (
    <aside className={`w-60 flex-shrink-0 h-full overflow-y-auto border-r ${borderColor} ${panelBg}`}>
      <div className={`px-5 py-5 border-b ${borderColor}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
            <UsersIcon size={16} />
          </div>
          <div>
            <h1 className={`text-sm font-bold ${textPrimary}`}>People</h1>
          </div>
        </div>
        <p className={`text-xs font-medium mt-2 ${textSecondary}`}>Manage employees and organizational structure.</p>
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
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
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
