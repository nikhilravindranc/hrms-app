'use client'

import { useMemo, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { ChevronRightIcon } from '@/components/Icons'
import {
  AttendanceStatus,
  attendanceStatusColors,
  getAttendanceStatus,
  getMonthMatrix,
  monthSummary,
} from '@/lib/attendanceCalendar'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const LEGEND_STATUSES: AttendanceStatus[] = ['Present', 'WFH', 'Late', 'On Leave', 'Absent', 'Holiday', 'Weekend']

export default function AttendanceCalendarPage() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()
  const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? '')
  const [cursor, setCursor] = useState(() => new Date(2026, 6, 1))

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'
  const todayRing = isDark ? 'ring-2 ring-[#27EAA6]' : 'ring-2 ring-[#00755A]'

  const employee = employees.find(e => e.id === employeeId) ?? employees[0]
  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  const weeks = useMemo(() => getMonthMatrix(year, month), [year, month])
  const summary = useMemo(() => (employee ? monthSummary(employee, year, month) : {}), [employee, year, month])

  const goPrevMonth = () => setCursor(new Date(year, month - 1, 1))
  const goNextMonth = () => setCursor(new Date(year, month + 1, 1))

  const today = new Date('2026-07-20')
  const isToday = (d: Date) => d.toDateString() === today.toDateString()

  if (!employee) return null

  const summaryCards: { label: AttendanceStatus; }[] = [
    { label: 'Present' },
    { label: 'WFH' },
    { label: 'Late' },
    { label: 'On Leave' },
    { label: 'Absent' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-extrabold ${textColor}`}>Attendance Calendar</h1>
          <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Day-by-day attendance record per employee</p>
        </div>

        <select
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
          className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none`}
        >
          {employees.map(e => (
            <option key={e.id} value={e.id}>
              {e.firstName} {e.lastName} · {e.designation}
            </option>
          ))}
        </select>
      </div>

      {/* Month summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {summaryCards.map(({ label }) => (
          <div key={label} className={`p-3.5 rounded-xl border ${borderColor} ${cardBg}`}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: attendanceStatusColors[label] }} />
              <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{label}</p>
            </div>
            <p className={`text-xl font-extrabold ${textColor}`}>{summary[label] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goPrevMonth}
            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}
          >
            <ChevronRightIcon size={16} className={`rotate-180 ${textColor}`} />
          </button>
          <p className={`text-sm font-bold ${textColor}`}>{MONTH_NAMES[month]} {year}</p>
          <button
            onClick={goNextMonth}
            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}
          >
            <ChevronRightIcon size={16} className={textColor} />
          </button>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {WEEKDAYS.map(d => (
            <p key={d} className={`text-center text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>
              {d}
            </p>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-2">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-2">
              {week.map((date, di) => {
                if (!date) return <div key={di} />
                const status = getAttendanceStatus(employee, date)
                const color = attendanceStatusColors[status]
                const dimmed = status === 'Upcoming' || status === 'Not Joined'
                return (
                  <div
                    key={di}
                    title={`${date.toDateString()} · ${status}`}
                    className={`aspect-square rounded-lg border ${borderColor} flex flex-col items-center justify-center gap-1 ${
                      isToday(date) ? todayRing : ''
                    }`}
                  >
                    <span className={`text-xs font-semibold ${dimmed ? textSecondary : textColor}`}>{date.getDate()}</span>
                    {!dimmed && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 pt-4 border-t ${borderColor}`}>
          {LEGEND_STATUSES.map(status => (
            <div key={status} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: attendanceStatusColors[status] }} />
              <span className={`text-[11px] font-medium ${textSecondary}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
