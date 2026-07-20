import { Employee } from '@/lib/mockData'

export type AttendanceStatus = 'Present' | 'WFH' | 'Late' | 'On Leave' | 'Absent' | 'Weekend' | 'Holiday' | 'Upcoming' | 'Not Joined'

export const attendanceStatusColors: Record<AttendanceStatus, string> = {
  Present: '#00755A',
  WFH: '#27EAA6',
  Late: '#F59E0B',
  'On Leave': '#5E93FF',
  Absent: '#EF4444',
  Weekend: '#9CA3AF',
  Holiday: '#D0FF71',
  Upcoming: '#9CA3AF',
  'Not Joined': '#9CA3AF',
}

// Public holidays observed org-wide (mock)
const HOLIDAYS = new Set(['2026-01-26', '2026-08-15', '2026-10-02', '2026-12-25'])

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

function hashString(s: string) {
  let hash = 0
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0
  return hash
}

const TODAY = new Date('2026-07-20')

export function getAttendanceStatus(employee: Employee, date: Date): AttendanceStatus {
  const key = dateKey(date)
  const day = date.getDay()

  if (date > TODAY) return 'Upcoming'
  if (date < employee.joiningDate) return 'Not Joined'
  if (HOLIDAYS.has(key)) return 'Holiday'
  if (day === 0 || day === 6) return 'Weekend'

  const roll = hashString(`${employee.id}-${key}`) % 100
  if (roll < 78) return 'Present'
  if (roll < 88) return 'WFH'
  if (roll < 94) return 'Late'
  if (roll < 98) return 'On Leave'
  return 'Absent'
}

export function getMonthMatrix(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = firstDay.getDay()

  const cells: (Date | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

export function monthSummary(employee: Employee, year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const counts: Partial<Record<AttendanceStatus, number>> = {}
  for (let d = 1; d <= daysInMonth; d++) {
    const status = getAttendanceStatus(employee, new Date(year, month, d))
    counts[status] = (counts[status] ?? 0) + 1
  }
  return counts
}
