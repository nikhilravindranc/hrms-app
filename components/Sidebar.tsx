'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useEmployee } from '@/context/EmployeeContext'
import { usePayrollConnection } from '@/context/PayrollConnectionContext'
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
  ChevronRightIcon,
  HomeIcon,
  EditIcon,
  CalendarIcon,
  LayersIcon,
  ListIcon,
  SettingsIcon,
  BuildingIcon,
  BadgeIcon,
  MapPinIcon,
  SitemapIcon,
  RefreshIcon,
  HistoryIcon,
  ReceiptIcon,
  TrophyIcon,
  FileTextIcon,
  BuildingBankIcon,
} from './Icons'

interface NavSection {
  label: string
  items: { id: string; label: string; icon: React.FC<{ size?: number; className?: string }>; href: string }[]
}

interface NavItem {
  id: string
  label: string
  icon: React.FC<{ size?: number; className?: string }>
  href: string
  badgeKey?: string
  sections?: NavSection[]
  statusPill?: { label: string; hex: string }
}

const peopleSections = [
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

const operationsSections = [
  {
    label: 'Today',
    items: [
      { id: 'today', label: "Today's Operations", icon: HomeIcon, href: '/operations' },
    ],
  },
  {
    label: 'Attendance',
    items: [
      { id: 'attendance', label: 'Attendance', icon: ClockIcon, href: '/operations/attendance' },
      { id: 'attendance-corrections', label: 'Attendance Corrections', icon: EditIcon, href: '/operations/attendance-corrections' },
    ],
  },
  {
    label: 'Time Off',
    items: [
      { id: 'leave', label: 'Leave', icon: CalendarIcon, href: '/operations/leave' },
      { id: 'holiday-calendar', label: 'Holiday Calendar', icon: CalendarIcon, href: '/operations/holiday-calendar' },
    ],
  },
  {
    label: 'Scheduling',
    items: [
      { id: 'shifts', label: 'Shifts', icon: LayersIcon, href: '/operations/shifts' },
      { id: 'shift-assignments', label: 'Shift Assignments', icon: ListIcon, href: '/operations/shift-assignments' },
    ],
  },
  {
    label: 'Setup',
    items: [
      { id: 'leave-types', label: 'Leave Types', icon: SettingsIcon, href: '/operations/leave-types' },
      { id: 'leave-policies', label: 'Leave Policies', icon: SettingsIcon, href: '/operations/leave-policies' },
      { id: 'holidays', label: 'Holidays', icon: SettingsIcon, href: '/operations/holidays' },
    ],
  },
]

const payrollSections = [
  {
    label: 'Processing',
    items: [
      { id: 'payroll-run', label: 'Payroll Run', icon: RefreshIcon, href: '/payroll/run' },
      { id: 'payroll-history', label: 'Payroll History', icon: HistoryIcon, href: '/payroll/history' },
    ],
  },
  {
    label: 'Compensation',
    items: [
      { id: 'salary-structures', label: 'Salary Structures', icon: LayersIcon, href: '/payroll/salary-structures' },
      { id: 'compensation', label: 'Employee Compensation', icon: WalletIcon, href: '/payroll/compensation' },
    ],
  },
  {
    label: 'Payments',
    items: [
      { id: 'reimbursements', label: 'Reimbursements', icon: ReceiptIcon, href: '/payroll/reimbursements' },
      { id: 'bonuses', label: 'Bonuses & Adjustments', icon: TrophyIcon, href: '/payroll/bonuses' },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { id: 'statutory-deductions', label: 'Statutory Deductions', icon: ShieldIcon, href: '/payroll/statutory-deductions' },
      { id: 'tax-declarations', label: 'Tax Declarations', icon: EditIcon, href: '/payroll/tax-declarations' },
    ],
  },
  {
    label: 'Documents',
    items: [
      { id: 'payslips', label: 'Payslips', icon: FileTextIcon, href: '/payroll/payslips' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { id: 'payroll-settings', label: 'Payroll Settings', icon: SettingsIcon, href: '/payroll/settings' },
      { id: 'payroll-calendar', label: 'Payroll Calendar', icon: CalendarIcon, href: '/payroll/calendar' },
      { id: 'payment-methods', label: 'Payment Methods', icon: BuildingBankIcon, href: '/payroll/payment-methods' },
      { id: 'statutory-configuration', label: 'Statutory Configuration', icon: ShieldIcon, href: '/payroll/statutory-configuration' },
    ],
  },
]

const navigationMenu: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: GridIcon, href: '/dashboard' },
  { id: 'people', label: 'People', icon: UsersIcon, href: '/people/employees', badgeKey: 'employees', sections: peopleSections },
  { id: 'operations', label: 'Operations', icon: ClockIcon, href: '/operations', sections: operationsSections },
  { id: 'requests', label: 'Requests', icon: ClipboardCheckIcon, href: '/requests', badgeKey: 'requests' },
  { id: 'reports', label: 'Reports', icon: BarChartIcon, href: '/reports' },
  { id: 'security', label: 'Security', icon: ShieldIcon, href: '/security' },
]

