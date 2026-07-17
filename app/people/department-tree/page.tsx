'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { mockDepartments, mockOrganization } from '@/lib/mockData'
import { BuildingIcon } from '@/components/Icons'

export default function DepartmentTreePage() {
  const { isDark } = useTheme()
  const { employees, getEmployee } = useEmployee()

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const hoverBg = isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'

  const depts = useMemo(
    () =>
      mockDepartments.map(dept => ({
        ...dept,
        head: getEmployee(dept.headId),
        count: employees.filter(e => e.department === dept.name).length,
      })),
    [employees, getEmployee]
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Department Tree</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Functional hierarchy across the organization</p>
      </div>

      <div className={`p-6 rounded-xl border ${borderColor} ${cardBg}`}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-fit">
          <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#004D43] text-white">
            <BuildingIcon size={17} />
          </span>
          <div>
            <p className={`text-sm font-bold ${textColor}`}>{mockOrganization.name}</p>
            <p className={`text-[11px] font-medium ${textSecondary}`}>{employees.length} Employees · {depts.length} Departments</p>
          </div>
        </div>

        <div className={`ml-6 pl-6 border-l ${borderColor}`}>
          {depts.map(dept => (
            <Link
              key={dept.id}
              href={`/people/departments/${dept.id}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg my-1 transition-colors group ${hoverBg} w-fit min-w-[260px]`}
            >
              <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
                <BuildingIcon size={15} />
              </span>
              <div className="min-w-0">
                <p className={`text-sm font-semibold group-hover:text-[#00755A] ${textColor}`}>{dept.name}</p>
                <p className={`text-[11px] font-medium ${textSecondary}`}>
                  {dept.count} Employees {dept.head && <>· Head: {dept.head.firstName} {dept.head.lastName}</>}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
