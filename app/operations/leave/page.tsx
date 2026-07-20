'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { CheckIcon, XIcon } from '@/components/Icons'
import { mockWorkforceLeaveRequests, mockLeaveTypes, mockLeaveBalances, LeaveRequest } from '@/lib/operationsData'

type View = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Calendar' | 'Employee Timeline' | 'Leave Balance'

const VIEWS: View[] = ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Calendar', 'Employee Timeline', 'Leave Balance']

const statusColors: Record<string, { bg: string; text: string }> = {
  Pending: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]' },
  Approved: { bg: 'bg-[#00755A]/15', text: 'text-[#00755A]' },
  Rejected: { bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]' },
  Cancelled: { bg: 'bg-[#9CA3AF]/15', text: 'text-[#9CA3AF]' },
}

export default function LeavePage() {
  return (
    <Suspense fallback={null}>
      <LeavePageInner />
    </Suspense>
  )
}

function LeavePageInner() {
  const { isDark } = useTheme()
  const searchParams = useSearchParams()
  const [view, setView] = useState<View>('Pending')
  const [requests, setRequests] = useState(mockWorkforceLeaveRequests)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    const v = searchParams.get('view')
    if (v && VIEWS.includes(v as View)) setView(v as View)
  }, [searchParams])

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const isTableView = ['Pending', 'Approved', 'Rejected', 'Cancelled'].includes(view)
  const filtered = useMemo(() => requests.filter(r => r.status === view), [requests, view])

  const setStatus = (id: string, status: LeaveRequest['status']) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    setSelected(prev => { const next = new Set(prev); next.delete(id); return next })
  }

  const toggle = (id: string) => setSelected(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })
  const toggleAll = () => setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(r => r.id)))
  const bulkApprove = () => selected.forEach(id => setStatus(id, 'Approved'))

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Leave</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Requests, calendar, employee timeline and balances</p>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className={`flex items-center gap-1 p-1 rounded-lg border ${borderColor} ${cardBg} w-fit flex-wrap`}>
          {VIEWS.map(v => (
            <button
              key={v}
              onClick={() => { setView(v); setSelected(new Set()) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                view === v ? 'bg-[#00755A] text-white' : `${textSecondary} ${isDark ? 'hover:text-[#D4D4D8]' : 'hover:text-[#0C2472]'}`
              }`}
            >
              {v}
              {isTableView && v === view && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white/25">{filtered.length}</span>
              )}
            </button>
          ))}
        </div>
        {view === 'Pending' && selected.size > 0 && (
          <button onClick={bulkApprove} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors">
            <CheckIcon size={15} />
            Bulk Approve ({selected.size})
          </button>
        )}
      </div>

      {isTableView && (
        <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                {view === 'Pending' && <th className="w-10 px-4 py-3"><input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length} onChange={toggleAll} className="rounded" /></th>}
                {['Employee', 'Type', 'From', 'To', 'Days', 'Reason', 'Approver', ''].map(h => (
                  <th key={h} className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className={`border-b ${borderColor} last:border-b-0 ${rowHover}`}>
                  {view === 'Pending' && (
                    <td className="px-4 py-3"><input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} className="rounded" /></td>
                  )}
                  <td className={`px-4 py-3 text-sm font-semibold whitespace-nowrap ${textColor}`}>{r.employeeName}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${isDark ? 'bg-[#27272A] text-[#D4D4D8]' : 'bg-[#E8EFF6] text-[#0C2472]'}`}>{r.leaveTypeName}</span></td>
                  <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{new Date(r.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{new Date(r.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td className={`px-4 py-3 text-sm font-semibold whitespace-nowrap ${textColor}`}>{r.days}</td>
                  <td className={`px-4 py-3 text-sm font-medium max-w-[200px] truncate ${textSecondary}`}>{r.reason}</td>
                  <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{r.approver}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setStatus(r.id, 'Approved')} className="px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors">Approve</button>
                        <button onClick={() => setStatus(r.id, 'Rejected')} className="px-2.5 py-1 rounded-md text-xs font-semibold text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/10 transition-colors">Reject</button>
                      </div>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${statusColors[r.status].bg} ${statusColors[r.status].text}`}>{r.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className={`text-sm font-medium ${textSecondary}`}>No {view.toLowerCase()} leave requests.</p>
            </div>
          )}
        </div>
      )}

      {view === 'Calendar' && <LeaveCalendarView requests={requests} />}
      {view === 'Employee Timeline' && <EmployeeTimelineView requests={requests} />}
      {view === 'Leave Balance' && <LeaveBalanceView />}
    </div>
  )
}

function LeaveCalendarView({ requests }: { requests: LeaveRequest[] }) {
  const { isDark } = useTheme()
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'

  const year = 2026, month = 6 // July
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const approved = requests.filter(r => r.status === 'Approved')

  const onLeaveByDay = (day: number) => {
    const d = new Date(year, month, day)
    return approved.filter(r => d >= new Date(r.startDate) && d <= new Date(r.endDate))
  }

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return (
    <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
      <p className={`text-sm font-bold mb-4 ${textColor}`}>July 2026</p>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <p key={d} className={`text-center text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{d}</p>
        ))}
      </div>
      <div className="space-y-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-2">
            {week.map((day, di) => {
              if (!day) return <div key={di} className="min-h-[64px]" />
              const onLeave = onLeaveByDay(day)
              return (
                <div key={di} className={`min-h-[64px] p-1.5 rounded-lg border ${borderColor}`}>
                  <p className={`text-xs font-semibold mb-1 ${textColor}`}>{day}</p>
                  <div className="space-y-0.5">
                    {onLeave.slice(0, 2).map(r => (
                      <p key={r.id} className="text-[9.5px] font-semibold px-1 py-0.5 rounded bg-[#5E93FF]/15 text-[#5E93FF] truncate">{r.employeeName.split(' ')[0]}</p>
                    ))}
                    {onLeave.length > 2 && <p className={`text-[9.5px] font-medium ${textSecondary}`}>+{onLeave.length - 2} more</p>}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function EmployeeTimelineView({ requests }: { requests: LeaveRequest[] }) {
  const { isDark } = useTheme()
  const { employees } = useEmployee()
  const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? '')

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'

  const employeeRequests = requests.filter(r => r.employeeId === employeeId).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  return (
    <div className="space-y-4">
      <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
        <select
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
          className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none`}
        >
          {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
        </select>
      </div>
      <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
        {employeeRequests.length === 0 && <p className={`text-sm font-medium ${textSecondary}`}>No leave history for this employee.</p>}
        <div className="space-y-4">
          {employeeRequests.map((r, i) => (
            <div key={r.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusColors[r.status].text.includes('EF4444') ? '#EF4444' : statusColors[r.status].text.includes('00755A') ? '#00755A' : statusColors[r.status].text.includes('F59E0B') ? '#F59E0B' : '#9CA3AF' }} />
                {i < employeeRequests.length - 1 && <span className={`w-px flex-1 mt-1 ${isDark ? 'bg-[#27272A]' : 'bg-[#D4E8E0]'}`} style={{ minHeight: 32 }} />}
              </div>
              <div className="min-w-0 pb-1">
                <p className={`text-sm font-semibold ${textColor}`}>{r.leaveTypeName} · {r.days} day{r.days > 1 ? 's' : ''}</p>
                <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>{new Date(r.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(r.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {r.reason}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${statusColors[r.status].bg} ${statusColors[r.status].text}`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LeaveBalanceView() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const balanceTypes = mockLeaveTypes.filter(lt => ['lt-001', 'lt-002', 'lt-003'].includes(lt.id))

  const balanceFor = (empId: string, ltId: string) => mockLeaveBalances.find(b => b.employeeId === empId && b.leaveTypeId === ltId)

  return (
    <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
      <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className={`border-b ${borderColor}`}>
            <th className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>Employee</th>
            {balanceTypes.map(lt => (
              <th key={lt.id} className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{lt.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} className={`border-b ${borderColor} last:border-b-0 ${rowHover}`}>
              <td className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap ${textColor}`}>{emp.firstName} {emp.lastName}</td>
              {balanceTypes.map(lt => {
                const bal = balanceFor(emp.id, lt.id)
                const remaining = bal ? bal.total - bal.used : 0
                return (
                  <td key={lt.id} className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`text-sm font-bold ${textColor}`}>{remaining}</span>
                    <span className={`text-xs font-medium ${textSecondary}`}> / {bal?.total ?? 0}</span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
