'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useEmployee } from '@/context/EmployeeContext'
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  CalendarIcon,
  CakeIcon,
  UsersIcon,
  UserXIcon,
  ShuffleIcon,
  EditIcon,
  HomeIcon,
  ClockIcon,
  CheckIcon,
  UploadIcon,
  MoreVerticalIcon,
  activityIconMap,
} from '@/components/Icons'
import {
  attentionItems,
  todayAttendance,
  mockShiftAssignments,
  mockShifts,
  workforceActivity,
  mockHolidays,
  mockWorkforceLeaveRequests,
} from '@/lib/workforceData'
import { upcomingBirthdays } from '@/lib/mockData'

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Present: { bg: 'bg-[#00755A]/15', text: 'text-[#00755A]', dot: '#00755A' },
  WFH: { bg: 'bg-[#27EAA6]/15', text: 'text-[#0B8F6E]', dot: '#27EAA6' },
  Late: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]', dot: '#F59E0B' },
  'On Leave': { bg: 'bg-[#5E93FF]/15', text: 'text-[#5E93FF]', dot: '#5E93FF' },
  Absent: { bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]', dot: '#EF4444' },
}

const attentionVisuals: Record<string, { icon: React.FC<{ size?: number; className?: string }>; iconBg: string; iconColor: string }> = {
  'not-checked-in': { icon: UserXIcon, iconBg: 'bg-[#EF4444]/15', iconColor: 'text-[#EF4444]' },
  'leave-pending': { icon: CalendarIcon, iconBg: 'bg-[#F59E0B]/15', iconColor: 'text-[#F59E0B]' },
  'corrections-pending': { icon: EditIcon, iconBg: 'bg-[#EAB308]/15', iconColor: 'text-[#EAB308]' },
  'shift-conflict': { icon: ShuffleIcon, iconBg: 'bg-[#8B5CF6]/15', iconColor: 'text-[#8B5CF6]' },
}

const snapshotConfig = [
  { key: 'Present', icon: UsersIcon, iconBg: 'bg-[#00755A]/15', iconColor: 'text-[#00755A]', trend: 8.2, trendUp: true, good: true },
  { key: 'Late', icon: ClockIcon, iconBg: 'bg-[#F59E0B]/15', iconColor: 'text-[#F59E0B]', trend: 12.5, trendUp: true, good: false },
  { key: 'Absent', icon: UserXIcon, iconBg: 'bg-[#EF4444]/15', iconColor: 'text-[#EF4444]', trend: 3.1, trendUp: false, good: true },
  { key: 'WFH', icon: HomeIcon, iconBg: 'bg-[#5E93FF]/15', iconColor: 'text-[#5E93FF]', trend: 5.4, trendUp: false, good: true },
  { key: 'On Leave', icon: CalendarIcon, iconBg: 'bg-[#8B5CF6]/15', iconColor: 'text-[#8B5CF6]', trend: 4.2, trendUp: true, good: null },
] as const

