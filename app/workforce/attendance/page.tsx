'use client'

import { useMemo, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import {
  MoreVerticalIcon,
  EditIcon,
  HistoryIcon,
  CheckCircleIcon,
  UploadIcon,
  ChevronRightIcon,
} from '@/components/Icons'
import { todayAttendance, mockShiftAssignments, mockShifts } from '@/lib/workforceData'
import { getAttendanceStatus, getMonthMatrix, attendanceStatusColors, AttendanceStatus } from '@/lib/attendanceCalendar'

type Tab = 'daily' | 'monthly' | 'employee' | 'bulk' | 'import'

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Present: { bg: 'bg-[#00755A]/15', text: 'text-[#00755A]', dot: '#00755A' },
  WFH: { bg: 'bg-[#27EAA6]/15', text: 'text-[#0B8F6E]', dot: '#27EAA6' },
  Late: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]', dot: '#F59E0B' },
  'On Leave': { bg: 'bg-[#5E93FF]/15', text: 'text-[#5E93FF]', dot: '#5E93FF' },
  Absent: { bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]', dot: '#EF4444' },
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'daily', label: 'Daily Attendance' },
  { id: 'monthly', label: 'Monthly Attendance' },
  { id: 'employee', label: 'Employee Attendance' },
  { id: 'bulk', label: 'Bulk Attendance' },
  { id: 'import', label: 'Import Attendance' },
]

export default function AttendancePage() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()
  const [tab, setTab] = useState<Tab>('daily')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
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

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Attendance</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Manage daily, monthly and bulk attendance records</p>
      </div>

      <div className={`flex items-center gap-1 p-1 rounded-lg border ${borderColor} ${cardBg} w-fit flex-wrap`}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              tab === t.id ? 'bg-[#00755A] text-white' : `${textSecondary} ${isDark ? 'hover:text-[#D4D4D8]' : 'hover:text-[#0C2472]'}`
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'daily' && (
        <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${borderColor}`}>
                  {['Employee', 'Shift', 'Check In', 'Check Out', 'Worked Hours', 'Overtime', 'Late', 'Status', ''].map(h => (
                    <th key={h} className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => {
                  const att = attendanceByEmployee[emp.id]
                  const shiftName = shiftById[assignmentByEmployee[emp.id]] ?? '—'
                  const style = statusStyles[att?.status ?? 'Present']
                  return (
                    <tr key={emp.id} className={`border-b ${borderColor} last:border-b-0 transition-colors ${rowHover}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5 min-w-[160px]">
                          <div className="w-7 h-7 rounded-full bg-[#004D43] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {emp.firstName[0]}{emp.lastName[0]}
                          </div>
                          <p className={`text-sm font-semibold truncate ${textColor}`}>{emp.firstName} {emp.lastName}</p>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textColor}`}>{shiftName}</td>
                      <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{att?.checkIn ?? '—'}</td>
                      <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{att?.checkOut ?? '—'}</td>
                      <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textColor}`}>{att?.workedHours ? `${att.workedHours}h` : '—'}</td>
                      <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${att && att.overtime > 0 ? 'text-[#00755A]' : textSecondary}`}>{att?.overtime ? `+${att.overtime}h` : '—'}</td>
                      <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${att && att.lateMinutes > 0 ? 'text-[#F59E0B]' : textSecondary}`}>{att?.lateMinutes ? `${att.lateMinutes}m` : '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold ${style.bg} ${style.text}`}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
                          {att?.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() => setOpenMenuId(prev => (prev === emp.id ? null : emp.id))}
                          className={`p-1.5 rounded-md ${textSecondary} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}
                        >
                          <MoreVerticalIcon size={16} />
                        </button>
                        {openMenuId === emp.id && (
                          <div className={`absolute right-4 top-10 z-10 w-40 rounded-lg border ${borderColor} ${cardBg} shadow-lg py-1`}>
                            {[
                              { label: 'Edit', icon: EditIcon },
                              { label: 'Regularize', icon: CheckCircleIcon },
                              { label: 'History', icon: HistoryIcon },
                            ].map(action => (
                              <button
                                key={action.label}
                                onClick={() => setOpenMenuId(null)}
                                className={`w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-medium ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}
                              >
                                <action.icon size={14} className={textSecondary} />
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'monthly' && <MonthlyAttendance />}
      {tab === 'employee' && <EmployeeAttendance />}
      {tab === 'bulk' && <BulkAttendance />}
      {tab === 'import' && <ImportAttendance />}
    </div>
  )
}

