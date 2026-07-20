'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { AlertTriangleIcon } from '@/components/Icons'
import { mockShifts, mockShiftAssignments, upcomingShiftChanges, shiftConflicts } from '@/lib/workforceData'

type Tab = 'employee' | 'department' | 'location' | 'calendar' | 'future' | 'history'

const TABS: { id: Tab; label: string }[] = [
  { id: 'employee', label: 'By Employee' },
  { id: 'department', label: 'By Department' },
  { id: 'location', label: 'By Location' },
  { id: 'calendar', label: 'Calendar View' },
  { id: 'future', label: 'Future Schedule' },
  { id: 'history', label: 'History' },
]

const assignmentHistory = [
  { id: 'h1', employeeName: 'Vikram Kumar', from: 'General', to: 'Night', date: '2026-07-01', by: 'Sneha Gupta' },
  { id: 'h2', employeeName: 'Karan Chopra', from: 'Morning', to: 'Flexible', date: '2026-06-15', by: 'Arjun Reddy' },
  { id: 'h3', employeeName: 'Pooja Singh', from: 'Morning', to: 'General', date: '2026-05-20', by: 'Neha Verma' },
]

export default function ShiftAssignmentsPage() {
  return (
    <Suspense fallback={null}>
      <ShiftAssignmentsPageInner />
    </Suspense>
  )
}

