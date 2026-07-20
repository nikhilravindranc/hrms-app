'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useEmployee } from '@/context/EmployeeContext'
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CalendarIcon,
  CakeIcon,
  TrophyIcon,
  UserPlusIcon,
  ClockIcon,
  CheckIcon,
  UploadIcon,
  activityIconMap,
} from '@/components/Icons'
import {
  attentionItems,
  todayAttendance,
  mockShiftAssignments,
  mockShifts,
  workforceActivity,
} from '@/lib/workforceData'
import { upcomingBirthdays, upcomingAnniversaries, probationEnding } from '@/lib/mockData'
import { mockHolidays } from '@/lib/workforceData'

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Present: { bg: 'bg-[#00755A]/15', text: 'text-[#00755A]', dot: '#00755A' },
  WFH: { bg: 'bg-[#27EAA6]/15', text: 'text-[#0B8F6E]', dot: '#27EAA6' },
  Late: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]', dot: '#F59E0B' },
  'On Leave': { bg: 'bg-[#5E93FF]/15', text: 'text-[#5E93FF]', dot: '#5E93FF' },
  Absent: { bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]', dot: '#EF4444' },
}

export default function TodaysWorkforcePage() {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const { employees, getEmployee } = useEmployee()
  const router = useRouter()

  const [deptFilter, setDeptFilter] = useState('')
  const [shiftFilter, setShiftFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const shiftById = useMemo(() => {
    const map: Record<string, string> = {}
    mockShifts.forEach(s => { map[s.id] = s.name })
    return map
  }, [])

  const assignmentByEmployee = useMemo(() => {
    const map: Record<string, string> = {}
    mockShiftAssignments.forEach(a => { map[a.employeeId] = a.shiftId })
    return map
  }, [])

  const attendanceByEmployee = useMemo(() => {
    const map: Record<string, (typeof todayAttendance)[number]> = {}
    todayAttendance.forEach(a => { map[a.employeeId] = a })
    return map
  }, [])

  const snapshot = useMemo(() => {
    const counts: Record<string, number> = { Present: 0, WFH: 0, Late: 0, 'On Leave': 0, Absent: 0 }
    todayAttendance.forEach(a => { counts[a.status] = (counts[a.status] ?? 0) + 1 })
    return counts
  }, [])

  const rows = useMemo(() => {
    return employees.filter(e => {
      if (deptFilter && e.department !== deptFilter) return false
      if (locationFilter && e.location !== locationFilter) return false
      const shiftId = assignmentByEmployee[e.id]
      if (shiftFilter && shiftId !== shiftFilter) return false
      const status = attendanceByEmployee[e.id]?.status
      if (statusFilter && status !== statusFilter) return false
      return true
    })
  }, [employees, deptFilter, shiftFilter, locationFilter, statusFilter, assignmentByEmployee, attendanceByEmployee])

  const departments = useMemo(() => Array.from(new Set(employees.map(e => e.department))), [employees])
  const locations = useMemo(() => Array.from(new Set(employees.map(e => e.location))), [employees])

  const upcomingHolidays = mockHolidays
    .filter(h => new Date(h.date) >= new Date('2026-07-20'))
    .slice(0, 3)

  const quickActions = [
    { id: 'mark-attendance', label: 'Mark Attendance', icon: CheckIcon, href: '/workforce/attendance' },
    { id: 'approve-leave', label: 'Approve Leave', icon: CalendarIcon, href: '/workforce/leave' },
    { id: 'assign-shift', label: 'Assign Shift', icon: ClockIcon, href: '/workforce/shift-assignments' },
    { id: 'create-holiday', label: 'Create Holiday', icon: CalendarIcon, href: '/workforce/holidays' },
    { id: 'import-attendance', label: 'Import Attendance', icon: UploadIcon, href: '/workforce/attendance' },
  ]

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-[#004D43] to-[#00755A]">
        <p className="text-white/70 text-sm font-semibold">Good Morning, {user?.firstName ?? 'there'}</p>
        <h1 className="text-2xl font-extrabold text-white mt-1">Here&apos;s today&apos;s workforce.</h1>
      </div>

      {/* Attention Center */}
      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <div className={`px-5 py-3.5 border-b ${borderColor} flex items-center gap-2`}>
          <AlertTriangleIcon size={16} className="text-[#F59E0B]" />
          <h2 className={`text-sm font-bold ${textColor}`}>Needs Your Attention</h2>
        </div>
        <div className="divide-y divide-[color:var(--tw-divide-opacity)]">
          {attentionItems.map(item => (
            <Link key={item.id} href={item.href}>
              <div className={`flex items-center justify-between px-5 py-3.5 transition-colors cursor-pointer ${rowHover} border-b ${borderColor} last:border-b-0`}>
                <p className={`text-sm font-medium ${textColor}`}>
                  <span className="font-bold">{item.count}</span> {item.label}
                </p>
                <span className="flex items-center gap-1 text-xs font-semibold text-[#00755A]">
                  {item.actionLabel}
                  <ArrowRightIcon size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Workforce Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(['Present', 'Late', 'Absent', 'WFH', 'On Leave'] as const).map(label => (
          <div key={label} className={`p-3.5 rounded-xl border ${borderColor} ${cardBg}`}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusStyles[label].dot }} />
              <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{label}</p>
            </div>
            <p className={`text-xl font-extrabold ${textColor}`}>{snapshot[label] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Today's Workforce table */}
          <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
            <div className={`px-5 py-3.5 border-b ${borderColor} flex items-center justify-between flex-wrap gap-2`}>
              <h2 className={`text-sm font-bold ${textColor}`}>Today&apos;s Workforce</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className={`px-2.5 py-1.5 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-xs font-medium outline-none`}>
                  <option value="">Department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={shiftFilter} onChange={e => setShiftFilter(e.target.value)} className={`px-2.5 py-1.5 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-xs font-medium outline-none`}>
                  <option value="">Shift</option>
                  {mockShifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className={`px-2.5 py-1.5 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-xs font-medium outline-none`}>
                  <option value="">Location</option>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`px-2.5 py-1.5 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-xs font-medium outline-none`}>
                  <option value="">Status</option>
                  {Object.keys(statusStyles).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className={`border-b ${borderColor} ${cardBg}`}>
                    {['Employee', 'Status', 'Shift', 'Check In', 'Check Out', 'Manager', ''].map(h => (
                      <th key={h} className={`text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(emp => {
                    const att = attendanceByEmployee[emp.id]
                    const shiftName = shiftById[assignmentByEmployee[emp.id]] ?? '—'
                    const manager = emp.manager ? getEmployee(emp.manager) : null
                    const style = statusStyles[att?.status ?? 'Present']
                    return (
                      <tr key={emp.id} className={`border-b ${borderColor} last:border-b-0 transition-colors cursor-pointer ${rowHover}`} onClick={() => router.push(`/people/employees/${emp.id}`)}>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5 min-w-[160px]">
                            <div className="w-7 h-7 rounded-full bg-[#004D43] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                              {emp.firstName[0]}{emp.lastName[0]}
                            </div>
                            <p className={`text-sm font-semibold truncate ${textColor}`}>{emp.firstName} {emp.lastName}</p>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${style.bg} ${style.text}`}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
                            {att?.status}
                          </span>
                        </td>
                        <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textColor}`}>{shiftName}</td>
                        <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{att?.checkIn ?? '—'}</td>
                        <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{att?.checkOut ?? '—'}</td>
                        <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{manager ? `${manager.firstName} ${manager.lastName}` : '—'}</td>
                        <td className="px-4 py-2.5" onClick={e => e.stopPropagation()}>
                          <Link href="/workforce/attendance" className="text-xs font-semibold text-[#00755A] hover:underline whitespace-nowrap">Mark</Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {rows.length === 0 && (
                <div className="py-12 text-center">
                  <p className={`text-sm font-medium ${textSecondary}`}>No employees match these filters.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
            <h2 className={`text-sm font-bold mb-3.5 ${textColor}`}>Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {quickActions.map(action => {
                const Icon = action.icon
                return (
                  <Link key={action.id} href={action.href}>
                    <div className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border ${borderColor} transition-colors cursor-pointer hover:border-[#00755A] ${isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'}`}>
                      <div className="w-9 h-9 rounded-lg bg-[#00755A]/15 text-[#00755A] flex items-center justify-center">
                        <Icon size={18} />
                      </div>
                      <p className={`text-xs font-semibold text-center ${textColor}`}>{action.label}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Upcoming */}
          <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
            <h2 className={`text-sm font-bold mb-3.5 ${textColor}`}>Upcoming</h2>
            <div className="space-y-4">
              <UpcomingBlock icon={CalendarIcon} label="Upcoming Leave" items={[
                { name: 'Rohit Iyer', detail: 'Annual · 5 days', date: 'Aug 3' },
                { name: 'Rahul Desai', detail: 'Annual · 5 days', date: 'Aug 10' },
              ]} textColor={textColor} textSecondary={textSecondary} />
              <UpcomingBlock icon={CakeIcon} label="Birthdays" items={upcomingBirthdays.map(b => ({ name: b.name, detail: b.detail, date: b.date }))} textColor={textColor} textSecondary={textSecondary} />
              <UpcomingBlock icon={TrophyIcon} label="Work Anniversaries" items={upcomingAnniversaries.map(a => ({ name: a.name, detail: a.detail, date: a.date }))} textColor={textColor} textSecondary={textSecondary} />
              <UpcomingBlock icon={CalendarIcon} label="Upcoming Holidays" items={upcomingHolidays.map(h => ({ name: h.name, detail: h.type, date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }))} textColor={textColor} textSecondary={textSecondary} />
              <UpcomingBlock icon={UserPlusIcon} label="Probation Ending" items={probationEnding.map(p => ({ name: p.name, detail: p.detail, date: p.date }))} textColor={textColor} textSecondary={textSecondary} />
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
            <h2 className={`text-sm font-bold mb-3.5 ${textColor}`}>Recent Activity</h2>
            <div className="space-y-3.5">
              {workforceActivity.map(item => {
                const Icon = activityIconMap[item.icon] ?? CheckIcon
                return (
                  <div key={item.id} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#00755A]/15 text-[#00755A] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={13} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold ${textColor}`}>{item.title}</p>
                      <p className={`text-[11px] font-medium ${textSecondary}`}>{item.actor} · {item.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function UpcomingBlock({
  icon: Icon,
  label,
  items,
  textColor,
  textSecondary,
}: {
  icon: React.FC<{ size?: number; className?: string }>
  label: string
  items: { name: string; detail: string; date: string }[]
  textColor: string
  textSecondary: string
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon size={13} className={textSecondary} />
        <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{label}</p>
      </div>
      <div className="space-y-1.5">
        {items.slice(0, 3).map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="min-w-0">
              <p className={`text-xs font-semibold truncate ${textColor}`}>{item.name}</p>
              <p className={`text-[10.5px] font-medium truncate ${textSecondary}`}>{item.detail}</p>
            </div>
            <span className={`text-[10.5px] font-bold flex-shrink-0 ${textSecondary}`}>{item.date}</span>
          </div>
        ))}
        {items.length === 0 && <p className={`text-xs font-medium ${textSecondary}`}>None coming up.</p>}
      </div>
    </div>
  )
}