function MonthlyAttendance() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()
  const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? '')
  const [cursor] = useState(() => new Date(2026, 6, 1))

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'

  const employee = employees.find(e => e.id === employeeId) ?? employees[0]
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const weeks = useMemo(() => getMonthMatrix(year, month), [year, month])

  if (!employee) return null

  return (
    <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <p className={`text-sm font-bold ${textColor}`}>July 2026</p>
        <select
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
          className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none`}
        >
          {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <p key={d} className={`text-center text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{d}</p>
        ))}
      </div>
      <div className="space-y-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-2">
            {week.map((date, di) => {
              if (!date) return <div key={di} className="aspect-square" />
              const status = getAttendanceStatus(employee, date)
              const dimmed = status === 'Upcoming' || status === 'Not Joined'
              return (
                <div key={di} title={`${date.toDateString()} · ${status}`} className={`aspect-square rounded-lg border ${borderColor} flex flex-col items-center justify-center gap-1`}>
                  <span className={`text-xs font-semibold ${dimmed ? textSecondary : textColor}`}>{date.getDate()}</span>
                  {!dimmed && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: attendanceStatusColors[status] }} />}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function EmployeeAttendance() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()
  const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? '')

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const employee = employees.find(e => e.id === employeeId) ?? employees[0]

  const last14Days = useMemo(() => {
    if (!employee) return []
    const days: { date: Date; status: AttendanceStatus }[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(2026, 6, 20 - i)
      days.push({ date: d, status: getAttendanceStatus(employee, d) })
    }
    return days
  }, [employee])

  if (!employee) return null

  return (
    <div className="space-y-4">
      <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
        <select
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
          className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none`}
        >
          {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} · {e.designation}</option>)}
        </select>
      </div>
      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <div className={`px-5 py-3 border-b ${borderColor}`}>
          <h2 className={`text-sm font-bold ${textColor}`}>Last 14 Days</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${borderColor}`}>
              {['Date', 'Day', 'Status'].map(h => (
                <th key={h} className={`text-left px-5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {last14Days.map(({ date, status }) => (
              <tr key={date.toISOString()} className={`border-b ${borderColor} last:border-b-0 ${rowHover}`}>
                <td className={`px-5 py-2.5 text-sm font-medium ${textColor}`}>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                <td className={`px-5 py-2.5 text-sm font-medium ${textSecondary}`}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</td>
                <td className="px-5 py-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: attendanceStatusColors[status] }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: attendanceStatusColors[status] }} />
                    {status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BulkAttendance() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState<AttendanceStatus>('Present')
  const [date, setDate] = useState('2026-07-20')
  const [applied, setApplied] = useState(false)

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const toggle = (id: string) => setSelected(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })
  const toggleAll = () => setSelected(prev => prev.size === employees.length ? new Set() : new Set(employees.map(e => e.id)))

  return (
    <div className="space-y-4">
      <div className={`rounded-xl border ${borderColor} ${cardBg} p-5 flex items-end gap-3 flex-wrap`}>
        <div className="flex flex-col gap-1">
          <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Date</label>
          <input type="date" value={date} onChange={e => { setDate(e.target.value); setApplied(false) }} className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none`} />
        </div>
        <div className="flex flex-col gap-1">
          <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Set Status</label>
          <select value={status} onChange={e => { setStatus(e.target.value as AttendanceStatus); setApplied(false) }} className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none min-w-[150px]`}>
            {['Present', 'WFH', 'Late', 'On Leave', 'Absent'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button
          disabled={selected.size === 0}
          onClick={() => setApplied(true)}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Apply to {selected.size} selected
        </button>
        {applied && selected.size > 0 && (
          <span className="text-xs font-semibold text-[#00755A]">Marked {selected.size} employees as {status} for {date}</span>
        )}
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${borderColor}`}>
              <th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.size === employees.length} onChange={toggleAll} className="rounded" /></th>
              <th className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Employee</th>
              <th className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Department</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className={`border-b ${borderColor} last:border-b-0 ${rowHover}`}>
                <td className="px-4 py-2.5"><input type="checkbox" checked={selected.has(emp.id)} onChange={() => toggle(emp.id)} className="rounded" /></td>
                <td className={`px-4 py-2.5 text-sm font-semibold ${textColor}`}>{emp.firstName} {emp.lastName}</td>
                <td className={`px-4 py-2.5 text-sm font-medium ${textSecondary}`}>{emp.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ImportAttendance() {
  const { isDark } = useTheme()
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'

  return (
    <div className={`rounded-xl border border-dashed ${borderColor} ${cardBg} p-10 flex flex-col items-center justify-center text-center gap-3`}>
      <div className="w-12 h-12 rounded-xl bg-[#00755A]/15 text-[#00755A] flex items-center justify-center">
        <UploadIcon size={22} />
      </div>
      <div>
        <p className={`text-sm font-bold ${textColor}`}>Import attendance from a file</p>
        <p className={`text-xs font-medium mt-1 ${textSecondary}`}>Upload a biometric device export or CSV with Employee ID, Date, Check In and Check Out columns.</p>
      </div>
      <button className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors">
        <UploadIcon size={15} />
        Choose File
      </button>
      <button className={`flex items-center gap-1 text-xs font-semibold ${textSecondary} hover:underline`}>
        Download CSV template
        <ChevronRightIcon size={12} />
      </button>
    </div>
  )
}
