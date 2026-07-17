'use client'

import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { DepartmentDrilldown } from '@/components/tree/DepartmentDrilldown'

export default function DepartmentTreePage() {
  const { isDark } = useTheme()
  const { employees, getEmployee } = useEmployee()

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Department Tree</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Click a department to reveal its employees · click again to collapse</p>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} p-6 overflow-x-auto`}>
        <DepartmentDrilldown employees={employees} getEmployee={getEmployee} />
      </div>
    </div>
  )
}
