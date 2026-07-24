'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { mockDesignations } from '@/lib/mockData'
import { PlusIcon, BadgeIcon } from '@/components/Icons'

export default function DesignationsPage() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()

  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const rows = useMemo(
    () =>
      mockDesignations
        .map(d => ({ ...d, employeeCount: employees.filter(e => e.designation === d.title).length }))
        .sort((a, b) => a.level - b.level),
    [employees]
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-extrabold ${textColor}`}>Designations</h1>
          <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>{mockDesignations.length} Designations</p>
        </div>
        <Link
          href="/people/designations/new"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#004A3A] transition-colors"
        >
          <PlusIcon size={15} />
          Add Designation
        </Link>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${borderColor}`}>
              {['Title', 'Level', 'Employees'].map(h => (
                <th key={h} className={`text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className={`border-b ${borderColor} last:border-b-0 transition-colors ${rowHover}`}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
                      <BadgeIcon size={15} />
                    </div>
                    <p className={`text-sm font-semibold ${textColor}`}>{row.title}</p>
                  </div>
                </td>
                <td className={`px-5 py-3.5 text-sm font-medium ${textSecondary}`}>Level {row.level}</td>
                <td className={`px-5 py-3.5 text-sm font-medium ${textColor}`}>{row.employeeCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