function ShiftAssignmentsPageInner() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>('employee')
  const [assignments, setAssignments] = useState(mockShiftAssignments)
  const [deptShift, setDeptShift] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [locShift, setLocShift] = useState('')
  const [selectedLoc, setSelectedLoc] = useState('')
  const [bulkMsg, setBulkMsg] = useState('')
  const [highlightId, setHighlightId] = useState<string | null>(null)

  useEffect(() => {
    const t = searchParams.get('tab')
    if (t === 'employee' || t === 'department' || t === 'location' || t === 'calendar' || t === 'future' || t === 'history') setTab(t as Tab)
    const h = searchParams.get('highlight')
    if (h) setHighlightId(h)
  }, [searchParams])

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
    assignments.forEach(a => { map[a.employeeId] = a.shiftId })
    return map
  }, [assignments])

  const departments = useMemo(() => Array.from(new Set(employees.map(e => e.department))), [employees])
  const locations = useMemo(() => Array.from(new Set(employees.map(e => e.location))), [employees])

  const setEmployeeShift = (employeeId: string, shiftId: string) => {
    setAssignments(prev => prev.map(a => a.employeeId === employeeId ? { ...a, shiftId } : a))
  }

  const bulkAssignDept = () => {
    if (!selectedDept || !deptShift) return
    const ids = new Set(employees.filter(e => e.department === selectedDept).map(e => e.id))
    setAssignments(prev => prev.map(a => ids.has(a.employeeId) ? { ...a, shiftId: deptShift } : a))
    setBulkMsg(`Assigned ${shiftById[deptShift]} shift to ${ids.size} employees in ${selectedDept}`)
  }
  const bulkAssignLoc = () => {
    if (!selectedLoc || !locShift) return
    const ids = new Set(employees.filter(e => e.location === selectedLoc).map(e => e.id))
    setAssignments(prev => prev.map(a => ids.has(a.employeeId) ? { ...a, shiftId: locShift } : a))
    setBulkMsg(`Assigned ${shiftById[locShift]} shift to ${ids.size} employees in ${selectedLoc}`)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Shift Assignments</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Assign shifts by employee, department or location</p>
      </div>

      {shiftConflicts.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10">
          <AlertTriangleIcon size={16} className="text-[#EF4444] flex-shrink-0" />
          {shiftConflicts.map(c => (
            <p key={c.id} className="text-xs font-semibold text-[#EF4444]">{c.employeeName}: {c.detail}</p>
          ))}
        </div>
      )}

      <div className={`flex items-center gap-1 p-1 rounded-lg border ${borderColor} ${cardBg} w-fit flex-wrap`}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setBulkMsg('') }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              tab === t.id ? 'bg-[#00755A] text-white' : `${textSecondary} ${isDark ? 'hover:text-[#D4D4D8]' : 'hover:text-[#0C2472]'}`
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'employee' && (
        <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                {['Employee', 'Department', 'Current Shift'].map(h => (
                  <th key={h} className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className={`border-b ${borderColor} last:border-b-0 ${rowHover} ${emp.id === highlightId ? 'bg-[#EF4444]/10' : ''}`}>
                  <td className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap ${textColor}`}>
                    {emp.firstName} {emp.lastName}
                    {emp.id === highlightId && <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444]/15 text-[#EF4444]">Conflict</span>}
                  </td>
                  <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{emp.department}</td>
                  <td className="px-4 py-2.5">
                    <select
                      value={assignmentByEmployee[emp.id] ?? ''}
                      onChange={e => setEmployeeShift(emp.id, e.target.value)}
                      className={`px-2.5 py-1.5 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-xs font-medium outline-none`}
                    >
                      {mockShifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {tab === 'department' && (
        <div className={`rounded-xl border ${borderColor} ${cardBg} p-5 flex items-end gap-3 flex-wrap`}>
          <div className="flex flex-col gap-1">
            <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Department</label>
            <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none min-w-[160px]`}>
              <option value="">Select department</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Shift</label>
            <select value={deptShift} onChange={e => setDeptShift(e.target.value)} className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none min-w-[160px]`}>
              <option value="">Select shift</option>
              {mockShifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <button disabled={!selectedDept || !deptShift} onClick={bulkAssignDept} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Bulk Assign
          </button>
          {bulkMsg && <span className="text-xs font-semibold text-[#00755A]">{bulkMsg}</span>}
        </div>
      )}

      {tab === 'location' && (
        <div className={`rounded-xl border ${borderColor} ${cardBg} p-5 flex items-end gap-3 flex-wrap`}>
          <div className="flex flex-col gap-1">
            <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Location</label>
            <select value={selectedLoc} onChange={e => setSelectedLoc(e.target.value)} className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none min-w-[160px]`}>
              <option value="">Select location</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Shift</label>
            <select value={locShift} onChange={e => setLocShift(e.target.value)} className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none min-w-[160px]`}>
              <option value="">Select shift</option>
              {mockShifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <button disabled={!selectedLoc || !locShift} onClick={bulkAssignLoc} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Bulk Assign
          </button>
          {bulkMsg && <span className="text-xs font-semibold text-[#00755A]">{bulkMsg}</span>}
        </div>
      )}

      {tab === 'calendar' && (
        <ShiftCalendar
          employees={employees}
          assignments={assignments}
          setAssignments={setAssignments}
          mockShifts={mockShifts}
          shiftById={shiftById}
          isDark={isDark}
          textColor={textColor}
          textSecondary={textSecondary}
          cardBg={cardBg}
          borderColor={borderColor}
        />
      )}

      {tab === 'future' && (
        <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                {['Employee', 'From', 'To', 'Effective From'].map(h => (
                  <th key={h} className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {upcomingShiftChanges.map(c => (
                <tr key={c.id} className={`border-b ${borderColor} last:border-b-0 ${rowHover}`}>
                  <td className={`px-4 py-2.5 text-sm font-semibold ${textColor}`}>{c.employeeName}</td>
                  <td className={`px-4 py-2.5 text-sm font-medium ${textSecondary}`}>{c.fromShift}</td>
                  <td className="px-4 py-2.5 text-sm font-semibold text-[#00755A]">{c.toShift}</td>
                  <td className={`px-4 py-2.5 text-sm font-medium ${textSecondary}`}>{new Date(c.effectiveFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {upcomingShiftChanges.length === 0 && <div className="py-16 text-center"><p className={`text-sm font-medium ${textSecondary}`}>No upcoming shift changes.</p></div>}
        </div>
      )}

      {tab === 'history' && (
        <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                {['Employee', 'From', 'To', 'Date', 'Changed By'].map(h => (
                  <th key={h} className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assignmentHistory.map(h => (
                <tr key={h.id} className={`border-b ${borderColor} last:border-b-0 ${rowHover}`}>
                  <td className={`px-4 py-2.5 text-sm font-semibold ${textColor}`}>{h.employeeName}</td>
                  <td className={`px-4 py-2.5 text-sm font-medium ${textSecondary}`}>{h.from}</td>
                  <td className={`px-4 py-2.5 text-sm font-semibold ${textColor}`}>{h.to}</td>
                  <td className={`px-4 py-2.5 text-sm font-medium ${textSecondary}`}>{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td className={`px-4 py-2.5 text-sm font-medium ${textSecondary}`}>{h.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

interface ShiftCalendarProps {
  employees: ReturnType<typeof useEmployee>['employees']
  assignments: any
  setAssignments: any
  mockShifts: typeof mockShifts
  shiftById: Record<string, string>
  isDark: boolean
  textColor: string
  textSecondary: string
  cardBg: string
  borderColor: string
}

function ShiftCalendar({
  employees,
  assignments,
  setAssignments,
  mockShifts,
  shiftById,
  isDark,
  textColor,
  textSecondary,
  cardBg,
  borderColor,
}: ShiftCalendarProps) {
  const [draggedShift, setDraggedShift] = useState<string | null>(null)

  const assignmentByEmployee = useMemo(() => {
    const map: Record<string, string> = {}
    assignments.forEach((a: any) => { map[a.employeeId] = a.shiftId })
    return map
  }, [assignments])

  const handleDragStart = (shiftId: string) => {
    setDraggedShift(shiftId)
  }

  const handleDropOnEmployee = (employeeId: string) => {
    if (!draggedShift) return
    setAssignments((prev: any) => prev.map((a: any) => a.employeeId === employeeId ? { ...a, shiftId: draggedShift } : a))
    setDraggedShift(null)
  }

  const shiftColors: Record<string, string> = {
    'shift-001': 'bg-[#00755A]/20 text-[#00755A]',
    'shift-002': 'bg-[#5E93FF]/20 text-[#5E93FF]',
    'shift-003': 'bg-[#F59E0B]/20 text-[#F59E0B]',
    'shift-004': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
    'shift-005': 'bg-[#27EAA6]/20 text-[#0B8F6E]',
  }

  return (
    <div className="space-y-4">
      <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
        <h3 className={`text-sm font-bold mb-3 ${textColor}`}>Drag shifts to assign</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {mockShifts.map(shift => (
            <div
              key={shift.id}
              draggable
              onDragStart={() => handleDragStart(shift.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold cursor-move transition-opacity ${shiftColors[shift.id] || 'bg-[#9CA3AF]/20 text-[#9CA3AF]'} ${draggedShift === shift.id ? 'opacity-50' : 'opacity-100'}`}
            >
              {shift.name}
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                <th className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Employee</th>
                <th className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Department</th>
                <th className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Current Shift (Drop here)</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const currentShiftId = assignmentByEmployee[emp.id]
                const currentShiftName = shiftById[currentShiftId] ?? '—'
                return (
                  <tr
                    key={emp.id}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDropOnEmployee(emp.id)}
                    className={`border-b ${borderColor} last:border-b-0 transition-colors ${isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'}`}
                  >
                    <td className={`px-4 py-3 text-sm font-semibold ${textColor}`}>{emp.firstName} {emp.lastName}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${textSecondary}`}>{emp.department}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1.5 rounded-lg text-sm font-semibold inline-block min-w-[120px] text-center ${shiftColors[currentShiftId] || 'bg-[#9CA3AF]/20 text-[#9CA3AF]'}`}>
                        {currentShiftName}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
