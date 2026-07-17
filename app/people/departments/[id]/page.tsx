'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { mockDepartments, upcomingBirthdays, upcomingAnniversaries, newJoiners } from '@/lib/mockData'
import { BuildingIcon, UsersIcon, CheckCircleIcon, UserPlusIcon, FileTextIcon, CalendarIcon } from '@/components/Icons'

type TabId = 'overview' | 'employees' | 'calendar' | 'files'

const tabs: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'employees', label: 'Employees' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'files', label: 'Files' },
]

export default function DepartmentDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { isDark } = useTheme()
  const { employees, getEmployee } = useEmployee()
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const dept = mockDepartments.find(d => d.id === id)

  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const deptEmployees = useMemo(
    () => (dept ? employees.filter(e => e.department === dept.name) : []),
    [dept, employees]
  )
  const head = dept ? getEmployee(dept.headId) : undefined
  const activeCount = deptEmployees.filter(e => e.status === 'Active').length
  const attendancePct = deptEmployees.length ? Math.round((activeCount / deptEmployees.length) * 100) : 0
  const newJoinerNames = new Set(newJoiners.map(n => n.name))
  const deptNewJoiners = deptEmployees.filter(e => newJoinerNames.has(`${e.firstName} ${e.lastName}`))

  if (!dept) {
    return (
      <div className={`p-8 rounded-xl border ${borderColor} ${cardBg} text-center`}>
        <p className={`text-sm font-semibold ${textColor}`}>Department not found.</p>
        <Link href="/people/departments" className={`text-sm font-semibold ${isDark ? 'text-[#27EAA6]' : 'text-[#004D43]'} hover:underline mt-2 inline-block`}>
          ← Back to Departments
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <Link href="/people/departments" className={`text-xs font-semibold ${textSecondary} ${isDark ? 'hover:text-[#27EAA6]' : 'hover:text-[#004D43]'}`}>
        ← Back to Departments
      </Link>

      <div className={`p-6 rounded-xl border ${borderColor} ${cardBg}`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
            <BuildingIcon size={24} />
          </div>
          <div>
            <h1 className={`text-lg font-extrabold ${textColor}`}>{dept.name}</h1>
            <p className={`text-sm font-medium mt-0.5 ${textSecondary}`}>
              {deptEmployees.length} Employees {head && <>· Head: {head.firstName} {head.lastName}</>}
            </p>
          </div>
        </div>
      </div>

      <div className={`flex items-center gap-1 border-b ${borderColor} overflow-x-auto`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#00755A] text-[#00755A]'
                : `border-transparent ${textSecondary} ${isDark ? 'hover:text-[#D4D4D8]' : 'hover:text-[#0C2472]'}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MiniStat icon={UsersIcon} label="Department Strength" value={`${deptEmployees.length}`} textColor={textColor} textSecondary={textSecondary} borderColor={borderColor} cardBg={cardBg} />
          <MiniStat icon={CheckCircleIcon} label="Attendance %" value={`${attendancePct}%`} textColor={textColor} textSecondary={textSecondary} borderColor={borderColor} cardBg={cardBg} />
          <MiniStat icon={UserPlusIcon} label="New Joiners" value={`${deptNewJoiners.length}`} textColor={textColor} textSecondary={textSecondary} borderColor={borderColor} cardBg={cardBg} />
          <MiniStat icon={CalendarIcon} label="Upcoming Leave" value="—" textColor={textColor} textSecondary={textSecondary} borderColor={borderColor} cardBg={cardBg} />
        </div>
      )}

      {activeTab === 'employees' && (
        <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                {['Employee', 'Designation', 'Location', 'Status'].map(h => (
                  <th key={h} className={`text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deptEmployees.map(emp => (
                <tr key={emp.id} className={`border-b ${borderColor} last:border-b-0 transition-colors ${rowHover}`}>
                  <td className="px-5 py-3">
                    <Link href={`/people/employees/${emp.id}`} className="flex items-center gap-3 group">
                      <span className="w-7 h-7 rounded-full bg-[#004D43] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </span>
                      <span className={`text-sm font-semibold group-hover:text-[#00755A] ${textColor}`}>{emp.firstName} {emp.lastName}</span>
                    </Link>
                  </td>
                  <td className={`px-5 py-3 text-sm font-medium ${textColor}`}>{emp.designation}</td>
                  <td className={`px-5 py-3 text-sm font-medium ${textColor}`}>{emp.location}</td>
                  <td className={`px-5 py-3 text-sm font-medium ${textSecondary}`}>{emp.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className={`p-5 rounded-xl border ${borderColor} ${cardBg} space-y-4`}>
          <CalendarSection title="Birthdays" items={upcomingBirthdays.filter(e => deptEmployees.some(d => `${d.firstName} ${d.lastName}` === e.name))} textColor={textColor} textSecondary={textSecondary} />
          <CalendarSection title="Work Anniversaries" items={upcomingAnniversaries.filter(e => deptEmployees.some(d => `${d.firstName} ${d.lastName}` === e.name))} textColor={textColor} textSecondary={textSecondary} />
          <CalendarSection title="Upcoming Leave" items={[]} textColor={textColor} textSecondary={textSecondary} />
        </div>
      )}

      {activeTab === 'files' && (
        <div className={`p-10 rounded-xl border ${borderColor} ${cardBg} text-center`}>
          <FileTextIcon size={28} className={`mx-auto mb-3 ${textSecondary}`} />
          <p className={`text-sm font-semibold ${textColor}`}>No shared files yet</p>
          <p className={`text-xs font-medium mt-1 ${textSecondary}`}>Department-level shared documents will appear here.</p>
        </div>
      )}
    </div>
  )
}

function MiniStat({
  icon: Icon,
  label,
  value,
  textColor,
  textSecondary,
  borderColor,
  cardBg,
}: {
  icon: React.FC<{ size?: number; className?: string }>
  label: string
  value: string
  textColor: string
  textSecondary: string
  borderColor: string
  cardBg: string
}) {
  return (
    <div className={`p-4 rounded-xl border ${borderColor} ${cardBg}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-[#00755A]" />
        <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{label}</p>
      </div>
      <p className={`text-xl font-bold ${textColor}`}>{value}</p>
    </div>
  )
}

function CalendarSection({
  title,
  items,
  textColor,
  textSecondary,
}: {
  title: string
  items: { id: string; name: string; date: string }[]
  textColor: string
  textSecondary: string
}) {
  return (
    <div>
      <p className={`text-[11px] font-semibold uppercase tracking-[0.05em] mb-2 ${textSecondary}`}>{title}</p>
      {items.length === 0 ? (
        <p className={`text-xs font-medium ${textSecondary}`}>Nothing upcoming.</p>
      ) : (
        <div className="space-y-1.5">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <p className={`text-sm font-medium ${textColor}`}>{item.name}</p>
              <span className={`text-xs font-semibold ${textSecondary}`}>{item.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