export default function TodaysWorkforcePage() {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const { employees, getEmployee } = useEmployee()
  const router = useRouter()

  const [deptFilter, setDeptFilter] = useState('')
  const [shiftFilter, setShiftFilter] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const shiftById = useMemo(() => {
    const map: Record<string, { name: string; time: string }> = {}
    mockShifts.forEach(s => { map[s.id] = { name: s.name, time: `${s.start} – ${s.end}` } })
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

  const departments = useMemo(() => Array.from(new Set(employees.map(e => e.department))), [employees])

  const rows = useMemo(() => {
    return employees.filter(e => {
      if (deptFilter && e.department !== deptFilter) return false
      const shiftId = assignmentByEmployee[e.id]
      if (shiftFilter && shiftId !== shiftFilter) return false
      return true
    })
  }, [employees, deptFilter, shiftFilter, assignmentByEmployee])

  const visibleRows = rows.slice(0, 6)

  const upcomingLeave = mockWorkforceLeaveRequests
    .filter(r => r.status === 'Approved' && new Date(r.startDate) >= new Date('2026-07-20'))
    .slice(0, 3)

  const upcomingHolidays = mockHolidays
    .filter(h => new Date(h.date) >= new Date('2026-07-20'))
    .slice(0, 2)

  const quickActions = [
    { id: 'mark-attendance', label: 'Mark Attendance', icon: CheckIcon, href: '/workforce/attendance', iconBg: 'bg-[#00755A]/15', iconColor: 'text-[#00755A]' },
    { id: 'approve-leave', label: 'Approve Leave', icon: CalendarIcon, href: '/workforce/leave', iconBg: 'bg-[#F59E0B]/15', iconColor: 'text-[#F59E0B]' },
    { id: 'review-corrections', label: 'Review Corrections', icon: EditIcon, href: '/workforce/attendance-corrections', iconBg: 'bg-[#EAB308]/15', iconColor: 'text-[#EAB308]' },
    { id: 'assign-shift', label: 'Assign Shift', icon: ShuffleIcon, href: '/workforce/shift-assignments', iconBg: 'bg-[#8B5CF6]/15', iconColor: 'text-[#8B5CF6]' },
    { id: 'add-holiday', label: 'Add Holiday', icon: CalendarIcon, href: '/workforce/holidays', iconBg: 'bg-[#5E93FF]/15', iconColor: 'text-[#5E93FF]' },
    { id: 'import-attendance', label: 'Import Attendance', icon: UploadIcon, href: '/workforce/attendance', iconBg: 'bg-[#27EAA6]/15', iconColor: 'text-[#0B8F6E]' },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Today&apos;s Workforce</h1>
        <p className={`flex items-center gap-1.5 text-xs font-medium mt-1 ${textSecondary}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00755A] flex-shrink-0" />
          Good morning, {user?.firstName ?? 'there'}! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Attention Center */}
      <div>
        <h2 className={`text-sm font-bold mb-3 flex items-center gap-2 ${textColor}`}>
          Needs Your Attention
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {attentionItems.map(item => {
            const visual = attentionVisuals[item.id]
            const Icon = visual.icon
            return (
              <Link key={item.id} href={item.href}>
                <div className={`p-4 rounded-xl border ${borderColor} ${cardBg} transition-transform hover:-translate-y-0.5 cursor-pointer`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${visual.iconBg} ${visual.iconColor}`}>
                      <Icon size={18} />
                    </div>
                    <p className={`text-2xl font-extrabold ${textColor}`}>{item.count}</p>
                  </div>
                  <p className={`text-xs font-semibold mb-1.5 ${textColor}`}>{item.label}</p>
                  <span className="flex items-center gap-1 text-xs font-bold text-[#00755A]">
                    {item.actionLabel}
                    <ArrowRightIcon size={12} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Workforce Snapshot + Upcoming Leave */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {snapshotConfig.map(cfg => {
          const Icon = cfg.icon
          const trendColor = cfg.good === null ? textSecondary : cfg.good ? 'text-[#00755A]' : 'text-[#EF4444]'
          return (
            <div key={cfg.key} className={`p-3.5 rounded-xl border ${borderColor} ${cardBg}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${cfg.iconBg} ${cfg.iconColor}`}>
                <Icon size={15} />
              </div>
              <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{cfg.key}</p>
              <p className={`text-xl font-extrabold mt-0.5 ${textColor}`}>{snapshot[cfg.key] ?? 0}</p>
              <p className={`flex items-center gap-0.5 text-[10.5px] font-semibold mt-1 ${trendColor}`}>
                {cfg.trendUp ? <ArrowUpRightIcon size={11} /> : <ArrowDownRightIcon size={11} />}
                {cfg.trend}% <span className={textSecondary}>vs yesterday</span>
              </p>
            </div>
          )
        })}
        <div className={`p-3.5 rounded-xl border ${borderColor} ${cardBg} col-span-2 sm:col-span-1`}>
          <div className="flex items-center gap-1.5 mb-2">
            <CalendarIcon size={13} className={textSecondary} />
            <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Upcoming Leave</p>
          </div>
          <div className="space-y-1.5">
            {upcomingLeave.slice(0, 2).map(r => (
              <div key={r.id} className="flex items-center justify-between gap-1">
                <p className={`text-[11px] font-semibold truncate ${textColor}`}>{r.employeeName.split(' ')[0]}</p>
                <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${isDark ? 'bg-[#5E93FF]/15 text-[#5E93FF]' : 'bg-[#5E93FF]/15 text-[#5E93FF]'}`}>
                  {new Date(r.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
            {upcomingLeave.length === 0 && <p className={`text-[11px] font-medium ${textSecondary}`}>None upcoming.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Today's Workforce table */}
          <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
            <div className={`px-5 py-3.5 border-b ${borderColor} flex items-center justify-between flex-wrap gap-2`}>
              <h2 className={`text-sm font-bold ${textColor}`}>Today&apos;s Workforce</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className={`px-2.5 py-1.5 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-xs font-medium outline-none`}>
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={shiftFilter} onChange={e => setShiftFilter(e.target.value)} className={`px-2.5 py-1.5 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-xs font-medium outline-none`}>
                  <option value="">All Shifts</option>
                  {mockShifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <Link href="/workforce/attendance" className={`px-3 py-1.5 rounded-lg border ${borderColor} text-xs font-semibold ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'} transition-colors`}>
                  View All
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${borderColor}`}>
                    {['Employee', 'Department', 'Shift', 'Check In', 'Check Out', 'Status', 'Location', ''].map(h => (
                      <th key={h} className={`text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map(emp => {
                    const att = attendanceByEmployee[emp.id]
                    const shift = shiftById[assignmentByEmployee[emp.id]]
                    const style = statusStyles[att?.status ?? 'Present']
                    return (
                      <tr key={emp.id} className={`border-b ${borderColor} last:border-b-0 transition-colors cursor-pointer ${rowHover}`} onClick={() => router.push(`/people/employees/${emp.id}`)}>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5 min-w-[160px]">
                            <div className="w-7 h-7 rounded-full bg-[#004D43] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                              {emp.firstName[0]}{emp.lastName[0]}
                            </div>
                            <div className="min-w-0">
                              <p className={`text-sm font-semibold truncate ${textColor}`}>{emp.firstName} {emp.lastName}</p>
                              <p className={`text-[10.5px] font-medium truncate ${textSecondary}`}>{emp.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textColor}`}>{emp.department}</td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <p className={`text-sm font-medium ${textColor}`}>{shift?.name ?? '—'}</p>
                          {shift && <p className={`text-[10.5px] font-medium ${textSecondary}`}>{shift.time}</p>}
                        </td>
                        <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{att?.checkIn ?? '—'}</td>
                        <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{att?.checkOut ?? '—'}</td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${style.bg} ${style.text}`}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
                            {att?.status}
                          </span>
                        </td>
                        <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{emp.location}</td>
                        <td className="px-4 py-2.5 relative" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setOpenMenuId(prev => (prev === emp.id ? null : emp.id))}
                            className={`p-1.5 rounded-md ${textSecondary} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}
                          >
                            <MoreVerticalIcon size={16} />
                          </button>
                          {openMenuId === emp.id && (
                            <div className={`absolute right-4 top-10 z-10 w-40 rounded-lg border ${borderColor} ${cardBg} shadow-lg py-1`}>
                              <Link href={`/people/employees/${emp.id}`} className={`block px-3 py-2 text-sm font-medium ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}>View Profile</Link>
                              <Link href="/workforce/attendance" className={`block px-3 py-2 text-sm font-medium ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}>Mark Attendance</Link>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {visibleRows.length === 0 && (
                <div className="py-12 text-center">
                  <p className={`text-sm font-medium ${textSecondary}`}>No employees match these filters.</p>
                </div>
              )}
            </div>
            <div className={`px-5 py-3 border-t ${borderColor} text-center`}>
              <Link href="/workforce/attendance" className="inline-flex items-center gap-1 text-xs font-bold text-[#00755A] hover:underline">
                View full attendance
                <ArrowRightIcon size={12} />
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
            <h2 className={`text-sm font-bold mb-3.5 ${textColor}`}>Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map(action => {
                const Icon = action.icon
                return (
                  <Link key={action.id} href={action.href}>
                    <div className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border ${borderColor} transition-colors cursor-pointer hover:border-[#00755A] ${isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.iconBg} ${action.iconColor}`}>
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
          {/* Today's Birthdays */}
          <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
            <div className="flex items-center gap-1.5 mb-3.5">
              <CakeIcon size={15} className="text-[#F59E0B]" />
              <h2 className={`text-sm font-bold ${textColor}`}>Today&apos;s Birthdays</h2>
            </div>
            <div className="space-y-3">
              {upcomingBirthdays.slice(0, 2).map(b => (
                <div key={b.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${textColor}`}>{b.name}</p>
                    <p className={`text-[10.5px] font-medium truncate ${textSecondary}`}>{b.detail}</p>
                  </div>
                  <span className={`text-[10.5px] font-bold flex-shrink-0 ${textSecondary}`}>{b.date}</span>
                </div>
              ))}
              {upcomingBirthdays.length === 0 && <p className={`text-xs font-medium ${textSecondary}`}>None today.</p>}
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
            <div className="flex items-center gap-1.5 mb-3.5">
              <CalendarIcon size={15} className="text-[#5E93FF]" />
              <h2 className={`text-sm font-bold ${textColor}`}>Upcoming Holidays</h2>
            </div>
            <div className="space-y-3">
              {upcomingHolidays.map(h => (
                <div key={h.id} className="flex items-center justify-between">
                  <p className={`text-xs font-semibold truncate ${textColor}`}>{h.name}</p>
                  <span className={`text-[10.5px] font-bold flex-shrink-0 ${textSecondary}`}>{new Date(h.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
              ))}
            </div>
            <Link href="/workforce/holiday-calendar" className="inline-flex items-center gap-1 text-xs font-bold text-[#00755A] hover:underline mt-3">
              View calendar
              <ArrowRightIcon size={12} />
            </Link>
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