export function Sidebar() {
  const { isDark } = useTheme()
  const pathname = usePathname()
  const { user } = useAuth()
  const { employees } = useEmployee()
  const { isConnected, isConfigured } = usePayrollConnection()

  const pendingApprovals = mockLeaveRequests.filter(r => r.status === 'Pending').length

  const badgeValues: Record<string, number> = {
    employees: employees.length,
    requests: pendingApprovals,
  }

  const isItemActive = (item: NavItem) =>
    pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href.split('/').slice(0, 2).join('/')))

  // Payroll's sub-navigation only exists once setup is complete — before that,
  // there's nothing to link to yet, so the accordion has no sections to expand.
  const integrationsMenu: NavItem[] = [
    {
      id: 'payroll',
      label: 'Payroll',
      icon: WalletIcon,
      href: '/payroll',
      sections: isConfigured ? payrollSections : undefined,
      statusPill: !isConnected
        ? { label: 'Not Connected', hex: '#94A3B8' }
        : !isConfigured
        ? { label: 'Setup Pending', hex: '#F59E0B' }
        : undefined,
    },
  ]

  const [expandedId, setExpandedId] = useState<string | null>(
    [...navigationMenu, ...integrationsMenu].find(item => item.sections && isItemActive(item))?.id ?? null
  )

  const sidebarBg = isDark ? 'bg-[#0A0A0A]' : 'bg-[#E8EFF6]'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textActive = isDark ? 'text-[#27EAA6]' : 'text-[#004D43]'
  // Nav item default color = Primary text (navy/light-gray), per typography spec
  const textInactive = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const iconInactive = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const hoverBg = isDark ? 'hover:bg-[#18181B]' : 'hover:bg-white'
  const activeBg = isDark ? 'bg-[#27EAA6]/10' : 'bg-[#ABE6D1]/30'
  const subActiveBg = isDark ? 'bg-[#27EAA6]/10' : 'bg-[#ABE6D1]/40'
  const subHoverBg = isDark ? 'hover:bg-[#18181B]' : 'hover:bg-white/60'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  // Sub-item label/icon default = darker than textSecondary for readability against the light sidebar bg
  const subTextInactive = isDark ? 'text-[#9CA3AF]' : 'text-[#475569]'
  const subIconInactive = isDark ? 'text-[#9CA3AF]' : 'text-[#64748B]'
  const sectionLabelColor = isDark ? 'text-[#71717A]' : 'text-[#64748B]'
  // Count badge = 10px/700/white on app primary, per Component Typography spec
  const badgeBg = 'bg-[#004D43] text-white'

  const isSubItemActive = (href: string) => (href === '/operations' ? pathname === '/operations' : pathname === href || pathname?.startsWith(href + '/'))

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon
    const isActive = isItemActive(item)
    const badgeValue = item.badgeKey ? badgeValues[item.badgeKey] : undefined
    const hasSections = !!item.sections
    const isExpanded = hasSections && expandedId === item.id

    const row = (
      <div
        className={`
          relative flex items-center justify-between px-3 py-2.5 rounded-xl
          transition-colors cursor-pointer
          ${isActive ? activeBg : hoverBg}
        `}
        onClick={hasSections ? (e) => { e.preventDefault(); setExpandedId(isExpanded ? null : item.id) } : undefined}
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
          {item.statusPill && (
            <span
              className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
              style={{ backgroundColor: `${item.statusPill.hex}22`, color: item.statusPill.hex }}
            >
              {item.statusPill.label}
            </span>
          )}
          {hasSections ? (
            <ChevronRightIcon
              size={14}
              className={`transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''} ${isActive ? textActive : textSecondary}`}
            />
          ) : (
            !item.statusPill && isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#004D43]" />
          )}
        </div>
      </div>
    )

    return (
      <div key={item.id}>
        {hasSections ? row : <Link href={item.href}>{row}</Link>}

        {hasSections && isExpanded && (
          <div className="mt-0.5 mb-1.5 space-y-2.5">
            {item.sections!.map(section => (
              <div key={section.label}>
                <p className={`px-3 pt-2 pb-1 text-[9.5px] font-bold uppercase tracking-[0.06em] ${sectionLabelColor}`}>
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {section.items.map(sub => {
                    const SubIcon = sub.icon
                    const subActive = isSubItemActive(sub.href)
                    return (
                      <Link key={sub.id} href={sub.href}>
                        <div
                          className={`
                            flex items-center gap-2.5 pl-9 pr-3 py-2 rounded-lg
                            transition-colors cursor-pointer
                            ${subActive ? subActiveBg : subHoverBg}
                          `}
                        >
                          <SubIcon size={14} className={subActive ? textActive : subIconInactive} />
                          <span className={`text-xs ${subActive ? `${textActive} font-semibold` : `font-medium ${subTextInactive}`}`}>
                            {sub.label}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside
      className={`
        w-[280px] h-screen fixed left-0 top-0 pt-16 z-30
        border-r ${borderColor}
        flex flex-col
        ${sidebarBg}
      `}
    >
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navigationMenu.map(renderNavItem)}

        <p className={`px-3 pt-4 pb-1.5 text-[10.5px] font-bold uppercase tracking-[0.06em] ${sectionLabelColor}`}>
          Integrations
        </p>
        {integrationsMenu.map(renderNavItem)}
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
