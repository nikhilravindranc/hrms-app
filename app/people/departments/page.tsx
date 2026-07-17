'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { mockDepartments } from '@/lib/mockData'
import { ChevronRightIcon } from '@/components/Icons'

export default function DepartmentsPage() {
  const { isDark } = useTheme()
  const { employees, getEmployee } = useEmployee()
  const router = useRouter()

  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const rows = useMemo(
    () =>
      mockDepartments.map(dept => {
        const deptEmployees = employees.filter(e => e.department === dept.name)
        const head = getEmployee(dept.headId)
        const locations = [...new Set(deptEmployees.map(e => e.location))]
        return { ...dept, head, employeeCount: deptEmployees.length, locations }
      }),
    [employees, getEmployee]
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Departments</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>{mockDepartments.length} Departments</p>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${borderColor}`}>
              {['Department', 'Head', 'Employees', 'Locations', ''].map(h => (
                <th key={h} className={`text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr
                key={row.id}
                onClick={() => router.push(`/people/departments/${row.id}`)}
                className={`border-b ${borderColor} last:border-b-0 cursor-pointer transition-colors ${rowHover}`}
              >
                <td className="px-5 py-4">
                  <p className={`text-sm font-semibold ${textColor}`}>{row.name}</p>
                </td>
                <td className="px-5 py-4">
                  {row.head ? (
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#004D43] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {row.head.firstName[0]}{row.head.lastName[0]}
                      </span>
                      <span className={`text-sm font-medium ${textColor}`}>{row.head.firstName} {row.head.lastName}</span>
                    </div>
                  ) : (
                    <span className={`text-sm font-medium ${textSecondary}`}>—</span>
                  )}
                </td>
                <td className={`px-5 py-4 text-sm font-medium ${textColor}`}>{row.employeeCount}</td>
                <td className={`px-5 py-4 text-sm font-medium ${textColor}`}>{row.locations.join(', ') || '—'}</td>
                <td className="px-5 py-4">
                  <ChevronRightIcon size={16} className={textSecondary} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
