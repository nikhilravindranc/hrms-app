'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { Employee } from '@/lib/mockData'

export default function EmployeeTreePage() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'

  const roots = useMemo(() => employees.filter(e => !e.manager), [employees])
  const childrenOf = useMemo(() => {
    const map: Record<string, Employee[]> = {}
    employees.forEach(e => {
      if (e.manager) {
        if (!map[e.manager]) map[e.manager] = []
        map[e.manager].push(e)
      }
    })
    return map
  }, [employees])

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Employee Tree</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Reporting hierarchy across the organization</p>
      </div>

      <div className={`p-6 rounded-xl border ${borderColor} ${cardBg} overflow-x-auto`}>
        {roots.map(root => (
          <TreeNode key={root.id} employee={root} childrenOf={childrenOf} isDark={isDark} depth={0} />
        ))}
      </div>
    </div>
  )
}

function TreeNode({
  employee,
  childrenOf,
  isDark,
  depth,
}: {
  employee: Employee
  childrenOf: Record<string, Employee[]>
  isDark: boolean
  depth: number
}) {
  const children = childrenOf[employee.id] ?? []
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const hoverBg = isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'

  return (
    <div className={depth > 0 ? `ml-6 pl-6 border-l ${borderColor}` : ''}>
      <Link
        href={`/people/employees/${employee.id}`}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg my-1 transition-colors group ${hoverBg} w-fit min-w-[260px]`}
      >
        <span className="w-9 h-9 rounded-full bg-[#004D43] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {employee.firstName[0]}{employee.lastName[0]}
        </span>
        <div className="min-w-0">
          <p className={`text-sm font-semibold group-hover:text-[#00755A] ${textColor}`}>{employee.firstName} {employee.lastName}</p>
          <p className={`text-[11px] font-medium ${textSecondary}`}>{employee.designation} · {employee.department}</p>
        </div>
        {children.length > 0 && (
          <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isDark ? 'bg-[#0F0F0F] text-[#9CA3AF]' : 'bg-[#E8EFF6] text-[#004D43]'}`}>
            {children.length}
          </span>
        )}
      </Link>
      {children.map(child => (
        <TreeNode key={child.id} employee={child} childrenOf={childrenOf} isDark={isDark} depth={depth + 1} />
      ))}
    </div>
  )
}
