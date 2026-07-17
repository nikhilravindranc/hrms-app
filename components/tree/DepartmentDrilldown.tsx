'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { BuildingIcon, ExternalLinkIcon } from '@/components/Icons'
import { PersonAvatar } from '@/components/tree/Avatar'
import { Employee, mockDepartments, mockOrganization } from '@/lib/mockData'

interface DeptInfo {
  id: string
  name: string
  headName?: string
  count: number
}

export function DepartmentDrilldown({
  employees,
  getEmployee,
}: {
  employees: Employee[]
  getEmployee: (id: string) => Employee | undefined
}) {
  const { isDark } = useTheme()
  const router = useRouter()
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null)

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const lineColor = isDark ? '#27272A' : '#D4E8E0'
  const selectedRing = isDark ? 'border-[#27EAA6] ring-1 ring-[#27EAA6]/30' : 'border-[#00755A] ring-1 ring-[#00755A]/20'

  const depts: DeptInfo[] = useMemo(
    () =>
      mockDepartments.map(dept => {
        const head = getEmployee(dept.headId)
        return {
          id: dept.id,
          name: dept.name,
          headName: head ? `${head.firstName} ${head.lastName}` : undefined,
          count: employees.filter(e => e.department === dept.name).length,
        }
      }),
    [employees, getEmployee]
  )

  const selectedDept = depts.find(d => d.id === selectedDeptId) ?? null
  const deptEmployees = selectedDept ? employees.filter(e => e.department === selectedDept.name) : []

  const toggleDept = (id: string) => setSelectedDeptId(prev => (prev === id ? null : id))

  const goToDept = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/people/departments/${id}`)
  }

  const goToEmployee = (id: string) => router.push(`/people/employees/${id}`)

  return (
    <div className="flex items-start gap-8 overflow-x-auto pb-4" style={{ minHeight: 500 }}>
      {/* Root */}
      <div className="flex flex-col items-center flex-shrink-0 pt-6">
        <div className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${borderColor} bg-[#004D43] w-36`}>
          <span className="w-11 h-11 rounded-lg bg-white/15 text-white flex items-center justify-center flex-shrink-0">
            <BuildingIcon size={20} />
          </span>
          <div className="text-center min-w-0">
            <p className="text-xs font-bold truncate w-full text-white">{mockOrganization.name}</p>
            <p className="text-[10px] font-medium truncate w-full text-white/70">{employees.length} Employees</p>
          </div>
        </div>
        {depts.length > 0 && (
          <span className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-[#0F0F0F] text-[#9CA3AF]' : 'bg-[#E8EFF6] text-[#004D43]'}`}>
            {depts.length}
          </span>
        )}
      </div>

      {/* Level 1: departments */}
      <div className="flex flex-col justify-center flex-shrink-0" style={{ minHeight: 480 }}>
        <div className="flex flex-col gap-3 relative pl-6 border-l-2" style={{ borderColor: lineColor }}>
          {depts.map(dept => {
            const isSelected = selectedDeptId === dept.id
            return (
              <div key={dept.id} className="relative flex items-center">
                <span className="absolute -left-6 top-1/2 w-6 h-0.5" style={{ backgroundColor: lineColor }} />
                <div
                  onClick={() => dept.count > 0 && toggleDept(dept.id)}
                  className={`w-60 flex items-center gap-3 pl-3 pr-2 py-2.5 rounded-xl border ${
                    isSelected ? selectedRing : `${borderColor} hover:border-[#00755A]`
                  } ${cardBg} transition-colors group ${dept.count > 0 ? 'cursor-pointer' : ''}`}
                >
                  <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
                    <BuildingIcon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[13px] font-semibold truncate ${textColor}`}>{dept.name}</p>
                    <p className={`text-[11px] font-medium truncate ${textSecondary}`}>
                      {dept.count} Employees{dept.headName ? ` · ${dept.headName}` : ''}
                    </p>
                  </div>
                  {dept.count > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${isDark ? 'bg-[#0F0F0F] text-[#9CA3AF]' : 'bg-[#E8EFF6] text-[#004D43]'}`}>
                      {dept.count}
                    </span>
                  )}
                  <button
                    title="View department"
                    onClick={e => goToDept(dept.id, e)}
                    className={`flex-shrink-0 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'hover:bg-[#27272A] text-[#9CA3AF]' : 'hover:bg-[#F7FAF9] text-[#94A3B8]'}`}
                  >
                    <ExternalLinkIcon size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Level 2: employees of selected department */}
      {selectedDept && (
        <div className="flex flex-col justify-center flex-shrink-0" style={{ minHeight: 480 }}>
          <div className="flex flex-col gap-3 relative pl-6 border-l-2" style={{ borderColor: lineColor }}>
            {deptEmployees.map(emp => (
              <div key={emp.id} className="relative flex items-center">
                <span className="absolute -left-6 top-1/2 w-6 h-0.5" style={{ backgroundColor: lineColor }} />
                <div
                  onClick={() => goToEmployee(emp.id)}
                  className={`w-60 flex items-center gap-3 pl-3 pr-2 py-2.5 rounded-xl border ${borderColor} hover:border-[#00755A] ${cardBg} transition-colors cursor-pointer group`}
                >
                  <PersonAvatar employee={emp} size={34} tone="normal" />
                  <div className="min-w-0 flex-1">
                    <p className={`text-[13px] font-semibold truncate ${textColor}`}>{emp.firstName} {emp.lastName}</p>
                    <p className={`text-[11px] font-medium truncate ${textSecondary}`}>{emp.designation}</p>
                  </div>
                  <ExternalLinkIcon size={13} className={`flex-shrink-0 ${isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
